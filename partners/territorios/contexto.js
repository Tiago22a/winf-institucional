(()=>{
 "use strict";
 const panel=document.querySelector("[data-territory-context]");
 if(!panel)return;
 const id=new URLSearchParams(location.search).get("territorio");
 if(!id||!/^[a-z0-9-]{3,90}$/.test(id))return;
 fetch("/config/winf-expansion-100-sp.json").then(r=>r.ok?r.json():Promise.reject()).then(j=>{
  const t=j.territorios.find(c=>c.id===id);
  if(!t)return;
  panel.hidden=false;
  const city=panel.querySelector("[data-territory-city]");
  if(city)city.textContent=t.municipio+" / "+t.uf;
  const status=panel.querySelector("[data-territory-status]");
  if(status)status.textContent="Território em avaliação. A situação comercial depende de confirmação da expansão.";
  const link=panel.querySelector("[data-territory-link]");
  if(link)link.href="/partners/territorios/?cidade="+encodeURIComponent(t.id);
  const next=panel.querySelector("[data-dark-link]");
  if(next)next.href="/partners/universo-dark/?territorio="+encodeURIComponent(t.id);
 }).catch(()=>{});
})();