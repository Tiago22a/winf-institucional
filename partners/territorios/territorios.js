
(() => {
  "use strict";
  const input=document.getElementById("city-query"), select=document.getElementById("region-select");
  const results=document.getElementById("results"), count=document.getElementById("result-count"), msg=document.getElementById("query-message"), more=document.getElementById("load-more");
  const geo=document.getElementById("use-location");
  const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
  let territories=[],shown=12;
  const labels={disponivel:["Disponível para candidatura","available"],em_validacao:["Em avaliação territorial","pending"],reservado:["Em reserva formal","reserved"],licenciado:["Licenciado · indisponível","licensed"]};
  function findExisting(city) {
    const source=[...(window.WINF_CIDADES||[]),...(window.WINF_PAGINAS_REGIONAIS||[]),...(window.WINF_UNIDADES_EXTRAS||[])];
    return source.find(c=>c.status==="ativa"&&normalize(c.cidade)===normalize(city));
  }
  function showExisting(city){
    const c=findExisting(city);if(!c)return false;
    const d=c.numero?.startsWith("5513")?"013":c.numero?.startsWith("5515")?"015":"WINF";
    msg.textContent=city+" possui atendimento operacional associado à Central "+d+". Isso não significa que exista licença territorial disponível.";
    results.replaceChildren();more.hidden=true;count.textContent="Cobertura regional própria";
    const a=el("a","action outline","Consultar unidades operacionais");a.href="/onde-comprar/";
    results.appendChild(a);return true;
  }
  function card(t) {
    const a=el("article","territory");
    a.append(el("small","",t.regiao));
    const st=labels[t.statusExclusividade]||labels.em_validacao;
    a.append(el("div","status "+st[1],st[0]));
    a.append(el("h3","",t.municipio+" / SP"));
    a.append(el("p","",t.aberturaInteresse?"Recebendo manifestações de interesse. Exclusividade e condições sujeitas à confirmação pela expansão.":"Consulte as condições de candidatura."));
    const link=el("a","","Ver ficha territorial");link.href="/partners/territorios/"+encodeURIComponent(t.id)+"/";a.append(link);
    return a;
  }
  function currentMatches(){
    const q=normalize(input.value),group=select.value;
    return territories.filter(t=>(!group||t.cluster===group)&&(!q||[t.municipio,t.regiao,...(t.aliases||[])].some(v=>normalize(v).includes(q))));
  }
  function render(){
    const q=normalize(input.value),a=currentMatches();results.replaceChildren();
    if(q&&!select.value&&!a.length&&showExisting(input.value.trim()))return;
    msg.textContent="";
    a.slice(0,shown).forEach(t=>results.appendChild(card(t)));
    count.textContent=a.length+" "+(a.length===1?"território encontrado":"territórios encontrados");
    document.getElementById("empty").hidden=a.length!==0;
    more.hidden=a.length<=shown;
  }
  input.addEventListener("input",()=>{shown=12;render();});
  select.addEventListener("change",()=>{shown=12;render();});
  more.addEventListener("click",()=>{shown+=12;render();});
  document.getElementById("clear-search").addEventListener("click",()=>{input.value="";select.value="";shown=12;render();input.focus();});
  geo.addEventListener("click",()=>{
    if(!navigator.geolocation){msg.textContent="Seu navegador não oferece localização. Digite o município.";return;}
    geo.disabled=true;msg.textContent="Solicitando autorização para identificar somente o município…";
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        // Consulta voluntária e única. Em produção de alto tráfego, substituir por geocodificador próprio.
        const u=new URL("https://nominatim.openstreetmap.org/reverse");
        u.searchParams.set("format","jsonv2");u.searchParams.set("zoom","10");u.searchParams.set("addressdetails","1");
        u.searchParams.set("lat",String(pos.coords.latitude));u.searchParams.set("lon",String(pos.coords.longitude));
        const res=await fetch(u,{headers:{"Accept":"application/json"}});
        if(!res.ok)throw Error("Serviço de localização indisponível");
        const json=await res.json(),addr=json.address||{};
        const city=addr.city||addr.town||addr.municipality||addr.village||"";
        if(!city)throw Error("Município não identificado");
        input.value=city;select.value="";shown=12;render();
        if(!currentMatches().length&&!findExisting(city))msg.textContent="Município identificado: "+city+". Ainda não consta nesta seleção de 100 territórios.";
      }catch(_){msg.textContent="Não foi possível identificar o município. Você pode digitá-lo manualmente.";}
      finally{geo.disabled=false;}
    },()=>{geo.disabled=false;msg.textContent="Localização não autorizada ou indisponível. Digite a cidade normalmente.";},{enableHighAccuracy:false,timeout:11000,maximumAge:0});
  });
  fetch("/config/winf-expansion-100-sp.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Cadastro indisponível");return r.json()}).then(data=>{
    territories=(data.territorios||[]).filter(t=>t.uf==="SP");if(territories.length!==100)throw Error("Cadastro incompleto");
    document.getElementById("territory-total").textContent=String(territories.length);
    const url=new URL(location.href),name=url.searchParams.get("cidade")||url.searchParams.get("territorio")||"";
    const found=territories.find(t=>t.id===name);
    input.value=found?found.municipio:name;
    render();
  }).catch(()=>{msg.textContent="A consulta está temporariamente indisponível. Tente novamente mais tarde.";count.textContent="Cadastro em manutenção";more.hidden=true;geo.disabled=true;});
})();
