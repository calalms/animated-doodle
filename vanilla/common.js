// common.js — shared vanilla-JS helpers for the Callie's Alpine Canine apps.
// No framework: a tiny hyperscript-style DOM builder, the Android/Chrome
// device-chrome builders (recreating android-frame.jsx / browser-window.jsx
// as plain DOM), a handful of shared icons, and small formatting helpers.

// ───────────────────────── DOM builder ─────────────────────────
// h(tag, props, children) — like a minimal hyperscript. Props starting with
// "on" + a function become addEventListener calls. `style` accepts an object
// or a CSS string. `html` sets innerHTML (use only for trusted, static SVG
// strings defined in this file — never for user input). Text children are
// inserted via createTextNode so user-supplied strings are always escaped.
function h(tag, props, children) {
  const e = document.createElement(tag);
  props = props || {};
  for (const k in props) {
    const v = props[k];
    if (v === undefined || v === null || v === false) continue;
    if (k === 'style') {
      if (typeof v === 'string') e.setAttribute('style', v);
      else Object.assign(e.style, v);
    } else if (k === 'html') {
      e.innerHTML = v;
    } else if (k === 'class') {
      e.className = v;
    } else if (k.slice(0, 2) === 'on' && typeof v === 'function') {
      e.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'checked' || k === 'disabled' || k === 'readOnly' || k === 'readonly') {
      if (v) e.setAttribute(k === 'readOnly' ? 'readonly' : k, '');
      if (k in e) e[k] = !!v;
    } else if (k === 'value') {
      e.value = v;
    } else {
      e.setAttribute(k, v);
    }
  }
  const kids = Array.isArray(children) ? children : (children === undefined ? [] : [children]);
  kids.forEach(c => {
    if (c === null || c === undefined || c === false) return;
    if (typeof c === 'string' || typeof c === 'number') e.appendChild(document.createTextNode(String(c)));
    else e.appendChild(c);
  });
  return e;
}
function frag(htmlStr) {
  const t = document.createElement('template');
  t.innerHTML = htmlStr.trim();
  return t.content.firstChild;
}
function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }
function mount(el, children) {
  clear(el);
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c === null || c === undefined || c === false) return;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
}

