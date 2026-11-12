/* Footer markup lives in /partials/winf-footer.html and is present before JS. */
(function () {
  'use strict';
  // Atendimento institucional fixo em todas as páginas públicas que usam os utilitários WINF.
  if (!document.querySelector('script[src^="/js/winf-quick-contact.js"]')) {
    const quickContact = document.createElement('script');
    quickContact.src = '/js/winf-quick-contact.js?v=20261112-city-docks2';
    quickContact.defer = true;
    document.head.appendChild(quickContact);
  }

  function enhance() {
    var footer = document.getElementById('winf-global-footer');
    if (!footer) return;
    footer.dataset.enhanced = 'true';
    // Central única de redes e localizador de unidades ativas em toda a rede.
    var nav = footer.querySelector('.wf-ref-primary');
    if (nav && !nav.querySelector('[data-winf-social-hub]')) {
      var origin = encodeURIComponent(window.location.pathname);
      var social = document.createElement('a');
      social.href = '/redes/?origem=' + origin;
      social.textContent = 'REDES SOCIAIS WINF™';
      social.setAttribute('data-winf-social-hub', 'true');
      nav.appendChild(social);
      var locator = document.createElement('a');
      locator.href = '/aerocore/onde-comprar/';
      locator.textContent = 'LOCATOR — UNIDADES ATIVAS';
      nav.appendChild(locator);
    }
    // Rotas institucionais já existentes: corrige rodapés antigos em cache sem duplicar links.
    footer.querySelectorAll('.wf-ref-upcoming').forEach(function (placeholder) {
      var title = (placeholder.textContent || '').trim();
      var href = /UNIVERSO DARK/i.test(title) ? '/partners/universo-dark/' :
        /SYNTHWAVE/i.test(title) ? '/synthwave/' : null;
      if (!href) return;
      var link = document.createElement('a');
      link.href = href;
      link.textContent = /SYNTHWAVE/i.test(title) ? 'SYNTHWAVE.fm' : 'UNIVERSO DARK™';
      placeholder.replaceWith(link);
    });
    // GHOST SHOP™: um único acesso público à vitrine nas páginas que usam o rodapé compartilhado.
    footer.querySelectorAll('.whr-pending').forEach(function (placeholder) {
      if (!/GHOST SHOP/i.test(placeholder.textContent || '')) return;
      var link = document.createElement('a');
      link.href = '/ghost-shop/';
      link.textContent = 'GHOST SHOP™ / VITRINE DE MEMBROS ↗';
      placeholder.replaceWith(link);
    });
    var shopNav = footer.querySelector('.wf-ref-primary') || footer.querySelector('.whr-columns .whr-column:last-child');
    if (shopNav && !shopNav.querySelector('a[href="/ghost-shop/"]')) {
      var shop = document.createElement('a');
      shop.href = '/ghost-shop/';
      shop.textContent = 'GHOST SHOP™ / VITRINE ↗';
      shopNav.appendChild(shop);
    }
    footer.querySelectorAll('a[href*="instagram.com/maw.winf/"]').forEach(function (link) {
      link.href = 'https://www.instagram.com/maw.partners/';
      link.title = 'M.A.W.™ — Marketing Advanced Windowfilm';
    });
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
