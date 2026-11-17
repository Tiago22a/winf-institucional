/* Consulta pública dos 200 territórios comerciais WINF Select.
 * Não expõe centrais internas ou credenciamento e não inventa loja, licença ou equipe.
 */
(()=>{
 "use strict";
 const root=document.getElementById("winf-turnkey-consumer");
 if(!root)return;
 const input=root.querySelector("#turnkey-city-search");
 const list=root.querySelector("#turnkey-city-results");
 const counter=root.querySelector("#turnkey-city-count");
 const more=root.querySelector("#turnkey-city-more");
 const normalize=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 let cities=[],limit=24;
 function render(){
  const q=normalize(input.value).trim();
  const filtered=cities.filter(t=>normalize(t.cidade+" "+t.uf).includes(q));
  const part=filtered.slice(0,limit);
  list.replaceChildren();
  for(const city of part){
    const li=document.createElement("li");li.className="turnkey-city-card";
    const title=document.createElement("strong");title.textContent=city.cidade+" / "+city.uf;
    const link=document.createElement("a");
    const msg="Olá! Estou em "+city.cidade+"/"+city.uf+" e gostaria de solicitar atendimento WINF para películas arquitetônicas. Podem confirmar a disponibilidade e as condições para minha cidade?";
    // Até o contrato, identidade e canal do licenciado serem validados no backend,
    // o atendimento público dos 200 territórios usa exclusivamente o número central.
    const phone="5513981113001";
    link.href="https://wa.me/"+phone+"?text="+encodeURIComponent(msg);
    link.target="_blank";link.rel="noopener noreferrer";
    link.textContent="Consultar atendimento ↗";
    li.append(title,link);list.append(li);
  }
  counter.textContent=filtered.length+" territórios encontrados";
  more.hidden=filtered.length<=limit;
 }
 input.addEventListener("input",()=>{limit=24;render()});
 more.addEventListener("click",()=>{limit+=24;render()});
 fetch("/config/winf-territorios-consumidor-200.json",{cache:"no-store"})
  .then(r=>{if(!r.ok)throw Error("Cadastro indisponível");return r.json()})
  .then(data=>{
    if(!Array.isArray(data.territories)||data.territories.length!==200 ||
      new Set(data.territories.map(t=>t.id)).size!==200 ||
      data.territories.filter(t=>t.uf==="SP").length!==100 ||
      data.whatsapp!=="5513981113001" ||
      data.territories.some(t=>typeof t.id!=="string"||!/^[a-z0-9]+(?:-[a-z0-9]+)*-[a-z]{2}$/.test(t.id) ||
      typeof t.cidade!=="string"||!t.cidade.trim()||!/^[A-Z]{2}$/.test(t.uf)))
      throw Error("Cadastro incompleto ou não validado");
    cities=data.territories.filter(t=>typeof t.cidade==="string"&&typeof t.uf==="string");
    render();
  }).catch(()=>{counter.textContent="Consulta temporariamente indisponível.";list.replaceChildren();
   const item=document.createElement("li");item.textContent="Entre em contato com a WINF pelo WhatsApp oficial: +55 13 98111-3001.";list.append(item);
  });
})();
