// WINF Partners MediaCar™ — authenticated cloud campaign drafts.
// Requires backend /api/mediacar and Firebase Web Auth configuration on Render.
// Never send Firebase Admin SDK credentials or store Firebase ID tokens in localStorage.
const $=id=>document.getElementById(id);
const app=window.MediaCarApp;
const message=(text,bad=false)=>{const el=$("mcSyncStatus");if(el){el.textContent=text;el.style.color=bad?"#ffb1aa":"";}};
if(app && $("mcSyncPanel")){
  let auth=null,provider=null,user=null,endpoint=window.WINF_MEDIACAR_API_BASE||"";
  let activeId=null;
  const allowedUrl=raw=>{
    const u=new URL(raw);
    if(u.protocol!=="https:"&&!["localhost","127.0.0.1"].includes(u.hostname))throw Error("A API precisa usar HTTPS.");
    if(u.username||u.password||u.search||u.hash)throw Error("Informe apenas a URL base da API.");
    return u.origin+u.pathname.replace(/\/$/,"").replace(/\/api\/mediacar$/,"");
  };
  const resolveEndpoint=()=>allowedUrl($("mcSyncApi").value.trim()||endpoint);
  const busy=async(btn,fn)=>{btn.disabled=true;try{await fn()}catch(e){message(e.message||"Falha de conexão",true)}finally{btn.disabled=false}};
  const request=async(method,path,body,authorize=true)=>{
    const headers={"Content-Type":"application/json"};
    if(authorize){if(!user)throw Error("Entre com sua conta WINF autorizada.");headers.Authorization="Bearer "+await user.getIdToken();}
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),16000);
    try{
      const res=await fetch(resolveEndpoint()+"/api/mediacar"+path,{method,headers,body:body?JSON.stringify(body):undefined,signal:controller.signal,cache:"no-store"});
      const data=await res.json().catch(()=>({}));
      if(!res.ok)throw Error(data.error||"Erro "+res.status);
      return data;
    }finally{clearTimeout(timeout)}
  };
  function slug(t){
    return t.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9_-]+/g,"-").replace(/^-|-$/g,"").slice(0,80);
  }
  function payload(){
    const s=app.get();
    const territoryId=slug(s.territory||"");
    if(!territoryId)throw Error("Informe a cidade/território antes de salvar.");
    const slots={};
    for(const [id,v] of Object.entries(s.slots)){
      const n=Number(v.price)||0;
      slots[id]={sponsor:String(v.sponsor||"").slice(0,80),priceCents:Math.round(n*100),logo:typeof v.logo==="string"?v.logo:null};
    }
    return {territoryId,vehicleId:s.car,styleId:s.style,name:"MediaCar / "+s.territory,slots};
  }
  async function list(){
    const territoryId=slug(app.get().territory||"");
    if(!territoryId)throw Error("Preencha primeiro o território.");
    const data=await request("GET","/campaigns?territoryId="+encodeURIComponent(territoryId));
    const sel=$("mcSyncList");sel.replaceChildren(new Option("Selecionar campanha salva",""));
    for(const c of data.campaigns||[])sel.add(new Option((c.name||"Campanha")+" · "+c.id.slice(0,6),c.id));
    if(activeId&&[...sel.options].some(o=>o.value===activeId))sel.value=activeId;
    message((data.campaigns||[]).length+" campanha(s) encontrada(s) nesse território.");
  }
  $("mcSyncConnect").addEventListener("click",()=>busy($("mcSyncConnect"),async()=>{
    const base=resolveEndpoint();
    const config=await request("GET","/auth/config",null,false);
    const [{initializeApp,getApps},{getAuth,GoogleAuthProvider,signInWithPopup,onAuthStateChanged}]=await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js")
    ]);
    const firebaseApp=getApps().find(a=>a.name==="mediacar-winf")||initializeApp(config,"mediacar-winf");
    auth=getAuth(firebaseApp);
    provider=new GoogleAuthProvider();
    user=auth.currentUser||null;
    if(!user){const result=await signInWithPopup(auth,provider);user=result.user;}
    onAuthStateChanged(auth,current=>{user=current;$("mcSyncAccount").textContent=current?(current.email||"Conta conectada"):"Não conectado";});
    endpoint=base;
    $("mcSyncAccount").textContent=user.email||"Conta conectada";
    message("Conexão autenticada. Consulte ou salve sua campanha.");
    await list();
  }));
  $("mcSyncSave").addEventListener("click",()=>busy($("mcSyncSave"),async()=>{
    const data=payload();
    const result=await request(activeId?"PUT":"POST",activeId?"/campaigns/"+encodeURIComponent(activeId):"/campaigns",data);
    activeId=result.id;
    await list();message("Campanha salva no Firestore. ID: "+result.id);
  }));
  $("mcSyncRefresh").addEventListener("click",()=>busy($("mcSyncRefresh"),list));
  $("mcSyncLoad").addEventListener("click",()=>busy($("mcSyncLoad"),async()=>{
    const id=$("mcSyncList").value;if(!id)throw Error("Selecione uma campanha.");
    const data=await request("GET","/campaigns/"+encodeURIComponent(id));
    if(!confirm("Abrir a campanha e substituir a simulação exibida?"))return;
    const slots={};for(const [key,v] of Object.entries(data.slots||{})){
      slots[key]={sponsor:v.sponsor||"",price:(v.priceCents||0)/100,logo:v.logo||null};
    }
    app.set({territory:(data.name||"").replace(/^MediaCar \/ /,"")||data.territoryId,car:data.vehicleId,style:data.styleId,slots});
    activeId=data.id;message("Campanha e logomarcas recuperadas do Firestore.");
  }));
  $("mcSyncList").addEventListener("change",()=>{activeId=$("mcSyncList").value||null;});
  $("mcSyncApi").value=endpoint;
  message("Para usar a nuvem, configure a API WINF e entre com uma conta autorizada.");
}
