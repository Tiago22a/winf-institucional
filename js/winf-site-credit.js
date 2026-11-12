/* WINF.inc® — assinatura institucional compartilhada.
   Idempotente: respeita os rodapés existentes e não altera menus/contatos. */
(function () {
  'use strict';
  const mark = 'winf-credit-by-maw';
  function addLink(text, href, title) {
    const a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    a.title = title;
    if (/^https?:\/\//.test(href)) { a.rel = 'noopener noreferrer'; a.target = '_blank'; }
    return a;
  }
  function ensureCredit() {
    const footers = document.querySelectorAll('footer');
    const footer = document.getElementById('winf-global-footer') || footers[footers.length - 1];
    const oldCredit = footer && footer.querySelector('.winf-footer-credit, .winf-site-signature');
    const host = oldCredit || document.createElement('p');
    if (host.dataset.creditNetworkVersion === '20261112') return true;
    host.dataset.creditNetworkVersion = '20261112';
    if (!oldCredit) host.className = 'winf-site-signature';
    const lead = document.createElement('span');
    lead.textContent = 'Desenvolvido por ';
    const divider = document.createElement('span');
    divider.textContent = ' · ';
    divider.setAttribute('aria-hidden', 'true');
    host.replaceChildren(
      lead,
      addLink('M.A.W.™', '/maw/', 'Conheça a M.A.W.™ — Marketing Advanced Windowfilm'),
      divider,
      addLink('NEXA BLUE™', 'https://nexablue.com.br/', 'Nexa Blue — tecnologia e desenvolvimento')
    );
    if (!oldCredit) {
      if (footer) footer.appendChild(host);
      else {
        const created = document.createElement('footer');
        created.className = 'winf-site-signature-footer';
        created.setAttribute('aria-label', 'Créditos de desenvolvimento WINF');
        created.appendChild(host);
        document.body.appendChild(created);
      }
    }
    return true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureCredit, { once: true });
  else ensureCredit();
})();