'use strict';

// The floating dock is independent of the copy inside the navigation menu.
(() => {
  const dock = document.getElementById('floating-contact-dock');
  if (!dock) return;
  const panel = dock.querySelector('#floating-contact-channels');
  const trigger = dock.querySelector('[data-floating-contact-toggle]');
  const close = dock.querySelector('[data-floating-contact-close]');
  if (!panel || !trigger || !close) return;

  function setOpen(open, restoreFocus = true) {
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) close.focus();
    else if (restoreFocus) trigger.focus();
  }
  trigger.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('click', event => {
    if (!panel.hidden && !dock.contains(event.target)) setOpen(false, false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      setOpen(false);
    }
  });
  document.querySelectorAll('[data-action="open-menu"], [data-brand-menu-open], #menu-toggle').forEach(button => {
    button.addEventListener('click', () => setOpen(false, false));
  });
})();

