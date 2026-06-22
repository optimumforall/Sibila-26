/* ============================================
 * NEXUS — Orquestador OFA OS
 * Floating widget: draggable, resizable, minimizable
 * Stack: HTML5 + Vanilla JS + CSS puro
 * ============================================ */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://pzjdruihfqtflugypcgl.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6amRydWloZnF0Zmx1Z3lwY2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODE4NzQsImV4cCI6MjA5MjM1Nzg3NH0.aYY7WaTvKqpFtzZPt2DY4Ag-_KLmBcRhJwLX_lGhKf4';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6amRydWloZnF0Zmx1Z3lwY2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODE4NzQsImV4cCI6MjA5MjM1Nzg3NH0.aYY7WaTvKqpFtzZPt2DY4Ag-_KLmBcRhJwLX_lGhKf4';
  const MEM_HEADERS = { apikey: ANON_KEY, Authorization: 'Bearer ' + ANON_KEY, 'Content-Type': 'application/json' };
  const NEXUS_ENDPOINT = `${SUPABASE_URL}/functions/v1/command`;
  const STORAGE_KEY = 'nexus_widget_state';

  if (window.__NEXUS_LOADED__) return;
  window.__NEXUS_LOADED__ = true;

  // ============================================
  // ESTILOS
  // ============================================
  const styles = `
    .nx-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: #ffffff;
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(15, 23, 42, 0.28), 0 0 0 0 rgba(15,23,42,.12);
      z-index: 999998;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Outfit', -apple-system, sans-serif;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.06em;
      transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
    }
    .nx-trigger:hover {
      transform: scale(1.1);
      box-shadow: 0 14px 44px rgba(15, 23, 42, 0.36);
    }
    .nx-trigger.nx-hidden { display: none; }
    .nx-trigger.has-notif {
      animation: nxPulse 2.4s ease-in-out infinite;
    }
    @keyframes nxPulse {
      0%, 100% { box-shadow: 0 8px 32px rgba(15,23,42,.28), 0 0 0 0 rgba(15,23,42,.18); }
      50% { box-shadow: 0 8px 32px rgba(15,23,42,.28), 0 0 0 10px rgba(15,23,42,.0); }
    }

    .nx-panel {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 440px;
      height: 620px;
      min-width: 340px;
      min-height: 420px;
      max-width: 90vw;
      max-height: 90vh;
      background: var(--card, #ffffff);
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 24px;
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.16), 0 8px 24px rgba(15,23,42,.06);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text, #0f172a);
    }
    .nx-panel.nx-hidden { display: none; }

    .nx-header {
      padding: 14px 18px;
      background: var(--bg, #f8fafc);
      border-bottom: 1px solid var(--border, #e2e8f0);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: move;
      user-select: none;
      flex-shrink: 0;
    }
    .nx-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.06em;
    }
    .nx-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
    }
    .nx-subtitle {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 400;
      margin-left: 6px;
      letter-spacing: 0;
    }
    .nx-actions {
      display: flex;
      gap: 6px;
    }
    .nx-icon-btn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: background 0.15s ease;
    }
    .nx-icon-btn:hover { background: #e2e8f0; color: #0f172a; }

    .nx-body {
      flex: 1;
      overflow-y: auto;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--card, #ffffff);
    }

    /* LOGIN */
    .nx-login {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px;
    }
    .nx-login h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .nx-login p {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .nx-login input {
      padding: 12px 14px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-family: inherit;
      font-size: 14px;
      background: #f8fafc;
      outline: none;
      transition: all 0.15s ease;
    }
    .nx-login input:focus {
      border-color: #0f172a;
      background: #ffffff;
    }
    .nx-login button {
      padding: 12px;
      background: #0f172a;
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .nx-login button:hover { background: #1e293b; }
    .nx-login button:disabled { background: #94a3b8; cursor: not-allowed; }
    .nx-error {
      background: #fef2f2;
      color: #991b1b;
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 12px;
      display: none;
    }
    .nx-error.nx-show { display: block; }

    /* MENSAJES */
    .nx-msg {
      max-width: 88%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      animation: nxFade 0.25s ease;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    @keyframes nxFade {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .nx-msg.user {
      align-self: flex-end;
      background: #0f172a;
      color: #ffffff;
      border-bottom-right-radius: 6px;
    }
    .nx-msg.assistant {
      align-self: flex-start;
      background: var(--bg, #f1f5f9);
      color: var(--text, #0f172a);
      border-bottom-left-radius: 6px;
      border: 1px solid var(--border, #e2e8f0);
    }
    .nx-msg.system {
      align-self: center;
      background: transparent;
      color: #94a3b8;
      font-size: 11.5px;
      font-style: italic;
      text-align: center;
    }
    .nx-msg-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nx-msg-wrap.user { align-items: flex-end; }
    .nx-msg-wrap.assistant { align-items: flex-start; }
    .nx-msg-wrap.system { align-items: center; }
    .nx-timestamp {
      font-size: 10px;
      color: #cbd5e1;
      padding: 0 4px;
    }
    .nx-notif-dot {
      position: absolute;
      top: 0; right: 0;
      width: 16px; height: 16px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid #fff;
      font-size: 9px;
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800;
      pointer-events: none;
    }
    .nx-typing {
      display: flex;
      gap: 4px;
      padding: 12px 14px;
      background: var(--bg, #f1f5f9);
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 16px;
      align-self: flex-start;
      width: fit-content;
    }
    .nx-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94a3b8;
      animation: nxTyping 1.4s infinite;
    }
    .nx-typing span:nth-child(2) { animation-delay: 0.2s; }
    .nx-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes nxTyping {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-5px); opacity: 1; }
    }

    /* INPUT */
    .nx-input-bar {
      padding: 12px;
      border-top: 1px solid var(--border, #e2e8f0);
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--card, #ffffff);
      flex-shrink: 0;
    }
    .nx-input-bar input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--border, #e2e8f0);
      border-radius: 14px;
      font-family: inherit;
      font-size: 14px;
      background: var(--bg, #f8fafc);
      color: var(--text, #0f172a);
      outline: none;
      transition: all 0.15s ease;
    }
    .nx-input-bar input:focus {
      border-color: var(--accent, #334155);
      background: var(--card, #ffffff);
    }
    .nx-input-bar input::placeholder { color: var(--muted, #94a3b8); }
    .nx-circle {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: none;
      background: #f1f5f9;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .nx-circle:hover { background: #e2e8f0; transform: scale(1.05); }
    .nx-circle.primary {
      background: #0f172a;
      color: #ffffff;
    }
    .nx-circle.primary:hover { background: #1e293b; }
    .nx-circle:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .nx-circle.recording {
      background: #ef4444;
      color: #ffffff;
      animation: nxRec 1.2s infinite;
    }
    @keyframes nxRec {
      0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
      50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    }

    .nx-resize {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 18px;
      height: 18px;
      cursor: nwse-resize;
      background:
        linear-gradient(135deg,
          transparent 0%, transparent 50%,
          #cbd5e1 50%, #cbd5e1 60%,
          transparent 60%, transparent 70%,
          #cbd5e1 70%, #cbd5e1 80%,
          transparent 80%, transparent 90%,
          #cbd5e1 90%);
      border-bottom-right-radius: 24px;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  if (!document.querySelector('link[href*="Outfit"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
  }

  // ============================================
  // DOM
  // ============================================
  const trigger = document.createElement('button');
  trigger.className = 'nx-trigger';
  trigger.setAttribute('aria-label', 'Abrir Nick Fury');
  trigger.innerHTML = 'NF';
  const notifDot = document.createElement('span');
  notifDot.className = 'nx-notif-dot';
  notifDot.style.display = 'none';
  notifDot.textContent = '0';
  trigger.appendChild(notifDot);
  let unreadCount = 0;

  const panel = document.createElement('div');
  panel.className = 'nx-panel nx-hidden';
  panel.innerHTML = `
    <div class="nx-header" id="nx-drag">
      <div class="nx-title">
        <span class="nx-dot"></span>
        <span>Nick Fury</span>
        <span class="nx-subtitle">orquestador</span>
      </div>
      <div class="nx-actions">
        <button class="nx-icon-btn" id="nx-tts" title="Voz on/off">🔊</button>
        <button class="nx-icon-btn" id="nx-logout" title="Salir" style="display:none">⎋</button>
        <button class="nx-icon-btn" id="nx-min" title="Minimizar">−</button>
      </div>
    </div>
    <div class="nx-body" id="nx-body"></div>
    <div class="nx-input-bar nx-hidden" id="nx-input-bar">
      <button class="nx-circle" id="nx-voice" title="Hablar">🎙️</button>
      <button class="nx-circle" id="nx-upload" title="Subir archivo">📎</button>
      <input type="file" id="nx-file-input" style="display:none" />
      <input type="text" id="nx-input" placeholder="Pregunta a Nick Fury..." autocomplete="off">
      <button class="nx-circle primary" id="nx-send" title="Enviar">→</button>
    </div>
    <div class="nx-resize" id="nx-resize"></div>
    <button class="nx-icon-btn" id="nx-scroll-bottom" title="Ir al final" style="position:absolute;bottom:70px;right:16px;width:32px;height:32px;background:rgba(255,255,255,0.8);border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.15);display:none;align-items:center;justify-content:center;z-index:10;">↓</button>
  `;

  document.body.appendChild(trigger);
  document.body.appendChild(panel);

  const chatBody = panel.querySelector('#nx-body');
  const inputBar = panel.querySelector('#nx-input-bar');
  const input = panel.querySelector('#nx-input');
  const btnSend = panel.querySelector('#nx-send');
  const btnVoice = panel.querySelector('#nx-voice');
  const btnUpload = panel.querySelector('#nx-upload');
  const fileInput = panel.querySelector('#nx-file-input');
  const btnScroll = panel.querySelector('#nx-scroll-bottom');
  const btnMin = panel.querySelector('#nx-min');
  const btnLogout = panel.querySelector('#nx-logout');
  const btnTts = panel.querySelector('#nx-tts');
  const dragHandle = panel.querySelector('#nx-drag');
  const resizeHandle = panel.querySelector('#nx-resize');

  // Mostrar botón cuando el usuario scrollea hacia arriba
  chatBody.addEventListener('scroll', () => {
    const atBottom = chatBody.scrollTop + chatBody.clientHeight >= chatBody.scrollHeight - 20;
    btnScroll.style.display = atBottom ? 'none' : 'flex';
  });
  btnScroll.addEventListener('click', () => {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' });
  });

  // ============================================
  // TTS — NEXUS habla (Web Speech API, voz española)
  // ============================================
  const TTS_KEY = 'nexus_tts_enabled';
  let ttsEnabled = (typeof OFA_STORAGE !== 'undefined' ? OFA_STORAGE : localStorage).getItem(TTS_KEY) !== 'false';
  let lastInputWasVoice = false; // si el último mensaje vino del micro, hablamos sí o sí
  let silentLoad = false;        // true mientras se carga historial: NO hablar

  // Idioma activo (reconocimiento + TTS). Persistente.
  const LANG_KEY = 'nexus_lang';
  // Mapa de códigos cortos a BCP-47
  const LANG_MAP = {
    'es': 'es-ES', 'español': 'es-ES', 'spanish': 'es-ES',
    'en': 'en-US', 'english': 'en-US', 'inglés': 'en-US', 'ingles': 'en-US',
    'sr': 'sr-RS', 'serbio': 'sr-RS', 'serbian': 'sr-RS',
    'fr': 'fr-FR', 'francés': 'fr-FR', 'frances': 'fr-FR',
    'ca': 'ca-ES', 'catalán': 'ca-ES', 'catalan': 'ca-ES',
  };
  function getLang() {
    return (typeof OFA_STORAGE !== 'undefined' ? OFA_STORAGE : localStorage).getItem(LANG_KEY) || 'es-ES';
  }
  function setLang(code) {
    const bcp = LANG_MAP[String(code).toLowerCase().trim()] || code;
    (typeof OFA_STORAGE !== 'undefined' ? OFA_STORAGE : localStorage).setItem(LANG_KEY, bcp);
    cachedVoice = pickVoiceFor(bcp);
    return bcp;
  }

  function updateTtsBtn() {
    if (!btnTts) return;
    btnTts.textContent = ttsEnabled ? '🔊' : '🔇';
    btnTts.title = ttsEnabled ? 'Voz activa (clic para silenciar)' : 'Voz silenciada (clic para activar)';
  }
  updateTtsBtn();

  if (btnTts) {
    btnTts.addEventListener('click', () => {
      ttsEnabled = !ttsEnabled;
      (typeof OFA_STORAGE !== 'undefined' ? OFA_STORAGE : localStorage).setItem(TTS_KEY, String(ttsEnabled));
      updateTtsBtn();
      if (!ttsEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
    });
  }

  // Cache de voz (cambia según idioma activo)
  let cachedVoice = null;
  function pickVoiceFor(bcp) {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const prefix = bcp.split('-')[0];
    return voices.find(v => v.lang === bcp)
        || voices.find(v => v.lang && v.lang.startsWith(prefix + '-'))
        || voices.find(v => v.lang && v.lang.startsWith(prefix))
        || voices.find(v => v.default)
        || voices[0];
  }
  if ('speechSynthesis' in window) {
    cachedVoice = pickVoiceFor(getLang());
    window.speechSynthesis.onvoiceschanged = () => { cachedVoice = pickVoiceFor(getLang()); };
  }

  function speak(text, force = false) {
    if (!text) return;
    if (!ttsEnabled && !force) return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // corta cualquier voz anterior
      // Limpia texto para TTS: quita emojis y markdown ligero
      const clean = String(text).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').replace(/[*_`#>]/g, '').trim();
      if (!clean) return;

      // Bug Chrome: utterances >200 chars se cortan. Solución: trocear por frases.
      const chunks = clean.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [clean];
      // Reagrupar chunks pequeños hasta ~180 chars
      const groups = [];
      let buf = '';
      for (const c of chunks) {
        if ((buf + c).length > 180 && buf) { groups.push(buf.trim()); buf = c; }
        else buf += c;
      }
      if (buf.trim()) groups.push(buf.trim());

      if (!cachedVoice) cachedVoice = pickVoiceFor(getLang());
      const lang = getLang();

      // Pausar wake word al empezar la primera utterance
      let started = false;
      groups.forEach((chunk, i) => {
        const u = new SpeechSynthesisUtterance(chunk);
        u.lang = lang;
        u.rate = 1.05;
        u.pitch = 1.0;
        if (cachedVoice) u.voice = cachedVoice;
        if (i === 0) u.onstart = () => { started = true; try { wakeRec && wakeRec.stop(); } catch(e){} };
        if (i === groups.length - 1) u.onend = () => { /* terminado */ };
        window.speechSynthesis.speak(u);
      });

      // Workaround para Chrome: si después de 14s sigue activo, hace "resume" para que no se quede mudo
      const keepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          clearInterval(keepAlive);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);
      // Auto-limpieza al cabo de 60s pase lo que pase
      setTimeout(() => clearInterval(keepAlive), 60000);
    } catch (e) { console.warn('TTS error:', e); }
  }

  // ============================================
  // STATE PERSISTENCE
  // ============================================
  function loadState() {
    try {
      const s = JSON.parse((typeof OFA_STORAGE!=='undefined'?OFA_STORAGE:localStorage).getItem(STORAGE_KEY)||'{}');
      if (s.width) panel.style.width = s.width + 'px';
      if (s.height) panel.style.height = s.height + 'px';
      if (s.left !== undefined && s.top !== undefined) {
        panel.style.left = s.left + 'px';
        panel.style.top = s.top + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
      }
    } catch (e) { /* noop */ }
  }
  function saveState() {
    const rect = panel.getBoundingClientRect();
    (typeof OFA_STORAGE!=='undefined'?OFA_STORAGE:localStorage).setItem(STORAGE_KEY,JSON.stringify({
      width: rect.width, height: rect.height,
      left: rect.left, top: rect.top,
    }));
  }
  loadState();

  // DRAG
  let dragging = false, dragOX = 0, dragOY = 0;
  dragHandle.addEventListener('mousedown', (e) => {
    if (e.target.closest('.nx-icon-btn')) return;
    dragging = true;
    const rect = panel.getBoundingClientRect();
    dragOX = e.clientX - rect.left;
    dragOY = e.clientY - rect.top;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, e.clientX - dragOX));
    const y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, e.clientY - dragOY));
    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; document.body.style.userSelect = ''; saveState(); }
  });

  // RESIZE
  let resizing = false, rSX = 0, rSY = 0, sW = 0, sH = 0;
  resizeHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    resizing = true;
    rSX = e.clientX; rSY = e.clientY;
    sW = panel.offsetWidth; sH = panel.offsetHeight;
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', (e) => {
    if (!resizing) return;
    panel.style.width = Math.max(340, sW + (e.clientX - rSX)) + 'px';
    panel.style.height = Math.max(420, sH + (e.clientY - rSY)) + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (resizing) { resizing = false; document.body.style.userSelect = ''; saveState(); }
  });

  // OPEN / CLOSE
  function openPanel() {
    panel.classList.remove('nx-hidden');
    trigger.classList.add('nx-hidden');
    // Clear unread badge
    unreadCount = 0;
    notifDot.style.display = 'none';
    setTimeout(() => input && !input.disabled && input.focus(), 100);
    
    if (chatBody.querySelectorAll('.nx-msg-wrap').length === 0) {
      addMsg('Fury. ¿Qué necesitas?', 'assistant');
    }
  }
  function closePanel() {
    panel.classList.add('nx-hidden');
    trigger.classList.remove('nx-hidden');
  }
  trigger.addEventListener('click', openPanel);
  btnMin.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.classList.contains('nx-hidden')) closePanel();
  });

  // ============================================
  // SUPABASE
  // ============================================
  let supabase = null;
  let currentConversationId = null;

  async function initSupabase() {
    const mod = await import('https://esm.sh/@supabase/supabase-js@2');
    supabase = mod.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,        // no toca localStorage → fin del error "Access to storage is not allowed"
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    });
  }

  // ============================================
  // MEMORIA PERSISTENTE (nexus_memory vía anon fetch)
  // ============================================
  async function saveToMemory(type, content, tags = []) {
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/nexus_memory', {
        method: 'POST',
        headers: { ...MEM_HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ type, content, tags })
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        console.warn('[NEXUS memoria] insert falló', r.status, txt);
      }
    } catch (e) { console.warn('[NEXUS memoria] error red:', e); }
  }

  async function loadMemory(type = 'conversation', limit = 10) {
    try {
      const res = await fetch(
        SUPABASE_URL + '/rest/v1/nexus_memory?type=eq.' + type + '&order=created_at.desc&limit=' + limit,
        { headers: MEM_HEADERS }
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.warn('[NEXUS memoria] load falló', res.status, txt);
        return [];
      }
      return await res.json();
    } catch (e) { console.warn('[NEXUS memoria] error load:', e); return []; }
  }

  function clearBody() { chatBody.innerHTML = ''; }

  function fmtTime(d) {
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  function addMsg(text, role = 'assistant') {
    const wrap = document.createElement('div');
    wrap.className = 'nx-msg-wrap ' + role;
    const m = document.createElement('div');
    m.className = 'nx-msg ' + role;
    m.textContent = text;
    wrap.appendChild(m);
    if (role !== 'system') {
      const ts = document.createElement('span');
      ts.className = 'nx-timestamp';
      ts.textContent = fmtTime(new Date());
      wrap.appendChild(ts);
    }
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
    // Notification badge when panel is closed and assistant replies
    if (role === 'assistant' && panel.classList.contains('nx-hidden')) {
      unreadCount++;
      notifDot.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
      notifDot.style.display = 'flex';
    }
    // TTS: NEXUS habla cuando responde. Si el usuario entró por voz, hablamos sí o sí.
    // Pero NUNCA durante la carga de historial.
    if (role === 'assistant' && !silentLoad) {
      speak(text, lastInputWasVoice);
      lastInputWasVoice = false;
    }
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'nx-typing';
    t.id = 'nx-typing-ind';
    t.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(t);
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  function hideTyping() {
    const t = document.getElementById('nx-typing-ind');
    if (t) t.remove();
  }

  // LOGIN
  function renderLogin() {
    clearBody();
    inputBar.classList.add('nx-hidden');
    btnLogout.style.display = 'none';

    const wrap = document.createElement('div');
    wrap.className = 'nx-login';
    wrap.innerHTML = `
      <h3>Acceso Nick Fury</h3>
      <p>Identifícate con tu cuenta OFA</p>
      <div class="nx-error" id="nx-err"></div>
      <input type="email" id="nx-email" placeholder="email" autocomplete="email">
      <input type="password" id="nx-pass" placeholder="contraseña" autocomplete="current-password">
      <button id="nx-do-login">Entrar</button>
    `;
    chatBody.appendChild(wrap);

    const emailEl = wrap.querySelector('#nx-email');
    const passEl = wrap.querySelector('#nx-pass');
    const errEl = wrap.querySelector('#nx-err');
    const btn = wrap.querySelector('#nx-do-login');

    async function doLogin() {
      errEl.classList.remove('nx-show');
      const email = emailEl.value.trim();
      const password = passEl.value;
      if (!email || !password) {
        errEl.textContent = 'Introduce email y contraseña';
        errEl.classList.add('nx-show');
        return;
      }
      btn.disabled = true;
      btn.textContent = 'Entrando...';
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      btn.disabled = false;
      btn.textContent = 'Entrar';
      if (error) {
        errEl.textContent = error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : error.message;
        errEl.classList.add('nx-show');
        return;
      }
      renderChat();
    }
    btn.addEventListener('click', doLogin);
    passEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
    emailEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') passEl.focus(); });
    setTimeout(() => emailEl.focus(), 100);
  }

  async function renderChat() {
    clearBody();
    inputBar.classList.remove('nx-hidden');
    btnLogout.style.display = 'none'; // NEXUS ya no usa login
  }

  // ============================================
  // COMANDOS ESPECIALES — notas, decisiones, recordatorios
  // ============================================
  function detectTags(text) {
    const tags = [];
    const lower = text.toLowerCase();
    if (lower.includes('elia') || lower.includes('salón') || lower.includes('salon')) tags.push('elia');
    if (lower.includes('venta') || lower.includes('lead') || lower.includes('cliente')) tags.push('ventas');
    if (lower.includes('bug') || lower.includes('error') || lower.includes('deploy')) tags.push('tech');
    if (lower.includes('coste') || lower.includes('gasto') || lower.includes('factura')) tags.push('finanzas');
    return tags;
  }

  function addNote(icon, content, time) {
    const m = document.createElement('div');
    m.className = 'nx-msg system';
    m.style.cssText = 'display:flex;align-items:flex-start;gap:8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:10px 12px;';
    m.innerHTML = '<span style="flex-shrink:0;font-size:1rem;">' + icon + '</span>'
      + '<span style="flex:1;font-size:.85rem;color:#0f172a;">' + content + '</span>'
      + '<span style="flex-shrink:0;font-size:.7rem;color:#94a3b8;">' + (time || '') + '</span>';
    chatBody.appendChild(m);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function processSpecialCommand(text) {
    const lower = text.toLowerCase().trim();

    // Ver notas
    if (lower === 'notas' || lower === 'mis notas' || lower === 'qué tengo anotado') {
      const notes = await loadMemory('note', 20);
      if (notes.length === 0) {
        addMsg('No tienes notas aún. Usa "nota: [texto]" para anotar algo.', 'system');
      } else {
        addMsg('Tus notas:', 'system');
        notes.slice().reverse().forEach(n => addNote('📝', n.content, timeAgo(n.created_at)));
      }
      return true;
    }

    // Cambiar idioma: "idioma: es" | "idioma: en" | "idioma: sr" | "lang: en"
    if (lower.startsWith('idioma:') || lower.startsWith('lang:') || lower.startsWith('language:')) {
      const code = text.split(':').slice(1).join(':').trim().toLowerCase();
      if (code) {
        const bcp = setLang(code);
        addMsg('Idioma cambiado a ' + bcp + '. El próximo comando de voz se reconocerá en ese idioma.', 'system');
        // Reiniciar wake word con el nuevo idioma
        try { wakeRec && wakeRec.stop(); } catch(e){}
        setTimeout(() => { try { startWakeWord(); } catch(e){} }, 500);
      } else {
        addMsg('Idioma actual: ' + getLang() + '. Usa "idioma: en" o "idioma: sr" para cambiarlo.', 'system');
      }
      return true;
    }

    // Anotar
    const noteMatch = lower.startsWith('anota:') || lower.startsWith('nota:') || lower.startsWith('recuerda:');
    if (noteMatch) {
      const note = text.split(':').slice(1).join(':').trim();
      if (note) {
        await saveToMemory('note', note, detectTags(note));
        addNote('📝', note, 'ahora');
        addMsg('Anotado.', 'system');
      }
      return true;
    }

    // Decisión
    if (lower.startsWith('decisión:') || lower.startsWith('decision:') || lower.startsWith('decidido:')) {
      const decision = text.split(':').slice(1).join(':').trim();
      if (decision) {
        await saveToMemory('decision', decision, detectTags(decision));
        addNote('✅', decision, 'ahora');
        addMsg('Decisión registrada.', 'system');
      }
      return true;
    }

    // Recordatorio
    if (lower.startsWith('recordar:') || lower.startsWith('reminder:')) {
      const reminder = text.split(':').slice(1).join(':').trim();
      if (reminder) {
        await saveToMemory('reminder', reminder, detectTags(reminder));
        addNote('⏰', reminder, 'ahora');
        addMsg('Recordatorio guardado.', 'system');
      }
      return true;
    }

    // ============================================
    // GMAIL TRIGGER — detectar requests de email
    // ============================================
    const gmailKeywords = ['gmail', 'email', 'emails', 'inbox', 'correo', 'correos',
      'leer email', 'lee email', 'responder email', 'envía email', 'enviar email',
      'mis emails', 'mi inbox', 'bandeja'];
    const needsGmail = gmailKeywords.some(kw => lower.includes(kw));

    if (needsGmail) {
      // Verificar si ya tiene token en Supabase
      let hasToken = false;
      try {
        const res = await fetch(SUPABASE_URL + '/rest/v1/google_auth_tokens?email=eq.optimum.for.all%40gmail.com&select=id&limit=1', {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: 'Bearer ' + SUPABASE_KEY,
          }
        });
        const data = await res.json();
        hasToken = Array.isArray(data) && data.length > 0;
      } catch (e) { console.warn('[NEXUS Gmail] token check error:', e); }

      if (!hasToken) {
        // No tiene token → mostrar link OAuth como botón clicable
        const oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
          + '?client_id=1006706198821-90a28vjoc0ra7ni4a2260gbp7u8nbm86.apps.googleusercontent.com'
          + '&redirect_uri=https%3A%2F%2Fpzjdruihfqtflugypcgl.supabase.co%2Fauth%2Fv1%2Fcallback'
          + '&response_type=code'
          + '&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.modify'
          + '&access_type=offline'
          + '&prompt=consent';

        // Crear mensaje con link clicable
        const wrap = document.createElement('div');
        wrap.className = 'nx-msg-wrap system';
        const m = document.createElement('div');
        m.className = 'nx-msg system';
        m.innerHTML = '📧 Necesito acceso a Gmail. <a href="' + oauthUrl + '" target="_blank" style="color:#22c55e;text-decoration:underline;font-weight:600;">Click aquí para autorizar</a> y cierra esa ventana cuando termine.';
        wrap.appendChild(m);
        chatBody.appendChild(wrap);
        chatBody.scrollTop = chatBody.scrollHeight;
        speak('Necesito que autorices el acceso a Gmail. Te he enviado el link.');
        return true;
      }

      // Tiene token → mostrar indicador y pasar al backend
      addMsg('📧 Conectando a Gmail...', 'system');
      return false; // Continúa al backend para ejecutar tool
    }

    return false;
  }

  // ============================================
  // MODO OFFLINE — respuestas locales con Supabase
  // ============================================
  const NAV_MAP = {
    'ventas': 'sales_console.html', 'leads': 'sales_console.html',
    'inbox': 'smart_inbox.html', 'correo': 'smart_inbox.html',
    'technical': 'technical.html', 'sistema': 'technical.html',
    'operaciones': 'operaciones.html', 'tareas': 'operaciones.html',
    'agentes': 'ai_agents.html', 'agents': 'ai_agents.html',
    'legal': 'legal_finances.html', 'finanzas': 'legal_finances.html',
    'settings': 'settings.html', 'ajustes': 'settings.html',
    'marketing': 'marketing_console.html'
    // 'nexus' eliminado: causaba que decir "hola nexus" abriera command.html
  };

  async function fetchAndRespond(type) {
    const H = MEM_HEADERS;
    try {
      if (type === 'leads') {
        const res = await fetch(SUPABASE_URL + '/rest/v1/leads?select=id,name,tony_score,status&order=tony_score.desc&limit=5', { headers: H });
        const leads = await res.json();
        if (!Array.isArray(leads) || leads.length === 0) return { response: 'No hay leads en el pipeline.' };
        const hot = leads.filter(l => l.tony_score >= 7);
        return { response: 'Pipeline: ' + leads.length + ' leads visibles, ' + hot.length + ' con score ≥7. Top: ' + leads.slice(0, 3).map(l => l.name).join(', ') + '.' };
      }
      if (type === 'tasks') {
        const res = await fetch(SUPABASE_URL + '/rest/v1/tasks?status=eq.pending&order=due_date.asc&limit=5', { headers: H });
        const tasks = await res.json();
        if (!Array.isArray(tasks) || tasks.length === 0) return { response: 'No hay tareas pendientes.' };
        return { response: tasks.length + ' tareas pendientes. Próxima: "' + (tasks[0].title || '—') + '".' };
      }
      if (type === 'agents') {
        const res = await fetch(SUPABASE_URL + '/rest/v1/agents?tenant_id=eq.OFA&select=name,status&order=name.asc', { headers: H });
        const agents = await res.json();
        if (!Array.isArray(agents)) return { response: 'No pude consultar los agentes.' };
        const active = agents.filter(a => a.status === 'active');
        return { response: agents.length + ' agentes OFA registrados. ' + active.length + ' activos: ' + active.slice(0, 5).map(a => a.name).join(', ') + '.' };
      }
    } catch (e) {}
    return { response: 'No pude consultar los datos.' };
  }

  async function offlineResponse(text) {
    const lower = text.toLowerCase();

    // Consultas de datos
    if (lower.includes('lead') || lower.includes('pipeline') || lower.includes('ventas')) {
      return fetchAndRespond('leads');
    }
    if (lower.includes('tarea') || lower.includes('pendiente') || lower.includes('hacer')) {
      return fetchAndRespond('tasks');
    }
    if (lower.includes('agente') || lower.includes('agent')) {
      return fetchAndRespond('agents');
    }

    // Navegación
    for (const [key, url] of Object.entries(NAV_MAP)) {
      if (lower.includes(key)) {
        return { response: 'Abriendo ' + key + '...', action: () => { window.location.href = url; } };
      }
    }

    return { response: 'Backend no disponible. Puedo: ver leads, tareas o agentes — o navegar a cualquier consola. También puedes "nota: [texto]" para anotar.' };
  }

  function timeAgo(iso) {
    if (!iso) return '';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return 'hace ' + mins + 'm';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return 'hace ' + hrs + 'h';
    return 'hace ' + Math.floor(hrs / 24) + 'd';
  }
  function cleanMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^[-•]\s/gm, '')
      .replace(/^#+\s/gm, '')
      .trim();
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    input.value = '';

    // Primero verificar comandos especiales (no requieren backend)
    const isSpecial = await processSpecialCommand(text);
    if (isSpecial) {
      // Mostrar el mensaje del usuario también, para que vea lo que dijo
      addMsg(text, 'user');
      return;
    }

    addMsg(text, 'user');
    input.disabled = true;
    btnSend.disabled = true;
    showTyping();

    try {
      // --- Fetch contexto real de Supabase ANTES de llamar a Nick ---
      const supaHeaders = {
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + ANON_KEY
      };

      let leadsData = [];
      let tasksData = [];
      try {
        const [leadsRes, tasksRes] = await Promise.all([
          fetch(SUPABASE_URL + '/rest/v1/leads?tony_score=gte.7&order=tony_score.desc&limit=3&select=name,city,tony_score', { headers: supaHeaders }),
          fetch(SUPABASE_URL + '/rest/v1/tasks?status=eq.pending&order=due_date.asc&limit=3&select=title', { headers: supaHeaders })
        ]);
        if (leadsRes.ok) leadsData = await leadsRes.json();
        if (tasksRes.ok) tasksData = await tasksRes.json();
      } catch(fetchErr) {
        console.warn('[NEXUS] No se pudo obtener contexto de Supabase:', fetchErr);
      }

      const systemContext = [
        leadsData.length
          ? 'Leads HOT: ' + leadsData.map(l => l.name + ' Score:' + l.tony_score).join(', ')
          : 'Leads HOT: ninguno con score ≥7',
        tasksData.length
          ? 'Tareas: ' + tasksData.map(t => t.title).join(', ')
          : 'Tareas: ninguna pendiente'
      ].join('. ');

      // --- Llamar al webhook de Nick con contexto real ---
      const backendUrl = 'https://n8n.optimumforall.es/webhook/nick-fury-chat';
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context: text,
          user_context: 'ofa_operator',
          system_context: systemContext
        })
      });

      hideTyping();
      // Guardar mensaje del usuario en memoria
      saveToMemory('conversation', 'user: ' + text);

      if (!res.ok) {
        addMsg('Nick Fury no está disponible ahora. Intenta en unos minutos.', 'assistant');
        return;
      }
      const rawText = await res.text();
      console.log('Nick Fury raw response:', rawText);
      if (!rawText || rawText.trim() === '') {
        throw new Error('Respuesta vacía del servidor');
      }

      let data;
      try { data = JSON.parse(rawText); } catch(e) { data = rawText; }
      let reply = typeof data === 'string' ? data : (data.response || data.message || data.reply || JSON.stringify(data));

      if (typeof reply === 'string' && reply.startsWith('=')) {
        reply = reply.substring(1);
      }

      addMsg(cleanMarkdown(reply), 'assistant');
      saveToMemory('conversation', 'assistant: ' + reply);
    } catch(e) {
      hideTyping();
      console.error('NEXUS error:', e.message, e);
      addMsg('Nick Fury no está disponible ahora. Error: ' + e.message, 'assistant');
      input.disabled = false;
      btnSend.disabled = false;
    } finally {
      input.disabled = false;
      btnSend.disabled = false;
      input.focus();
    }
  }

  btnSend.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  // VOZ
  btnVoice.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addMsg('Tu navegador no soporta voz. Usa Chrome.', 'system');
      return;
    }
    // Si NEXUS está hablando, lo cortamos para escuchar
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    // Pausamos wake word mientras escuchamos comando explícito
    try { wakeRec && wakeRec.stop(); } catch(e){}
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Rec();
    rec.lang = getLang();
    rec.continuous = false;
    rec.interimResults = false;
    btnVoice.classList.add('recording');
    rec.onresult = (e) => {
      input.value = e.results[0][0].transcript;
      lastInputWasVoice = true;
      sendMessage(input.value);
    };
    rec.onerror = (e) => { addMsg('Error de voz: ' + (e.error === 'not-allowed' ? 'Permite el micrófono en Chrome' : e.error || 'inténtalo de nuevo'), 'system'); btnVoice.classList.remove('recording'); };
    rec.onend = () => {
      btnVoice.classList.remove('recording');
      // Reanudar wake word cuando termine el speak (lo gestiona u.onend)
      // Si por lo que sea no se llega a hablar, lo reanudamos en 2s por si acaso
      setTimeout(() => { try { startWakeWord(); } catch(e){} }, 2000);
    };
    rec.start();
  });

  // Botón logout neutralizado: NEXUS ya no usa login
  // (Mantenemos el listener vacío por si el botón se hiciera visible accidentalmente)
  btnLogout.addEventListener('click', () => {});

  // ============================================
  // WAKE WORD — "Hey NEXUS"
  // ============================================
  let wakeRec = null;
  let wakeActive = false;

  function startWakeWord() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    if (wakeActive) return;
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    wakeRec = new Rec();
    wakeRec.lang = getLang();
    wakeRec.continuous = true;
    wakeRec.interimResults = true;
    wakeActive = true;

    wakeRec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript.toLowerCase().trim();
        if (transcript.includes('nexus') || transcript.includes('néxus')) {
          // Wake word detected — open panel and start command mode
          if (panel.classList.contains('nx-hidden')) {
            panel.classList.remove('nx-hidden');
            trigger.classList.add('nx-hidden');
          }
          // Brief visual feedback on the mic button
          btnVoice.classList.add('recording');
          setTimeout(() => btnVoice.classList.remove('recording'), 600);
          // Auto-start command recognition after a brief pause
          setTimeout(() => {
            if (!input.disabled) {
              const cmdRec = new Rec();
              cmdRec.lang = getLang();
              cmdRec.continuous = false;
              cmdRec.interimResults = false;
              cmdRec.onresult = (ev) => {
                const cmd = ev.results[0][0].transcript;
                input.value = cmd;
                lastInputWasVoice = true;
                sendMessage(cmd);
              };
              cmdRec.onerror = () => {};
              cmdRec.onend = () => btnVoice.classList.remove('recording');
              btnVoice.classList.add('recording');
              cmdRec.start();
            }
          }, 400);
        }
      }
    };

    wakeRec.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') wakeActive = false;
    };

    wakeRec.onend = () => {
      wakeActive = false;
      // Restart after 1s unless page is hidden
      if (!document.hidden) setTimeout(startWakeWord, 1000);
    };

    try { wakeRec.start(); } catch(e) { wakeActive = false; }
  }

  document.addEventListener('visibilitychange', () => {
    // Wake word desactivado — causaba "aborted" al pulsar el micro
    // if (!document.hidden && !wakeActive) startWakeWord();
  });

  // INIT — sin login requerido, anon accede a nexus_memory directamente
  (async function init() {
    await initSupabase();
    renderChat();
    // Wake word desactivado por defecto (conflicto con micro manual).
    // Para reactivarlo: descomenta la línea de abajo.
    // startWakeWord();
  })();

})();
