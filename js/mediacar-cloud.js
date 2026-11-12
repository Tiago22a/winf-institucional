"use strict";
(function(){
const $=id=>document.getElementById(id);
const ids=["mcCloudApi","mcCloudToken","mcCloudConnect","mcCloudSave","mcCloudRefresh","mcCloudProjects","mcCloudLoad","mcCloudDelete","mcCloudStatus"];
if(!ids.every(id=>$(id)))return;
const bridge=window.MediaCarStudioBridge;
const status=(message,error=false)=>{const el=$("mcCloudStatus");el.textContent=message;el.style.color=error?"#ff9f94":"";};
function endpoint(){
 const raw=$("mcCloudApi").value.trim();
 let url;try{url=new URL(raw)}catch(_){throw Error("Informe a URL completa da API.");}
 if(url.protocol!=="https:"&&!["localhost","127.0.0.1"].includes(url.hostname))throw Error("A API precisa usar HTTPS.");
 if(url.username||url.password||url.search||url.hash)throw Error("Use apenas a URL base da API.");
 return url.origin+url.pathname.replace(/\/$/,"");
}
async function request(method,path,body){
 const token=$("mcCloudToken").value.trim();
 if(!token)throw Error("Informe um Firebase ID token válido da sessão autorizada.");
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch(endpoint()+"/api/mediacar"+path,{method,headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined,signal:controller.signal,cache:"no-store"});
  let data={};try{data=await response.json()}catch(_){}
  if(!response.ok)throw Error(data.error||"Erro HTTP "+response.status);
  return data;
 }finally{clearTimeout(timeout)}
}
async function busy(button,action){button.disabled=true;status("Conectando ao serviço WINF…");try{await action()}catch(e){status(e.name==="AbortError"?"A API demorou para responder. Tente novamente.":e.message,true)}finally{button.disabled=false}}
async function refresh(){
 const result=await request("GET","/projects");
 const select=$("mcCloudProjects");const previous=select.value;select.replaceChildren(new Option("Selecione um projeto remoto",""));
 (result.projects||[]).forEach(p=>{const opt=new Option((p.name||"MediaCar")+" · "+(p.territoryId||"território"),p.id);select.add(opt)});
 if([...select.options].some(o=>o.value===previous))select.value=previous;
 status("Projetos remotos disponíveis: "+(result.projects||[]).length+".");
}
$("mcCloudConnect").onclick=()=>busy($("mcCloudConnect"),async()=>{await request("GET","/health");status("Conexão autenticada com a API MediaCar confirmada.")});
$("mcCloudRefresh").onclick=()=>busy($("mcCloudRefresh"),refresh);
$("mcCloudSave").onclick=()=>busy($("mcCloudSave"),async()=>{
 if(!bridge)throw Error("Simulador não inicializado.");
 const state=bridge.snapshot();
 const territoryId=(state.city||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9_-]+/g,"-").replace(/^-|-$/g,"").slice(0,90);
 if(!territoryId)throw Error("Preencha a cidade/território antes de salvar.");
 const id=bridge.currentId()||"mc-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
 const payload={name:(state.vehicle||"MediaCar")+" / "+(state.licenseName||"Licenciado"),territoryId,vehicleId:state.model||"custom",state};
 await request("PUT","/projects/"+encodeURIComponent(id),payload);
 bridge.setId(id);await refresh();$("mcCloudProjects").value=id;status("Projeto salvo na nuvem. ID: "+id);
});
$("mcCloudLoad").onclick=()=>busy($("mcCloudLoad"),async()=>{
 const id=$("mcCloudProjects").value;if(!id)throw Error("Selecione um projeto remoto.");
 const project=await request("GET","/projects/"+encodeURIComponent(id));
 if(!project.state)throw Error("Projeto remoto sem dados.");
 if(!confirm("Abrir o projeto remoto e substituir o rascunho atual? Exporte JSON antes, se necessário."))return;
 bridge.restore(project.state);bridge.setId(project.id);status("Projeto remoto aberto: "+project.name);
});
$("mcCloudDelete").onclick=()=>busy($("mcCloudDelete"),async()=>{
 const id=$("mcCloudProjects").value;if(!id)throw Error("Selecione um projeto remoto.");
 if(!confirm("Excluir definitivamente o projeto remoto "+id+"?"))return;
 await request("DELETE","/projects/"+encodeURIComponent(id));await refresh();status("Projeto removido da nuvem.");
});

function configId(){const id=bridge&&bridge.currentId();if(!id)throw Error("Salve primeiro o projeto na nuvem para vincular a configuração 3D.");return id;}
const save3d=$("mc3dCloudSave"),load3d=$("mc3dCloudLoad");
if(save3d)save3d.onclick=()=>busy(save3d,async()=>{
 if(!window.MediaCar3D)throw Error("Aguarde o carregamento do visualizador 3D.");
 const state=bridge.snapshot();
 const territoryId=(state.city||"").trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9_-]+/g,"-").replace(/^-|-$/g,"").slice(0,90);
 if(!territoryId)throw Error("Informe a cidade do projeto.");
 await request("PUT","/configurations/"+encodeURIComponent(configId()),{...window.MediaCar3D.get(),territoryId,projectId:configId()});
 status("Cor, modelo, acabamento e câmera 3D salvos na nuvem.");
});
if(load3d)load3d.onclick=()=>busy(load3d,async()=>{
 if(!window.MediaCar3D)throw Error("Aguarde o carregamento do visualizador 3D.");
 const data=await request("GET","/configurations/"+encodeURIComponent(configId()));
 window.MediaCar3D.set(data);status("Configuração 3D restaurada.");
});
})();