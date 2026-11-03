'use strict';
(() => {
  const link = document.querySelector('[data-partners-return]');
  if (!link) return;
  let previous;
  try {
    const referrer = new URL(document.referrer);
    const current = new URL(location.href);
    const trusted = ['winf.com.br', 'www.winf.com.br'];
    if (['https:', 'http:'].includes(referrer.protocol) && trusted.includes(referrer.hostname) && referrer.pathname.replace(/\/$/, '') !== current.pathname.replace(/\/$/, '')) previous = referrer;
  } catch (_) { /* Direct visits keep the AeroCore fallback. */ }
  if (!previous) return;
  link.href = previous.href;
  link.setAttribute('aria-label', 'Voltar à página anterior');
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || history.length < 2) return;
    event.preventDefault();
    history.back();
  });
})();
