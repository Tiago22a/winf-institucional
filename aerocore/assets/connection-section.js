(() => {
  'use strict';
  const links = document.querySelectorAll('[data-connection-return]');
  if (!links.length) return;
  let previous;
  try {
    const referrer = new URL(document.referrer);
    const trusted = ['winf.com.br', 'www.winf.com.br'];
    if (['http:', 'https:'].includes(referrer.protocol) && trusted.includes(referrer.hostname.toLowerCase()) && referrer.pathname.replace(/\/+$/, '') !== location.pathname.replace(/\/+$/, '')) previous = referrer;
  } catch (_) { /* Direct visits use the AeroCore home destination. */ }
  if (!previous) return;
  links.forEach(link => {
    link.href = previous.href;
    link.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || history.length < 2) return;
      event.preventDefault();
      history.back();
    });
  });
})();
