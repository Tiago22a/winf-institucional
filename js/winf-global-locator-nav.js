'use strict';
/* Menu institucional WINF compartilhado visualmente com a homepage,
   sem importar o script.js que depende do hero da home. */
(() => {
  const menu = document.getElementById('menu-overlay');
  const trigger = document.querySelector('[data-action="open-menu"]');
  if (!menu || !trigger) return;
  let lastFocus = null;
  const focusable = () => [...menu.querySelectorAll('a[href],button:not([disabled]),summary')]
    .filter(el => !el.hidden && getComputedStyle(el).visibility !== 'hidden' && el.getClientRects().length > 0);
  function toggle(open) {
    if (open) lastFocus = document.activeElement;
    menu.classList.toggle('hidden', !open);
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    trigger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (open) menu.querySelector('[data-action="close-menu"]')?.focus();
    else if (lastFocus?.isConnected) lastFocus.focus();
  }
  trigger.addEventListener('click', () => toggle(true));
  menu.querySelectorAll('[data-action="close-menu"],[data-action="menu-link"]').forEach(el => {
    el.addEventListener('click', () => toggle(false));
  });
  document.addEventListener('keydown', e => {
    if (menu.classList.contains('hidden')) return;
    if (e.key === 'Escape') { e.preventDefault(); toggle(false); return; }
    if (e.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0], last = items[items.length-1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