// Since every render() rebuilds the whole screen subtree from scratch (no
// virtual-DOM diffing here), a naive rebuild on every keystroke would steal
// focus out of whatever <input>/<textarea> the user is typing into. Give
// editable fields a stable `data-key`, then wrap the render call in
// withFocusPreserved() to remember which key was focused (and its cursor
// position) and restore it once the new tree is mounted.
function withFocusPreserved(container, buildFn) {
  const active = document.activeElement;
  let key = null, selStart = null, selEnd = null;
  if (active && container.contains(active) && active.hasAttribute && active.hasAttribute('data-key')) {
    key = active.getAttribute('data-key');
    if ('selectionStart' in active) { try { selStart = active.selectionStart; selEnd = active.selectionEnd; } catch (e) {} }
  }
  buildFn();
  if (key) {
    const el = container.querySelector('[data-key="' + key.replace(/"/g, '\\"') + '"]');
    if (el) {
      el.focus();
      if (selStart !== null && 'setSelectionRange' in el) {
        try { el.setSelectionRange(selStart, selEnd); } catch (e) {}
      }
    }
  }
}

// ───────────────────────── formatting helpers ─────────────────────────
function initials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function fmtTime(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ───────────────────────── icons (copied verbatim from the source .dc.html files) ─────────────────────────
const ICONS = {
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  plusSm: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  plusLg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
  play: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
  message: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
  messageSm: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-800)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
  alertCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-700)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  check: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  checkSm: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  checkAbout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  gps: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12" y2="20"></line></svg>',
  gpsSummary: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path></svg>',
  share: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
  shareSm: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>',
  stop: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>',
  home: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"></path></svg>',
  clients: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  calendar: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  payments: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1"></path><path d="M17 12h4v4h-4z"></path></svg>',
  history: '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  logout: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
  hamburger: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
};
function icon(name, style) {
  const span = h('span', { html: ICONS[name], style: Object.assign({ display: 'inline-flex' }, style || {}) });
  return span;
}

// ───────────────────────── Android device frame (from android-frame.jsx) ─────────────────────────
const MD_C = {
  surface: '#f4fbf8',
  onSurface: '#171d1b',
  frameBorder: 'rgba(116,119,117,0.5)',
};
function buildAndroidFrame() {
  const frame = h('div', {
    style: {
      width: '412px', height: '892px', borderRadius: '18px', overflow: 'hidden',
      background: MD_C.surface, border: '8px solid ' + MD_C.frameBorder,
      boxShadow: '0 30px 80px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
    },
  });
  const statusBar = h('div', {
    style: {
      height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', position: 'relative', fontFamily: 'Roboto, system-ui, sans-serif',
    },
    html:
      '<div style="width:128px;display:flex;align-items:center;gap:8px">' +
        '<span style="font-size:14px;font-weight:400;letter-spacing:0.25px;line-height:20px;color:' + MD_C.onSurface + '">9:30</span>' +
      '</div>' +
      '<div style="position:absolute;left:50%;top:8px;transform:translateX(-50%);width:24px;height:24px;border-radius:100px;background:#2e2e2e"></div>' +
      '<div style="display:flex;align-items:center">' +
        '<div style="display:flex;padding-right:2px">' +
          '<svg width="16" height="16" viewBox="0 0 16 16" style="margin-right:-2px"><path d="M8 13.3L.67 5.97a10.37 10.37 0 0114.66 0L8 13.3z" fill="' + MD_C.onSurface + '"/></svg>' +
          '<svg width="16" height="16" viewBox="0 0 16 16" style="margin-right:-2px"><path d="M14.67 14.67V1.33L1.33 14.67h13.34z" fill="' + MD_C.onSurface + '"/></svg>' +
        '</div>' +
        '<svg width="16" height="16" viewBox="0 0 16 16"><rect x="3.75" y="2" width="8.5" height="13" rx="1.5" fill="' + MD_C.onSurface + '"/><rect x="5.5" y="0.9" width="5" height="2" rx="0.5" fill="' + MD_C.onSurface + '"/></svg>' +
      '</div>',
  });
  const screenWrap = h('div', { style: { flex: '1', overflow: 'auto' } });
  const navBar = h('div', {
    style: { height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    html: '<div style="width:108px;height:4px;border-radius:2px;background:' + MD_C.onSurface + ';opacity:.4"></div>',
  });
  frame.appendChild(statusBar);
  frame.appendChild(screenWrap);
  frame.appendChild(navBar);
  return { frame, screen: screenWrap };
}

// ───────────────────────── Chrome browser window (from browser-window.jsx) ─────────────────────────
const CHROME_C = { barBg: '#202124', tabBg: '#35363a', text: '#e8eaed', dim: '#9aa0a6', urlBg: '#282a2d' };
function buildChromeFrame(opts) {
  opts = opts || {};
  const width = opts.width || 1400, height = opts.height || 900, url = opts.url || 'example.com', title = opts.title || 'New Tab';
  const frame = h('div', {
    style: {
      width: width + 'px', height: height + 'px', borderRadius: '10px', overflow: 'hidden',
      boxShadow: '0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.1)',
      display: 'flex', flexDirection: 'column', background: CHROME_C.tabBg,
    },
  });
  const tabBar = h('div', {
    style: { display: 'flex', alignItems: 'center', height: '44px', background: CHROME_C.barBg, paddingRight: '8px' },
    html:
      '<div style="display:flex;gap:8px;padding:0 14px">' +
        '<div style="width:12px;height:12px;border-radius:50%;background:#ff5f57"></div>' +
        '<div style="width:12px;height:12px;border-radius:50%;background:#febc2e"></div>' +
        '<div style="width:12px;height:12px;border-radius:50%;background:#28c840"></div>' +
      '</div>' +
      '<div style="display:flex;align-items:flex-end;height:100%;padding-left:4px;flex:1">' +
        '<div style="position:relative;height:34px;align-self:flex-end;padding:0 12px;display:flex;align-items:center;gap:8px;background:' + CHROME_C.tabBg + ';border-radius:8px 8px 0 0;min-width:120px;max-width:220px;font-family:system-ui,sans-serif;font-size:12px;color:' + CHROME_C.text + '">' +
          '<svg width="8" height="10" viewBox="0 0 8 10" style="position:absolute;bottom:0;left:-8px"><path d="M0 10C2 9 6 8 8 0V10H0Z" fill="' + CHROME_C.tabBg + '"/></svg>' +
          '<svg width="8" height="10" viewBox="0 0 8 10" style="position:absolute;bottom:0;right:-8px;transform:scaleX(-1)"><path d="M0 10C2 9 6 8 8 0V10H0Z" fill="' + CHROME_C.tabBg + '"/></svg>' +
          '<div style="width:14px;height:14px;border-radius:50%;background:#5f6368;flex-shrink:0"></div>' +
          '<span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + title + '</span>' +
        '</div>' +
      '</div>',
  });
  const toolbar = h('div', {
    style: { height: '40px', background: CHROME_C.tabBg, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' },
    html:
      '<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center"><div style="width:16px;height:16px;border-radius:50%;background:' + CHROME_C.dim + ';opacity:.4"></div></div>' +
      '<div style="flex:1;height:30px;border-radius:15px;background:' + CHROME_C.urlBg + ';display:flex;align-items:center;gap:8px;padding:0 14px;margin:0 6px">' +
        '<div style="width:12px;height:12px;border-radius:50%;background:' + CHROME_C.dim + ';opacity:.4"></div>' +
        '<span style="flex:1;color:' + CHROME_C.text + ';font-size:13px;font-family:system-ui,sans-serif">' + url + '</span>' +
      '</div>' +
      '<div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center"><div style="width:16px;height:16px;border-radius:50%;background:' + CHROME_C.dim + ';opacity:.4"></div></div>',
  });
  const screen = h('div', { style: { flex: '1', background: '#fff', overflow: 'auto' } });
  frame.appendChild(tabBar);
  frame.appendChild(toolbar);
  frame.appendChild(screen);
  return { frame, screen };
}

// ───────────────────────── dialog helper ─────────────────────────
function dialogBackdrop(dialogEl, onClose) {
  const backdrop = h('div', {
    class: 'dialog-backdrop',
    style: { position: 'absolute' },
    onClick: onClose,
  }, [dialogEl]);
  dialogEl.addEventListener('click', e => e.stopPropagation());
  return backdrop;
}

// ───────────────────────── page-frame boot helper ─────────────────────────
// Sets up the outer centered stage + device/browser bezel and returns the
// "screen" element apps should render their content into.
function bootPhoneApp(rootId) {
  const root = document.getElementById(rootId);
  Object.assign(root.style, {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '44px', background: 'var(--color-neutral-200)', boxSizing: 'border-box', fontFamily: 'var(--font-body)',
  });
  const { frame, screen } = buildAndroidFrame();
  const screenRoot = h('div', {
    style: {
      width: '100%', height: '100%', background: 'var(--color-bg)', display: 'flex',
      flexDirection: 'column', color: 'var(--color-text)', overflow: 'hidden', position: 'relative',
    },
  });
  screen.appendChild(screenRoot);
  root.appendChild(frame);
  return screenRoot;
}
function bootBrowserApp(rootId, url) {
  const root = document.getElementById(rootId);
  Object.assign(root.style, {
    minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '40px', background: 'var(--color-neutral-200)', boxSizing: 'border-box', fontFamily: 'var(--font-body)',
  });
  const { frame, screen } = buildChromeFrame({ width: 1400, height: 900, url });
  const screenRoot = h('div', {
    style: { width: '100%', height: '100%', background: 'var(--color-bg)', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  });
  screen.appendChild(screenRoot);
  root.appendChild(frame);
  return screenRoot;
}
