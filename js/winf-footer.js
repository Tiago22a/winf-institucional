/* Footer markup lives in /partials/winf-footer.html and is present before JS. */
(function () {
  'use strict';
  // Atendimento institucional fixo em todas as páginas públicas que usam os utilitários WINF.
  if (!document.querySelector('script[src^="/js/winf-quick-contact.js"]')) {
    const quickContact = document.createElement('script');
    quickContact.src = '/js/winf-quick-contact.js?v=20261127-top-ghost-1';
    quickContact.defer = true;
    document.head.appendChild(quickContact);
  }

  // Defesa de compatibilidade para páginas que ainda carreguem o menu GHOST+ antigo em cache.
  // Remove SOMENTE o atalho ao login restrito; mantém GHOST+, WhatsApp e todas as marcas.
  function removePrivateOSShortcut() {
    document.querySelectorAll('#winf-quick-contact .wqc-options a').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var name = (link.textContent || '').trim();
      if ((href.indexOf('painel-os.') !== -1 && href.indexOf('/login') !== -1) || /WINF OS.*ENTRAR NO APLICATIVO/i.test(name)) link.remove();
    });
  }
  function watchGhostMenu() {
    // Páginas de produtos e territórios têm widgets próprios, sem o menu GHOST+ compartilhado.
    var currentPath = window.location.pathname.toLowerCase();
    if (/^\/(?:pelicula-de-controle-solar-[a-z0-9-]+|insulfilm-residencial-[a-z0-9-]+|blackpro|dual-reflect|invisible|securityblind|miniblind-venetian)(?:\/|$)/.test(currentPath)) return;
    if (/^\/partners\/carro-midia(?:\/|$)/.test(currentPath)) return;
    if (document.querySelector('#ws-product-contact, #winf-global-dock, [data-winf-territory-dock], .winf-city-dock')) return;
    var dock = document.getElementById('winf-quick-contact');
    if (dock) {
      if (dock.dataset.privateLinkGuard === 'true') return;
      dock.dataset.privateLinkGuard = 'true';
      removePrivateOSShortcut();
      new MutationObserver(removePrivateOSShortcut).observe(dock, {childList:true,subtree:true});
      return;
    }
    // O GHOST+ é inserido depois do carregamento do rodapé em algumas páginas.
    var observer = new MutationObserver(function () {
      if (document.getElementById('winf-quick-contact')) { observer.disconnect(); watchGhostMenu(); }
    });
    observer.observe(document.documentElement, {childList:true,subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchGhostMenu, {once:true});
  else watchGhostMenu();

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
    // A vitrine GHOST SHOP™ pertence às jornadas de expansão/licenciamento,
    // não à navegação comercial destinada ao consumidor final.
    var currentPath = window.location.pathname.toLowerCase();
    var isExpansionPage = /^\/(?:partners|briefing)(?:\/|$)/.test(currentPath) ||
      /^\/aerocore\/licenciamento(?:\/|$)/.test(currentPath);
    var isGhostShopPage = /^\/ghost-shop(?:\/|$)/.test(currentPath);
    if (isExpansionPage) {
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
    } else if (!isGhostShopPage) {
      // Compatibilidade com HTML antigo em cache: elimina somente referências
      // ao shop sem alterar navegação de produtos, atendimento ou licenciamento.
      footer.querySelectorAll('a[href="/ghost-shop/"], a[href="/ghost-shop"]').forEach(function (link) { link.remove(); });
      footer.querySelectorAll('.whr-pending').forEach(function (placeholder) {
        if (/GHOST SHOP/i.test(placeholder.textContent || '')) placeholder.remove();
      });
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
