/* SynthWAVE.fm™ — política pura de opt-in e cadência para integração futura Hermes.
 * NÃO envia mensagens; NÃO gera tokens; NÃO consulta nem grava dados de assinantes.
 */
"use strict";
const KINDS=Object.freeze(["welcome","discovery","digest"]);
function err(code){const e=new Error("Operação de e-mail inválida");e.code=code;throw e;}
function normalizeEmail(input){
 if(typeof input!=="string")err("invalid_email");
 const e=input.trim().toLowerCase();
 if(e.length>254||!/^[-.!#$%&'*+/=?^_`{|}~a-z0-9]+@[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?\.[a-z]{2,63}$/.test(e))err("invalid_email");
 return e;
}
function initialSubscriber(email){
 return {email:normalizeEmail(email),state:"pending_confirmation",consentVersion:null,
  confirmedAt:null,optedOutAt:null,sent:{welcome:null,discovery:null,digest:null}};
}
function applySubscriberEvent(rec,event){
 if(!rec||!event||typeof event.type!=="string")err("invalid_event");
 const r={...rec,sent:{...rec.sent}};
 if(event.type==="consent_submitted"){
  if(!["pending_confirmation","unsubscribed"].includes(r.state)||event.explicitConsent!==true||
     typeof event.consentVersion!=="string"||!/^synthwave-email-v[0-9]+$/.test(event.consentVersion))err("consent_required");
  r.state="pending_confirmation";r.consentVersion=event.consentVersion;r.confirmedAt=null;r.optedOutAt=null;
  r.sent={welcome:null,discovery:null,digest:null};
 }else if(event.type==="confirmed"){
  if(r.state!=="pending_confirmation"||!r.consentVersion||event.tokenVerifiedByServer!==true||
     !Number.isSafeInteger(event.at)||event.at<=0)err("confirmation_required");
  r.state="confirmed";r.confirmedAt=event.at;
 }else if(event.type==="unsubscribed"){
  if(!Number.isSafeInteger(event.at)||event.at<=0||event.tokenVerifiedByServer!==true)err("unsubscribe_token_required");
  r.state="unsubscribed";r.optedOutAt=event.at;
 }else if(event.type==="mark_sent"){
  if(r.state!=="confirmed"||!KINDS.includes(event.kind)||!event.providerMessageId||
     !Number.isSafeInteger(event.at)||event.at<=0)err("invalid_send_confirmation");
  if(r.sent[event.kind]!==null)err("already_sent");
  r.sent[event.kind]=event.at;
 }else err("unknown_event");
 return Object.freeze(r);
}
function dueMessage(rec,nowMs,opts={}){
 if(rec?.state!=="confirmed"||!Number.isSafeInteger(rec.confirmedAt)||!Number.isSafeInteger(nowMs))return null;
 if(opts.sendEnabled!==true||opts.providerVerified!==true||opts.isSuppressed===true)return null;
 if(!rec.sent?.welcome)return "welcome";
 if(!rec.sent?.discovery&&nowMs-rec.confirmedAt>=7*86400000)return "discovery";
 if(opts.digestAvailable===true && nowMs-rec.confirmedAt>=14*86400000 &&
  (!rec.sent?.digest||nowMs-rec.sent.digest>=14*86400000))return "digest";
 return null;
}
module.exports={normalizeEmail,initialSubscriber,applySubscriberEvent,dueMessage};
