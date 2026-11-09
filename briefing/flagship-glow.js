/* Luz acompanhando o cursor nos três cards informativos do Flagship. */
(() => {
  'use strict';
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('#flagship-detail .al-grid--flagship-glow > .al-card')
    .forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--flagship-glow-x', `${event.clientX - box.left}px`);
        card.style.setProperty('--flagship-glow-y', `${event.clientY - box.top}px`);
      }, { passive: true });
      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--flagship-glow-x');
        card.style.removeProperty('--flagship-glow-y');
      }, { passive: true });
    });
})();
