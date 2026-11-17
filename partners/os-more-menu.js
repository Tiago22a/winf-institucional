/* Menu expansível do cabeçalho WINF Partners™.
   Details nativo mantém funcionamento mesmo sem JS; controles só aprimoram a UX. */
(() => {
  'use strict';
  const menu = document.querySelector('.wp-header .wp-os-more');
  if (!menu) return;
  const trigger = menu.querySelector('summary');
  document.addEventListener('pointerdown', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    event.preventDefault();
    menu.open = false;
    trigger?.focus();
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.open = false;
  }));
})();
