"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const studio=read("partners/carro-midia/index.html");
const preview=read("js/mediacar-client-preview.js");
const tiny="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7aM4EAAAAASUVORK5CYII=";
function previewAPI(){
 const ctx={window:{}};
 const injectable=preview.replace("window.MediacarPresentation={show:show,exportHtml:exportHtml};","window.MediacarPresentation={show:show,exportHtml:exportHtml,build:build};");
 vm.runInNewContext(injectable,ctx,{timeout:1000});
 return ctx.window.MediacarPresentation;
}
function fixture(){
 return {
  state:{
   licenseName:"WINF Select — Santos",city:"Santos / SP",vehicle:"BMW M4",
   slots:{
    left:[
     {type:"official",id:"R08",name:"08",x:55,y:53,w:13,h:20,visible:true},
     {type:"official",id:"W0",name:"WINF™",x:34,y:61,w:16,h:9,visible:true,logo:tiny},
     {type:"sponsor",id:"A1",name:"COTA A1",x:14,y:61,w:17,h:12,visible:true,status:"available",price:600},
     {type:"sponsor",id:"A2",name:"COTA A2",x:70,y:57,w:17,h:12,visible:true,status:"sold",price:1200,logo:tiny},
     {type:"sponsor",id:"A3",name:"COTA A3",x:80,y:68,w:13,h:9,visible:true,status:"reserved",price:800}
    ]
   }
  },
  images:{left:{src:tiny,flip:false}}
 };
}
test("MediaCar: prévia é independente, preserva a identidade e não altera o editor",()=>{
 assert.doesNotThrow(()=>new Function(preview));
 for(const id of ["mcClientPreview","mcClientExport","mcClientDialog","mcClientFrame","mcClientClose"]){
  assert.match(studio,new RegExp('id="'+id+'"'),id);
 }
 assert.match(studio,/\/js\/mediacar-client-preview\.js/);
 assert.match(studio,/\/css\/mediacar-client-preview\.css/);
 assert.match(studio,/function presentationImages/);
 assert.match(studio,/window\.MediacarPresentation\.show/);
 assert.match(studio,/window\.MediacarPresentation\.exportHtml/);
 assert.match(studio,/iframe id="mcClientFrame"[^>]+sandbox=""/);
});
test("Apresentação estática contém imagem, cotas, território e número 08 sem controles",async()=>{
 const api=previewAPI(),f=fixture();
 const html=await api.build(f.state,f.images);
 for(const value of ["Santos / SP","WINF Select","BMW M4","MediaCar","08","COTA A1","COTA A2","COTA A3","Disponível","Reservada","Vendida","R$"]){
  assert.ok(html.includes(value),"Falta "+value);
 }
 assert.match(html,/src="data:image\/png;base64,/);
 assert.match(html,/<!doctype html>/i);
 assert.doesNotMatch(html,/<script|<input|<button|onclick=/i);
 assert.doesNotMatch(html,/id="slotEditor"|indexedDB|localStorage/);
 assert.doesNotMatch(html,/https?:\/\//);
});
test("Apresentação sanitiza textos e URLs, impedindo injeção em HTML compartilhado",async()=>{
 const api=previewAPI(),f=fixture();
 f.state.licenseName='<img src=x onerror="alert(1)">';
 f.state.slots.left[2].name='<script>alert("x")</script>';
 f.state.slots.left[3].logo='javascript:alert(1)';
 const html=await api.build(f.state,f.images);
 assert.match(html,/&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);
 assert.match(html,/&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
 assert.doesNotMatch(html,/<script|onerror=("|')/);
 assert.doesNotMatch(html,/javascript:/);
});
test("Apresentação não cria um veículo inexistente e não aceita URL remota",async()=>{
 const api=previewAPI(),f=fixture();
 await assert.rejects(api.build(f.state,{}),/Anexe ao menos uma imagem/);
 await assert.rejects(api.build(f.state,{left:{src:"https://example.com/car.png"}}),/Imagem não autorizada/);
});
