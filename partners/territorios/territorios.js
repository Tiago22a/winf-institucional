(() => {
  "use strict";
  const input=document.getElementById("city-query");
  const region=document.getElementById("region-select"), center=document.getElementById("central-select"),scope=document.getElementById("scope-select");
  const results=document.getElementById("results"),brResults=document.getElementById("br-results"),count=document.getElementById("result-count"),spCount=document.getElementById("sp-count"),brCount=document.getElementById("br-count");
  const covered=document.getElementById("coverage-results"), coveredCount=document.getElementById("coverage-count");
  const msg=document.getElementById("query-message"),more=document.getElementById("load-more"),brMore=document.getElementById("br-more"),coveredMore=document.getElementById("coverage-more");
  const geo=document.getElementById("use-location"),empty=document.getElementById("empty");
  const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  const labels={
    disponivel:["Disponível para candidatura","available"],
    em_validacao:["Em avaliação territorial","pending"],
    reservado:["Em reserva formal","reserved"],
    licenciado:["Licenciado · indisponível","licensed"]
  };
  const activeEntries=[...(window.WINF_CIDADES||[]),...(window.WINF_UNIDADES_EXTRAS||[]),...(window.WINF_PAGINAS_REGIONAIS||[])];
  const coverage=[...new Map(activeEntries.filter(c=>c.exemplo===false&&c.status==="ativa"&&c.uf==="SP"&&["5513981113001","5515997909049"].includes(c.numero)).map(c=>[c.id,c])).values()];
  let territories=[],shown=12,shownBr=12,shownCoverage=6,loaded=false;
  const ddd=c=>c.numero==="5513981113001"?"013":"015";
  const filteredCoverage=()=>{
    const q=normalize(input.value),filter=center.value;
    return coverage.filter(c=>(!filter||ddd(c)===filter)&&(!q||normalize(c.cidade).includes(q)));
  };
  const filteredExpansion=()=>{
    const q=normalize(input.value),group=region.value,where=scope.value;
    return territories.filter(t=>(!where||(where==="SP"?t.uf==="SP":t.uf!=="SP"))&&
      (!group||(t.uf==="SP"?t.cluster===group:"Brasil-"+t.macroRegiao===group))&&
      (!q||[t.municipio,t.uf,t.regiao,...(t.aliases||[]),...(t.bairrosParaValidar||[])].some(v=>normalize(v).includes(q))));
  };
  const link=(text,href)=>{const a=el("a","",text);a.href=href;return a;};
  const card=(t)=>{
    const a=el("article","territory");
    a.append(el("small","",(t.uf==="SP"?"EXPANSÃO ESTADO DE SÃO PAULO":"EXPANSÃO BRASIL / "+t.macroRegiao)+" · "+t.regiao));
    const st=labels[t.statusExclusividade]||labels.em_validacao;
    a.append(el("div","status "+st[1],st[0]));
    a.append(el("h3","",t.municipio+" / "+t.uf));
    a.append(el("p","",t.aberturaInteresse?
      "Recebendo manifestações de interesse. Exclusividade e condições sujeitas à confirmação pela expansão.":
      "Consulte as condições de candidatura."));
    if(t.bairrosParaValidar?.length)a.append(el("p","neighborhood-hint","Bairros em pesquisa: "+t.bairrosParaValidar.slice(0,3).join(", ")+". "));
    a.append(link("Ver ficha territorial ↗","/partners/territorios/"+encodeURIComponent(t.id)+"/"));
    a.append(el("span","territory-detail-divider"," · "));
    a.append(link("Site WINF Select™ ↗","/winf-select/cidades/"+encodeURIComponent(t.id)+"/"));
    return a;
  };
  const coverageCard=(c)=>{
    const a=el("article","territory coverage");
    a.append(el("small","","WINF SELECT™ / CENTRAL "+ddd(c)));
    a.append(el("div","status active","Atendimento regional ativo"));
    a.append(el("h3","",c.cidade+" / SP"));
    a.append(el("p","",
      "Solicitações atendidas pela Central "+ddd(c)+". A agenda por município, a instalação e a capacidade dos profissionais dependem de confirmação operacional."));
    const links=el("div","city-links");
    if(c.url&&c.url.startsWith("/"))links.append(link("Página da cidade ↗",c.url));
    const text="Olá! Estou em "+c.cidade+"/SP e desejo atendimento WINF Select™ para películas arquitetônicas. Origem: vitrine territorial. Cidade: "+c.cidade+". Código WINF: "+c.id+".";
    const wa=link("WhatsApp Central "+ddd(c)+" ↗","https://wa.me/"+c.numero+"?text="+encodeURIComponent(text));
    wa.target="_blank";wa.rel="noopener noreferrer";
    links.append(wa);
    if(c.instagram&&/^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?$/.test(c.instagram)){
      const insta=link("Instagram da cidade ↗",c.instagram);insta.target="_blank";insta.rel="noopener noreferrer";links.append(insta);
    }
    a.append(links);
    a.append(el("p","operations-note","Agenda municipal: vinculada à Central "+ddd(c)+". Instaladores e horários: verificação interna, não disponibilidade anunciada."));
    return a;
  };
  function render(){
    const active=filteredCoverage(),exp=filteredExpansion(),sp=exp.filter(t=>t.uf==="SP"),br=exp.filter(t=>t.uf!=="SP");
    covered.replaceChildren();results.replaceChildren();brResults.replaceChildren();
    active.slice(0,shownCoverage).forEach(c=>covered.append(coverageCard(c)));
    sp.slice(0,shown).forEach(t=>results.append(card(t)));
    br.slice(0,shownBr).forEach(t=>brResults.append(card(t)));
    coveredCount.textContent=active.length+" "+(active.length===1?"cidade com atendimento regional":"cidades com atendimento regional");
    count.textContent=loaded?exp.length+" "+(exp.length===1?"território selecionado":"territórios selecionados"):"Carregando 200 municípios…";
    spCount.textContent=sp.length+" municípios de SP encontrados";
    brCount.textContent=br.length+" municípios fora de SP encontrados";
    document.getElementById("coverage-total").textContent=String(coverage.length);
    document.getElementById("territory-total").textContent=loaded?String(territories.length):"…";
    document.getElementById("territory-sp-total").textContent=loaded?String(territories.filter(t=>t.uf==="SP").length):"…";
    document.getElementById("territory-br-total").textContent=loaded?String(territories.filter(t=>t.uf!=="SP").length):"…";
    coveredMore.hidden=active.length<=6;coveredMore.textContent=shownCoverage>6?"VER MENOS CIDADES ↑":"VER MAIS CIDADES ↓";
    more.hidden=sp.length<=12;more.textContent=shown>12?"VER MENOS SÃO PAULO ↑":"VER MAIS SÃO PAULO ↓";
    brMore.hidden=br.length<=12;brMore.textContent=shownBr>12?"VER MENOS BRASIL ↑":"VER MAIS BRASIL ↓";
    document.getElementById("expansao-sp").hidden=scope.value==="BR";
    document.getElementById("expansao-br").hidden=scope.value==="SP";
    empty.hidden=!loaded||active.length+exp.length!==0;
    msg.textContent=loaded&&normalize(input.value)&&active.length+exp.length===0?"Município não cadastrado nas seleções nem na cobertura regional. Consulte a expansão WINF.":"";
    window.dispatchEvent(new CustomEvent("winf:scope",{detail:{scope:scope.value}}));
  }
  const resetPaging=()=>{shown=12;shownBr=12;shownCoverage=6;render();};
  input.addEventListener("input",resetPaging);
  region.addEventListener("change",resetPaging);
  scope.addEventListener("change",()=>{region.value="";resetPaging();});
  center.addEventListener("change",resetPaging);
  more.addEventListener("click",()=>{shown=shown>12?12:100;render();});
  brMore.addEventListener("click",()=>{shownBr=shownBr>12?12:100;render();});
  coveredMore.addEventListener("click",()=>{shownCoverage=shownCoverage>6?6:coverage.length;render();});
  document.getElementById("clear-search").addEventListener("click",()=>{
    input.value="";center.value="";region.value="";scope.value="";resetPaging();input.focus();
  });
  document.querySelectorAll("[data-select-center]").forEach(a=>{
    a.addEventListener("click",()=>{center.value=a.dataset.selectCenter;shownCoverage=6;render();});
  });
  geo.addEventListener("click",()=>{
    if(!navigator.geolocation){msg.textContent="Seu navegador não oferece localização. Digite o município.";return;}
    geo.disabled=true;msg.textContent="Solicitando autorização para identificar seu município…";
    navigator.geolocation.getCurrentPosition(async position=>{
      try{
        // Dados enviados uma vez ao OpenStreetMap após permissão. Produção deve usar geocodificador com SLA.
        const url=new URL("https://nominatim.openstreetmap.org/reverse");
        url.searchParams.set("format","jsonv2");url.searchParams.set("zoom","10");url.searchParams.set("addressdetails","1");
        url.searchParams.set("lat",String(position.coords.latitude));url.searchParams.set("lon",String(position.coords.longitude));
        const response=await fetch(url,{headers:{"Accept":"application/json"}});
        if(!response.ok)throw Error("geocodificação indisponível");
        const data=await response.json(),addr=data.address||{};
        const city=addr.city||addr.town||addr.municipality||addr.village||"";
        if(!city)throw Error("cidade desconhecida");
        input.value=city;center.value="";region.value="";resetPaging();
      }catch(_){msg.textContent="Não foi possível identificar seu município. Digite a cidade normalmente.";}
      finally{geo.disabled=false;}
    },()=>{geo.disabled=false;msg.textContent="Localização não autorizada ou indisponível. Digite a cidade normalmente.";},
      {enableHighAccuracy:false,timeout:11000,maximumAge:0});
  });
  const params=new URL(location.href).searchParams,initial=params.get("cidade")||params.get("territorio")||"";
  const central=params.get("central");
  if(central==="013"||central==="015")center.value=central;
  if(initial){const a=coverage.find(c=>c.id===initial);input.value=a?a.cidade:initial;}
  render();
  Promise.all(["/config/winf-expansion-100-sp.json","/config/winf-expansion-100-br.json"].map(u=>fetch(u,{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()))).then(([s,b])=>{
    const local=(s.territorios||[]).filter(t=>t.uf==="SP"),nacional=(b.territorios||[]).filter(t=>t.uf!=="SP");
    if(local.length!==100||nacional.length!==100)throw Error("Cadastro 200 incompleto");
    territories=[...local,...nacional];loaded=true;
    const t=territories.find(x=>x.id===initial);if(t){input.value=t.municipio;scope.value=t.uf==="SP"?"SP":"BR";}
    render();
  }).catch(()=>{loaded=false;count.textContent="Expansão temporariamente indisponível";more.hidden=true;brMore.hidden=true;msg.textContent="Cadastro de expansão indisponível; o atendimento 013/015 continua na lista.";});
})();
