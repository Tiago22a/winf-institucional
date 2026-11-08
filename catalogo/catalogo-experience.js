/* WINF Catálogo | experiência das quatro marcas e atendimento territorial.
 * Mantém os dados PRODUCT_CATALOG do HTML original e substitui somente sua camada de interface.
 * O legado ?partner= permanece funcional para números cadastrados; nunca confie em destinos arbitrários.
 */
(() => {
  'use strict';
  const ROOT = '/catalogo/';
  const OFFICIAL_PHONE = '5513981113001';
  const TERRITORIES = Object.freeze({
    'santos-sp': { name:'Santos / SP', whatsapp:'5513981113001', page:'/pelicula-de-controle-solar-santos-sp/' }
  });
  const ORIGINS = {
    select: 'WINF Select™',
    aerocore: 'AeroCore™',
    neoskin: 'NeoSkin™',
    ceramic: 'Ceramic Armoring™'
  };
  const SECTIONS = {
    select: {
      label:'WINF Select™ / Glass + Home',
      title:'WINF SELECT™<br><span>GLASS + HOME.</span>',
      desc:'Películas arquitetônicas, proteção de vidros e soluções complementares para residências e empresas. A origem de cada tecnologia continua identificada.'
    },
    aerocore: {
      label:'AeroCore™ / Window Film',
      title:'AEROCORE™<br><span>ENGENHARIA TÉRMICA.</span>',
      desc:'Soluções em películas para automóveis e projetos especiais. Aplicações em embarcações ou aeronaves exigem avaliação específica e, quando aplicável, autorização.'
    },
    neoskin: {
      label:'NeoSkin™ / Paint Protection Film',
      title:'NEOSKIN™<br><span>PROTEÇÃO DE SUPERFÍCIES.</span>',
      desc:'PPF para pintura e superfícies compatíveis. Projetos arquitetônicos, náuticos e aeronáuticos dependem de homologação e análise técnica.'
    },
    ceramic: {
      label:'Ceramic Armoring™ / Revestimentos',
      title:'CERAMIC ARMORING™<br><span>PROTEÇÃO MOLECULAR.</span>',
      desc:'Revestimentos e tratamentos para superfícies. Aplicações em balcões, pedras e acabamentos nobres dependem da compatibilidade do material e do sistema.'
    }
  };
  const FILTERS = {
    select:[['all','Todos'],['glass','Vidros e fachadas'],['surfaces','Superfícies']],
    aerocore:[['all','Todos'],['auto','Automóveis'],['marine','Embarcações'],['air','Aeronaves']],
    neoskin:[['all','Todos'],['auto','Automóveis'],['home','Arquitetura'],['marine','Embarcações'],['air','Aeronaves']],
    ceramic:[['all','Todos'],['auto','Automóveis'],['home','Arquitetura'],['marine','Embarcações'],['air','Aeronaves']]
  };
  const GHOST = '/aerocore/assets/ghost-symbol.png';
  const own = (node,prop)=>Object.prototype.hasOwnProperty.call(node,prop);
  let application = 'all';
  let originCategory = 'select';
  let currentDetail = null;
  let currentTerritory = null;

  // O registro autorizado será substituído pelo WINF OS após homologação da API.
  function resolveTerritory() {
    const params = new URLSearchParams(location.search);
    const slug = (params.get('territorio') || '').toLowerCase().trim();
    if (own(TERRITORIES,slug)) return TERRITORIES[slug];
    const legacy = (params.get('partner') || '').replace(/\D/g,'');
    // Mantém explicitamente o link de Santos existente. Novos números precisam ser homologados.
    if (legacy === TERRITORIES['santos-sp'].whatsapp) return TERRITORIES['santos-sp'];
    return null;
  }
  function phone() { return currentTerritory?.whatsapp || OFFICIAL_PHONE; }
  function whats(message) {
    return 'https://wa.me/' + phone() + '?text=' + encodeURIComponent(message);
  }
  function contactText(product) {
    const brand = product ? ORIGINS[product.line] : ORIGINS[originCategory];
    const focus = product ? ('produto ' + product.name) : ('linha ' + brand);
    return 'Olá! Vim pelo Catálogo WINF™' + (currentTerritory ? ' — ' + currentTerritory.name : '') +
      ' e gostaria de orientação sobre ' + focus + '. Meu projeto é para [automóvel / vidro / superfície].';
  }
  function safeText(s) { return String(s ?? 'Não informado'); }
  function contact(product) {
    const a=document.createElement('a');
    a.href=whats(contactText(product));a.target='_blank';a.rel='noopener noreferrer';
    a.className='wc-contact-action';a.textContent='Falar com consultor no WhatsApp ↗';return a;
  }
  function getCategory() {return originCategory;}
  function products() {
    // Glass + Home agrega produtos das marcas irmãs, mas não troca sua marca de origem.
    let list = PRODUCT_CATALOG.filter(p=>originCategory==='select'
      ? (p.category==='arch'||p.line==='neoskin'||p.line==='ceramic')
      : p.line===originCategory);
    if(originCategory==='select'&&application==='glass')
      list=list.filter(p=>p.category==='arch'&&(p.line==='select'||p.line==='aerocore'));
    if(originCategory==='select'&&application==='surfaces')
      list=list.filter(p=>p.line==='neoskin'||p.line==='ceramic');
    return list;
  }
  function isConsultative() {
    return ['home','marine','air'].includes(application) ||
      (originCategory==='select'&&application==='surfaces');
  }
  function filterNotice(){
    if(isConsultative()) return 'Aplicações complementares apresentadas como possibilidades de estudo. A instalação depende de ficha técnica, análise do substrato e homologação específica. Não há aprovação automática para uso em aeronaves.';
    return originCategory==='select'
      ? 'Produtos WINF Select e tecnologias complementares identificadas por sua marca original.'
      : 'Portfólio da marca. Desempenho e adequação dependem da variante, das fichas técnicas e da aplicação.';
  }
  function badge(product) {
    const shell=document.createElement('div');shell.className='wc-brand-mark';
    if(product.line==='aerocore'||product.line==='neoskin') {
      const img=document.createElement('img');img.src=GHOST;img.alt='';img.loading='lazy';img.width=24;img.height=24;shell.append(img);
    }
    const label=document.createElement('span');
    label.textContent = ORIGINS[product.line] || 'WINF™';shell.append(label);
    return shell;
  }
  function safeHrefWithProduct(product) {
    const url = new URL(location.href);
    url.pathname = ROOT;
    url.searchParams.set('produto',product.id);
    return url.pathname+url.search+url.hash;
  }
  function createCard(product) {
    const article=document.createElement('article');
    article.className='wc-product-card';
    const picture=document.createElement('div');picture.className='wc-product-image';
    const img=document.createElement('img');img.src=product.image;img.alt='Imagem de apresentação de '+product.name;
    img.loading='lazy';img.decoding='async';picture.append(img);
    picture.append(badge(product));
    const body=document.createElement('div');body.className='wc-product-body';
    const kicker=document.createElement('p');kicker.className='wc-product-kicker';kicker.textContent=product.badge;
    const h=document.createElement('h3');h.textContent=product.name;
    const subtitle=document.createElement('p');subtitle.className='wc-product-subtitle';subtitle.textContent=product.subname;
    const desc=document.createElement('p');desc.className='wc-product-description';desc.textContent=product.shortDescription;
    body.append(kicker,h,subtitle,desc);
    if(originCategory==='select'&&product.line!=='select') {
      const info=document.createElement('p');info.className='wc-product-disclaimer';
      info.textContent='Tecnologia '+ORIGINS[product.line]+' para avaliação de aplicação arquitetônica.';
      body.append(info);
    }
    const bottom=document.createElement('div');bottom.className='wc-product-bottom';
    const warranty=document.createElement('span');warranty.textContent=product.keyMetrics.warranty;
    const link=document.createElement('a');link.href=safeHrefWithProduct(product);
    link.className='wc-spec-link';link.textContent='Explorar ficha ↗';
    link.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();openDetail(product.id,true);});
    bottom.append(warranty,link);body.append(bottom);article.append(picture,body);return article;
  }
  function parsePercent(value) {
    if(typeof value==='number'&&value>=0&&value<=100)return value;
    const v=String(value??'').trim();
    const m=v.match(/(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*%/g);
    if(!m||m.length!==1)return null;
    const result=Number(m[0].replace('%','').trim().replace(',','.'));
    return Number.isFinite(result)&&result>=0&&result<=100?result:null;
  }
  function fmtPercent(n) {return n===null?'Não informado':n.toLocaleString('pt-BR',{maximumFractionDigits:1})+'%';}
  function isGlassFilm(p){
    return p && (p.line==='select'||p.line==='aerocore') &&
      p.specs && p.specs.vlt!=='N/A';
  }
  // Só VLT e TSER quando identificados no cadastro; IRR não é proxy de TSER e não gera °C.
  function simMetrics(p) {
    if(!isGlassFilm(p))return {vlt:null,tser:null};
    return {vlt:parsePercent(p.specs.vlt),tser:parsePercent(p.keyMetrics.tser)};
  }
  function renderSim(){
    const panel=document.getElementById('thermal-simulator');
    const unavailable=document.getElementById('sim-not-available');
    const supported=originCategory==='select'||originCategory==='aerocore';
    panel.hidden=!supported;unavailable.hidden=supported;
    if(!supported)return;
    const film=PRODUCT_CATALOG.find(p=>p.id===document.getElementById('sim-film-select').value);
    const {vlt,tser}=simMetrics(film);
    const radiation=Number(document.getElementById('sun-slider').value)||0;
    const bg=document.getElementById('sim-bg');
    const scene=document.getElementById('sim-model-select').value;
    bg.dataset.scenario=['facade','residential','office'].includes(scene)?scene:'facade';
    document.getElementById('sun-label').textContent=radiation+'%';
    document.getElementById('sim-vlt').textContent=fmtPercent(vlt);
    document.getElementById('sim-ir').textContent=film?safeText(film.keyMetrics.ir):'—';
    document.getElementById('sim-warranty').textContent=film?safeText(film.keyMetrics.warranty):'—';
    document.getElementById('film-badge').textContent=film?'Com '+film.name:'Com película';
    document.getElementById('temp-common').textContent=radiation+'%';
    document.getElementById('bar-common-val').textContent=radiation+'%';
    const transmitted=tser===null?null:radiation*(100-tser)/100;
    const summary=transmitted===null?'Sem dado TSER':fmtPercent(transmitted);
    document.getElementById('temp-winf').textContent=summary;
    document.getElementById('bar-winf-val').textContent=summary;
    document.getElementById('bar-common').style.width=radiation+'%';
    document.getElementById('bar-winf').style.width=(transmitted===null?0:transmitted)+'%';
    const right=document.getElementById('right-svg');right.replaceChildren();
    const tinted=document.getElementById('tint-overlay');
    tinted.style.opacity=(vlt===null?0:Math.min(.7,(100-vlt)/150));
    document.getElementById('sun-ext-temp').textContent='INCIDÊNCIA '+radiation+'%';
    document.getElementById('sim-bottom-label').textContent=
      film?'Transparência '+fmtPercent(vlt)+' · TSER '+fmtPercent(tser):'Comparativo ilustrativo de vidro';
    const title = document.getElementById('bar-common-label');if(title)title.textContent='Índice de radiação incidente';
    const second=document.getElementById('bar-winf-label');if(second)second.textContent='Índice de energia transmitida';
    document.getElementById('sun-badge').style.transform='none';
    const icon=document.getElementById('bar-winf-icon');
    icon.className='w-10 h-10 flex items-center justify-center border border-white/20 text-zinc-300';
    const note=document.getElementById('sim-status');
    if(note)note.textContent=film
      ? (tser===null?'TSER não disponível para esta variante. Nenhuma estimativa numérica de transmissão solar foi calculada.':'Comparação aritmética de referência: índice incidente × (1 − TSER/100). Não estima temperatura ambiente nem consumo de energia.')
      : 'Escolha uma película de vidro e consulte a variante correta. Resultados dependem de ensaio técnico e do vidro.';
  }
  function refreshSelect(){
    const select=document.getElementById('sim-film-select');
    const old=select.value;select.replaceChildren(new Option('Selecione a película',''));
    products().filter(p=>isGlassFilm(p)).forEach(p=>select.add(new Option(p.name,p.id)));
    select.value=[...select.options].some(o=>o.value===old)?old:'';
    renderSim();
  }
  function renderFilters(){
    const holder=document.getElementById('application-filters');holder.replaceChildren();
    FILTERS[originCategory].forEach(([id,name])=>{
      const b=document.createElement('button');b.type='button';b.textContent=name;
      b.setAttribute('aria-pressed',String(id===application));
      b.addEventListener('click',()=>{application=id;renderFilters();window.renderGrid();});
      holder.append(b);
    });
  }
  function findBrandPage(product){
    if(product.line==='select')return '/aerocore/winf-select/';
    if(product.line==='aerocore')return '/aerocore/aerocore/';
    if(product.line==='neoskin')return '/aerocore/neoskin/';
    if(product.line==='ceramic')return '/aerocore/ceramic-armoring/';
    return '/';
  }
  function renderDetail(product){
    const holder=document.getElementById('wc-product-detail');
    holder.replaceChildren();
    const bar=document.createElement('div');bar.className='wc-detail-top';
    const back=document.createElement('button');back.type='button';back.textContent='← Voltar aos produtos';
    back.addEventListener('click',()=>closeDetail(true));bar.append(back,badge(product));
    const grid=document.createElement('div');grid.className='wc-detail-grid';
    const image=document.createElement('img');image.src=product.image;image.alt='Apresentação de '+product.name;image.className='wc-detail-image';
    const content=document.createElement('div');content.className='wc-detail-copy';
    const kicker=document.createElement('p');kicker.className='wc-product-kicker';kicker.textContent=product.badge;
    const h=document.createElement('h1');h.textContent=product.name;
    const subtitle=document.createElement('p');subtitle.className='wc-detail-subtitle';subtitle.textContent=product.subname;
    const desc=document.createElement('p');desc.textContent=product.fullDescription||product.shortDescription;
    content.append(kicker,h,subtitle,desc);
    const data=document.createElement('dl');data.className='wc-detail-specs';
    const specs=[
      ['Marca',ORIGINS[product.line]],['VLT',product.specs.vlt],['Rejeição IR',product.keyMetrics.ir],
      ['TSER',product.keyMetrics.tser],['Proteção UV',product.keyMetrics.uv],
      ['Espessura',product.specs.thickness],['Material',product.specs.material],
      ['Garantia informada',product.keyMetrics.warranty]
    ];
    specs.forEach(([key,value])=>{
      const pair=document.createElement('div');pair.className='wc-detail-pair';
      const dt=document.createElement('dt');dt.textContent=key;const dd=document.createElement('dd');dd.textContent=safeText(value);
      pair.append(dt,dd);data.append(pair);
    });
    content.append(data);
    const note=document.createElement('p');note.className='wc-detail-warning';
    note.textContent='Dados exibidos conforme o cadastro atual do catálogo, sujeitos à conferência nas fichas técnicas oficiais. A aplicação exige análise de compatibilidade; usos em aeronaves dependem de autorização.';
    content.append(note);
    const links=document.createElement('div');links.className='wc-detail-actions';
    links.append(contact(product));
    const brand=document.createElement('a');brand.href=findBrandPage(product);
    brand.textContent='Conhecer a marca ↗';brand.className='wc-secondary-action';links.append(brand);
    const share=document.createElement('button');share.type='button';share.className='wc-secondary-action';share.textContent='Copiar link';
    share.addEventListener('click',async()=>{
      try{await navigator.clipboard.writeText(location.href);share.textContent='Link copiado';}
      catch{share.textContent='Copie o endereço da página';}
    });
    links.append(share);content.append(links);grid.append(image,content);holder.append(bar,grid);
  }
  function showDetail(id,historyChange){
    const product=PRODUCT_CATALOG.find(p=>p.id===id);
    if(!product)return false;
    currentDetail=product.id;
    if(historyChange){const url=new URL(location.href);url.searchParams.set('produto',id);history.pushState({product:id},'',url);}
    document.querySelector('.wc-hero').hidden=true;
    document.getElementById('catalog-products').hidden=true;
    document.getElementById('thermal-simulator').hidden=true;
    document.getElementById('sim-not-available').hidden=true;
    const detail=document.getElementById('wc-product-detail');detail.hidden=false;
    renderDetail(product);
    document.title=product.name+' | Catálogo WINF™';
    updateDockWhats(product);
    scrollTo({top:0,behavior:'auto'});
    return true;
  }
  function hideDetail(historyChange){
    currentDetail=null;
    if(historyChange){const url=new URL(location.href);url.searchParams.delete('produto');history.pushState({},'',url);}
    document.querySelector('.wc-hero').hidden=false;
    document.getElementById('catalog-products').hidden=false;
    document.getElementById('wc-product-detail').hidden=true;
    document.title='Catálogo WINF™ | Glass + Home, AeroCore, NeoSkin e Ceramic Armoring';
    renderSim();updateDockWhats();scrollTo({top:0,behavior:'auto'});
  }
  function openDetail(id,push) {return showDetail(id,push);}
  function closeDetail(push) {hideDetail(push);}
  function setCategory(id) {
    if(!own(SECTIONS,id))return;
    originCategory=id;activeCategory=id;application='all';selectedFilmId='';
    Object.keys(SECTIONS).forEach(key=>{const b=document.getElementById('tab-'+key);if(b)b.setAttribute('aria-selected',String(key===id));});
    document.getElementById('catalog-products').setAttribute('aria-labelledby','tab-'+id);
    document.getElementById('division-label').textContent=SECTIONS[id].label;
    document.getElementById('hero-title').innerHTML=SECTIONS[id].title;
    document.getElementById('hero-desc').textContent=SECTIONS[id].desc;
    if(currentDetail)hideDetail(true);
    renderFilters();window.renderGrid();refreshSelect();
    updateDockWhats();
  }
  function renderGrid() {
    const grid=document.getElementById('product-grid');
    grid.replaceChildren();
    products().forEach(p=>grid.append(createCard(p)));
    const notice=document.getElementById('application-note');notice.textContent=filterNotice();
  }
  function openWhats(product) {window.open(whats(contactText(product)),'_blank','noopener,noreferrer');}
  function updateDockWhats(product) {
    const link=document.querySelector('#wc-dock .wc-dock-wa');
    if(link)link.href=whats(contactText(product||null));
    const panelLink=document.querySelector('#wc-dock .wc-contact-action');
    if(panelLink)panelLink.href=whats(contactText(product||null));
  }
  function createDock(){
    const dock=document.createElement('aside');dock.id='wc-dock';dock.setAttribute('aria-label','Atendimento e navegação WINF');
    const panel=document.createElement('div');panel.className='wc-dock-panel';panel.hidden=true;
    panel.innerHTML='<strong>UNIVERSO WINF™</strong><p>Selecione uma linha ou fale com a nossa equipe.</p>';
    Object.entries(ORIGINS).forEach(([key,title])=>{
      const a=document.createElement('button');a.type='button';a.textContent=title;
      a.addEventListener('click',()=>{panel.hidden=true;setCategory(key);});
      panel.append(a);
    });
    panel.append(contact(null));
    const launch=document.createElement('div');launch.className='wc-dock-buttons';
    const ghost=document.createElement('button');ghost.type='button';ghost.className='wc-dock-circle';
    ghost.setAttribute('aria-expanded','false');ghost.setAttribute('aria-label','Abrir universo WINF');
    const icon=document.createElement('img');icon.src=GHOST;icon.width=27;icon.height=32;icon.alt='';ghost.append(icon);
    ghost.addEventListener('click',()=>{panel.hidden=!panel.hidden;ghost.setAttribute('aria-expanded',String(!panel.hidden));});
    const wa=document.createElement('a');wa.className='wc-dock-circle wc-dock-wa';wa.href=whats(contactText(null));
    wa.target='_blank';wa.rel='noopener noreferrer';wa.setAttribute('aria-label','Falar com a equipe WINF pelo WhatsApp');
    wa.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.7L3 21l1.5-4.9A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M8.2 7.4c.3-.3.7-.2.8.1l1 2c.1.3 0 .5-.5 1 .7 1.5 1.7 2.5 3.2 3.2.5-.5.7-.9 1-.8l2 .9c.4.2.4.5.2.9-.4.9-1.1 1.3-2 1.1-3.7-.8-6.6-3.7-7.1-6.5-.1-.8.5-1.6 1.4-1.9Z"/></svg>';
    launch.append(ghost,wa);dock.append(panel,launch);document.body.append(dock);
    document.addEventListener('click',e=>{if(!dock.contains(e.target)){panel.hidden=true;ghost.setAttribute('aria-expanded','false');}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){panel.hidden=true;ghost.setAttribute('aria-expanded','false');ghost.focus();}});
  }
  // Substitui funções legadas sem alterar os dados de produtos e as fichas.
  window.setCategory=setCategory;
  window.renderGrid=renderGrid;
  window.populateFilmSelect=refreshSelect;
  window.onSunChange=()=>renderSim();
  window.setSun=(n)=>{document.getElementById('sun-slider').value=n;renderSim();};
  window.updateSimDisplay=renderSim;
  window.updatePresetButtons=()=>{};
  window.openSpecModal=(id)=>openDetail(id,true);
  window.closeSpecModal=()=>closeDetail(true);
  window.falarConsultor=()=>openWhats(null);
  window.falarConsultorProduto=(ev,name)=>{
    if(ev?.stopPropagation)ev.stopPropagation();
    const item=PRODUCT_CATALOG.find(p=>p.name===name);openWhats(item||null);
  };
  document.addEventListener('DOMContentLoaded',()=>{
    currentTerritory=resolveTerritory();
    const detail=document.createElement('section');detail.id='wc-product-detail';detail.className='wc-detail-page';detail.hidden=true;
    document.getElementById('catalog-products').before(detail);
    const marker=document.getElementById('wc-territory');if(marker)marker.textContent=currentTerritory
      ?'ATENDIMENTO TERRITORIAL: '+currentTerritory.name:'ATENDIMENTO CENTRAL WINF™';
    // Texto técnico de índice energético em lugar da antiga temperatura fictícia.
    document.querySelector('#temp-common')?.setAttribute('aria-label','Índice solar incidente');
    const common=document.querySelector('#bar-common-label');if(common)common.textContent='Radiação incidente';
    const chosen=document.getElementById('bar-winf-label');if(chosen)chosen.textContent='Energia solar transmitida';
    const newLabel=document.getElementById('sim-status');
    if(newLabel)newLabel.textContent='Escolha uma película e confira o TSER cadastrado.';
    createDock();
    setCategory('select');
    const id=new URLSearchParams(location.search).get('produto');
    if(id)showDetail(id,false);
    window.addEventListener('popstate',()=>{
      const current=new URLSearchParams(location.search).get('produto');
      if(current){showDetail(current,false);}else{hideDetail(false);}
    });
  });
})();