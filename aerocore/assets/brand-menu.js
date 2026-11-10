'use strict';
(() => {
 const layer = document.getElementById('brand-menu-layer');
 const trigger = document.querySelector('[data-brand-menu-open]');
 const header = document.getElementById('brand-header');
 if (!layer || !trigger || !header) return;
 const panel = layer.querySelector('.brand-menu-panel');
 // Link comum para AeroCore™, NeoSkin™ e Ceramic Armoring™, sem duplicar menus.
 const sections = panel.querySelectorAll('.brand-menu-section');
 const collectionNav = sections.length > 1 ? sections[1] : sections[0];
 if (collectionNav && !panel.querySelector('a[href="/ghost-shop/"]')) {
   const link = document.createElement('a');
   link.href = '/ghost-shop/';
   link.className = 'brand-menu-line';
   const label = document.createElement('span');
   label.textContent = 'GHOST SHOP™ — Boutique';
   const arrow = document.createElement('span');
   arrow.textContent = '↗';
   arrow.setAttribute('aria-hidden', 'true');
   link.append(label, arrow);
   collectionNav.appendChild(link);
 }

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
