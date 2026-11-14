/* SynthWAVE.fm Google / Firestore bridge.
 * Disabled by default until Firebase config and rules are deployed.
 * No listener leads or phone numbers are stored by this component.
 * All remote writes require an explicit listener action.
 */
(function(global){
 'use strict';
 const state={status:'checking',ready:false,user:null,message:'Verificando disponibilidade da conta Google.'};
 let auth=null,db=null,authApi=null,storeApi=null,provider=null;
 const notify=()=>{try{global.dispatchEvent(new CustomEvent('sw:cloud-state',{detail:snapshot()}))}catch(_){}};
 const snapshot=()=>({status:state.status,ready:state.ready,user:state.user?{uid:state.user.uid,displayName:state.user.displayName||'',email:state.user.email||''}:null,message:state.message});
 const fail=(status,message)=>{state.status=status;state.message=message;state.ready=false;notify()};
 const assertUser=()=>{if(!state.ready||!state.user||!db||!storeApi)throw Error('Entre com o Google para usar a nuvem.')};
 function errorText(error){
  const code=String(error?.code||'');
  if(code.includes('popup-closed-by-user')||code.includes('cancelled-popup-request'))return 'Entrada cancelada. Suas playlists locais foram preservadas.';
  if(code.includes('unauthorized-domain'))return 'Este domínio precisa ser autorizado no projeto Firebase.';
  if(code.includes('permission-denied'))return 'Acesso recusado pelas regras do banco. Não houve sincronização.';
  if(code.includes('network'))return 'Não foi possível acessar a rede. Tente novamente.';
  return 'Não foi possível concluir. Sua biblioteca neste dispositivo continua intacta.';
 }
 async function init(){
   try{
     const response=await fetch('/synthwave/firebase-public-config.json?v=20261114-2',{cache:'no-store'});
     if(!response.ok)throw Error('public-config-unavailable');
     const config=await response.json();
     const keys=['apiKey','authDomain','projectId','appId'];
     if(config.enabled!==true||!keys.every(k=>typeof config[k]==='string'&&config[k].trim())){
       fail('unconfigured','Conta Google em preparação. A rádio e as playlists locais funcionam sem cadastro.');
       return;
     }
     // Firebase modular browser SDK; no credentials beyond Firebase public web config.
     const [appModule,authModule,storeModule]=await Promise.all([
       import('https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js'),
       import('https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js'),
       import('https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js')
     ]);
     const firebaseConfig={apiKey:config.apiKey,authDomain:config.authDomain,projectId:config.projectId,appId:config.appId};
     if(config.messagingSenderId)firebaseConfig.messagingSenderId=config.messagingSenderId;
     const app=appModule.initializeApp(firebaseConfig,'synthwave-fm');
     auth=authModule.getAuth(app);
     db=storeModule.getFirestore(app);
     authApi=authModule;storeApi=storeModule;
     provider=new authModule.GoogleAuthProvider();
     state.ready=true;state.status='ready';state.message='Conecte sua conta para salvar suas playlists na nuvem.';
     authModule.onAuthStateChanged(auth,user=>{
       state.user=user||null;
       state.message=user?'Conectado como '+(user.displayName||user.email||'ouvinte')+'.':'Entre com o Google para salvar suas playlists.';
       state.status=user?'connected':'ready';
       notify();
     },error=>fail('error',errorText(error)));
     notify();
   }catch(e){
     console.warn('SynthWAVE cloud initialization unavailable:',e?.code||e?.message||e);
     fail('error','O serviço de contas não está disponível no momento. Você pode continuar ouvindo sem login.');
   }
 }
 async function login(){
   if(!state.ready||!auth||!authApi||!provider)throw Error(state.message);
   try{
     // Must run from a direct user click to avoid popup blockers.
     await authApi.signInWithPopup(auth,provider);
   }catch(error){throw Error(errorText(error))}
 }
 async function logout(){
   if(!state.ready||!auth)throw Error('Serviço de conta indisponível.');
   await authApi.signOut(auth);
 }
 function validateList(item){
   if(!item||!/^([a-z0-9-]{1,48})$/.test(String(item.id||'')))return null;
   const name=String(item.name||'').trim().slice(0,48);
   if(name.length<2)return null;
   const tracks=Array.isArray(item.tracks)?[...new Set(item.tracks.filter(x=>typeof x==='string'&&x.length<100))].slice(0,100):[];
   return {id:item.id,name,tracks};
 }
 async function load(){
   assertUser();
   try{
     const coll=storeApi.collection(db,'synthwave_users',state.user.uid,'playlists');
     const result=await storeApi.getDocs(coll);
     return result.docs.slice(0,25).map(d=>validateList({id:d.id,...d.data()})).filter(Boolean);
   }catch(error){throw Error(errorText(error))}
 }
 async function save(lists){
   assertUser();
   if(!Array.isArray(lists))throw Error('Formato de playlist inválido.');
   if(lists.length>25)throw Error('Limite de 25 playlists na nuvem.');
   const payload=lists.map(validateList);
   if(payload.some(x=>!x))throw Error('Uma das playlists contém dados inválidos.');
   try{
     const batch=storeApi.writeBatch(db);
     for(const item of payload){
       const docRef=storeApi.doc(db,'synthwave_users',state.user.uid,'playlists',item.id);
       batch.set(docRef,{name:item.name,tracks:item.tracks,updatedAt:storeApi.serverTimestamp()});
     }
     await batch.commit();
     return payload.length;
   }catch(error){throw Error(errorText(error))}
 }
 global.SynthwaveCloud={snapshot,login,logout,load,save};
 init();
})(window);
