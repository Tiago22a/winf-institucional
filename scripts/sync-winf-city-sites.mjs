/* WINF Select™ / sincronização das unidades por um único template visual.
 * Edite a página Santos (template) ou config/winf-active-cities.json.
 * Não edite páginas regionais geradas manualmente: regenerar restaura o padrão.
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyCitySeo} from './winf-city-seo.mjs';
import {applyTerritorySection} from './winf-city-territory.mjs';
import {applyApplicationSection} from './winf-city-applications.mjs';
import {applyCitySearchLanguage} from './winf-city-search-language.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const cfg=JSON.parse(readFileSync(resolve(root,'config/winf-active-cities.json'),'utf8'));
const template=readFileSync(resolve(root,cfg.template),'utf8');
const generateCity=function generateCity(template, city) {
  if(city.origin==='santos')return template;
  const route='/'+city.slug+'/';
  const sourceRoute='/pelicula-de-controle-solar-santos-sp/';
  let html=template.replaceAll(sourceRoute,route);
  html=html.replaceAll('origem=santos','origem='+city.origin);
  html=html.replaceAll('5513981113001',city.phone);
  html=html.replaceAll('SANTOS',city.city.toLocaleUpperCase('pt-BR'));
  html=html.replaceAll('Santos',city.city);
  if(city.uf!=='SP'){
    html=html.replaceAll('BR-SP','BR-'+city.uf);
    html=html.replaceAll(city.city+' SP',city.city+' '+city.uf);
    html=html.replaceAll(city.city+'/SP',city.city+'/'+city.uf);
    html=html.replaceAll(city.city+' · SP',city.city+' · '+city.uf);
    html=html.replaceAll(city.city.toLocaleUpperCase('pt-BR')+' SP',city.city.toLocaleUpperCase('pt-BR')+' '+city.uf);
    html=html.replaceAll(city.city.toLocaleUpperCase('pt-BR')+' · SP',city.city.toLocaleUpperCase('pt-BR')+' · '+city.uf);
  }
  const quotePhone=city.phone;
  // Nunca encaminhar os links de páginas de serviço para subpáginas exclusivas de Santos.
  html=html.replaceAll(route+'sacadas-varandas/',route+'#aplicacoes-santos');
  html=html.replaceAll(route+'janelas-residenciais/',route+'#aplicacoes-santos');
  html=html.replaceAll(route+'privacidade/',route+'#solucoes');
  const disclaimer=city.note.replaceAll('&','&amp;').replaceAll('<','&lt;');
  html=html.replace(/(<aside class="winf-city-service-strip"[^>]*><div><strong>)[^<]*(<\/strong><span>ATENDIMENTO \/ 07H ÀS 22H<\/span><\/div><p>)[^<]*(<\/p><\/aside>)/,(_m,a,b,c)=>a+'WINF SELECT™ / '+city.city.toLocaleUpperCase('pt-BR')+' '+city.uf+b+disclaimer+c);
  // Bairros são parâmetros da solicitação, não bairros inventados para cada cidade.
  html=html.replace(/<div class="santos-neighborhood-grid"[^>]*>[\s\S]*?<\/div>/,
    '<div class="santos-neighborhood-grid" aria-label="Orientações para a área de atendimento"><span>INFORME SEU BAIRRO</span><span>ENVIE SEU CEP</span><span>ORÇAMENTO SOB CONSULTA</span><span>AGENDA LOCAL A CONFIRMAR</span></div>');
  html=html.replace(/<div class="mt-14 border-t border-white\/10 pt-8 text-xs font-mono uppercase tracking-\[0\.3em\] text-zinc-400">[^<]*<\/div>/,
    '<div class="mt-14 border-t border-white/10 pt-8 text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">ATENDIMENTO '+city.city.toLocaleUpperCase('pt-BR')+' / INFORME SEU BAIRRO E CEP</div>');
  html=html.replace('placeholder="Ex.: Gonzaga, Boqueirão, Embaré"','placeholder="Ex.: seu bairro e referência de localização"');
  html=html.replace('Gonzaga, Boqueirão, Embaré, Ponta da Praia e','bairros da cidade e');
  html=html.replace(/<p class="text-lg font-light leading-relaxed text-zinc-200 sm:text-2xl">[^<]*<\/p>/,
    '<p class="text-lg font-light leading-relaxed text-zinc-200 sm:text-2xl">A WINF Select recebe solicitações de películas para apartamentos, casas, coberturas e projetos comerciais em '+city.city+'/'+city.uf+'. A solução é especificada conforme o tipo de vidro, incidência solar e objetivo de cada ambiente.</p>');
  html=html.replace('a paisagem que você quer preservar','a luminosidade que você deseja preservar');
  html=html.replace('consulte disponibilidade e agenda antes da visita.','consulte disponibilidade e agenda antes da visita. '+disclaimer);
  const social=city.instagram
   ? '<a href="https://www.instagram.com/'+city.instagram+'/" target="_blank" rel="noopener noreferrer">INSTAGRAM LOCAL / @'+city.instagram+' ↗</a>'
   : '<a href="https://www.instagram.com/winf.ofc/" target="_blank" rel="noopener noreferrer">INSTAGRAM OFICIAL WINF™ / @winf.ofc ↗</a>';
  html=html.replace(/<p class="winf-city-social">[\s\S]*?<\/p>/,'<p class="winf-city-social">'+social+'</p>');
  html=html.replace('"https://www.instagram.com/winfselect.santos/"',`"https://www.instagram.com/${city.instagram||'winf.ofc'}/"`);
  html=html.replace('"https://www.instagram.com/winfselect.santos/"]',city.instagram?'"https://www.instagram.com/'+city.instagram+'/"]':']');
  html=html.replace(/https:\/\/www\.instagram\.com\/winfselect\.santos\//g,city.instagram?'https://www.instagram.com/'+city.instagram+'/':'https://www.instagram.com/winf.ofc/');
  // Telefones das variantes de catálogo acompanham a cidade sem alterar os URLs canônicos globais.
  html=html.replaceAll('href="/invisible/?origem='+city.origin+'"','href="/invisible/?origem='+city.origin+'&amp;partner='+quotePhone+'"');
  html=html.replaceAll('href="/blackpro/?origem='+city.origin+'"','href="/blackpro/?origem='+city.origin+'&amp;partner='+quotePhone+'"');
  html=html.replaceAll('href="/dual-reflect/?origem='+city.origin+'"','href="/dual-reflect/?origem='+city.origin+'&amp;partner='+quotePhone+'"');
  html=html.replaceAll('href="/securityblind/?origem='+city.origin+'"','href="/securityblind/?origem='+city.origin+'&amp;partner='+quotePhone+'"');
  html=html.replaceAll('href="/miniblind-venetian/?origem='+city.origin+'"','href="/miniblind-venetian/?origem='+city.origin+'&amp;partner='+quotePhone+'"');
  const contactNote=city.origin==='campina-grande'
    ? 'Atendimento e disponibilidade em '+city.city+' sob consulta pela central oficial WINF.'
    : 'Atendimento comercial para '+city.city+'/'+city.uf+' pelo WhatsApp informado. Instalação sujeita à confirmação.';
  html=html.replace(/<p class="santos-area-notice">[\s\S]*?<\/p>/,
    '<p class="santos-area-notice">'+contactNote+' Recebemos solicitações das 07h às 22h. Esta página não representa loja física aberta ao público.</p>');
  // WhatsApp contextualiza o território mesmo quando há uma central comum.
  html=html.replaceAll('data-city="'+city.city+'"','data-city="'+city.city+'"');
  // O schema representa a cidade real e identifica o WhatsApp da central que a atende.
  const internationalPhone=city.phone==='5515997909049'?'+55-15-99790-9049':'+55-13-98111-3001';
  html=html.replace('"areaServed":"'+city.city+', SP"','"areaServed":"'+city.city+', '+city.uf+'"');
  html=html.replace('"telephone":"+55-13-98111-3001"','"telephone":"'+internationalPhone+'"');
  // Espaços em nomes compostos não devem permanecer soltos em URLs de WhatsApp.
  html=html.replace(/href="https:\/\/wa\.me\/[^"]+"/g,(url)=>url.replaceAll(city.city,encodeURIComponent(city.city)));
  if(city.origin==='campina-grande')html=html.replace('WhatsApp de '+city.city+' sempre à mão','atendimento da central oficial WINF sempre à mão');
  // A marca WINF global sempre remete ao Instagram oficial, e a conta local só existe quando fornecida.
  if(city.instagram){
    html=html.replace(/"sameAs":\["https:\/\/www\.instagram\.com\/winf\.ofc\/","https:\/\/www\.instagram\.com\/[^"]+\/"\]/,
      '"sameAs":["https://www.instagram.com/winf.ofc/","https://www.instagram.com/'+city.instagram+'/"]');
  } else {
    html=html.replace(/"sameAs":\["https:\/\/www\.instagram\.com\/winf\.ofc\/","https:\/\/www\.instagram\.com\/[^"]+\/"\]/,
      '"sameAs":["https://www.instagram.com/winf.ofc/"]');
  }
  return applyCitySeo(applyTerritorySection(applyCitySearchLanguage(applyApplicationSection(html,city),city),city),city);
};
let stale=0;
for(const city of cfg.cities){
  if(city.origin==='santos')continue;
  const dest=resolve(root,city.slug,'index.html');
  const expected=generateCity(template,city);
  if(process.argv.includes('--check')){
    let current='';try{current=readFileSync(dest,'utf8')}catch{}
    if(current!==expected){console.error('DIVERGENTE:',city.slug);stale++;}
  }else{
    mkdirSync(dirname(dest),{recursive:true});
    writeFileSync(dest,expected,'utf8');
    console.log('SINCRONIZADO:',city.slug);
  }
}
if(stale)process.exitCode=1;
