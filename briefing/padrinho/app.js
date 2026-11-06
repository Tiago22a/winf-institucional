(()=>{"use strict";
const API="https://winf-node.onrender.com/api/partners";
const f=document.getElementById("padrinho-form"),send=document.getElementById("send"),status=document.getElementById("send-status"),error=document.getElementById("form-errors"),receipt=document.getElementById("receipt");
const p=new URLSearchParams(location.search),clean=(v,n)=>String(v||"").trim().slice(0,n);
const id=crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(18)),x=>x.toString(16).padStart(2,"0")).join("");
let credentials=null;
async function post(route,payload){
const r=await fetch(API+route,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store"});
let data;try{data=await r.json();}catch{throw Error("A Central está temporariamente indisponível.");}
if(!r.ok||!data.success)throw Error(data.message||"Falha ao enviar o cadastro.");return data;
}
f.addEventListener("submit",async e=>{e.preventDefault();if(!f.reportValidity())return;
const values=Object.fromEntries(new FormData(f).entries());
const payload={...values,perfil:"padrinho",consentimento:values.consentimento==="on",origem:clean(p.get("utm_source")||p.get("origem")||"site",60),campanha:clean(p.get("utm_campaign"),60),convite:clean(p.get("convite"),70),request_id:id};
send.disabled=true;status.textContent="Registrando seu interesse...";error.hidden=true;
try{const result=await post("/candidaturas",payload);
credentials={protocolo:result.protocolo,chave_consulta:result.chave_consulta};
f.hidden=true;receipt.hidden=false;
document.getElementById("ticket-text").textContent="Protocolo: "+result.protocolo+"\nCódigo de consulta: "+result.chave_consulta;
document.getElementById("receipt-status").textContent="Status: interesse recebido. A Central fará a análise.";
}catch(ex){error.textContent=ex.message+" Se persistir, contate a Central pelo WhatsApp.";error.hidden=false;status.textContent="";}
finally{send.disabled=false;}
});
document.getElementById("copy-receipt").addEventListener("click",async()=>{
if(!credentials)return;const value="WINF Partners — Protocolo: "+credentials.protocolo+" / Código de consulta: "+credentials.chave_consulta;
try{await navigator.clipboard.writeText(value);document.getElementById("receipt-status").textContent="Comprovante copiado.";}catch{document.getElementById("receipt-status").textContent="Copie manualmente os códigos exibidos.";}
});
document.getElementById("check-status").addEventListener("click",async()=>{
if(!credentials)return;const label=document.getElementById("receipt-status");label.textContent="Consultando...";
try{const data=await post("/candidaturas/consultar",credentials);label.textContent="Status registrado: "+data.status+". Sua avaliação depende da Central.";}catch(ex){label.textContent=ex.message;}
});
})();