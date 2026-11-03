/* Footer markup lives in /partials/winf-footer.html and is present before JS. */
(function () {
  'use strict';
  function enhance() {
    var footer = document.getElementById('winf-global-footer');
    if (!footer) return;
    footer.dataset.enhanced = 'true';
    footer.querySelectorAll('[data-current-year]').forEach(function (item) {
      item.textContent = String(new Date().getFullYear());
    });
    // Retain compatibility with a previously cached page containing this control.
    var top = footer.querySelector('.wf-footer__back-top');
    if (top) top.addEventListener('click', function () {
      window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance, {once: true});
  else enhance();
}());
