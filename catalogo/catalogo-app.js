/* WINF™ Catálogo unificado | aplicações, fichas, simulação e contatos (sem frameworks).
   O catálogo usa dados PRODUCT_CATALOG existentes e mantém os links ?partner legados.
   A ativação territorial via WINF OS ainda requer integração autenticada.
*/
(function () {
  "use strict";
  var ROOT = "/catalogo/";
  var MAIN_PHONE = "5513981113001";
  var LEGACY = new URLSearchParams(location.search);
  // Fallback offline: Santos foi homologado. A configuração pública é carregada
  // de /catalogo/territorios.json (mesma origem); nunca aceitar telefone livre via URL.
  var TERRITORIES = Object.assign(Object.create(null), {"santos-sp": {name:"Santos / SP",phone:"5513981113001"}});
  function phoneValid(value) { return /^55[1-9][0-9]{9,10}$/.test(value || ""); }
  var territoryKey = (LEGACY.get("territorio") || "").toLowerCase();
  var legacyPhone = (LEGACY.get("partner") || "").replace(/[^0-9]/g,"");
  var territory = null, knownLegacy = null, salesPhone = MAIN_PHONE, partnerContext = "central WINF";
  function resolveTerritory() {
    territory = Object.prototype.hasOwnProperty.call(TERRITORIES,territoryKey) ? TERRITORIES[territoryKey] : null;
    knownLegacy = phoneValid(legacyPhone) ? Object.keys(TERRITORIES).map(function(k){return TERRITORIES[k];}).find(function(p){return p.phone === legacyPhone;}) : null;
    salesPhone = territory ? territory.phone : (knownLegacy ? knownLegacy.phone : MAIN_PHONE);
    partnerContext = territory ? territory.name : (knownLegacy ? knownLegacy.name : "central WINF");
  }
  function loadTerritories() {
    if(typeof fetch !== "function")return;
    fetch("/catalogo/territorios.json", {cache:"no-store"}).then(function(res){
      if(!res.ok)throw new Error("Registro territorial indisponível");
      return res.json();
    }).then(function(data) {
      if(!data || data.schemaVersion !== 1 || !data.territories || typeof data.territories !== "object")return;
      for(var key of Object.keys(data.territories)){
        var item=data.territories[key];
        if(!/^[a-z0-9-]{4,60}$/.test(key) || !item || item.status !== "active" || !phoneValid(item.phone) ||
          typeof item.name !== "string" || !item.name.trim())continue;
        TERRITORIES[key]={name:item.name.trim(),phone:item.phone};
      }
      resolveTerritory();updateDock();
      var wa=document.getElementById("wc-detail-whatsapp");
      if(wa && selectedProduct)wa.href=waUrl(selectedProduct);
    }).catch(function(){ /* fallback homologado — sem erro crítico para o cliente */ });
  }
  resolveTerritory();
  var section = "select", application = "all", selectedProduct = null, prevFocused = null;
  var brandNames = {select:"WINF SELECT™",aerocore:"AEROCORE™",neoskin:"NEOSKIN™",ceramic:"CERAMIC ARMORING™"};
  var brandPages = {select:"/aerocore/winf-select/",aerocore:"/aerocore/aerocore/",neoskin:"/aerocore/neoskin/",ceramic:"/aerocore/ceramic-armoring/"};
  var sections = {
    select:{label:"WINF SELECT™ / GLASS + HOME",headline:"WINF SELECT™",sub:"GLASS + HOME.",desc:"Películas arquitetônicas e soluções de proteção para vidros e superfícies. Complementos de outras marcas WINF aparecem com a origem identificada e exigem avaliação técnica."},
    aerocore:{label:"AEROCORE™ / WINDOW FILM",headline:"AEROCORE™",sub:"CONTROLE TÉRMICO.",desc:"Películas de engenharia térmica AeroCore. Aplicações automotivas, náuticas e aeronáuticas devem respeitar a especificação e as autorizações de cada contexto."},
    neoskin:{label:"NEOSKIN™ / PAINT PROTECTION FILM",headline:"NEOSKIN™",sub:"PROTEÇÃO DE SUPERFÍCIES.",desc:"PPF NeoSkin para proteção de pintura e superfícies. O uso arquitetônico, náutico ou aeronáutico depende da compatibilidade e da homologação correspondente."},
    ceramic:{label:"CERAMIC ARMORING™ / COATINGS",headline:"CERAMIC ARMORING™",sub:"PROTEÇÃO CERÂMICA.",desc:"Revestimentos para proteção de superfícies de alto padrão. Bancadas e acabamentos são aplicações potenciais sujeitas à especificação e ensaio de compatibilidade."}
  };
  var uses = {
    select:[["all","Todos os produtos"],["glass","Vidros e fachadas"],["surface","Superfícies especiais"]],
    aerocore:[["all","Todos"],["auto","Automóveis"],["marine","Embarcações"],["aviation","Aeronaves"]],
    neoskin:[["all","Todos"],["auto","Automóveis"],["home","Residências"],["marine","Embarcações"],["aviation","Aeronaves"]],
    ceramic:[["all","Todos"],["home","Arquitetura"],["auto","Automóveis"],["marine","Embarcações"],["aviation","Aeronaves"]]
  };
  function items() { return typeof PRODUCT_CATALOG !== "undefined" ? PRODUCT_CATALOG : []; }
  function find(id) { return items().find(function (p) {return p.id === id;}); }
  function origin(p) { return brandNames[p.line] || "WINF™"; }
  function catalogUrl(id) {var url = new URL(location.href);if(id)url.searchParams.set("produto",id);else url.searchParams.delete("produto");return url; }
  function escapeHtml(value) {return String(value == null ? "" : value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function contextMessage(product) {
    var p = product || selectedProduct;
    return "Olá! Estou no Catálogo WINF™ e gostaria de orientação sobre " + (p ? p.name + " (" + origin(p) + ")" : brandNames[section]) +
      ". Aplicação: " + (uses[section].find(function(x){return x[0]===application;}) || ["","não especificada"])[1] +
      ". Origem do atendimento: " + partnerContext + ".";
  }
  function waUrl(p) {return "https://wa.me/" + salesPhone + "?text=" + encodeURIComponent(contextMessage(p));}
  function goWhatsapp(p) {window.open(waUrl(p),"_blank","noopener,noreferrer");}
  window.falarConsultor = function(){goWhatsapp(null);};
  window.falarConsultorProduto = function(e,name) {if(e && e.stopPropagation)e.stopPropagation();goWhatsapp(items().find(function(x){return x.name===name || x.id===name;}) || null);};
  window.shareProduct = function(e,id){if(e&&e.stopPropagation)e.stopPropagation();goWhatsapp(find(id));};
  window.shareAll = function(){goWhatsapp(null);};
  function productsVisible(){
    var a=items().filter(function(p){
      if(section==="select")return p.category==="arch" || p.id==="neoskin-bunker150" || p.id==="neoskin-apocalypse190" || p.line==="ceramic";
      return p.line === section;
    });
    if(section==="select" && application==="glass")return a.filter(function(p){return p.line==="select" || p.id==="select-invisible-spectre";});
    if(section==="select" && application==="surface")return a.filter(function(p){return p.line==="neoskin" || p.line==="ceramic";});
    return a;
  }
  function note() {
    if(section==="select")return "Produtos de outras marcas aparecem como complementos arquitetônicos. Avalie o substrato, a homologação e a disponibilidade antes de especificar.";
    if(application==="marine" || application==="aviation" || application==="home")return "Contexto especial para consulta: a presença do produto nesta lista não é homologação técnica para essa aplicação.";
    return "Seleção de produtos " + brandNames[section] + ". Especificações e uso final sujeitos à ficha técnica do produto.";
  }
  function ghostMark(p) {
    if(p.line==="aerocore" || p.line==="neoskin")return '<img class="wc-ghost-mark" src="/aerocore/assets/ghost-symbol.png" width="22" height="26" alt="" loading="lazy">';
    return "";
  }
  function cardHtml(p) {
    var original = p.id==="select-invisible-spectre" ? "InfiSpectre™ by AeroCore™" : p.name;
    var label = p.line==="select" ? "WINF SELECT™" : origin(p);
    return ['<article class="wc-product-card product-card" data-id="',escapeHtml(p.id),'">',
      '<a class="wc-card-image" href="',escapeHtml(catalogUrl(p.id).pathname+catalogUrl(p.id).search),'" data-open-product="',escapeHtml(p.id),'" aria-label="Ver ficha de ',escapeHtml(original),'">',
      '<img src="',escapeHtml(p.image),'" alt="Apresentação do produto ',escapeHtml(original),'" loading="lazy" decoding="async">',
      '<span class="wc-image-shade"></span><span class="wc-card-brand',p.line==="aerocore"?' wc-aerocore-wordmark':'','">',
      ghostMark(p),'<strong>',escapeHtml(label),'</strong></span></a>',
      '<div class="wc-product-body"><span class="wc-origin">MARCA DE ORIGEM / ',escapeHtml(origin(p)),'</span>',
      '<small class="wc-badge">',escapeHtml(p.badge),'</small><h3>',escapeHtml(original),'</h3>',
      '<p class="wc-sub">',escapeHtml(p.subname),'</p><p class="wc-product-desc">',escapeHtml(p.shortDescription),'</p>',
      (section==="select" && p.line!=="select" ? '<p class="wc-compatibility">Complemento arquitetônico — aplicação sujeita a avaliação técnica.</p>' : ""),
      '<div class="wc-product-actions"><span>',escapeHtml(p.keyMetrics.warranty),'</span>',
      '<a class="wc-explore" href="',escapeHtml(catalogUrl(p.id).pathname+catalogUrl(p.id).search),'" data-open-product="',escapeHtml(p.id),'">EXPLORAR SPECS <span aria-hidden="true">↗</span></a></div>',
      '</div></article>'].join("");
  }
  function renderFilters(){
    var holder=document.getElementById("application-filters");
    if(!holder)return;
    holder.innerHTML=uses[section].map(function(entry){
      return '<button type="button" data-wc-use="'+escapeHtml(entry[0])+'" aria-pressed="'+String(entry[0]===application)+'">'+escapeHtml(entry[1])+'</button>';
    }).join("");
    holder.querySelectorAll("[data-wc-use]").forEach(function(btn){
      btn.addEventListener("click",function(){application=btn.dataset.wcUse;renderFilters();window.renderGrid();});
    });
    document.getElementById("application-note").textContent=note();
  }
  window.renderGrid=function(){
    var grid=document.getElementById("product-grid");if(!grid)return;
    grid.innerHTML=productsVisible().map(cardHtml).join("");
    renderFilters();
    grid.querySelectorAll("[data-open-product]").forEach(function(link){
      link.addEventListener("click",function(event){event.preventDefault();openProduct(link.dataset.openProduct,true);});
    });
  };
  window.populateFilmSelect=function(){
    var select=document.getElementById("sim-film-select");if(!select)return;
    var options=productsVisible().filter(function(p){return (p.line==="select"||p.line==="aerocore")&&/^[0-9]+/.test(p.specs.vlt||"");});
    select.innerHTML='<option value="">Selecione uma película para vidro</option>'+options.map(function(p){
      return '<option value="'+escapeHtml(p.id)+'">'+escapeHtml(p.id==="select-invisible-spectre"?"InfiSpectre™ by AeroCore™":p.name)+'</option>';
    }).join("");
  };
  window.updatePresetButtons=function(){};
  window.updateSimDisplay=function(){if(document.getElementById("wc-sun-input"))simulate();};
  window.setCategory=function(key){
    if(!sections[key])return;
    section=key;application="all";
    var data=sections[key];
    document.getElementById("division-label").textContent=data.label;
    document.getElementById("hero-title").innerHTML=escapeHtml(data.headline)+'<br><span class="font-medium">'+escapeHtml(data.sub)+'</span>';
    document.getElementById("hero-desc").textContent=data.desc;
    document.querySelectorAll(".wc-nav-tabs [role=tab]").forEach(function(btn){btn.setAttribute("aria-selected",String(btn.id==="tab-"+key));});
    document.getElementById("catalog-products").setAttribute("aria-labelledby","tab-"+key);
    var logo=document.querySelector(".wc-brand-panel");
    if(logo){
      if(key==="select"){logo.innerHTML='<img src="/winf-logo.svg" width="100" height="50" alt="WINF™" decoding="async"><span>CATÁLOGO OFICIAL</span>';}
      else{logo.innerHTML='<img class="wc-brand-ghost" src="/aerocore/assets/ghost-symbol.png" width="32" height="40" alt="" decoding="async"><strong class="wc-hero-brand '+key+'">'+escapeHtml(brandNames[key])+'</strong><span>ECOSSISTEMA WINF™</span>';}
    }
    var sim=document.getElementById("thermal-simulator"),not=document.getElementById("sim-not-available");
    if(sim&&not){sim.hidden=!(key==="select"||key==="aerocore");not.hidden=!sim.hidden;}
    window.renderGrid();window.populateFilmSelect();simulate();updateDock();
  };
  function numPct(raw) {
    if(typeof raw==="number")return raw>=0&&raw<=100?raw:null;
    var m=String(raw||"").replace(",",".").match(/^\s*([0-9]+(?:\.[0-9]+)?)\s*%?\s*$/);
    if(!m)return null;var n=Number(m[1]);return n>=0&&n<=100?n:null;
  }
  function simulatorHTML(){
    return ['<div class="wc-sim-head"><span class="wc-kicker">WINF / ESTUDO VISUAL</span>',
      '<h2>SIMULADOR DE CONTROLE SOLAR.</h2>',
      '<p>Explore a relação entre incidência solar, transparência visual e rejeição total de energia solar (TSER) quando informada no cadastro do produto.</p></div>',
      '<div class="wc-sim-layout"><div class="wc-sim-controls">',
      '<label for="wc-scenario">TIPO DE PROJETO</label><select id="wc-scenario"><option value="facade">Fachada contemporânea</option><option value="residential">Apartamento envidraçado</option><option value="office">Escritório</option></select>',
      '<label for="sim-film-select">PELÍCULA PARA VIDRO</label><select id="sim-film-select"></select>',
      '<label for="wc-sun-input">RADIAÇÃO SOLAR INCIDENTE <output id="wc-sun-output">750 W/m²</output></label><input id="wc-sun-input" type="range" min="200" max="1000" step="50" value="750">',
      '<p class="wc-sim-disclaimer">Ferramenta didática, não substitui laudo, ensaio, cálculo térmico do edifício nem a avaliação de compatibilidade do conjunto vidro/película. A irradiância é escolhida pelo usuário, não medida.</p>',
      '</div><div class="wc-sim-visual"><div class="wc-sim-glass"><div class="wc-glass-pane"><span>01 / RADIAÇÃO INCIDENTE</span><strong id="wc-before-result">750 W/m²</strong><small>Energia sobre o vidro</small></div>',
      '<div class="wc-glass-pane wc-glass-treated"><div id="wc-tint" aria-hidden="true"></div><span>02 / PARCELA NÃO REJEITADA</span><strong id="wc-after-result">—</strong><small id="wc-after-note">Selecione a película</small></div></div>',
      '<div class="wc-sim-metrics"><div><span>VLT / TRANSMISSÃO DE LUZ</span><strong id="wc-vlt-output">—</strong></div><div><span>TSER / REJEIÇÃO SOLAR TOTAL</span><strong id="wc-tser-output">—</strong></div></div>',
      '<p id="wc-sim-status" class="wc-sim-status" role="status" aria-live="polite">Selecione uma película com dados técnicos para iniciar a comparação.</p>',
      '</div></div>'].join("");
  }
  function initSimulator(){
    var root=document.getElementById("thermal-simulator");if(!root)return;
    root.innerHTML=simulatorHTML();
    ["wc-scenario","sim-film-select","wc-sun-input"].forEach(function(id){document.getElementById(id).addEventListener("input",simulate);});
    window.populateFilmSelect();simulate();
  }
  function simulate(){
    var slider=document.getElementById("wc-sun-input");
    if(!slider)return;
    var incoming=Number(slider.value)||750;
    var select=document.getElementById("sim-film-select");
    var film=select&&select.value?find(select.value):null;
    var vlt=film?numPct(film.specs.vlt):null;
    var tser=film?numPct(film.keyMetrics.tser):null;
    document.getElementById("wc-sun-output").textContent=incoming+" W/m²";
    document.getElementById("wc-before-result").textContent=incoming+" W/m²";
    document.getElementById("wc-vlt-output").textContent=vlt===null?"N/D":vlt+"%";
    document.getElementById("wc-tser-output").textContent=tser===null?"N/D":tser+"%";
    document.getElementById("wc-tint").style.opacity=vlt===null?0:Math.min(.78,Math.max(0,(100-vlt)/100)*.72);
    var after=document.getElementById("wc-after-result"),note=document.getElementById("wc-after-note"),status=document.getElementById("wc-sim-status");
    if(tser===null){
      after.textContent="—";note.textContent=film?"TSER ainda não cadastrado":"Selecione a película";
      status.textContent=film?"Sem TSER válido para esse produto. A simulação energética fica indisponível até cadastrar dados técnicos.":"Selecione uma película com dados técnicos para iniciar a comparação.";
    } else {
      var remaining=Math.round(incoming*(1-tser/100));
      after.textContent=remaining+" W/m²";
      note.textContent="Índice calculado pelo TSER informado";
      status.textContent="Cálculo didático: incidência × (1 − TSER). O TSER é específico do conjunto vidro/película ensaiado; não representa temperatura do ambiente nem ganho interno medido.";
    }
  }
  function specsHTML(p){
    var entries=[["TRANSMISSÃO VLT",p.specs.vlt],["REJEIÇÃO IR",p.specs.irer],["TSER / DADOS DO CADASTRO",p.keyMetrics.tser],
      ["PROTEÇÃO UV",p.keyMetrics.uv],["MATERIAL",p.specs.material],["ESPESSURA",p.specs.thickness],["GARANTIA INFORMADA",p.keyMetrics.warranty]];
    return entries.filter(function(v){return v[1]&&v[1]!=="N/A";}).map(function(v){
      return '<div class="wc-detail-spec"><dt>'+escapeHtml(v[0])+'</dt><dd>'+escapeHtml(v[1])+'</dd></div>';
    }).join("");
  }
  function detailMarkup(p){
    var title=p.id==="select-invisible-spectre"?"InfiSpectre™ by AeroCore™":p.name;
    return ['<div class="wc-detail-top"><button class="wc-back" id="wc-detail-close" type="button"><img src="/brand/winf-monogram.svg" class="wc-mini-w" width="22" height="22" alt="" aria-hidden="true"> ← VOLTAR AO CATÁLOGO</button><span>WINF / FICHA DE PRODUTO</span></div>',
      '<div class="wc-detail-columns"><div class="wc-detail-visual"><img src="',escapeHtml(p.image),'" alt="',escapeHtml(title),'" loading="eager">',
      '<div class="wc-detail-origin">',ghostMark(p),'<span>',escapeHtml(origin(p)),'</span></div></div>',
      '<div class="wc-detail-content"><span class="wc-kicker">',escapeHtml(p.badge),'</span><h2 id="wc-detail-title">',escapeHtml(title),'</h2>',
      '<p class="wc-detail-sub">',escapeHtml(p.subname),'</p><p>',escapeHtml(p.fullDescription||p.shortDescription),'</p>',
      (p.line==="neoskin"||p.line==="ceramic"||p.id==="select-invisible-spectre"?'<p class="wc-detail-caution">Aplicações em outras superfícies ou segmentos devem passar por verificação de compatibilidade, disponibilidade e especificação técnica.</p>':""),
      '<h3>ESPECIFICAÇÕES DISPONÍVEIS</h3><dl class="wc-detail-specs">',specsHTML(p),'</dl>',
      '<p class="wc-detail-caution">As informações do catálogo estão sujeitas à conferência com fichas técnicas, laudos e condições comerciais vigentes.</p>',
      '<div class="wc-detail-actions"><a id="wc-detail-whatsapp" href="',escapeHtml(waUrl(p)),'" target="_blank" rel="noopener noreferrer">FALAR COM CONSULTOR ↗</a>',
      '<a href="',brandPages[p.line]||"/",'" target="_blank" rel="noopener noreferrer">CONHECER A LINHA ↗</a>',
      '<button type="button" id="wc-detail-copy">COPIAR LINK</button></div></div></div>'].join("");
  }
  function openProduct(id,recordHistory){
    var p=find(id);if(!p)return;
    var dialog=document.getElementById("wc-product-detail");if(!dialog)return;
    selectedProduct=p;prevFocused=document.activeElement;
    dialog.innerHTML=detailMarkup(p);
    dialog.hidden=false;document.body.classList.add("wc-detail-open");
    document.getElementById("wc-detail-close").addEventListener("click",closeProduct);
    document.getElementById("wc-detail-copy").addEventListener("click",function(){
      var url=catalogUrl(p.id).toString();
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(function(){showCopyFeedback();}).catch(function(){window.prompt("Copie o endereço:",url);});
      else window.prompt("Copie o endereço:",url);
    });
    document.getElementById("wc-detail-close").focus();
    if(recordHistory) history.pushState({wcProduct:id},"",catalogUrl(id).toString());
    updateDock();
  }
  function showCopyFeedback(){var b=document.getElementById("wc-detail-copy");if(b)b.textContent="LINK COPIADO ✓";}
  function closeProduct(){
    var dialog=document.getElementById("wc-product-detail");
    if(dialog)dialog.hidden=true;
    document.body.classList.remove("wc-detail-open");
    selectedProduct=null;
    var url=catalogUrl(null);history.replaceState({},"",url.pathname+url.search+url.hash);
    if(prevFocused&&prevFocused.focus)prevFocused.focus();
    updateDock();
  }
  function updateDock(){
    var wa=document.getElementById("wc-fixed-whatsapp"),assist=document.getElementById("wc-fixed-assist");
    if(wa)wa.href=waUrl(selectedProduct);
    if(assist)assist.setAttribute("aria-label","Abrir opções WINF — "+brandNames[section]);
    var active=document.getElementById("wc-active-territory");
    if(active)active.textContent=partnerContext;
  }
  function initDock(){
    var dock=document.createElement("aside");
    dock.className="wc-fixed-dock";dock.setAttribute("aria-label","Atendimento e marcas WINF");
    dock.innerHTML=['<div class="wc-dock-panel" id="wc-dock-panel" hidden><div><strong>UNIVERSO WINF™</strong>',
      '<button type="button" id="wc-dock-close" aria-label="Fechar menu">×</button></div><p>Atendimento: <span id="wc-active-territory"></span></p>',
      '<nav><a href="/aerocore/winf-select/">WINF Select™</a><a href="/aerocore/aerocore/">AeroCore™</a>',
      '<a href="/aerocore/neoskin/">NeoSkin™</a><a href="/aerocore/ceramic-armoring/">Ceramic Armoring™</a></nav></div>',
      '<div class="wc-dock-buttons"><button type="button" class="wc-dock-circle" id="wc-fixed-assist" aria-expanded="false" aria-controls="wc-dock-panel" title="Universo WINF" aria-label="Abrir opções WINF"><img src="/aerocore/assets/ghost-symbol.png" width="24" height="30" alt=""></button>',
      '<a id="wc-fixed-whatsapp" class="wc-dock-circle wc-dock-wa" href="#" target="_blank" rel="noopener noreferrer" title="Falar no WhatsApp" aria-label="Falar com a central WINF pelo WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.7 7.7L3 21l1.5-4.9A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M8.2 7.4c.3-.3.7-.2.8.1l1 2c.1.3 0 .5-.5 1 .7 1.5 1.7 2.5 3.2 3.2.5-.5.7-.9 1-.8l2 .9c.4.2.4.5.2.9-.4.9-1.1 1.3-2 1.1-3.7-.8-6.6-3.7-7.1-6.5-.1-.8.5-1.6 1.4-1.9Z"/></svg></a></div>'].join("");
    document.body.appendChild(dock);
    var panel=document.getElementById("wc-dock-panel"),trigger=document.getElementById("wc-fixed-assist");
    function toggle(value){panel.hidden=!value;trigger.setAttribute("aria-expanded",String(value));}
    trigger.addEventListener("click",function(){toggle(panel.hidden);});
    document.getElementById("wc-dock-close").addEventListener("click",function(){toggle(false);trigger.focus();});
    document.addEventListener("click",function(e){if(!panel.hidden&&!dock.contains(e.target))toggle(false);});
    updateDock();
  }
  function initDetail(){
    var overlay=document.createElement("section");overlay.id="wc-product-detail";overlay.className="wc-product-detail";overlay.hidden=true;
    overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-labelledby","wc-detail-title");
    document.body.appendChild(overlay);
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!overlay.hidden){e.preventDefault();closeProduct();}});
    window.addEventListener("popstate",function(){
      var id=new URLSearchParams(location.search).get("produto");
      if(id&&find(id))openProduct(id,false);
      else {overlay.hidden=true;document.body.classList.remove("wc-detail-open");selectedProduct=null;updateDock();}
    });
  }
  document.addEventListener("DOMContentLoaded",function(){
    var spectre=find("select-invisible-spectre");if(spectre){spectre.name="InfiSpectre™ by AeroCore™";spectre.line="aerocore";spectre.category="arch";}
    var film=find("select-blackpro");if(film&&film.specs&&film.specs.vlt==="70%"){film.specs.vlt="N/A";} // não apresentar como comprovado VLT inconsistente
    initDetail();
    // Link global compartilhável pode abrir diretamente uma das quatro marcas:
    // /catalogo/?territorio=santos-sp&marca=neoskin
    var params = new URLSearchParams(location.search);
    var initialBrand = (params.get("marca") || "").toLowerCase();
    window.setCategory(Object.prototype.hasOwnProperty.call(sections, initialBrand) ? initialBrand : "select");
    initSimulator();
    initDock();
    loadTerritories();
    var id=params.get("produto");
    if(id&&find(id)){
      var p=find(id);
      // A ficha enviada por link sempre prevalece sobre a aba, mantendo o território.
      window.setCategory(p.category==="arch"?"select":(Object.prototype.hasOwnProperty.call(sections,p.line)?p.line:"select"));
      openProduct(id,false);
    }
  });
})();
