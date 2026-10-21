/* Accessible disclosure navigation shared by all static pages. */
(() => {
  'use strict';
  const header = document.getElementById('winf-site-header');
  if (!header) return;
  const toggle = header.querySelector('.wh-toggle');
  const menu = document.getElementById('winf-site-menu');
  const normalize = path => path.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  header.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.getAttribute('href'), location.href);
    if (url.origin === location.origin && !url.hash && normalize(url.pathname) === normalize(location.pathname)) link.setAttribute('aria-current', 'page');
  });
  // Paint the fallback footer's year even if a page has no other scripts.
  document.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  let outside = [];
  function setOpen(open, restore = true) {
    if (open === !menu.hidden) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    menu.hidden = !open;
    document.body.classList.toggle('wh-menu-open', open);
    if (open) {
      // Keep keyboard and assistive navigation inside the open command bar.
      outside = [...document.body.children].filter(el => el !== header && !['SCRIPT','STYLE','LINK'].includes(el.tagName)).map(el => [el, el.inert]);
      outside.forEach(([el]) => { el.inert = true; });
      menu.querySelector('a')?.focus();
    } else {
      outside.forEach(([el, inert]) => { el.inert = inert; });
      outside = [];
      if (restore) toggle.focus();
    }
  }
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('pointerdown', event => {
    if (!menu.hidden && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key !== 'Tab') return;
    const items = [...header.querySelectorAll('a, button')].filter(el => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  addEventListener('pagehide', () => setOpen(false, false));
})();
