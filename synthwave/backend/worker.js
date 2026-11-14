/* SynthWAVE.fm optional newsletter API — Cloudflare Worker, D1 and Turnstile.
 * Do not activate until the database, security checks, privacy policy and
 * operational opt-out/deletion workflow are configured.
 */
const json=(value,status=200,origin='')=>new Response(JSON.stringify(value),{
 status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
 'X-Content-Type-Options':'nosniff','Vary':'Origin',...(origin?{'Access-Control-Allow-Origin':origin}:{})}
});
function allowed(request,env){
 const origins=String(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
 const origin=request.headers.get('Origin')||'';
 return origin&&origins.includes(origin)?origin:'';
}
const invalid=(message,origin)=>json({ok:false,message},400,origin);
async function validateTurnstile(token,env,ip){
 const form=new FormData();
 form.append('secret',env.TURNSTILE_SECRET);
 form.append('response',token);
 if(ip)form.append('remoteip',ip);
 const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
  method:'POST',body:form,signal:AbortSignal.timeout(8000)
 });
 if(!verification.ok)return false;
 const data=await verification.json();
 return data.success===true;
}
export default {
 async fetch(request,env){
  const origin=allowed(request,env);
  if(!origin)return json({ok:false,message:'Origem não autorizada.'},403);
  if(request.method==='OPTIONS'){
   return new Response(null,{status:204,headers:{
    'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'
   }});
  }
  if(request.method!=='POST')return json({ok:false,message:'Método não permitido.'},405,origin);
  if(new URL(request.url).pathname!=='/synthwave/newsletter')return json({ok:false,message:'Rota não encontrada.'},404,origin);
  if(!env.DB||!env.TURNSTILE_SECRET||!env.CONSENT_VERSION||!env.ALLOWED_ORIGINS){
   return json({ok:false,message:'Cadastro temporariamente indisponível.'},503,origin);
  }
  if((request.headers.get('Content-Type')||'').split(';')[0].trim().toLowerCase()!=='application/json'){
   return invalid('Envie dados em JSON.',origin);
  }
  if(Number(request.headers.get('Content-Length')||0)>3000)return invalid('Dados muito extensos.',origin);
  let body;
  try{body=await request.text();if(body.length>3000)return invalid('Dados muito extensos.',origin)}catch(_){return invalid('Requisição inválida.',origin)}
  try{body=JSON.parse(body)}catch(_){return invalid('JSON inválido.',origin)}
  const name=String(body.name||'').trim().replace(/\s+/g,' ');
  const digits=String(body.phone||'').replace(/\D/g,'');
  const phone=digits.length===11?'55'+digits:digits;
  const consent=body.consent===true,version=String(body.consentVersion||'');
  const token=String(body.turnstileToken||'');
  if(!/^[^\x00-\x1f<>]{2,80}$/.test(name))return invalid('Informe um nome válido.',origin);
  if(!/^55[1-9]\d9\d{8}$/.test(phone))return invalid('Informe um WhatsApp brasileiro com DDD.',origin);
  if(!consent||version!==env.CONSENT_VERSION)return invalid('Você precisa consentir com a newsletter.',origin);
  if(token.length<10||token.length>3000)return invalid('Conclua a verificação de segurança.',origin);
  let verified=false;
  try{verified=await validateTurnstile(token,env,request.headers.get('CF-Connecting-IP'))}catch(_){}
  if(!verified)return invalid('Verificação de segurança inválida. Tente novamente.',origin);
  const now=new Date().toISOString();
  const statement="INSERT INTO synthwave_newsletter"+
   " (phone_e164,name,consent_version,consent_at,source,status,created_at,updated_at)"+
   " VALUES (?,?,?,?,?,'opted_in',?,?)"+
   " ON CONFLICT(phone_e164) DO UPDATE SET name=excluded.name,"+
   " consent_version=excluded.consent_version,consent_at=excluded.consent_at,"+
   " status='opted_in',updated_at=excluded.updated_at";
  try{
   await env.DB.prepare(statement).bind('+'+phone,name,version,now,'synthwave-fm',now,now).run();
   return json({ok:true,message:'Inscrição recebida. Obrigado por sintonizar.'},201,origin);
  }catch(_){
   return json({ok:false,message:'Não foi possível registrar a inscrição. Tente mais tarde.'},503,origin);
  }
 }
};
