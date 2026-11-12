"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const studio=read("partners/carro-midia/studio/360/index.html");
const institutional=read("mediacar/index.html");
const openTag="<script>",closeTag="</script>";
const scriptStart=studio.lastIndexOf(openTag);
const scriptEnd=studio.indexOf(closeTag,scriptStart);
const code=studio.slice(scriptStart+openTag.length,scriptEnd);
test("Studio V2: JS executa sem erro de sintaxe e conserva funções preexistentes",()=>{
 assert.ok(scriptStart>=0&&scriptEnd>scriptStart);
 assert.doesNotThrow(()=>new Function(code));
 for(const id of ["photoInput","addSlot","saveProject","loadProject","exportJpg","printProposal","slotEditor","viewTabs","zones","copySummary","resetProject"]){
  assert.match(studio,new RegExp('id="'+id+'"'),"Controle ausente: "+id);
 }
 assert.doesNotMatch(institutional,/<iframe\b/i);
});
test("Galeria V2: seis veículos e referências conceituais não homologadas",()=>{
 assert.equal((studio.match(/class="mc-model"/g)||[]).length,6);
 for(const val of ["bmw","porsche","volvo","mustang","sprinter","custom"])assert.match(studio,new RegExp('data-mc-model="'+val+'"'));
 assert.match(studio,/\/css\/mediacar-studio-v2\.css/);
 assert.match(studio,/NÚMERO 08|08/);
 assert.match(studio,/ANEXAR IMAGENS/);
 assert.match(studio,/Conceito ilustrado · anexe vistas aprovadas/);
 assert.ok(!studio.includes("asset-light-mobilidade-2026.webp"));
});
test("Marca oficial original e fotografia MediaCar existem",()=>{
 for(const filename of ["media/brands/winf-logo-horizontal-official.png","media/brands/winf-logo-reduced-official.png","media/ecossistema/mediacar-bmw.webp"]){
  assert.ok(fs.statSync(path.join(root,filename)).size>1000,filename);
 }
 assert.match(studio,/\/media\/brands\/winf-logo-horizontal-official\.png/);
 assert.doesNotMatch(studio,/\/briefing\/media\/asset-light/);
});
test("Nº 08 e quatro identidades permanentes são protegidos",()=>{
 const start=code.indexOf("var MC_MODELS="),end=code.indexOf("var state=seed()",start);
 assert.ok(start>=0&&end>start);
 const keys=["left","right","front","back","roof"];
 const labels={left:"Lateral esquerda",right:"Lateral direita",front:"Frente",back:"Traseira",roof:"Teto"};
 const ctx=vm.runInNewContext(code.slice(start,end)+";({seed:seed,upgradeState:upgradeState})",{keys,labels});
 const sample=ctx.seed();
 for(const view of keys){
  const brand=sample.slots[view].filter(s=>s.type==="official");
  assert.equal(brand.length,6);
  assert.ok(brand.some(s=>s.id==="R08"&&s.name==="08"));
  for(const name of ["WINF™","AEROCORE™","NEOSKIN™","CERAMIC ARMORING™"])assert.ok(brand.some(s=>s.name===name),name);
  assert.ok(sample.slots[view].some(s=>s.type==="sponsor"&&s.status==="available"));
 }
 const old={version:1,photos:{left:null,right:null,front:null,back:null,roof:null},slots:{left:[{id:"W1",type:"official",name:"WINF SELECT™"},{id:"A1",type:"sponsor",name:"COTA A1",x:10,y:20,w:30,h:15}],right:[],front:[],back:[],roof:[]}};
 const updated=ctx.upgradeState(old);
 assert.equal(updated.model,"bmw");
 assert.ok(updated.slots.left.some(s=>s.type==="sponsor"&&s.name==="COTA A1"));
 assert.ok(!updated.slots.left.some(s=>s.name==="WINF SELECT™"&&s.type==="official"));
 assert.match(code,/if\(slot\.type==="official"\)\{/);
 assert.match(code,/if\(isOfficial\)return/);
 assert.match(code,/\$\("slotVisible"\)\.disabled=isOfficial/);
});
test("Projetos de vários carros são isolados e podem ser armazenados no navegador",()=>{
 assert.match(code,/function captureCurrentModel/);
 assert.match(code,/function chooseModel\(/);
 assert.match(code,/state\.modelAssets\[modelId\]/);
 assert.match(code,/indexedDB\.open\("winf-carro-midia",2\)/);
 assert.match(code,/createObjectStore\("projects"\)/);
 for(const btn of ["mcSaveLocal","mcLoadLocal","mcDeleteLocal"])assert.match(studio,new RegExp('id="'+btn+'"'));
 assert.match(code,/function refreshProjects/);
 assert.match(code,/if\(!currentImage\(\)\)\{toast\("Adicione uma foto/);
});

test("MediaCar: biblioteca de prompts para seis modelos e cinco vistas está conectada",()=>{
 const promptCode=read("js/mediacar-image-prompts.js");
 assert.doesNotThrow(()=>new Function(promptCode));
 assert.match(studio,/id="mcPromptModel"/);
 assert.match(studio,/id="mcPromptView"/);
 assert.match(studio,/id="mcPromptOutput"/);
 assert.match(studio,/id="mcPromptCopy"/);
 assert.match(studio,/id="mcPromptDownload"/);
 assert.match(studio,/src="\/js\/mediacar-image-prompts\.js/);
 const ctx={window:{},document:{readyState:"loading",addEventListener(){}},navigator:{}};
 vm.runInNewContext(promptCode,ctx);
 const lib=ctx.window.MediaCarPromptLibrary;
 assert.deepEqual(Array.from(lib.models),["bmw","porsche","volvo","mustang","sprinter","custom"]);
 assert.deepEqual(Array.from(lib.views),["left","right","front","back","roof"]);
 for(const model of lib.models)for(const view of lib.views){
  const p=lib.buildPrompt(model,view);
  assert.match(p,/MEDIACAR™/);
  assert.match(p,/1920 × 1080/);
  assert.match(p,/NÃO INSERIR/);
  assert.match(p,/fotografia conceitual/i);
 }
 for(const slug of ["porsche-911","volvo-ex90","mustang-fastback","sprinter"]){
  const asset="media/ecossistema/mediacar-"+slug+"-concept.svg";
  assert.match(studio,new RegExp(asset.replaceAll("/","\\/").replaceAll(".","\\.")));
  assert.ok(require("node:fs").statSync(require("node:path").join(root,asset)).size>1000,asset);
 }
 // O BMW continua a única fonte de fotografia aprovada no template de edição.
 const modelsBlock=code.slice(code.indexOf("var MC_MODELS="),code.indexOf("var MC_BRANDS="));
 assert.match(modelsBlock,/bmw:\{label:"BMW M4 \/ MediaCar",views:\{left:"\/media\/ecossistema\/mediacar-bmw\.webp"/);
 for(const model of ["porsche","volvo","mustang","sprinter","custom"])assert.match(modelsBlock,new RegExp(model+':\\{label:"[^"]+",views:\\{\\}\\}'));
});

test("MediaCar cloud: API UI and simulator bridge are connected without local token persistence",()=>{
 const cloud=read("js/mediacar-cloud.js");
 assert.doesNotThrow(()=>new Function(cloud));
 for(const id of ["mcCloudApi","mcCloudToken","mcCloudSave","mcCloudLoad","mcCloudDelete","mcCloudRefresh","mcCloudConnect","mcCloudProjects"])assert.match(studio,new RegExp('id="'+id+'"'));
 assert.match(studio,/window\.MediaCarStudioBridge=/);
 assert.match(studio,/src="\/js\/mediacar-cloud\.js/);
 assert.match(cloud,/Authorization/);
 assert.match(cloud,/Bearer /);
 assert.doesNotMatch(cloud,/localStorage|sessionStorage/);
 assert.match(cloud,/\/api\/mediacar/);
});
