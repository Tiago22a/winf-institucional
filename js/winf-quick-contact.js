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
  if (/^\/(pelicula-de-controle-solar-santos-sp|insulfilm-residencial-sorocaba-sp)(?:\/|$)/.test(path)) return;
  // Não criar widgets comerciais em aplicativos internos, checkout ou painel de gestão.
  if (/^\/(admin|adm|app|apps|os|sistema|checkout|painel)(?:\/|$)/.test(path)) return;
  const forPartners = /^\/(partners|briefing)(?:\/|$)/.test(path);
  const pageName = forPartners ? 'WINF Partners™' : /^\/aerocore/.test(path) ? 'AeroCore™ e WINF' : 'WINF™';
  const salesPhone = '5513981113001', partnerPhone = '5513997815375';
  const chosenPhone = forPartners ? partnerPhone : salesPhone;
  const whatsapp = (phone, message) => 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  const directMessage = forPartners
    ? 'Olá! Estou na página WINF Partners e gostaria de consultar as oportunidades de licenciamento na minha cidade.'
    : 'Olá! Estou no site WINF e gostaria de conhecer os produtos e serviços.';
  const commonBrandLinks = [
    ['WINF — Premium Quality Window Film','/'],
    ['WINF Select™ — Arquitetura','/aerocore/winf-select/'],
    ['AeroCore™ — Películas','/aerocore/aerocore/'],
    ['NeoSkin™ — PPF','/aerocore/neoskin/'],
    ['Ceramic Armoring™','/aerocore/ceramic-armoring/'],
    ['WINF Partners™ — Expansão','/partners/'],
    ['Redes sociais oficiais — Todas as marcas','/redes/?origem=' + encodeURIComponent(location.pathname)],
    ['Locator — Unidades ativas','/aerocore/onde-comprar/']
  ];
  const partnerHelp = [
    ['Como funciona o Asset Light™?','/partners/#asset-light'],
    ['Quais são os formatos de licenciamento?','/partners/#modalidades'],
    ['Como é a seleção territorial?','/partners/#jornada'],
    ['Conhecer todos os Instagrams da WINF','/redes/?origem=' + encodeURIComponent(location.pathname)],
    ['Ver unidades ativas no Locator','/aerocore/onde-comprar/'],
    ['Quero falar com a expansão', whatsapp(partnerPhone,'Olá! Quero entender os modelos WINF Partners e consultar meu território.')]
  ];
  const generalHelp = [
    ['Onde comprar ou solicitar aplicação?','/aerocore/onde-comprar/'],
    ['Conhecer as redes sociais da WINF','/redes/?origem=' + encodeURIComponent(location.pathname)],
    ['Películas arquitetônicas WINF Select™','/aerocore/winf-select/'],
    ['Proteção automotiva AeroCore™','/aerocore/aerocore/'],
    ['Quero falar com um consultor', whatsapp(salesPhone,'Olá! Preciso de orientação para escolher uma solução WINF.')]
  ];

  function addStyle() {
    if (document.querySelector('link[href^="/css/winf-quick-contact.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/winf-quick-contact.css?v=20261110-single-dock';
    document.head.appendChild(link);
  }
  function addLink(label,href) {
    const a = document.createElement('a');
    a.textContent = label;
    a.href = href;
    if (href.startsWith('https://')) {a.target = '_blank';a.rel='noopener noreferrer';}
    const arr = document.createElement('span'); arr.textContent = '↗';arr.setAttribute('aria-hidden','true');
    a.appendChild(arr);
    return a;
  }
  const whatsappSymbol = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.7L3 21l1.5-4.9A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M8.2 7.4c.3-.3.7-.2.8.1l1 2c.1.3 0 .5-.5 1 .7 1.5 1.7 2.5 3.2 3.2.5-.5.7-.9 1-.8l2 .9c.4.2.4.5.2.9-.4.9-1.1 1.3-2 1.1-3.7-.8-6.6-3.7-7.1-6.5-.1-.8.5-1.6 1.4-1.9Z"/></svg>';
  const helpSymbol = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-8.5 8c-1.4 0-2.6-.3-3.8-.9L3 20l1.4-4.5A8 8 0 1 1 20 11.5Z"/><path d="M9 9.3a3 3 0 0 1 6 0c0 2-3 2.4-3 4.2"/><path d="M12 16h.01"/></svg>';

  function init() {
    if (document.getElementById('winf-quick-contact') || !document.body) return;
    // Eliminar o dock legado quando HTML previamente em cache ainda estiver disponível.
    document.getElementById('winf-global-dock')?.remove();
    addStyle();
    const dock = document.createElement('aside');
    dock.id='winf-quick-contact';
    dock.setAttribute('aria-label','Acesso rápido WINF — canais e ajuda');
    dock.innerHTML = '<div class="wqc-panel" id="wqc-panel" role="region" aria-label="Canais de atendimento WINF" hidden><div class="wqc-panel-head"><div><strong id="wqc-panel-title">WINF™ — Canais</strong><p id="wqc-panel-desc">Escolha um caminho.</p></div><button class="wqc-close" type="button" data-wqc-close aria-label="Fechar ajuda">×</button></div><div class="wqc-options" id="wqc-options"></div><p class="wqc-note" id="wqc-note"></p></div>'
      + '<div class="wqc-launchers">'
      + '<div class="wqc-item"><button type="button" data-wqc="brands" class="wqc-circle" aria-controls="wqc-panel" aria-expanded="false" aria-label="Abrir universo WINF" title="Universo WINF"><img src="/aerocore/assets/ghost-symbol.png" width="31" height="40" alt=""></button><span class="wqc-label">WINF</span></div>'
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
    const panel=dock.querySelector('#wqc-panel'),options=dock.querySelector('#wqc-options');
    const title=dock.querySelector('#wqc-panel-title'),description=dock.querySelector('#wqc-panel-desc'),note=dock.querySelector('#wqc-note');
    const triggers=[...dock.querySelectorAll('button[data-wqc]')];
    let active = null;
    function setPanel(type,restoreFocus=true) {
      active=type;
      panel.hidden=!type;
      triggers.forEach(btn=>btn.setAttribute('aria-expanded',String(btn.dataset.wqc===type)));
      if (!type) {
        if (restoreFocus) dock.querySelector('button[data-wqc="brands"]')?.focus();
        return;
      }
      const isBrands=type==='brands';
      title.textContent=isBrands?'UNIVERSO WINF™':(forPartners?'GUIA WINF PARTNERS™':'GUIA RÁPIDO WINF™');
      description.textContent=isBrands?'PREMIUM QUALITY WINDOW FILM':'Escolha uma dúvida ou fale com uma pessoa.';
      note.textContent=isBrands?'Você está navegando pelas marcas do ecossistema WINF.':
        'Orientações rápidas disponíveis nesta versão. O Hermes será integrado futuramente; para atendimento personalizado, utilize o WhatsApp.';
      options.replaceChildren();
      const records=isBrands?commonBrandLinks:(forPartners?partnerHelp:generalHelp);
      records.forEach(([label,url])=>options.append(addLink(label,url)));
      dock.querySelector('[data-wqc-close]').focus();
    }
    triggers.forEach(btn=>btn.addEventListener('click',()=>setPanel(active===btn.dataset.wqc?null:btn.dataset.wqc)));
    dock.querySelector('[data-wqc-close]').addEventListener('click',()=>setPanel(null));
    document.addEventListener('click',event=>{if(active && !dock.contains(event.target))setPanel(null,false);});
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'&&active){event.preventDefault();setPanel(null);}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
