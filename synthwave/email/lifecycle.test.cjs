"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {normalizeEmail,initialSubscriber,applySubscriberEvent,dueMessage}=require("./lifecycle.cjs");
const at=Date.UTC(2026,10,14);
const step=(r,event)=>applySubscriberEvent(r,event);
test("normaliza email e rejeita dado inválido",()=>{
 assert.equal(normalizeEmail(" Teste@Exemplo.com "),"teste@exemplo.com");
 for(const x of ["", "sem-arroba", "a@b", "<script>@x.com", undefined])assert.throws(()=>normalizeEmail(x));
});
test("não envia nada antes do consentimento e confirmação comprovada",()=>{
 let r=initialSubscriber("ola@exemplo.com");
 assert.equal(dueMessage(r,at,{sendEnabled:true,providerVerified:true}),null);
 assert.throws(()=>step(r,{type:"confirmed",at,tokenVerifiedByServer:true}),{code:"confirmation_required"});
 assert.throws(()=>step(r,{type:"consent_submitted",explicitConsent:false,consentVersion:"synthwave-email-v1"}),{code:"consent_required"});
 r=step(r,{type:"consent_submitted",explicitConsent:true,consentVersion:"synthwave-email-v1"});
 assert.equal(dueMessage(r,at,{sendEnabled:true,providerVerified:true}),null);
 assert.throws(()=>step(r,{type:"confirmed",at}),{code:"confirmation_required"});
 r=step(r,{type:"confirmed",at,tokenVerifiedByServer:true});
 assert.equal(dueMessage(r,at,{sendEnabled:false,providerVerified:true}),null);
 assert.equal(dueMessage(r,at,{sendEnabled:true,providerVerified:false}),null);
 assert.equal(dueMessage(r,at,{sendEnabled:true,providerVerified:true}),"welcome");
});
test("boas-vindas, descoberta e digest com intervalo, sem mensagens duplicadas",()=>{
 let r=initialSubscriber("ouvinte@exemplo.com");
 r=step(r,{type:"consent_submitted",explicitConsent:true,consentVersion:"synthwave-email-v1"});
 r=step(r,{type:"confirmed",at,tokenVerifiedByServer:true});
 r=step(r,{type:"mark_sent",kind:"welcome",at,providerMessageId:"m1"});
 assert.equal(dueMessage(r,at+6*86400000,{sendEnabled:true,providerVerified:true}),null);
 assert.equal(dueMessage(r,at+7*86400000,{sendEnabled:true,providerVerified:true}),"discovery");
 r=step(r,{type:"mark_sent",kind:"discovery",at:at+7*86400000,providerMessageId:"m2"});
 assert.equal(dueMessage(r,at+14*86400000,{sendEnabled:true,providerVerified:true,digestAvailable:true}),"digest");
 r=step(r,{type:"mark_sent",kind:"digest",at:at+14*86400000,providerMessageId:"m3"});
 assert.equal(dueMessage(r,at+15*86400000,{sendEnabled:true,providerVerified:true,digestAvailable:true}),null);
 assert.equal(dueMessage(r,at+29*86400000,{sendEnabled:true,providerVerified:true,digestAvailable:true}),"digest");
 assert.throws(()=>step(r,{type:"mark_sent",kind:"welcome",at,providerMessageId:"x"}),{code:"already_sent"});
});
test("cancelamento imediato bloqueia campanhas mesmo se havia agendamento",()=>{
 let r=initialSubscriber("x@exemplo.com");
 r=step(r,{type:"consent_submitted",explicitConsent:true,consentVersion:"synthwave-email-v1"});
 r=step(r,{type:"confirmed",at,tokenVerifiedByServer:true});
 assert.throws(()=>step(r,{type:"unsubscribed",at}),{code:"unsubscribe_token_required"});
 r=step(r,{type:"unsubscribed",at,tokenVerifiedByServer:true});
 assert.equal(dueMessage(r,at+40*86400000,{sendEnabled:true,providerVerified:true,digestAvailable:true}),null);
});
