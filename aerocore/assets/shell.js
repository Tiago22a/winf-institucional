'use strict';

// Shared static header, menu and contact dock for every AeroCore page.
(() => {
const menu = document.getElementById('menu-overlay');
const menuTrigger = document.querySelector('[data-action="open-menu"]');
const header = document.getElementById('aerocore-header');
const channels = document.getElementById('contact-channels');
const channelsTrigger = document.querySelector('[data-toggle-channels]');
let previousFocus;
function toggleMenu(open) {
  if (open) previousFocus = document.activeElement;
  if (!open && !channels.hidden) {
    channels.hidden = true;
    channelsTrigger.setAttribute('aria-expanded', 'false');
  }
  menu.hidden = !open;
  menu.setAttribute('aria-hidden', String(!open));
  menuTrigger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  if (open) menu.querySelector('button, a').focus();
  else previousFocus?.focus();
}
menuTrigger.addEventListener('click', () => toggleMenu(true));
menu.querySelectorAll('[data-close-menu], [data-action="close-menu"]').forEach(button => button.addEventListener('click', () => toggleMenu(false)));
menu.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', () => toggleMenu(false)));
function toggleChannels(open) {
  channels.hidden = !open;
  channelsTrigger.setAttribute('aria-expanded', String(open));
  if (open) channels.querySelector('button, a').focus();
  else channelsTrigger.focus();
}
channelsTrigger.addEventListener('click', () => toggleChannels(channels.hidden));
channels.querySelector('[data-close-channels]').addEventListener('click', () => toggleChannels(false));
document.addEventListener('click', event => {
  if (!channels.hidden && !event.target.closest('aside')) toggleChannels(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!menu.hidden) toggleMenu(false);
    if (!channels.hidden) toggleChannels(false);
  }
  if (event.key !== 'Tab') return;
  const panel = !channels.hidden ? channels : !menu.hidden ? menu : null;
  if (!panel) return;
  const focusable = [...panel.querySelectorAll('a[href], button')].filter(el => !el.hidden);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
let previousY = window.scrollY;
let scheduled = false;
window.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    const currentY = window.scrollY;
    header.classList.toggle('is-scrolled', currentY > 40);
    header.classList.toggle('is-hidden', currentY > previousY && currentY > 80 && menu.hidden && !header.contains(document.activeElement));
    previousY = currentY;
    scheduled = false;
  });
}, { passive: true });
})();

