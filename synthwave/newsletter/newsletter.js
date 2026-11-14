/* Newsletter opcional — exibida apenas com endpoint seguro e Turnstile configurados. */
(async function(){
 'use strict';
 const mount=document.getElementById('sw-newsletter-mount');if(!mount)return;
 let config;
 try{
  const response=await fetch('/synthwave/newsletter/config.json?v=20261114-2',{cache:'no-store'});
  if(!response.ok)return;
  config=await response.json();
 }catch(_){return}
 const url=String(config?.endpoint||'');
 if(config?.enabled!==true||
   !/^https:\/\/(?:api\.|www\.)?winf\.com\.br\/synthwave\/newsletter$/.test(url)||
   !config.turnstileSiteKey||!config.consentVersion)return;
 const privacy=String(config.privacyUrl||'');
 if(!/^\/[a-z0-9/-]+(?:#[a-z0-9-]+)?$/i.test(privacy))return;
 mount.innerHTML=[
  '<div class="sw-newsletter-content"><div>',
  '<p class="text-pink text-xs font-black tracking-[.2em] uppercase">A FREQUÊNCIA CONTINUA</p>',
  '<h2 class="text-4xl md:text-6xl text-white mt-2">RECEBA NOVIDADES DA SYNTHWAVE.</h2>',
  '<p class="text-sm text-gray-400 mt-3">Novas coleções e episódios. Você pode continuar ouvindo sem informar seus dados.</p>',
  '</div><form id="sw-newsletter-form" class="grid gap-3" autocomplete="on">',
  '<label for="sw-nl-name" class="text-xs text-gray-200">Nome</label>',
  '<input id="sw-nl-name" type="text" maxlength="80" minlength="2" autocomplete="name" required placeholder="Como podemos chamar você?">',
  '<label for="sw-nl-phone" class="text-xs text-gray-200">WhatsApp com DDD</label>',
  '<input id="sw-nl-phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" required placeholder="(13) 99999-9999">',
  '<label class="sw-newsletter-consent"><input type="checkbox" id="sw-nl-consent" required><span>Quero receber mensagens da SynthWAVE.fm pelo WhatsApp. Posso pedir cancelamento a qualquer momento, conforme a <a href="',
  privacy,
  '" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>',
  '<div id="sw-nl-turnstile"></div>',
  '<button class="sw-moment-action" type="submit">Quero receber novidades ↗</button>',
  '<p id="sw-nl-status" role="status" aria-live="polite" class="text-sm text-gray-300"></p>',
  '</form></div>'
 ].join('');
 mount.hidden=false;
 let widgetId=null;
 const status=mount.querySelector('#sw-nl-status');
 const form=mount.querySelector('#sw-newsletter-form');
 const script=document.createElement('script');
 script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
 script.async=true;
 script.onerror=()=>{
  status.textContent='Cadastro indisponível por enquanto. A rádio continua livre.';
  form.querySelector('button[type=submit]').disabled=true;
 };
 script.onload=()=>{
  try{widgetId=window.turnstile.render('#sw-nl-turnstile',{sitekey:config.turnstileSiteKey,theme:'dark'})}
  catch(_){status.textContent='Não foi possível ativar a validação. Tente mais tarde.'}
 };
 document.head.appendChild(script);
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const token=widgetId!==null&&window.turnstile?.getResponse(widgetId);
  if(!token){status.textContent='Conclua a verificação de segurança.';return}
  const submit=form.querySelector('button[type=submit]');
  submit.disabled=true;status.textContent='Registrando sua inscrição…';
  try{
   const response=await fetch(url,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
     name:form.querySelector('#sw-nl-name').value.trim(),
     phone:form.querySelector('#sw-nl-phone').value,
     consent:form.querySelector('#sw-nl-consent').checked,
     consentVersion:config.consentVersion,
     turnstileToken:token
    })
   });
   const data=await response.json();
   if(!response.ok||data.ok!==true)throw Error(String(data.message||'Não foi possível registrar.'));
   form.reset();status.textContent='Inscrição registrada com sucesso. Obrigado por sintonizar!';
  }catch(e){status.textContent=e.message||'Não foi possível registrar. Tente novamente.'}
  finally{try{window.turnstile?.reset(widgetId)}catch(_){}submit.disabled=false}
 });
})();
