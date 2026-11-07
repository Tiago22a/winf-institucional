(() => {
  'use strict';
  const menu = document.getElementById('menu-overlay');
  const trigger = document.querySelector('[data-action="open-menu"]');
  const closeButton = menu?.querySelector('[data-action="close-menu"]');
  let previousFocus = null;

  const setMenu = (open) => {
    if (!menu || !trigger) return;
    if (open) previousFocus = document.activeElement;
    menu.hidden = !open;
    menu.setAttribute('aria-hidden', String(!open));
    trigger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('wp-menu-open', open);
    if (open) closeButton?.focus();
    else (previousFocus?.isConnected ? previousFocus : trigger)?.focus();
  };

  trigger?.addEventListener('click', () => setMenu(true));
  closeButton?.addEventListener('click', () => setMenu(false));
  menu?.addEventListener('click', e => {
    if (e.target === menu || e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (menu?.hidden) return;
    if (e.key === 'Escape') setMenu(false);
    if (e.key === 'Tab') {
      const focusable = [...menu.querySelectorAll('a[href],button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.querySelectorAll('[data-current-year]').forEach(el => {el.textContent = new Date().getFullYear();});
})();
