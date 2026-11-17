/* WINF™ / Acesso permanente a atendimento, sem depender do Hermes.
 * Usa recursos locais e links oficiais. Não simula IA nem armazena mensagens.
 */
(() => {
  'use strict';
  if (window.__winfQuickContactV1) return;
  window.__winfQuickContactV1 = true;
  const path = location.pathname.toLowerCase().replace(/\/+/g, '/');
  // Páginas territoriais possuem seu próprio widget local (fantasminha + WhatsApp).
  // Evita duplicar ou sobrepor CTAs e mantém o cliente no atendimento da cidade.
  // Qualquer página WINF Select territorial possui dock nativo (Ghost + WhatsApp).
  // A central usa WhatsApp por região; jamais criar outro conjunto com número global.
  // Guarda por padrão de URL, cobrindo também futuras cidades sem nova alteração.
  if (/^\/(?:pelicula-de-controle-solar-[a-z0-9-]+|insulfilm-residencial-[a-z0-9-]+)(?:\/|$)/.test(path)) return;
  // Páginas de produtos WINF Select já carregam o dock contextual próprio.
  // O script do rodapé também carrega este utilitário; sem esta guarda,
  // dois conjuntos (Ghost/WhatsApp/Ajuda) ficam sobrepostos no mobile.
  if (/^\/(?:blackpro|dual-reflect|invisible|securityblind|miniblind-venetian)(?:\/|$)/.test(path)) return;
  // Respeitar outros docks contextuais já existentes na página.
  if (document.getElementById('ws-product-contact')) return;
  // Não criar widgets comerciais em aplicativos internos, checkout ou painel de gestão.
  if (/^\/(admin|adm|app|apps|os|sistema|checkout|painel)(?:\/|$)/.test(path)) return;
  // MediaCar is a working visual editor: floating contact buttons obscure vehicle cards and controls on mobile.
  // Contact remains available through the institutional footer.
  if (/^\/partners\/carro-midia(?:\/|$)/.test(path)) return;
  const forPartners = /^\/(partners|briefing)(?:\/|$)/.test(path);
  const pageName = forPartners ? 'WINF Partners™' : /^\/aerocore/.test(path) ? 'AeroCore™ e WINF' : 'WINF™';
  const salesPhone = '5513981113001', partnerPhone = '5513997815375';
  const chosenPhone = forPartners ? partnerPhone : salesPhone;
  const whatsapp = (phone, message) => 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  const directMessage = forPartners
    ? 'Olá! Estou na página WINF Partners e gostaria de consultar as oportunidades de licenciamento na minha cidade.'
    : 'Olá! Estou no site WINF e gostaria de conhecer os produtos e serviços.';
  function addStyle() {
    if (document.querySelector('link[href^="/css/winf-quick-contact.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/winf-quick-contact.css?v=20261110-single-dock';
    document.head.appendChild(link);
  }
  const whatsappSymbol = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.7L3 21l1.5-4.9A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M8.2 7.4c.3-.3.7-.2.8.1l1 2c.1.3 0 .5-.5 1 .7 1.5 1.7 2.5 3.2 3.2.5-.5.7-.9 1-.8l2 .9c.4.2.4.5.2.9-.4.9-1.1 1.3-2 1.1-3.7-.8-6.6-3.7-7.1-6.5-.1-.8.5-1.6 1.4-1.9Z"/></svg>';
  function init() {
    if (document.getElementById('winf-quick-contact') || !document.body) return;
    // Um único dock por página: respeitar widgets territoriais e de produto.
    // Esses widgets podem estar no HTML inicial ou ter sido montados por outro script.
    const nativeDock = document.querySelector('#ws-product-contact, #winf-global-dock, [data-winf-territory-dock], .winf-city-dock');
    if (nativeDock) return;
    // Eliminar o dock legado quando HTML previamente em cache ainda estiver disponível.
    document.getElementById('winf-global-dock')?.remove();
    addStyle();
    const dock = document.createElement('aside');
    dock.id='winf-quick-contact';
    dock.setAttribute('aria-label','Acesso rápido WINF — canais e ajuda');
    // Acesso flutuante único: somente WhatsApp. O menu WINF fica no cabeçalho.
    dock.innerHTML = '<div class="wqc-launchers">'
      + '<div class="wqc-item"><a class="wqc-circle wqc-whatsapp" href="' + whatsapp(chosenPhone,directMessage) + '" target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp: ' + pageName + '" title="Falar no WhatsApp">' + whatsappSymbol + '</a><span class="wqc-label">WHATSAPP</span></div>'
      + '</div>';
    document.body.appendChild(dock);
    document.documentElement.classList.add('winf-quick-dock-active');
    // O aviso de cookies nunca deve ficar atrás dos atalhos.
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
      const updateCookieOffset = () => {
        const cs = getComputedStyle(cookieBanner);
        const rect = cookieBanner.getBoundingClientRect();
        const visible = !cookieBanner.hidden && cs.display !== 'none' && cs.visibility !== 'hidden' && rect.height > 0;
        dock.style.setProperty('--winf-qc-cookie-offset', visible ? Math.ceil(rect.height + 10) + 'px' : '0px');
      };
      updateCookieOffset();
      new MutationObserver(updateCookieOffset).observe(cookieBanner,{attributes:true,attributeFilter:['class','style','hidden','aria-hidden']});
      if ('ResizeObserver' in window) new ResizeObserver(updateCookieOffset).observe(cookieBanner);
      window.addEventListener('resize',updateCookieOffset,{passive:true});
    }

  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
