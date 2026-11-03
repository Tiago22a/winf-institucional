'use strict';
(() => {
 const layer = document.getElementById('brand-menu-layer');
 const trigger = document.querySelector('[data-brand-menu-open]');
 const header = document.getElementById('brand-header');
 if (!layer || !trigger || !header) return;
 const panel = layer.querySelector('.brand-menu-panel');
 let previousFocus;
 function setOpen(open) {
   if (open) previousFocus = document.activeElement;
   layer.hidden = !open;
   trigger.setAttribute('aria-expanded', String(open));
   document.body.classList.toggle('brand-menu-open', open);
   if (open) panel.querySelector('[data-brand-menu-close]').focus();
   else previousFocus?.focus();
 }
 trigger.addEventListener('click', () => setOpen(true));
 layer.querySelectorAll('[data-brand-menu-close]').forEach(button => button.addEventListener('click', () => setOpen(false)));
 layer.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', () => setOpen(false)));
 document.addEventListener('keydown', event => {
   if (layer.hidden) return;
   if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return; }
   if (event.key !== 'Tab') return;
   const focusable = [...panel.querySelectorAll('a[href],button,summary')].filter(el => {
     const details = el.closest('details');
     return !details || details.open || el === details.querySelector('summary');
   });
   const first = focusable[0], last = focusable[focusable.length-1];
   if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
 });
 function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
 window.addEventListener('scroll', updateHeader, {passive:true});
 updateHeader();
})();
