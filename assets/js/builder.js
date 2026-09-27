document.addEventListener('DOMContentLoaded', () => {
  const draggables = document.querySelectorAll('.draggable-item');
  const mainCanvas = document.getElementById('builderCanvas');
  const emptyState = mainCanvas ? mainCanvas.querySelector('.empty-state') : null;
  
  if (!mainCanvas) return;

  let draggedType = null;
  window.__draggedElement = null;

  draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedType = item.getAttribute('data-type');
      e.dataTransfer.setData('text/plain', draggedType);
      item.style.opacity = '0.5';
    });
    item.addEventListener('dragend', () => {
      item.style.opacity = '1';
    });
  });

  function getDragAfterElement(container, y) {
    // Only get direct children that are builder-elements
    const draggableElements = [...container.children].filter(c => c.classList.contains('builder-element') && !c.classList.contains('dragging'));
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function handleDragOver(e, container) {
    e.preventDefault();
    e.stopPropagation();
    container.classList.add('drag-over');
    
    if (window.__draggedElement) {
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(window.__draggedElement);
      } else {
        container.insertBefore(window.__draggedElement, afterElement);
      }
    }
  }

  // Main Canvas Dropzone
  mainCanvas.addEventListener('dragover', (e) => {
    handleDragOver(e, mainCanvas);
  });
  mainCanvas.addEventListener('dragleave', () => {
    mainCanvas.classList.remove('drag-over');
  });
  mainCanvas.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mainCanvas.classList.remove('drag-over');
    if (emptyState) emptyState.style.display = 'none';
    
    // Prevent dropping inside another element if not a column
    if (e.target.closest('.builder-col')) return;

    const type = e.dataTransfer.getData('text/plain');
    if (type === 'reorder') {
      // Reordering is already handled in dragover visually, but we finalize here
      if (window.__draggedElement) {
        window.__draggedElement.classList.remove('dragging');
      }
    } else if (type) {
      const el = createComponent(type);
      const afterElement = getDragAfterElement(mainCanvas, e.clientY);
      if (afterElement == null) {
        mainCanvas.appendChild(el);
      } else {
        mainCanvas.insertBefore(el, afterElement);
      }
      setupColumns(el);
    }
  });

  function createComponent(type, customContent = null) {
    const wrapper = document.createElement('div');
    wrapper.className = 'builder-element';
    wrapper.setAttribute('draggable', 'true');
    
    wrapper.addEventListener('dragstart', (e) => {
      e.stopPropagation();
      draggedType = 'reorder';
      e.dataTransfer.setData('text/plain', 'reorder');
      window.__draggedElement = wrapper;
      wrapper.classList.add('dragging');
      setTimeout(() => wrapper.style.opacity = '0.5', 0);
    });
    wrapper.addEventListener('dragend', (e) => {
      e.stopPropagation();
      wrapper.style.opacity = '1';
      wrapper.classList.remove('dragging');
      window.__draggedElement = null;
    });
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    removeBtn.onclick = function() {
      wrapper.remove();
      if (mainCanvas.querySelectorAll('.builder-element').length === 0) {
        if(emptyState) emptyState.style.display = 'block';
      }
    };
    wrapper.appendChild(removeBtn);

    let content = '';
    if (customContent) {
      content = customContent;
    } else {
      if (type === 'heading') content = '<h2>Drag & Drop Heading</h2>';
      if (type === 'text') content = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>';
      if (type === 'button') content = '<a href="#" class="btn primary">Click Me</a>';
      if (type === 'image') content = '<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80" style="width: 100%; border-radius: 8px;" alt="Placeholder">';
      if (type === 'row') content = '<div class="builder-row"><div class="builder-col dropzone"></div><div class="builder-col dropzone"></div></div>';
    }
    
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'builder-content-wrap';
    contentWrapper.innerHTML = content;
    wrapper.appendChild(contentWrapper);
    
    return wrapper;
  }

  function setupColumns(rowWrapper) {
    const cols = rowWrapper.querySelectorAll('.builder-col');
    cols.forEach(col => {
      col.addEventListener('dragover', (e) => {
        handleDragOver(e, col);
      });
      col.addEventListener('dragleave', (e) => {
        e.stopPropagation();
        col.classList.remove('drag-over');
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        col.classList.remove('drag-over');
        
        const type = e.dataTransfer.getData('text/plain');
        if (type === 'reorder') {
          if (window.__draggedElement) {
             window.__draggedElement.classList.remove('dragging');
          }
        } else if (type && type !== 'row') { 
          // don't nest rows inside columns for simplicity
          const el = createComponent(type);
          const afterElement = getDragAfterElement(col, e.clientY);
          if (afterElement == null) {
            col.appendChild(el);
          } else {
            col.insertBefore(el, afterElement);
          }
          if (emptyState) emptyState.style.display = 'none';
        }
      });
    });
  }

  // Preview Logic
  const previewBtn = document.getElementById('builderPreviewBtn');
  const modal = document.getElementById('previewModal');
  const closeBtn = document.getElementById('previewCloseBtn');
  const previewBody = document.getElementById('previewBody');
  const clearBtn = document.getElementById('builderClearBtn');

  if (previewBtn && modal) {
    previewBtn.addEventListener('click', () => {
      previewBody.innerHTML = '';
      const clone = mainCanvas.cloneNode(true);
      clone.querySelectorAll('.remove-btn').forEach(btn => btn.remove());
      const es = clone.querySelector('.empty-state');
      if(es) es.remove();
      
      previewBody.innerHTML = clone.innerHTML;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      mainCanvas.querySelectorAll('.builder-element').forEach(el => el.remove());
      if(emptyState) emptyState.style.display = 'block';
    });
  }

  // Initialize Example Layout
  function initExample() {
    if (emptyState) emptyState.style.display = 'none';
    
    const h1 = createComponent('heading', '<h1 style="font-size: 3rem; line-height: 1.2; margin-bottom: 10px;">Build Stunning Digital Experiences</h1>');
    mainCanvas.appendChild(h1);
    
    const p1 = createComponent('text', '<p style="font-size: 1.1rem; color: var(--text-muted);">This is a pre-built layout. You can drag and drop components from the left sidebar to customize this page, or clear it and start from scratch.</p>');
    mainCanvas.appendChild(p1);
    
    const row = createComponent('row');
    mainCanvas.appendChild(row);
    setupColumns(row);
    
    const cols = row.querySelectorAll('.builder-col');
    if (cols.length === 2) {
      const img = createComponent('image', '<img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" style="width: 100%; border-radius: 12px; height: 100%; object-fit: cover; min-height: 250px;" alt="Code">');
      cols[0].appendChild(img);
      
      const h2 = createComponent('heading', '<h3 style="margin-bottom: 15px; font-size: 1.5rem;">Fast & Reliable</h3>');
      const p2 = createComponent('text', '<p style="margin-bottom: 25px; line-height: 1.6; color: var(--text-muted);">I specialize in building scalable backend systems and high-performance web applications using modern technologies.</p>');
      const btn = createComponent('button', '<a href="#contact" class="btn primary" style="border-radius: 30px;">Let\'s Talk <i class="fa-solid fa-arrow-right" style="margin-left: 8px;"></i></a>');
      
      cols[1].appendChild(h2);
      cols[1].appendChild(p2);
      cols[1].appendChild(btn);
    }
  }

  // Load example on start
  initExample();
});
