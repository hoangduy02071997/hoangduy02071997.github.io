  // Tool Logic Scripts
    // Tab switching
    function openTool(toolId, btnElement) {
      document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('tool-' + toolId).classList.add('active');
      
      document.querySelectorAll('.tool-tab').forEach(b => b.classList.remove('active'));
      btnElement.classList.add('active');
    }

    // JSON Tool
    function formatJSON() {
      const input = document.getElementById('json-input');
      const errEl = document.getElementById('json-error');
      try {
        if(!input.value.trim()) return;
        const parsed = JSON.parse(input.value);
        input.value = JSON.stringify(parsed, null, 4);
        errEl.innerText = '✅ Valid JSON';
        errEl.style.color = '#05c46b';
      } catch (e) {
        errEl.innerText = '❌ Error: ' + e.message;
        errEl.style.color = '#ff3f34';
      }
    }
    
    function minifyJSON() {
      const input = document.getElementById('json-input');
      const errEl = document.getElementById('json-error');
      try {
        if(!input.value.trim()) return;
        const parsed = JSON.parse(input.value);
        input.value = JSON.stringify(parsed);
        errEl.innerText = '✅ Minified Successfully';
        errEl.style.color = '#05c46b';
      } catch (e) {
        errEl.innerText = '❌ Error: ' + e.message;
        errEl.style.color = '#ff3f34';
      }
    }

    // Base64 Tool
    function encodeB64() {
       try {
         const val = document.getElementById('b64-input').value;
         document.getElementById('b64-output').value = btoa(unescape(encodeURIComponent(val)));
       } catch(e) {
         document.getElementById('b64-output').value = "Error: " + e.message;
       }
    }
    
    function decodeB64() {
       try {
         const val = document.getElementById('b64-input').value;
         document.getElementById('b64-output').value = decodeURIComponent(escape(atob(val)));
       } catch(e) {
         document.getElementById('b64-output').value = "Error: Invalid Base64 string.";
       }
    }

    // JWT Tool
    function decodeJWT() {
      const input = document.getElementById('jwt-input').value.trim();
      const errEl = document.getElementById('jwt-error');
      const outWrap = document.getElementById('jwt-output');
      
      outWrap.style.display = 'none';
      errEl.innerText = '';
      
      if(!input) return;
      
      const parts = input.split('.');
      if (parts.length !== 3) {
         errEl.innerText = '❌ Error: Invalid JWT format. Must contain 3 parts separated by dots.';
         return;
      }
      
      try {
         const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
         const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
         
         document.getElementById('jwt-header').innerText = JSON.stringify(header, null, 4);
         document.getElementById('jwt-payload').innerText = JSON.stringify(payload, null, 4);
         outWrap.style.display = 'flex';
      } catch(e) {
         errEl.innerText = '❌ Error decoding token: ' + e.message;
      }
    }

    // Epoch Tool
    function convertTime() {
       let val = document.getElementById('time-input').value.trim();
       if(!val) return;
       // If it's likely seconds (10 digits), convert to ms
       if(val.length <= 10) val = parseInt(val) * 1000;
       else val = parseInt(val);
       
       const date = new Date(val);
       if(isNaN(date.getTime())) {
          document.getElementById('time-local').innerText = "Invalid Date";
          document.getElementById('time-gmt').innerText = "Invalid Date";
       } else {
          document.getElementById('time-local').innerText = date.toLocaleString();
          document.getElementById('time-gmt').innerText = date.toUTCString();
       }
    }
    
    function setCurrentTime() {
       const now = Date.now();
       document.getElementById('time-input').value = Math.floor(now / 1000);
       convertTime();
    }
    
    // URL Encode
    function encodeURL() {
       const val = document.getElementById('url-input').value;
       document.getElementById('url-output').value = encodeURIComponent(val);
    }
    function decodeURL() {
       try {
          const val = document.getElementById('url-input').value;
          document.getElementById('url-output').value = decodeURIComponent(val);
       } catch(e) {
          document.getElementById('url-output').value = "Error: Malformed URI component.";
       }
    }
    
    // Dev Rules
    function copyRules() {
       const text = document.getElementById('rules-md').value;
       navigator.clipboard.writeText(text).then(() => {
          alert('Copied to clipboard!');
       }).catch(err => {
          console.error('Failed to copy text: ', err);
       });
    }
    
    function downloadRules() {
       const text = document.getElementById('rules-md').value;
       const blob = new Blob([text], { type: 'text/markdown' });
       const a = document.createElement('a');
       a.href = URL.createObjectURL(blob);
       a.download = 'developer_rules.md';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
    }
