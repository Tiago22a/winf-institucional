(() => {
  "use strict";
  const API = "https://winf-node.onrender.com/api/partners";
  const form = document.getElementById("candidate-form");
  const steps = [...document.querySelectorAll("[data-step]")];
  const bars = [...document.querySelectorAll(".progress span")];
  const status = document.getElementById("send-status");
  const errors = document.getElementById("form-errors");
  const btnBack = document.getElementById("back");
  const btnNext = document.getElementById("next");
  const btnSend = document.getElementById("send");
  const receipt = document.getElementById("receipt");
  const params = new URLSearchParams(location.search);
  const clean = (value, max) => String(value || "").trim().slice(0,max);
  const origin = clean(params.get("utm_source") || params.get("origem") || "site", 60);
  const campaign = clean(params.get("utm_campaign") || params.get("campanha") || "", 60);
  const invite = clean(params.get("convite") || "",70);
  if(invite) document.getElementById("invite-label").hidden = false;
  let current = 0;
  let credentials = null;
  function render(){
    steps.forEach((s,i)=>s.hidden = i !== current);
    bars.forEach((s,i)=>s.classList.toggle("active", i<=current));
    document.getElementById("step-label").textContent = "ETAPA 0" + (current+1) + " DE 03";
    btnBack.hidden = current===0;
    btnNext.hidden = current===2;
    btnSend.hidden = current!==2;
    status.textContent = "";
    errors.hidden=true;
  }
  function validateStep(){
    const fields=[...steps[current].querySelectorAll("input,textarea,select")].filter(el => el.type !== "hidden");
    for(const el of fields){if(!el.checkValidity()){el.reportValidity();el.focus();return false;}}
    return true;
  }
  btnBack.addEventListener("click",()=>{current=Math.max(0,current-1);render();});
  btnNext.addEventListener("click",()=>{if(!validateStep())return;current=Math.min(2,current+1);render();});
  const uniqueRequestId=()=>{
    if(globalThis.crypto?.randomUUID)return crypto.randomUUID();
    const bytes=new Uint8Array(18);crypto.getRandomValues(bytes);
    return [...bytes].map(x=>x.toString(16).padStart(2,"0")).join("");
  };
  const requestId=uniqueRequestId();
  async function postJSON(path, data){
    const response=await fetch(API + path,{
      method:"POST",headers:{"Content-Type":"application/json"},
      cache:"no-store",body:JSON.stringify(data)
    });
    let json;
    try{json=await response.json();}catch{throw new Error("A Central está temporariamente indisponível.");}
    if(!response.ok||!json.success)throw new Error(json.message||"Não foi possível concluir a solicitação.");
    return json;
  }
  function saveCredentials(data){
    credentials={protocolo:data.protocolo,chave_consulta:data.chave_consulta};
    try{sessionStorage.setItem("winf-candidatura-consulta",JSON.stringify(credentials));}catch{}
  }
  function showReceipt(data){
    saveCredentials(data);
    form.hidden = true;
    document.getElementById("step-label").hidden = true;
    document.querySelector(".progress").hidden = true;
    receipt.hidden = false;
    document.getElementById("ticket-text").textContent = "Protocolo: " + data.protocolo + "\nCódigo de consulta: " + data.chave_consulta;
    document.getElementById("receipt-status").textContent = "Status: recebida. A Central avaliará perfil e território.";
  }
  form.addEventListener("submit",async(event)=>{
    event.preventDefault();
    if(!validateStep())return;
    const f=new FormData(form);
    const payload=Object.fromEntries(f.entries());
    payload.consentimento=f.get("consentimento")==="on";
    payload.origem=origin;payload.campanha=campaign;payload.convite=invite;
    payload.modelo="WINF Asset Light™";payload.request_id=requestId;
    btnSend.disabled = true;
    status.textContent = "Enviando candidatura com segurança...";
    errors.hidden=true;
    try{const data=await postJSON("/candidaturas",payload);showReceipt(data);}
    catch(e){
      errors.textContent=e.message + " Seus dados não foram confirmados como recebidos. Você pode tentar novamente ou falar com a Central.";
      errors.hidden=false;
      status.replaceChildren(document.createTextNode("Se o erro persistir, "));
      const link=document.createElement("a");
      link.href="https://wa.me/5513997815375?text="+encodeURIComponent("Olá! Tive dificuldade para registrar minha candidatura WINF Partners. Quero falar com a equipe de expansão.");
      link.target="_blank";link.rel="noopener noreferrer";link.textContent="fale com a Central pelo WhatsApp";
      status.append(link,document.createTextNode("."));
    }finally{btnSend.disabled=false;}
  });
  document.getElementById("copy-receipt").addEventListener("click",async()=>{
    if(!credentials)return;
    const value="WINF Partners — Protocolo: "+credentials.protocolo+" / Código de consulta: "+credentials.chave_consulta;
    try{await navigator.clipboard.writeText(value);document.getElementById("receipt-status").textContent="Comprovante copiado. Guarde em local privado.";}
    catch{document.getElementById("receipt-status").textContent="Copie manualmente o protocolo e o código exibidos acima.";}
  });
  document.getElementById("check-status").addEventListener("click",async()=>{
    if(!credentials)return;
    const label=document.getElementById("receipt-status");
    label.textContent="Consultando...";
    try{
      const r=await postJSON("/candidaturas/consultar",credentials);
      const map={recebida:"Recebida",pre_qualificacao:"Pré-qualificação",aguardando_dados:"Aguardando informações",analise_territorial:"Análise territorial",entrevista:"Entrevista",aprovacao_pendente:"Aguardando decisão",aprovada:"Aprovada",nao_aprovada:"Não aprovada",formalizacao:"Formalização",implantacao:"Implantação"};
      label.textContent="Status atual: "+(map[r.status]||"Em análise")+" — situação territorial sujeita à decisão da Central.";
    }catch(e){label.textContent=e.message;}
  });
  render();
})();