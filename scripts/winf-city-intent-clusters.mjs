/* WINF Select™: arquitetura de busca cidade × aplicação × necessidade.
 * Sem centenas de páginas quase iguais: um bloco original e útil por cidade.
 */
import {readFileSync} from 'node:fs';
const regions=JSON.parse(readFileSync(new URL('../config/winf-city-intents.json',import.meta.url),'utf8')).territories;
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function applyCityIntentClusters(html,city){
  const e=regions[city.origin];
  if(!e)throw new Error('Falta cluster regional: '+city.origin);
  const title=escape(city.city);
  const content=e.segments.map((s,i)=>'<a class="winf-intent-card" href="/aplicacoes/'+s[3]+'/" aria-label="'+escape(s[0])+' — guia de aplicação">'+
    '<span class="winf-intent-card-index">0'+(i+1)+' / '+escape(s[1])+'</span>'+
    '<strong>'+escape(s[0])+'</strong><span>'+escape(s[2])+'</span>'+
    '<em>ENTENDA A APLICAÇÃO ↗</em></a>').join('');
  const contactNote=city.origin==='campina-grande'
   ? 'Consulta pela central WINF; unidade em pré-ativação e agenda local ainda não confirmada.'
   : 'O atendimento, a avaliação técnica e a instalação dependem de disponibilidade confirmada pela central.';
  const newSection='<section class="winf-intent-section" id="solucoes-por-necessidade" aria-labelledby="winf-intent-title">'+
  '<div class="winf-intent-container">'+
  '<p class="winf-intent-eyebrow">GUIA DE ESCOLHA / '+escape(city.city.toUpperCase())+' · '+escape(city.uf)+'</p>'+
  '<h2 id="winf-intent-title">'+escape(e.headline)+'</h2>'+
  '<p class="winf-intent-lead">'+escape(e.intro)+'</p>'+
  '<div class="winf-intent-grid">'+content+'</div>'+
  '<div class="winf-intent-summary"><p>'+escape(e.search)+'</p><p>'+escape(contactNote)+'</p>'+
  '<nav aria-label="Conteúdo nacional e outras localidades WINF"><a href="/peliculas-de-controle-solar-brasil/">GUIA NACIONAL DE PELÍCULAS ↗</a><a href="/mapa-do-site/">EXPLORAR O MAPA DE SOLUÇÕES ↗</a></nav>'+
  '</div></div></section>\n';
  const clean=html.replace(/<section class="winf-intent-section" id="solucoes-por-necessidade"[\s\S]*?<\/section>\s*/g,'');
  const marker=/<section id="bairros-santos"/;
  if(!marker.test(clean))throw new Error('Âncora de bairros ausente '+city.city);
  return clean.replace(marker,newSection+'<section id="bairros-santos"');
}
