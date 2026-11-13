(()=>{
"use strict";
const holder=document.getElementById("territory-map"),status=document.getElementById("map-status"),scope=document.getElementById("scope-select");
if(!holder)return;
if(typeof L==="undefined"){holder.textContent="Mapa interativo indisponível. Utilize a lista de 200 municípios acima.";return;}
const map=L.map(holder,{scrollWheelZoom:false}).setView([-15.5,-51.8],4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',maxZoom:17}).addTo(map);
const groups={SP:L.layerGroup(),BR:L.layerGroup()},esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
function sync(){const val=scope?.value||"";for(const key of ["SP","BR"]){if(!val||val===key){if(!map.hasLayer(groups[key]))groups[key].addTo(map);}else if(map.hasLayer(groups[key]))map.removeLayer(groups[key]);}
map.setView(val==="SP"?[-22.9,-48]:[-15.5,-51.8],val==="SP"?7:4);}
fetch("/config/winf-expansion-map.json",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{
if(data.total!==200||data.territorios.length!==200)throw Error("mapa incompleto");holder.replaceChildren();
for(const item of data.territorios){
 const key=item.uf==="SP"?"SP":"BR",color=key==="SP"?"#80b5f1":"#e6ae69";
 const point=L.circleMarker([item.latitude,item.longitude],{radius:5,color,weight:1,fillColor:color,fillOpacity:.65});
 const area=(item.bairrosParaValidar||[]).slice(0,3).map(esc).join(", ");
 point.bindPopup('<strong>'+esc(item.municipio)+' / '+esc(item.uf)+'</strong><br>'+esc(key==="SP"?"Expansão Estado de São Paulo":"Expansão Brasil")+'<br>Exclusividade em avaliação'+(area?'<br>Bairros em pesquisa: '+area:"")+'<br><a href="'+esc(item.url)+'">Abrir ficha territorial ↗</a>');
 point.addTo(groups[key]);
}
L.control.layers(null,{"Expansão São Paulo · 100":groups.SP,"Expansão Brasil · 100":groups.BR},{collapsed:false}).addTo(map);sync();
status.textContent="200 referências municipais carregadas. Pontos aproximados, não endereços de unidades. © OpenStreetMap contributors.";
window.addEventListener("winf:scope",sync);
}).catch(()=>{holder.textContent="Mapa temporariamente indisponível. As 200 fichas permanecem na lista.";status.textContent="Não foi possível carregar os pontos geográficos.";});
})();
