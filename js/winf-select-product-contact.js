/* Product-aware WINF Select contact. No tracking or external SDK is required. */
(() => {
  'use strict';
  const route = location.pathname.toLowerCase().replace(/\/+$/, '') + '/';
  const options = {
    '/blackpro/': {name:'BlackPro™',subject:'privacidade e controle solar'},
    '/dual-reflect/': {name:'Dual Reflect™',subject:'controle solar refletivo'},
    '/invisible/': {name:'Invisible™',subject:'transparência e proteção térmica'},
    '/securityblind/': {name:'SecurityBlinder™',subject:'película de segurança'},
    '/miniblind-venetian/': {name:'MiniBlind & Venetian™',subject:'películas de privacidade decorativa'}
  };
  const current = options[route];
  // O atendimento específico do produto tem prioridade sobre o dock global.
  // Evita sobreposição independentemente da ordem de carregamento dos scripts.
  if (current) {
    document.getElementById('winf-quick-contact')?.remove();
    document.documentElement.classList.remove('winf-quick-dock-active');
  }
  if (!current || document.getElementById('ws-product-contact')) return;
  const origin = new URLSearchParams(location.search).get('origem');
  const isSantos = origin === 'santos';
  // Preserve the territorial sales journey when product details are opened from Santos.
  if (isSantos) {
    const home = document.querySelector('.ws-product-header .winf-home-brand');
    if (home) { home.href='/pelicula-de-controle-solar-santos-sp/'; home.setAttribute('aria-label','Voltar ao site WINF Santos'); }
    document.querySelectorAll('#menu-overlay .ws-menu-products a[href]').forEach(link=>{
      if (/^\/(invisible|dual-reflect|blackpro|securityblind|miniblind-venetian)\/$/.test(link.pathname)) link.href=link.pathname+'?origem=santos';
    });
    document.querySelectorAll('#menu-overlay a[href="/catalogo/"]').forEach(link=>{link.href='/catalogo/?origem=santos&partner=5513981113001';});
  }
  const productHref = 'https://winf.com.br' + route;
  const cityLabel = isSantos ? 'WINF Select Santos' : 'WINF Select Glass + Home™';
  const message = isSantos
    ? `Olá! Vim pelo site WINF Santos e estou conhecendo ${current.name} (${productHref}). Gostaria de um orçamento com atendimento em Santos/SP. Meu bairro e minhas medidas aproximadas são: `
    : `Olá! Estou conhecendo a linha ${current.name} na WINF Select Glass + Home™ (${productHref}) e gostaria de orientação e orçamento para meu ambiente.`;
  const whatsapp = 'https://wa.me/5513981113001?text=' + encodeURIComponent(message);
  const instagram = 'https://www.instagram.com/winf.ofc/';
  const dock = document.createElement('aside');
  dock.id = 'ws-product-contact';
  dock.className = 'ws-dock';
  dock.setAttribute('aria-label', (isSantos ? 'Atendimento WINF Santos — ' : 'Atendimento WINF Select — ') + current.name);
  dock.innerHTML = `
    <div class="ws-dock-panel" id="ws-dock-options" hidden>
      <button class="ws-dock-close" type="button" aria-label="Fechar opções de atendimento">×</button>
      <h2>${cityLabel}<br>${current.name}</h2>
      <p>${isSantos ? 'Você veio do site de Santos. O atendimento e o orçamento continuam direcionados à unidade da cidade.' : 'Você está explorando ' + current.subject + '. Fale diretamente com a central ou conheça as outras linhas de películas arquitetônicas.'}</p>
      <a href="${whatsapp}" target="_blank" rel="noopener noreferrer">Falar sobre ${current.name} <span aria-hidden="true">↗</span></a>
      <a href="${isSantos ? '/pelicula-de-controle-solar-santos-sp/#solucoes' : '/aerocore/winf-select/#arsenal'}">${isSantos ? 'Voltar ao site Santos' : 'Conhecer todas as linhas'} <span aria-hidden="true">↗</span></a>
      <a href="${instagram}" target="_blank" rel="noopener noreferrer">WINF™ no Instagram <span aria-hidden="true">↗</span></a>
    </div>
    <button class="ws-dock-ghost ws-dock-item" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="ws-dock-options" aria-label="Abrir orientações ${isSantos ? 'WINF Santos' : 'WINF Select'} ${current.name}">
      <span class="ws-dock-circle"><img src="/aerocore/assets/ghost-symbol.png" alt="" width="32" height="42"></span>
      <span>${isSantos ? 'WINF SANTOS' : 'WINF SELECT'}</span>
    </button>
    <a class="ws-dock-whatsapp ws-dock-item" href="${whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${isSantos ? 'da unidade Santos' : 'WINF Select'} sobre ${current.name}">
      <span class="ws-dock-circle"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3a13 13 0 0 0-11 20L3 29l6.2-2.1A13 13 0 1 0 16 3Z"/><path d="M11 10.2c-.6-.2-1 .7-1.1 1.2-.3 3.5 5.9 9.6 9.5 9.8.6 0 1.6-.6 1.5-1.3-.1-.5-3.1-1.7-3.5-1.5l-1.1 1.1c-1.7-.8-3.4-2.4-4.2-4.2l1.1-1.1c.2-.5-1.1-3.6-1.6-4Z"/></svg></span>
      <span>WHATSAPP</span>
    </a>`;
  document.body.append(dock);
  const toggle=dock.querySelector('.ws-dock-ghost');
  const panel=dock.querySelector('.ws-dock-panel');
  const close=dock.querySelector('.ws-dock-close');
  const setOpen=(state,focus=false)=>{panel.hidden=!state;toggle.setAttribute('aria-expanded',String(state));if(focus)(state?close:toggle).focus()};
  toggle.addEventListener('click',()=>setOpen(panel.hidden,true));
  close.addEventListener('click',()=>setOpen(false,true));
  document.addEventListener('click',e=>{if(!panel.hidden&&!dock.contains(e.target))setOpen(false)});
  document.addEventListener('keydown',e=>{if(!panel.hidden&&e.key==='Escape')setOpen(false,true)});
})();
