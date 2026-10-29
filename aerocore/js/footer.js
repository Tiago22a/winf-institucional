(() => {
 const footer = document.querySelector('.ac-footer');
 if (!footer) return;
 footer.querySelector('[data-ac-year]').textContent = new Date().getFullYear();
 footer.querySelector('.ac-footer__top').addEventListener('click', () => {
   window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
 });
})();
