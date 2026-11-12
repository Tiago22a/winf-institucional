/* Shared return navigation: internal origin when available, section home otherwise. */
(() => {
  'use strict';
  // Atendimento institucional fixo em todas as páginas públicas que usam os utilitários WINF.
  if (!document.querySelector('script[src^="/js/winf-quick-contact.js"]')) {
    const quickContact = document.createElement('script');
    quickContact.src = '/js/winf-quick-contact.js?v=20261112-city-docks2';
    quickContact.defer = true;
    document.head.appendChild(quickContact);
  }

  // Keep a separate scroll position for each history entry, with a URL fallback.
  const positionKey = 'winf-scroll-positions-v1';
  const pendingKey = 'winf-return-position-v1';
  const read = key => { try { return JSON.parse(sessionStorage.getItem(key)); } catch (_) { return null; } };
  const write = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const pageURL = location.href;
  let entryKey = '';
  try {
    const state = history.state;
    if (state === null || (typeof state === 'object' && !Array.isArray(state))) {
      entryKey = state?.__winfScrollEntry || String(Date.now()) + Math.random().toString(36).slice(2);
      history.replaceState({ ...state, __winfScrollEntry: entryKey }, '');
    }
    history.scrollRestoration = 'auto';
  } catch (_) {}
  const savePosition = () => {
    const positions = read(positionKey) || {};
    const lockedTop = document.body.style.position === 'fixed' ? parseFloat(document.body.style.top) : NaN;
    const position = { x: scrollX, y: Number.isFinite(lockedTop) && lockedTop < 0 ? -lockedTop : scrollY, at: Date.now() };
    positions['url:' + pageURL] = position;
    if (entryKey) positions['entry:' + entryKey] = position;
    const keys = Object.keys(positions).sort((a, b) => positions[b].at - positions[a].at);
    keys.slice(120).forEach(key => delete positions[key]);
    write(positionKey, positions);
  };
  addEventListener('pagehide', savePosition);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') savePosition(); });
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    let destination;
    try { destination = new URL(anchor.href); } catch (_) { return; }
    if (!['winf.com.br', 'www.winf.com.br'].includes(destination.hostname)) return;
    savePosition();
    if (anchor.matches('[data-winf-return],[data-connection-return]')) write(pendingKey, { url: destination.href, at: Date.now() });
  }, true);
  let cancelRestore = false;
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(type => addEventListener(type, () => { cancelRestore = true; }, { passive: true }));
  const restorePosition = event => {
    const pending = read(pendingKey);
    const requested = pending?.url === pageURL && Date.now() - pending.at < 60000;
    const fromHistory = event.persisted || performance.getEntriesByType?.('navigation')[0]?.type === 'back_forward';
    if (!requested && !fromHistory) return;
    if (requested) { try { sessionStorage.removeItem(pendingKey); } catch (_) {} }
    const positions = read(positionKey) || {};
    const position = positions['entry:' + entryKey] || positions['url:' + pageURL];
    if (!position || !Number.isFinite(position.y) || !Number.isFinite(position.x)) return;
    cancelRestore = false;
    const started = Date.now();
    const apply = () => {
      if (cancelRestore) return;
      const root = document.documentElement;
      const behavior = root.style.getPropertyValue('scroll-behavior');
      const priority = root.style.getPropertyPriority('scroll-behavior');
      root.style.setProperty('scroll-behavior', 'auto', 'important');
      scrollTo(position.x, position.y);
      if (behavior) root.style.setProperty('scroll-behavior', behavior, priority);
      else root.style.removeProperty('scroll-behavior');
      if (root.scrollHeight - innerHeight < position.y && Date.now() - started < 1500) setTimeout(apply, 150);
    };
    requestAnimationFrame(apply);
    document.fonts?.ready.then(() => { if (Date.now() - started < 1500) apply(); });
  };
  addEventListener('pageshow', restorePosition);

  const link = document.querySelector('[data-winf-return]');
  if (!link) return;
  const trustedHosts = new Set(['winf.com.br', 'www.winf.com.br']);
  const normalize = path => path.replace(/\/+$/, '') || '/';
  let previous;
  try {
    const referrer = new URL(document.referrer);
    if (['https:', 'http:'].includes(referrer.protocol) &&
        trustedHosts.has(referrer.hostname.toLowerCase()) &&
        normalize(referrer.pathname) !== normalize(location.pathname)) previous = referrer;
  } catch (_) { /* A direct visit keeps the section-home link in the HTML. */ }

  // Place return, wordmark and menu on the same header row in the AeroCore family.
  const header = document.querySelector('#brand-header, #aerocore-header, #navbar');
  let row = null;
  if (header && !header.querySelector('.select-header-logo')) {
    row = header.id === 'brand-header' ? header : header.firstElementChild;
  } else if (/^\/(neoskin|ceramic)\//.test(location.pathname)) {
    row = document.querySelector('header');
  }
  if (row && !row.contains(link)) {
    const menu = row.querySelector('[data-brand-menu-open], [data-action="open-menu"], #menu-toggle');
    const logo = row.firstElementChild;
    if (menu && logo && logo !== menu) {
      row.classList.add('winf-return-row');
      logo.classList.add('winf-return-logo');
      menu.classList.add('winf-return-menu');
      link.classList.add('winf-return-inline');
      row.prepend(link);
    }
  }

  if (!previous) return;
  link.hidden = false;
  link.href = previous.href;
  link.setAttribute('aria-label', 'Voltar à página anterior');
  link.title = 'Voltar à página anterior';
  link.addEventListener('click', event => {
    // Modified clicks and new tabs retain the real, accessible destination URL.
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || history.length < 2) return;
    event.preventDefault();
    history.back();
  });
})();
