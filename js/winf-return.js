/* Shared return navigation: internal origin when available, section home otherwise. */
(() => {
  'use strict';
  const link = document.querySelector('[data-winf-return]');
  if (!link) return;
  const trustedHosts = new Set(['winf.com.br', 'www.winf.com.br']);
  const normalize = path => path.replace(/\/+$/, '') || '/';
  let previous;
  try {
    const referrer = new URL(document.referrer);
    if (['https:', 'http:'].includes(referrer.protocol) &&
        trustedHosts.has(referrer.hostname.toLowerCase()) &&
        normalize(referrer.pathname) !== normalize(location.pathname)) previous = referrer;
  } catch (_) { /* A direct visit keeps the section-home link in the HTML. */ }

  if (!previous) return;
  link.hidden = false;
  link.href = previous.href;
  link.setAttribute('aria-label', 'Voltar à página anterior');
  link.title = 'Voltar à página anterior';
  link.addEventListener('click', event => {
    // Modified clicks and new tabs retain the real, accessible destination URL.
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || history.length < 2) return;
    event.preventDefault();
    history.back();
  });
})();
