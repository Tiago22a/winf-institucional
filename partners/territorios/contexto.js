(()=>{
"use strict";
const panel=document.querySelector("[data-territory-context]");if(!panel)return;
const id=new URLSearchParams(location.search).get("territorio");if(!id||!/^[a-z0-9-]{3,90}$/.test(id))return;
Promise.all(["/config/winf-expansion-100-sp.json","/config/winf-expansion-100-br.json"].map(u=>fetch(u).then(r=>r.ok?r.json():Promise.reject()))).then(values=>{
 const t=values.flatMap(j=>j.territorios||[]).find(c=>c.id===id);if(!t)return;panel.hidden=false;
 const city=panel.querySelector("[data-territory-city]");if(city)city.textContent=t.municipio+" / "+t.uf;
 const status=panel.querySelector("[data-territory-status]");if(status)status.textContent="Território em avaliação. A situação comercial depende de confirmação da expansão.";
 const link=panel.querySelector("[data-territory-link]");if(link)link.href="/partners/territorios/?cidade="+encodeURIComponent(t.id);
 const next=panel.querySelector("[data-dark-link]");if(next)next.href="/partners/universo-dark/?territorio="+encodeURIComponent(t.id);
}).catch(()=>{});
})();
