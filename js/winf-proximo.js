(()=>{"use strict";
const input=document.getElementById("localizador-cidade"),select=document.getElementById("localizador-uf"),form=document.getElementById("localizador-form"),gps=document.getElementById("localizador-gps"),choices=document.getElementById("localizador-sugestoes"),output=document.getElementById("localizador-resultado");
if(!input||!select||!form||!gps||!choices||!output)return;
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const R=6371.0088,rad=Math.PI/180;
const dist=(lat,lon,tlat,tlon)=>{const a=Math.sin((tlat-lat)*rad/2)**2+Math.cos(lat*rad)*Math.cos(tlat*rad)*Math.sin((tlon-lon)*rad/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(a)));};
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n;};
let index=null;
const msg=text=>output.replaceChildren(el("p","note",text));
function find(q){if(!index)return[];const term=norm(q);if(term.length<2)return[];const uf=select.value;return index.cities.filter(c=>(!uf||c[2]===uf)&&norm(c[1]).includes(term)).sort((a,b)=>{const an=norm(a[1]),bn=norm(b[1]);return Number(bn===term)-Number(an===term)||an.length-bn.length||an.localeCompare(bn);}).slice(0,12);}
function choose(c){input.value=c[1];select.value=c[2];choices.replaceChildren();const url=new URL(location.href);url.searchParams.set("cidade",c[0]);history.replaceState(null,"",url);show(c,c[3],c[4],false);}
function show(c,lat,lon,fromGps){if(!index)return;let names=fromGps?index.hubs.map((h,i)=>i).sort((a,b)=>dist(lat,lon,index.hubs[a][3],index.hubs[a][4])-dist(lat,lon,index.hubs[b][3],index.hubs[b][4])).slice(0,3):c.slice(5,8);
output.replaceChildren();
const header=el("h3","",fromGps?"Territórios mais próximos das coordenadas autorizadas":"Territórios de referência para "+c[1]+"/"+c[2]);output.append(header);
const note=el("p","note","Distância estimada em linha reta entre coordenadas municipais, sem equivalência com percurso viário ou disponibilidade de equipe.");output.append(note);
const cards=el("div","result-list","");
names.forEach((idx,n)=>{const h=index.hubs[idx],km=dist(lat,lon,h[3],h[4]),card=el("article","result-card","");
card.append(el("small","",n===0?"01 / TERRITÓRIO MAIS PRÓXIMO":String(n+1).padStart(2,"0")+" / OUTRA OPÇÃO"),el("strong","",h[1]+" / "+h[2]),el("span","km",km.toFixed(1)+" km"),el("small","","WINF Asset Light™ · Turnkey · atendimento digital"));
const a=el("a","", "VER SITE DO TERRITÓRIO ↗");a.href="/winf-select/cidades/"+encodeURIComponent(h[0])+"/";card.append(a);cards.append(card);});
output.append(cards);
if(!fromGps){
const region=index.regional.find(x=>x[0]===c[0]);
if(region){const div=el("div","regional","");div.append(el("strong","","Essa cidade também possui cobertura comercial regional: "+region[1]+"/"+region[2]+"."));
div.append(el("p","note","Central "+(region[6]==="5515997909049"?"015":"013")+"; confirme a equipe técnica e a agenda pelo contato regional."));
const a=el("a","regional-link","VER PÁGINA DE ATENDIMENTO ↗");a.href=region[5];div.append(a);const w=el("a","regional-link","WHATSAPP REGIONAL ↗");w.href="https://wa.me/"+region[6]+"?text="+encodeURIComponent("Olá! Sou de "+c[1]+"/"+c[2]+" e gostaria de consultar atendimento WINF Select.");w.target="_blank";w.rel="noopener noreferrer";div.append(w);output.append(div);}
}
const phone="5513981113001",id=names.length?index.hubs[names[0]][0]:"",origin=fromGps?"localização autorizada":c[1]+"/"+c[2];
const wa=el("a","whatsapp","CONSULTAR A CENTRAL WINF 013 ↗");wa.href="https://wa.me/"+phone+"?text="+encodeURIComponent("Olá! Vim do localizador WINF Select. Minha localidade: "+origin+". Território próximo: "+id+". Gostaria de confirmar disponibilidade de atendimento e encaminhamento de instalador.");wa.target="_blank";wa.rel="noopener noreferrer";output.append(wa);
}
function suggestions(){choices.replaceChildren();for(const c of find(input.value)){const b=el("button","choice",c[1]+" / "+c[2]);b.type="button";b.addEventListener("click",()=>choose(c));choices.append(b);}}
input.addEventListener("input",suggestions);select.addEventListener("change",suggestions);
form.addEventListener("submit",e=>{e.preventDefault();const matches=find(input.value);if(!matches.length){msg("Não encontrei a cidade. Confira a grafia e selecione a UF.");return;}if(matches.length>1&&norm(matches[0][1])!==norm(input.value)&&!select.value){msg("Escolha um município nas sugestões ou selecione a UF.");return;}choose(matches[0]);});
gps.addEventListener("click",()=>{if(!navigator.geolocation){msg("Seu navegador não permite geolocalização. Use a busca por município.");return;}
gps.disabled=true;gps.textContent="CONSULTANDO LOCALIZAÇÃO…";
navigator.geolocation.getCurrentPosition(p=>{gps.disabled=false;gps.textContent="USAR MINHA LOCALIZAÇÃO ⌖";choices.replaceChildren();show(null,p.coords.latitude,p.coords.longitude,true);},()=>{gps.disabled=false;gps.textContent="USAR MINHA LOCALIZAÇÃO ⌖";msg("Não foi possível obter a localização. Pesquise seu município manualmente.");},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});});
fetch("/config/winf-proximidade-brasil.json",{cache:"force-cache"}).then(r=>{if(!r.ok)throw Error("Base não encontrada");return r.json();}).then(d=>{
if(d.count!==5571||d.hubsCount!==200||d.cities.length!==5571)throw Error("Base incompleta");index=d;
for(const s of d.states){const o=document.createElement("option");o.value=s[0];o.textContent=s[1]+" / "+s[0];select.append(o);}
const q=new URLSearchParams(location.search).get("cidade");if(q){const city=d.cities.find(x=>x[0]===q);if(city)choose(city);}
}).catch(()=>msg("O diretório de cidades está temporariamente indisponível. Consulte a Central WINF pelo WhatsApp (13) 98111-3001."));
})();