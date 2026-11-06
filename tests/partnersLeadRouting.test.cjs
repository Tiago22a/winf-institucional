"use strict";
const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const source=fs.readFileSync(path.join(root,"partners/partners.js"),"utf8");
const briefing=fs.readFileSync(path.join(root,"briefing/index.html"),"utf8");

function simulateLead(kind){
  const listeners={};
  const leads=[];
  const model={value:"",addEventListener(){}};
  const form={
    data:{name:"Representante WINF",city:"Sorocaba/SP",phone:"15999999999",
      message:"Quero conversar antes de formalizar qualquer compromisso."},
    reportValidity(){return true},
    addEventListener(type,fn){listeners[type]=fn}
  };
  const status={
    children:[],replaceChildren(...items){this.children=items},
    append(item){this.children.push(item)}
  };
  const contact={
    open:false,showModal(){this.open=true},close(){this.open=false},
    addEventListener(){}
  };
  const link={
    dataset:{model:kind},
    addEventListener(type,fn){listeners["open-"+type]=fn}
  };
  const doc={
    hidden:false,
    querySelector:()=>null,
    querySelectorAll:q=>q==="[data-model]"?[link]:[],
    getElementById:id=>({
      "contact":contact,"partners-form":form,
      "partner-model":model,"partners-form-status":status
    })[id]||null,
    addEventListener(){},
    createTextNode:text=>({textContent:text}),
    createElement:tag=>({tagName:tag.toUpperCase()})
  };
  const opened=[];
  class FormDataMock {
    constructor(el){this.values={...el.data,model:model.value}}
    get(key){return this.values[key]||""}
  }
  vm.runInNewContext(source,{
    document:doc,window:{open:(url)=>opened.push(url)},
    navigator:{connection:{saveData:false}},
    matchMedia:()=>({matches:false,addEventListener(){}}),
    FormData:FormDataMock
  });
  listeners["open-click"]();
  assert.equal(model.value,kind);
  listeners.submit({preventDefault(){}});
  assert.equal(opened.length,1);
  assert.match(opened[0],/^https:\/\/wa\.me\/5513997815375\?text=/);
  const text=decodeURIComponent(new URL(opened[0]).searchParams.get("text"));
  return {text,opened,status};
}
test("participação societária gera mensagem própria, sem falar em disponibilidade territorial",()=>{
 const {text,status}=simulateLead("Investimento societário / parceria estratégica");
 assert.match(text,/parceria de investimento/);
 assert.match(text,/Assunto: investimento estratégico/);
 assert.match(text,/condições e riscos de uma eventual participação/);
 assert.doesNotMatch(text,/consultar a disponibilidade territorial|receber o dossiê/);
 assert.equal(status.children.length,2);
});
test("importador recebe mensagem sobre fornecimento e logística",()=>{
 const {text}=simulateLead("Parceria industrial / importação");
 assert.match(text,/importação, fornecimento ou distribuição/);
 assert.match(text,/Assunto: parceria industrial \/ importação/);
 assert.match(text,/logística e condições comerciais possíveis/);
 assert.doesNotMatch(text,/disponibilidade territorial|receber o dossiê/);
});
test("licenciado recebe mensagem territorial sem misturar participação societária",()=>{
 const {text}=simulateLead("WINF Asset Light™");
 assert.match(text,/conhecer os modelos da WINF Partners/);
 assert.match(text,/Assunto: licenciamento territorial/);
 assert.match(text,/consultar a disponibilidade territorial/);
 assert.doesNotMatch(text,/eventual participação|fornecimento ou distribuição/);
});
test("formulário contém opções correspondentes, sem promessa de aceite",()=>{
 for(const kind of [
  "Investimento societário / parceria estratégica",
  "Parceria industrial / importação",
  "WINF Asset Light™"
 ])assert(briefing.includes(kind),kind);
 assert.match(briefing,/Sobre sua experiência ou proposta/);
 assert.match(briefing,/Cidade \/ UF \/ País/);
 assert.match(briefing,/não representa aprovação, ativação ou contratação/);
});
test("mensagem final nunca confirma sociedade, fornecimento ou pedido",()=>{
 for(const kind of [
  "Investimento societário / parceria estratégica",
  "Parceria industrial / importação",
  "WINF Asset Light™"
 ]){
  const {text}=simulateLead(kind);
  assert(text.includes("Nome: Representante WINF"));
  assert(text.includes("WhatsApp: 15999999999"));
  assert.doesNotMatch(text,/investimento aprovado|parceria confirmada|pedido enviado/i);
 }
});
