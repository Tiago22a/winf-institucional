import {initializeApp} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getAuth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,signOut} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
const API="https://winf-node.onrender.com/api/specifiers";
const app=initializeApp({
apiKey:"AIzaSyBs5nRf528evxnNQUIsxf8Ygrkzxi1KEv4",
authDomain:"winf-auth.firebaseapp.com",projectId:"winf-auth",
storageBucket:"winf-auth.appspot.com",messagingSenderId:"218399040481",appId:"1:218399040481:web:1f971f1a71a70812c728a0"
});
const auth=getAuth(app), provider=new GoogleAuthProvider();
provider.setCustomParameters({prompt:"select_account"});
const get=id=>document.getElementById(id);
const screens=["login-screen","register-screen","pending-screen","dashboard-screen"];
const clean=(v,n=120)=>String(v||"").trim().slice(0,n);
let currentProfile=null;
function show(id){screens.forEach(x=>get(x).hidden=x!==id);}
async function api(method,path,payload){
  const user=auth.currentUser;
  if(!user)throw new Error("Faça login antes de continuar.");
  const token=await user.getIdToken();
  const res=await fetch(API+path,{
    method,cache:"no-store",
    headers:{"Authorization":"Bearer "+token,...(payload?{"Content-Type":"application/json"}:{})},
    ...(payload?{body:JSON.stringify(payload)}:{})
  });
  let data;try{data=await res.json();}catch{throw new Error("A Central está temporariamente indisponível.");}
  if(!res.ok||!data.success)throw new Error(data.message||"Não foi possível completar a solicitação.");
  return data;
}
async function refresh(){
  if(!auth.currentUser){show("login-screen");return;}
  const status=get("login-status");status.textContent="Carregando seu espaço...";
  try{
    const r=await api("GET","/me");
    if(!r.cadastrado){show("register-screen");return;}
    currentProfile=r.perfil;
    if(r.perfil.status!=="aprovado"){
      show("pending-screen");
      get("pending-description").textContent={
        pendente:"Cadastro recebido. A Central está avaliando seu perfil e o território.",
        recusado:"Sua solicitação não foi aprovada nesta avaliação. Entre em contato com a Central se precisar de esclarecimentos.",
        suspenso:"O acesso está temporariamente suspenso. Entre em contato com a Central."
      }[r.perfil.status]||"Cadastro em análise pela Central.";
      return;
    }
    show("dashboard-screen");
    get("welcome").textContent="OLÁ, "+clean(r.perfil.nome,30).toUpperCase()+".";
    get("unit-name").textContent=r.perfil.unidadeId||"Central WINF";
    const projects=await api("GET","/me/projetos");
    renderProjects(projects.items||[]);
  }catch(e){show("login-screen");status.textContent=e.message+" Tente novamente ou fale com a Central.";}
}
function renderProjects(items){
 get("project-count").textContent=String(items.length);
 const list=get("projects-list");list.replaceChildren();
 if(!items.length){const p=document.createElement("p");p.textContent="Nenhum projeto registrado.";list.append(p);return;}
 for(const item of items){
   const box=document.createElement("div");box.className="item";
   const title=document.createElement("b");title.textContent=item.nome||"Projeto";
   const desc=document.createElement("small");desc.textContent=[item.tipo,item.cidade,item.uf,"Status: "+item.status].filter(Boolean).join(" · ");
   box.append(title,desc);list.append(box);
 }
}
get("google-login").addEventListener("click",async()=>{
  get("login-status").textContent="Abrindo acesso Google...";
  try{await signInWithPopup(auth,provider);}
  catch(e){
    if(["auth/popup-blocked","auth/popup-closed-by-user"].includes(e.code)){
      if(e.code==="auth/popup-blocked"){await signInWithRedirect(auth,provider);return;}
      get("login-status").textContent="Login cancelado. Você pode tentar novamente.";return;
    }
    get("login-status").textContent="Não foi possível entrar. Verifique se o acesso Google está habilitado no Firebase e se este domínio está autorizado.";
  }
});
getRedirectResult(auth).catch(()=>{get("login-status").textContent="Não foi possível concluir o acesso Google. Tente novamente.";});
for(const id of ["logout-register","logout-pending","logout-dashboard"])get(id).addEventListener("click",()=>signOut(auth));
get("refresh-account").addEventListener("click",async()=>{
 get("pending-status").textContent="Atualizando...";
 await refresh();get("pending-status").textContent="";
});
get("specifier-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!e.currentTarget.reportValidity())return;
 const values=Object.fromEntries(new FormData(e.currentTarget).entries());
 const payload={...values,aceitePrivacidade:values.aceitePrivacidade==="on",origem:clean(new URLSearchParams(location.search).get("utm_source")||"site",70)};
 const status=get("register-status"),btn=get("register-button");
 btn.disabled=true;status.textContent="Registrando seu cadastro...";
 try{const r=await api("POST","/cadastro",payload);status.textContent=r.message;await refresh();}
 catch(err){status.textContent=err.message;}finally{btn.disabled=false;}
});
get("project-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!e.currentTarget.reportValidity())return;
 const values=Object.fromEntries(new FormData(e.currentTarget).entries());
 const payload={...values,autorizacaoContato:values.autorizacaoContato==="on"};
 const status=get("project-status"),btn=get("send-project");
 btn.disabled=true;status.textContent="Salvando projeto...";
 try{
   const r=await api("POST","/me/projetos",payload);
   status.textContent=r.message;
   e.currentTarget.reset();
   const projects=await api("GET","/me/projetos");renderProjects(projects.items||[]);
 }catch(err){status.textContent=err.message;}finally{btn.disabled=false;}
});
onAuthStateChanged(auth,user=>{if(user)refresh();else{currentProfile=null;show("login-screen");}});
