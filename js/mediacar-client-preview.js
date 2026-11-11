/* MediaCar™ / WINF Partners™ — apresentação comercial independente do editor.
 * Sem publicação em nuvem: gera uma prévia local e um HTML autossuficiente para envio.
 * O HTML não contém script e não permite alterar cotas comerciais.
 */
(function(){
"use strict";
var VIEWS={left:"Lateral esquerda",right:"Lateral direita",front:"Frente",back:"Traseira",roof:"Teto"};
function escapeHtml(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function short(v,len){return String(v==null?"":v).slice(0,len||120)}
function clamp(n,min,max){n=Number(n);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):min}
function currency(n){return (Number(n)||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}
function safeImage(source){
 if(typeof source!=="string")return "";
 if(/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(source)&&source.length<12000000)return source;
 if(/^\/media\/brands\/winf-logo-(?:horizontal|reduced)-official\.png$/.test(source))return source;
 if(/^\/media\/ecossistema\/mediacar-bmw\.webp$/.test(source))return source;
 return "";
}
function fileData(blob){
 return new Promise(function(resolve,reject){
  var reader=new FileReader();reader.onload=function(){resolve(String(reader.result||""))};
  reader.onerror=function(){reject(Error("Falha ao incorporar uma imagem."))};
  reader.readAsDataURL(blob);
 });
}
async function embedImage(input){
 var src=safeImage(input);
 if(!src)throw Error("Imagem não autorizada ou incompatível com esta apresentação.");
 if(src.startsWith("data:"))return src;
 var res=await fetch(src,{credentials:"same-origin",mode:"same-origin"});
 if(!res.ok)throw Error("Não foi possível incluir um arquivo de marca ou veículo.");
 var blob=await res.blob();
 if(!/^image\/(?:png|jpeg|webp)$/.test(blob.type)||blob.size>7000000)throw Error("Arquivo de imagem inválido ou muito grande.");
 return await fileData(blob);
}
function htmlStyle(){
 return '<style>'+
 '*{box-sizing:border-box}html{background:#090c10;color:#f3f5f6}body{margin:0;font:14px/1.5 Arial,Helvetica,sans-serif;background:radial-gradient(ellipse at 50% 0,#202b2d,#090c10 60%)}'+
 '.wrap{max-width:1200px;margin:auto;padding:clamp(16px,3vw,42px)}.top{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;border-bottom:1px solid #ffffff35;padding-bottom:22px}.brand{font-size:clamp(24px,4vw,40px);font-weight:900;letter-spacing:-.06em;font-style:italic}.brand span{color:#d9fc45}.small{color:#b5bdc6;font-size:11px;letter-spacing:.1em;text-transform:uppercase}.eyebrow{color:#dcfa89;font-size:11px;letter-spacing:.16em;font-weight:700;text-transform:uppercase;margin:0 0 13px}.hero{padding:38px 0 30px}.hero h1{font-size:clamp(30px,5vw,54px);letter-spacing:-.055em;line-height:1.08;margin:0 0 12px}.hero p{margin:0;color:#c4cbd1;font-size:15px;max-width:820px}.meta{display:flex;flex-wrap:wrap;gap:12px;margin-top:25px}.chip{border:1px solid #ffffff35;background:#171c22;border-radius:7px;padding:12px 15px;min-width:135px}.chip small{display:block;color:#afbac4;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.chip strong{font-size:23px;color:#e9ff97}.sectionHead{margin:28px 0 12px;display:flex;justify-content:space-between;align-items:end;gap:12px}.sectionHead h2{margin:0;font-size:23px;letter-spacing:-.035em}.view{margin:0 0 22px;background:#121820;border:1px solid #ffffff25;border-radius:10px;padding:clamp(10px,2vw,18px);break-inside:avoid}.viewHead{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 0 14px}.viewHead b{text-transform:uppercase;letter-spacing:.07em}.stage{position:relative;aspect-ratio:16/9;overflow:hidden;background:#20242d;border-radius:7px;border:1px solid #ffffff24}.stage>img{position:absolute;width:100%;height:100%;object-fit:contain;inset:0}.zone{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:3px;overflow:hidden;color:#fff;font-size:clamp(7px,1.55vw,13px);line-height:1.14;font-weight:800;letter-spacing:-.025em;text-shadow:0 1px 5px #000;background:#05080ab8;border:1px solid #ffffff95}.zone.official{border-style:solid}.zone.sponsor{border:1.5px dashed #d9fc45;background:#07120bbd}.zone.sponsor.sold{border-color:#33e78b;border-style:solid}.zone.sponsor.reserved{border-color:#f3d475}.zone img{max-width:95%;max-height:93%;object-fit:contain}.zone.n08{font-size:clamp(20px,4.5vw,68px);font-weight:900;letter-spacing:-.08em}.zone small{display:block;font:700 clamp(5px,.65vw,9px)/1.3 Arial,sans-serif;letter-spacing:.08em;margin-top:2px}.table{width:100%;border-collapse:collapse;border:1px solid #ffffff29;table-layout:fixed}.table th,.table td{border-bottom:1px solid #ffffff22;text-align:left;padding:11px 13px;overflow-wrap:anywhere}.table th{color:#d8fa8c;text-transform:uppercase;font-size:10px;letter-spacing:.07em;background:#171d25}.table td{color:#d5dce2}.green{color:#8af2b3}.yellow{color:#f7dd88}.footer{margin-top:32px;border-top:1px solid #ffffff30;padding-top:18px;color:#adb4bf;font-size:11px;line-height:1.7}.note{color:#aab1bb;font-size:11px;margin-top:9px}.empty{padding:24px;background:#1d2025;border-radius:8px;border:1px solid #ffffff35}.noscript{display:none}@media(max-width:640px){.wrap{padding:15px}.table th,.table td{padding:8px 5px;font-size:11px}.meta{gap:7px}.chip{min-width:calc(50% - 4px)}.zone{font-size:7px}.zone.n08{font-size:24px}}@media print{body{background:white;color:#10151a}.top,.hero,.view,.table{-webkit-print-color-adjust:exact;print-color-adjust:exact}.top{color:white;background:#10131c;padding:14px}.hero p,.small{color:#41494f}.chip{background:#f1f1f1;color:#111}.chip strong{color:#222}.view{break-inside:avoid}.footer{color:#333}'+
 '</style>';
}
function sanitizedSlots(raw){
 return (Array.isArray(raw)?raw:[]).filter(function(s){return s&&typeof s==="object"&&s.visible!==false&&(s.type==="official"||s.type==="sponsor")}).slice(0,80).map(function(s){
  var x=clamp(s.x,0,95),y=clamp(s.y,0,95),w=clamp(s.w,4,100-x),h=clamp(s.h,4,100-y);
  return{id:short(s.id,16),type:s.type,name:short(s.name,80),x:x,y:y,w:w,h:h,
    logo:safeImage(s.logo),status:["available","reserved","sold"].includes(s.status)?s.status:"available",price:clamp(s.price,0,100000000)};
 });
}
function getImageInput(source,view){
 if(!source||typeof source!=="object")return null;
 var v=source[view];
 if(!v||typeof v!=="object"||!v.src)return null;
 return{src:v.src,flip:!!v.flip};
}
async function prepareViews(state,source){
 var prepared=[],imageCache={};
 async function cached(src){
  if(!imageCache[src])imageCache[src]=embedImage(src);
  return imageCache[src];
 }
 for(var view of Object.keys(VIEWS)){
  var data=getImageInput(source,view);
  if(!data)continue;
  var base=await cached(data.src);
  var zones=[];
  for(var slot of sanitizedSlots(state.slots&&state.slots[view])){
   var logo=slot.logo;
   if(logo)try{logo=await cached(logo)}catch(e){logo="";}
   zones.push({...slot,logo:logo});
  }
  prepared.push({key:view,label:VIEWS[view],image:base,flip:data.flip,zones:zones});
 }
 if(!prepared.length)throw Error("Anexe ao menos uma imagem de veículo para preparar a apresentação.");
 return prepared;
}
function renderZones(zones){
 return zones.map(function(s){
  var style='left:'+s.x+'%;top:'+s.y+'%;width:'+s.w+'%;height:'+s.h+'%';
  var img=s.logo?'<img alt="" src="'+escapeHtml(s.logo)+'">':'<span>'+escapeHtml(s.name)+'</span>';
  var status=s.type==="sponsor"&&!s.logo?'<small>'+({available:"DISPONÍVEL",reserved:"RESERVADA",sold:"VENDIDA"}[s.status])+'</small>':'';
  return '<div class="zone '+s.type+' '+s.status+(s.id==="R08"?" n08":"")+'" style="'+style+'" title="'+escapeHtml(s.name)+'">'+img+status+'</div>';
 }).join("");
}
function renderRows(views){
 var rows=[];
 views.forEach(function(v){v.zones.filter(function(s){return s.type==="sponsor"}).forEach(function(s){
  var status={available:"Disponível",reserved:"Reservada",sold:"Vendida"}[s.status];
  rows.push('<tr><td>'+escapeHtml(v.label)+'</td><td>'+escapeHtml(s.name)+'</td><td>'+escapeHtml(status)+'</td><td>'+escapeHtml(s.price?currency(s.price):"A definir")+'</td></tr>');
 })});
 return rows.join("");
}
function renderViews(views){
 return views.map(function(v){
  return '<article class="view"><div class="viewHead"><b>'+escapeHtml(v.label)+'</b><span class="small">MEDIACAR™ / 08</span></div><div class="stage"><img alt="Veículo MediaCar visto de '+escapeHtml(v.label)+'" src="'+escapeHtml(v.image)+'"'+(v.flip?' style="transform:scaleX(-1)"':'')+'>'+renderZones(v.zones)+'</div><div class="note">Prévia de posicionamento; conferir proporções reais antes de produzir adesivos.</div></article>';
 }).join("");
}
async function build(state,source){
 if(!state||typeof state!=="object")throw Error("O projeto não foi encontrado.");
 var views=await prepareViews(state,source);
 var commercial=views.flatMap(function(v){return v.zones.filter(function(s){return s.type==="sponsor"})});
 var num=function(status){return commercial.filter(function(s){return s.status===status}).length};
 var identity=escapeHtml(short(state.licenseName||"Operação MediaCar™",100));
 var city=escapeHtml(short(state.city||"Território a definir",100));
 var model=escapeHtml(short(state.vehicle||"Veículo MediaCar™",100));
 var title="MediaCar™ 08 — apresentação comercial";
 var counts='<div class="meta">'+
  '<div class="chip"><small>Áreas disponíveis</small><strong>'+num("available")+'</strong></div>'+
  '<div class="chip"><small>Reservadas</small><strong>'+num("reserved")+'</strong></div>'+
  '<div class="chip"><small>Áreas vendidas</small><strong>'+num("sold")+'</strong></div>'+
  '<div class="chip"><small>Vistas do veículo</small><strong>'+views.length+'</strong></div></div>';
 var html='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="robots" content="noindex,nofollow"><title>'+escapeHtml(title)+'</title>'+htmlStyle()+'</head><body><div class="wrap">'+
 '<header class="top"><strong class="brand">MEDIA<span>CAR™</span> <span>08</span></strong><span class="small">UMA OPERAÇÃO WINF PARTNERS™</span></header>'+
 '<section class="hero"><p class="eyebrow">Apresentação comercial / mídias sobre rodas</p><h1>'+identity+'<br><span style="color:#d9fc45">'+city+'</span></h1><p>'+model+' — veja as áreas de mídia comercial disponíveis nesta configuração. A ocupação retratada é uma simulação salva pelo licenciado, não uma confirmação de venda ou reserva no sistema central.</p>'+counts+'</section>'+
 '<div class="sectionHead"><h2>Projeto visual do veículo</h2><span class="small">WINF • AEROCORE • NEOSKIN • CERAMIC ARMORING • 08</span></div>'+
 renderViews(views)+
 '<div class="sectionHead"><h2>Inventário de cotas</h2><span class="small">Mensalidades indicativas / por área e vista</span></div>'+
 '<table class="table"><thead><tr><th>Vista</th><th>Espaço</th><th>Situação</th><th>Mensalidade</th></tr></thead><tbody>'+renderRows(views)+'</tbody></table>'+
 '<footer class="footer"><strong>MEDIACAR™ BY WINF PARTNERS™ — Nº 08</strong><p>Apresentação estática gerada pelo licenciado. Para atualizar cotas, exporte novamente pelo Studio. Este arquivo não possui acesso ao WINF OS™, não recebe pagamentos e não confirma contratos. Arte conceitual: as medidas, autorizações de marcas, normas aplicáveis e layout final de envelopamento devem ser validados previamente.</p></footer></div></body></html>';
 return html;
}
function fileName(state){
 var name=String(state.city||state.licenseName||"projeto").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").slice(0,45).toLowerCase();
 return "mediacar-08-"+(name||"projeto")+"-apresentacao.html";
}
function download(html,state){
 var blob=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob);
 var a=document.createElement("a");a.href=url;a.download=fileName(state);document.body.appendChild(a);a.click();a.remove();
 setTimeout(function(){URL.revokeObjectURL(url)},5000);
}
function ensureDialog(){
 var modal=document.getElementById("mcClientDialog");
 if(!modal)throw Error("A prévia comercial não está disponível.");
 return modal;
}
async function show(state,images){
 var modal=ensureDialog(),frame=document.getElementById("mcClientFrame"),note=document.getElementById("mcPreviewNote");
 if(!frame||!note)throw Error("Janela de apresentação incompleta.");
 note.textContent="Preparando as imagens e as cotas do projeto…";
 var html=await build(state,images);
 frame.srcdoc=html;
 note.textContent="Esta prévia representa o projeto no momento da abertura. Compartilhamento ao vivo requer o WINF OS™.";
 if(!modal.open)modal.showModal();
}
async function exportHtml(state,images){
 var html=await build(state,images);
 download(html,state);
}
window.MediacarPresentation={show:show,exportHtml:exportHtml};
})();
