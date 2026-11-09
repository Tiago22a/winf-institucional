/* Diagnóstico de disponibilidade de páginas por cidade WINF™.
 * Testa HTTPS externo para as variantes com e sem www, status real HTTP,
 * conteúdo mínimo, redirecionamento e canonical.
 * Não altera produção ou dados do Search Console.
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const {cities}=JSON.parse(readFileSync('config/winf-active-cities.json','utf8'));
const targets=[
 {city:'Home',path:'/'},
 ...cities.map(c=>({city:c.city,path:'/'+c.slug+'/'})),
 {city:'Sitemap',path:'/sitemap.xml'}
];
const results=[];
for(const target of targets){
 for(const host of ['winf.com.br','www.winf.com.br']){
  const url='https://'+host+target.path;
  const started=Date.now();
  try{
   const res=await fetch(url,{
    redirect:'follow',signal:AbortSignal.timeout(18000),
    headers:{'User-Agent':'Mozilla/5.0 (compatible; WINF-City-Healthcheck/1.0; +https://winf.com.br/)','Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'}
   });
   const html=await res.text();
   const rawTitle=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g,' ').trim()||'';
   const canonical=html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]||'';
   const expected=target.city==='Sitemap'?'<urlset':target.city==='Home'?'WINF':target.city;
   const found=html.toLowerCase().includes(expected.toLowerCase());
   const record={city:target.city,request:url,status:res.status,effectiveUrl:res.url,title:rawTitle,canonical,bytes:Buffer.byteLength(html),contentOk:found,latencyMs:Date.now()-started,
    securityBlock:/cloudflare|access denied|attention required|just a moment/i.test(rawTitle)?'possible':null};
   results.push(record);
   console.log('[LIVE]',JSON.stringify(record));
  }catch(e){
   const record={city:target.city,request:url,error:String(e?.cause?.message||e?.message||e).slice(0,180),latencyMs:Date.now()-started};
   results.push(record);console.log('[ERROR]',JSON.stringify(record));
  }
 }
}
mkdirSync('build',{recursive:true});
writeFileSync('build/winf-city-live-audit.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
const dead=results.filter(r=>r.status!==200||!r.contentOk);
console.log('SUMMARY',{total:results.length,successful:results.length-dead.length,problematic:dead.length});
if(dead.length){console.log('Problems:',dead.map(x=>x.request+' '+(x.status||x.error)).join('\n'))}
