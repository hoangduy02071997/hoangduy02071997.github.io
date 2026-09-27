/* ==========================================================================
   Knowledge Graph — Interactive Canvas
   ========================================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('knowledgeGraph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dpr;
  let mouse = { x: -9999, y: -9999 };
  let animId;

  // Load Avatar
  const avatarImg = new Image();
  avatarImg.src = 'assets/img/avatar.jpg';

  /* ── Color palette per category ── */
  const palette = {
    backend:  { dark: '#8d73ff', light: '#6d4fe8' },
    frontend: { dark: '#64b5f6', light: '#1976d2' },
    data:     { dark: '#66dec4', light: '#1db99a' },
    devops:   { dark: '#ffb74d', light: '#e65100' },
    ai:       { dark: '#ef5350', light: '#c62828' },
    arch:     { dark: '#ab47bc', light: '#7b1fa2' },
    core:     { dark: '#ffffff', light: '#1a1d26' },
  };

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }

  /* ── Node data ── */
  const nodeData = [
    { id: 'me', label: 'Duy Hoàng', cat: 'core', r: 35, fixed: true, fx: 0.5, fy: 0.5 },

    // Hubs (Categories)
    { id: 'hub_backend', label: 'Backend', cat: 'backend', r: 24 },
    { id: 'hub_frontend', label: 'Frontend', cat: 'frontend', r: 24 },
    { id: 'hub_data', label: 'DB', cat: 'data', r: 24 },
    { id: 'hub_devops', label: 'DevOps', cat: 'devops', r: 24 },
    { id: 'hub_ai', label: 'AI / LLM', cat: 'ai', r: 24 },
    { id: 'hub_arch', label: 'Architecture', cat: 'arch', r: 24 },

    // Backend
    { id: 'nodejs',   label: 'Node.js',   cat: 'backend', r: 18, projects: ['E-Buzz Chat Application', 'Dating Application', 'LofiWee — Page Builder Platform', 'Activation Management', 'Heineken System', 'Daikin Ecommerce', 'Gumac — CRM / Ecommerce', 'Private Chat System'] },
    { id: 'nestjs',   label: 'NestJS',    cat: 'backend', r: 16, projects: ['POS Ecommerce System — Multitenant', 'Private Chat System', 'Support Chatbot GPT', 'Ecommerce Website', 'E-Buzz Chat Application', 'Dating Application', 'Tarot Application', 'LofiWee — Page Builder Platform'] },
    { id: 'laravel',  label: 'Laravel',   cat: 'backend', r: 18, projects: ['POS Ecommerce System — Multitenant', 'POS HT Official Coffee', 'Activation Management', 'Heineken System', 'Daikin Ecommerce', 'Gumac — CRM / Ecommerce', 'VCBS — Vietcombank Securities', 'B2C Ecommerce', 'CMS Management'] },
    { id: 'python',   label: 'Python',    cat: 'backend', r: 16, projects: ['Check-in / Face Recognition', 'Activation Management'] },
    { id: 'golang',   label: 'Golang',    cat: 'backend', r: 14, projects: ['POS Ecommerce System — Multitenant', 'Private Chat System'] },
    { id: 'express',  label: 'Express',   cat: 'backend', r: 13, projects: ['Various Backend APIs'] },
    { id: 'flask',    label: 'Flask',     cat: 'backend', r: 12, projects: ['Check-in / Face Recognition'] },

    // Frontend
    { id: 'react',    label: 'React',      cat: 'frontend', r: 16, projects: ['POS Ecommerce System — Multitenant', 'Private Chat System', 'Support Chatbot GPT', 'Ecommerce Website', 'Daikin Ecommerce', 'Gumac — CRM / Ecommerce', 'VCBS — Vietcombank Securities', 'E-Buzz Chat Application', 'B2C Ecommerce', 'CMS Management', 'LofiWee — Page Builder Platform'] },
    { id: 'nextjs',   label: 'Next.js',    cat: 'frontend', r: 14, projects: ['Ecommerce Website', 'Dating Application', 'Tarot Application', 'B2C Ecommerce', 'LofiWee — Page Builder Platform'] },
    { id: 'rn',       label: 'React Native', cat: 'frontend', r: 14, projects: ['POS Ecommerce System — Multitenant', 'POS HT Official Coffee', 'Private Chat System', 'Activation Management', 'Heineken System', 'E-Buzz Chat Application', 'Dating Application', 'Tarot Application'] },
    { id: 'js',       label: 'JavaScript', cat: 'frontend', r: 13, projects: ['Frontend & Backend Core'] },

    // Data
    { id: 'pg',       label: 'PostgreSQL', cat: 'data', r: 16, projects: ['POS Ecommerce System — Multitenant', 'Private Chat System'] },
    { id: 'mysql',    label: 'MySQL',      cat: 'data', r: 16, projects: ['POS Ecommerce System — Multitenant', 'POS HT Official Coffee', 'Private Chat System', 'Activation Management', 'Heineken System', 'Daikin Ecommerce', 'Gumac — CRM / Ecommerce', 'B2C Ecommerce', 'CMS Management'] },
    { id: 'redis',    label: 'Redis',      cat: 'data', r: 15, projects: ['POS Ecommerce System — Multitenant', 'POS HT Official Coffee', 'Private Chat System', 'Support Chatbot GPT', 'Ecommerce Website', 'E-Buzz Chat Application', 'Dating Application', 'Tarot Application', 'B2C Ecommerce', 'LofiWee — Page Builder Platform'] },
    { id: 'kafka',    label: 'Kafka',      cat: 'data', r: 14, projects: ['POS Ecommerce System — Multitenant', 'Private Chat System'] },
    { id: 'mongo',    label: 'MongoDB',    cat: 'data', r: 14, projects: ['Private Chat System', 'Support Chatbot GPT', 'Ecommerce Website', 'Gumac — CRM / Ecommerce', 'E-Buzz Chat Application', 'Dating Application', 'Tarot Application', 'LofiWee — Page Builder Platform'] },
    { id: 'rabbit',   label: 'RabbitMQ',   cat: 'data', r: 13, projects: ['Gumac — CRM / Ecommerce'] },

    // DevOps
    { id: 'docker',   label: 'Docker',     cat: 'devops', r: 15, projects: ['LofiWee — Page Builder Platform', 'Microservices Deployments'] },
    { id: 'linux',    label: 'Linux',      cat: 'devops', r: 14, projects: ['Server Setup', 'CI/CD Pipelines'] },
    { id: 'nginx',    label: 'Nginx',      cat: 'devops', r: 13, projects: ['Load Balancing', 'Reverse Proxy'] },
    { id: 'git',      label: 'Git',        cat: 'devops', r: 13, projects: ['Version Control', 'GitLab CI/CD'] },

    // AI
    { id: 'gpt',      label: 'GPT / OpenAI', cat: 'ai', r: 16, projects: ['Support Chatbot GPT', 'Ecommerce Website', 'POS Ecommerce System — Multitenant'] },
    { id: 'langchain',label: 'LangChain',    cat: 'ai', r: 14, projects: ['POS Ecommerce System — Multitenant', 'Support Chatbot GPT'] },
    { id: 'llama',    label: 'Llama',        cat: 'ai', r: 13, projects: ['Support Chatbot GPT'] },
    { id: 'agentic',  label: 'Agentic AI',   cat: 'ai', r: 14, projects: ['POS Ecommerce System — Multitenant'] },
    { id: 'embed',    label: 'Embeddings',   cat: 'ai', r: 12, projects: ['Check-in / Face Recognition'] },
    { id: 'faceid',   label: 'Face Recog.',  cat: 'ai', r: 12, projects: ['Check-in / Face Recognition'] },

    // Architecture
    { id: 'rest',     label: 'REST API',      cat: 'arch', r: 14, projects: ['All API services'] },
    { id: 'micro',    label: 'Microservices', cat: 'arch', r: 15, projects: ['Private Chat System', 'LofiWee — Page Builder Platform', 'POS Ecommerce System — Multitenant'] },
    { id: 'ws',       label: 'WebSocket',     cat: 'arch', r: 14, projects: ['POS Ecommerce System — Multitenant', 'Private Chat System', 'E-Buzz Chat Application'] },
    { id: 'grpc',     label: 'gRPC',          cat: 'arch', r: 13, projects: ['Private Chat System'] },
    { id: 'oop',      label: 'OOP',           cat: 'arch', r: 13, projects: ['Core System Design'] },
    { id: 'dp',       label: 'Design Patterns', cat: 'arch', r: 14, projects: ['Core System Architecture'] },
  ];

  /* ── Edges (connections) ── */
  const edgeData = [
    // Core to Hubs
    ['me','hub_backend'], ['me','hub_frontend'], ['me','hub_data'], 
    ['me','hub_devops'], ['me','hub_ai'], ['me','hub_arch'],

    // Hubs to Skills
    ['hub_backend','nodejs'], ['hub_backend','laravel'], ['hub_backend','python'], ['hub_backend','golang'], ['hub_backend','express'], ['hub_backend','flask'], ['nodejs','nestjs'],
    ['hub_frontend','react'], ['hub_frontend','nextjs'], ['hub_frontend','rn'], ['hub_frontend','js'],
    ['hub_data','pg'], ['hub_data','mysql'], ['hub_data','redis'], ['hub_data','kafka'], ['hub_data','mongo'], ['hub_data','rabbit'],
    ['hub_devops','docker'], ['hub_devops','linux'], ['hub_devops','nginx'], ['hub_devops','git'],
    ['hub_ai','gpt'], ['hub_ai','langchain'], ['hub_ai','llama'], ['hub_ai','agentic'], ['hub_ai','embed'], ['hub_ai','faceid'],
    ['hub_arch','rest'], ['hub_arch','micro'], ['hub_arch','ws'], ['hub_arch','grpc'], ['hub_arch','oop'], ['hub_arch','dp'],

    // Cross connections (keep them light)
    ['nodejs','react'], ['docker','linux'], ['gpt','langchain'], ['gpt','agentic'], ['embed','faceid']
  ];

  let nodes = [];
  let edges = [];
  let hoveredNode = null;
  let activeNode = null; // Used for click-to-pin functionality

  function initNodes() {
    const catAngles = { backend: 0, frontend: 1, data: 2, devops: 3, ai: 4, arch: 5 };
    const totalCats = 6;

    nodes = nodeData.map((d) => {
      let x, y;
      if (d.fixed) {
        x = d.fx * W;
        y = d.fy * H;
      } else {
        const catIdx = catAngles[d.cat] ?? 0;
        const angle = (catIdx / totalCats) * Math.PI * 2 - Math.PI / 2;
        const distanceMul = d.id.startsWith('hub_') ? 0.25 : 0.6;
        const spread = Math.min(W, H) * distanceMul;
        const jitter = () => (Math.random() - 0.5) * spread * 0.2;
        x = W / 2 + Math.cos(angle) * spread + jitter();
        y = H / 2 + Math.sin(angle) * spread + jitter();
      }
      return { ...d, x, y, vx: 0, vy: 0, origX: x, origY: y };
    });

    const nodeMap = {};
    nodes.forEach(n => nodeMap[n.id] = n);
    edges = edgeData.map(([a, b]) => ({ source: nodeMap[a], target: nodeMap[b] })).filter(e => e.source && e.target);
  }

  function simulate() {
    const dt = 0.4;
    const repulsion = 2400; 
    const attraction = 0.008;
    const damping = 0.88;
    const centerPull = 0.001;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let minDist = a.r + b.r + 15;
        if (dist < minDist * 2.5) {
          let force = repulsion / (dist * dist);
          let fx = (dx / dist) * force;
          let fy = (dy / dist) * force;
          if (!a.fixed) { a.vx -= fx * dt; a.vy -= fy * dt; }
          if (!b.fixed) { b.vx += fx * dt; b.vy += fy * dt; }
        }
      }
    }

    edges.forEach(e => {
      let dx = e.target.x - e.source.x;
      let dy = e.target.y - e.source.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      let isHubToSkill = (e.source.id.startsWith('hub_') && !e.target.id.startsWith('hub_'));
      let isMeToHub = (e.source.id === 'me' && e.target.id.startsWith('hub_'));
      let lengthMultiplier = isMeToHub ? 4.5 : (isHubToSkill ? 3.5 : 2.5);
      
      let idealLen = (e.source.r + e.target.r) * lengthMultiplier;
      let diff = dist - idealLen;
      let fx = (dx / dist) * diff * attraction;
      let fy = (dy / dist) * diff * attraction;
      if (!e.source.fixed) { e.source.vx += fx; e.source.vy += fy; }
      if (!e.target.fixed) { e.target.vx -= fx; e.target.vy -= fy; }
    });

    nodes.forEach(n => {
      if (n.fixed) {
        n.x = n.fx * W;
        n.y = n.fy * H;
        return;
      }
      n.vx += (W / 2 - n.x) * centerPull;
      n.vy += (H / 2 - n.y) * centerPull;
      
      // Organic floating motion (trôi nổi tự nhiên)
      let time = Date.now() * 0.001;
      let seed = n.id.charCodeAt(0) + n.id.charCodeAt(n.id.length - 1);
      n.vx += Math.sin(time + seed) * 0.15;
      n.vy += Math.cos(time + seed * 1.5) * 0.15;
      
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      let pad = n.r + 4;
      if (n.x < pad) { n.x = pad; n.vx *= -0.5; }
      if (n.x > W - pad) { n.x = W - pad; n.vx *= -0.5; }
      if (n.y < pad) { n.y = pad; n.vy *= -0.5; }
      if (n.y > H - pad) { n.y = H - pad; n.vy *= -0.5; }
    });
  }

  function drawTooltip(node, isDark) {
    if (!node.projects || node.projects.length === 0) return;
    const tw = 280; // wider for full project names
    const lh = 20;
    const lines = node.projects;
    const th = lines.length * lh + 40; // more padding
    let tx = node.x + node.r + 15;
    let ty = node.y - th / 2;
    
    if (tx + tw > W) tx = node.x - node.r - 15 - tw;
    if (ty < 0) ty = 10;
    if (ty + th > H) ty = H - th - 10;

    // Outer glow / shadow
    ctx.shadowBlur = 20;
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)';
    ctx.fillStyle = isDark ? '#111827' : '#ffffff';
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 12);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Border matches category color
    const theme = getTheme();
    ctx.strokeStyle = palette[node.cat]?.[theme] || (isDark ? '#374151' : '#e5e7eb');
    ctx.lineWidth = 2;
    ctx.stroke();

    // Title / Header
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280';
    ctx.font = '700 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('USED IN PROJECTS:', tx + 16, ty + 12);

    // List of exact project names
    ctx.fillStyle = isDark ? '#f3f4f6' : '#111827';
    ctx.font = '500 12px Inter, sans-serif';
    lines.forEach((line, i) => {
      // Draw bullet
      ctx.beginPath();
      ctx.arc(tx + 18, ty + 34 + i * lh + 6, 3, 0, Math.PI * 2);
      ctx.fillStyle = palette[node.cat]?.[theme] || '#888';
      ctx.fill();

      // Draw text
      ctx.fillStyle = isDark ? '#f3f4f6' : '#111827';
      ctx.fillText(line, tx + 28, ty + 34 + i * lh);
    });
  }

  function draw() {
    const theme = getTheme();
    const isDark = theme === 'dark';
    ctx.clearRect(0, 0, W, H);

    let focusNode = hoveredNode || activeNode;

    edges.forEach(e => {
      let isHighlighted = false;
      let opacity = 0.25; // default opacity
      
      if (focusNode) {
          if (e.source.id === focusNode.id || e.target.id === focusNode.id) {
              isHighlighted = true;
              opacity = 0.85;
          } else {
              opacity = 0.05; // fade others when something is focused
          }
      }

      ctx.beginPath();
      ctx.moveTo(e.source.x, e.source.y);
      ctx.lineTo(e.target.x, e.target.y);
      
      if (isHighlighted) {
        ctx.strokeStyle = palette[focusNode.cat]?.[theme] || '#888';
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
        ctx.lineWidth = 1;
      }
      
      ctx.globalAlpha = opacity;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    nodes.forEach(n => {
      const col = palette[n.cat]?.[theme] || '#888';
      let isFocused = false;
      let opacity = 1;
      
      if (focusNode) {
          isFocused = (focusNode.id === n.id);
          const isConnected = edges.some(e => (e.source.id === focusNode.id && e.target.id === n.id) || (e.target.id === focusNode.id && e.source.id === n.id));
          if (!isFocused && !isConnected) {
              opacity = 0.15; // fade out non-connected nodes
          }
      }

      ctx.globalAlpha = opacity;

      // Glow for focused, active, or hub nodes
      let isGlow = isFocused || (n.id === activeNode?.id) || (n.id.startsWith('hub_') && !focusNode) || (n.id === 'me' && !focusNode);
      if (isGlow) {
        ctx.save();
        ctx.shadowColor = (n.id === 'me') ? palette.backend[theme] : col;
        ctx.shadowBlur = isFocused || (n.id === activeNode?.id) ? 30 : 15;
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)';
        ctx.fill();
        ctx.restore();
      }

      if (n.id === 'me') {
        // Draw Avatar Image
        ctx.save();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        if (avatarImg.complete && avatarImg.naturalHeight !== 0) {
          ctx.drawImage(avatarImg, n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
        } else {
          ctx.fillStyle = isDark ? '#1a1d26' : '#ffffff';
          ctx.fill();
        }
        ctx.restore();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.strokeStyle = palette.backend[theme];
        ctx.lineWidth = isFocused || activeNode?.id === 'me' ? 3.5 : 2;
        ctx.stroke();

      } else {
        // Normal Hub or Skill Node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        const alpha = isFocused || (n.id === activeNode?.id) ? 0.35 : (n.id.startsWith('hub_') ? 0.2 : 0.12);
        ctx.fillStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 0.6})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.strokeStyle = col;
        ctx.lineWidth = isFocused || (n.id === activeNode?.id) ? 3 : 1.5;
        ctx.stroke();

        let fontSize = n.id.startsWith('hub_') ? 11 : Math.max(9, n.r * 0.55);
        let fontWeight = n.id.startsWith('hub_') ? '800' : '700';
        
        ctx.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isFocused || (n.id === activeNode?.id) ? col : (isDark ? '#e0e4ec' : '#2d3748');
        ctx.fillText(n.label, n.x, n.y);
      }
      ctx.globalAlpha = 1;
    });

    drawLegend(theme, isDark);
    
    // Draw tooltip only for the hovered detail node (not hubs, not avatar)
    if (hoveredNode && hoveredNode.id !== 'me' && !hoveredNode.id.startsWith('hub_')) {
      drawTooltip(hoveredNode, isDark);
    } else if (activeNode && !hoveredNode && activeNode.id !== 'me' && !activeNode.id.startsWith('hub_')) {
      // If no hover, but a detail node is clicked/pinned, show its tooltip
      drawTooltip(activeNode, isDark);
    }
  }

  function drawLegend(theme, isDark) {
    const cats = [
      { key: 'backend', label: 'Backend' },
      { key: 'frontend', label: 'Frontend' },
      { key: 'data', label: 'DB' },
      { key: 'devops', label: 'DevOps' },
      { key: 'ai', label: 'AI / LLM' },
      { key: 'arch', label: 'Architecture' },
    ];
    const lx = 16, ly = H - cats.length * 20 - 8;
    ctx.font = '600 9px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    cats.forEach((c, i) => {
      const y = ly + i * 20;
      ctx.beginPath();
      ctx.arc(lx + 5, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = palette[c.key][theme];
      ctx.fill();
      ctx.fillStyle = isDark ? '#8892a4' : '#5a6478';
      ctx.fillText(c.label, lx + 15, y);
    });
  }

  function loop() {
    simulate();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nodes.forEach(n => {
      if (n.fixed) { n.x = n.fx * W; n.y = n.fy * H; }
    });
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    
    let oldHover = hoveredNode;
    hoveredNode = null;
    
    for (let n of nodes) {
      let dx = mouse.x - n.x, dy = mouse.y - n.y;
      if (Math.sqrt(dx * dx + dy * dy) < n.r + 6) {
        hoveredNode = n;
        break;
      }
    }
    canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
  }

  function onClick(e) {
    if (hoveredNode) {
      // Toggle active pin state
      if (activeNode && activeNode.id === hoveredNode.id) {
        activeNode = null; // unpin
      } else {
        activeNode = hoveredNode; // pin new node
      }

      // Add a slight burst to the clicked node
      if (!hoveredNode.fixed) {
        hoveredNode.vx += (Math.random() - 0.5) * 40;
        hoveredNode.vy += (Math.random() - 0.5) * 40;
      }
    } else {
      // Clicked on empty background, unpin
      activeNode = null;
    }
  }

  function onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
    hoveredNode = null;
  }

  function init() {
    resize();
    initNodes();
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', resize);
    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    requestAnimationFrame(init);
  }
})();
