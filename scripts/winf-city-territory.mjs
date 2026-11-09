/* WINF Select — cobertura editorial e prospecção territorial por cidade.
 * A classificação é comercial e exploratória; nunca uma declaração de renda ou atendimento garantido.
 */
import {readFileSync} from 'node:fs';
const TERRITORIES=JSON.parse(readFileSync(new URL('../config/winf-neighborhoods.json',import.meta.url),'utf8')).territories;
export function applyTerritorySection(html,city) {
  const info=TERRITORIES[city.origin];
  if(!info)throw new Error("Plano territorial ausente: "+city.origin);
  const escape=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const title=escape(city.city),uf=escape(city.uf);
  const prelaunch=city.origin==="campina-grande";
  const whtext=encodeURIComponent("Olá! Vim pelo site WINF Select "+city.city+"/"+city.uf+". Tenho interesse em película para vidros. Meu bairro é: ");
  const cta="https://wa.me/"+city.phone+"?text="+whtext;
  const locationSocial=city.instagram
    ? '<a href="https://www.instagram.com/'+escape(city.instagram)+'/" target="_blank" rel="noopener noreferrer">INSTAGRAM LOCAL / @'+escape(city.instagram)+' ↗</a>'
    : '<a href="https://www.instagram.com/winf.ofc/" target="_blank" rel="noopener noreferrer">INSTAGRAM OFICIAL / @winf.ofc ↗</a>';
  const chips=items=>items.map(n=>'<li>'+escape(n)+'</li>').join("");
  const category=prelaunch?"ÁREAS EM MAPEAMENTO COMERCIAL":"REGIÕES PARA CONSULTA DE ATENDIMENTO";
  const regionNotice=prelaunch
    ? "A unidade está em pré-ativação. Os bairros são áreas de prospecção e não representam cobertura técnica confirmada. Antes de contratar, consulte a central oficial WINF."
    : "Bairros indicados como foco comercial e áreas de consulta. A inclusão não garante disponibilidade imediata de instalador ou prazo; confirme a agenda pela central.";
  const extra=escape(info.secondaryContext);
  const notice="Atendimento comercial das 07h às 22h. Não há loja física anunciada neste endereço. Informe seu bairro e CEP para confirmar condições de instalação.";
  const htmlSection=[
'<section id="bairros-santos" class="santos-local-area winf-territory-local" aria-labelledby="santos-bairros-title">',
'<div class="santos-local-shell">',
'<div class="winf-territory-intro"><p class="section-label">WINF SELECT™ / '+title.toLocaleUpperCase("pt-BR")+' · '+uf+'</p>',
'<h2 id="santos-bairros-title">Seu bairro.<br><span>Sua solução em '+title+'.</span></h2>',
'<p>'+escape(info.intro)+'</p>',
'<p class="winf-territory-context">'+extra+'</p>',
'<a href="'+cta+'" class="santos-area-cta" target="_blank" rel="noopener noreferrer">CONSULTAR SEU BAIRRO NO WHATSAPP ↗</a></div>',
'<div class="winf-territory-zones" aria-label="Bairros e regiões de interesse comercial em '+title+'">',
'<div class="winf-territory-cluster"><p class="winf-territory-label">01 / FOCO COMERCIAL INICIAL</p><h3>Principais regiões</h3>',
'<ul class="winf-territory-tags">'+chips(info.priority)+'</ul></div>',
'<div class="winf-territory-cluster winf-territory-cluster--secondary"><p class="winf-territory-label">02 / COBERTURA A CONSULTAR</p><h3>Outros bairros e regiões</h3>',
'<ul class="winf-territory-tags">'+chips(info.complementary)+'</ul></div>',
'</div></div>',
'<p class="winf-territory-coverage"><strong>'+category+'.</strong> '+regionNotice+'</p>',
'<p class="santos-area-notice">'+notice+'</p>',
'<p class="winf-city-social">'+locationSocial+'</p>',
'<div class="santos-process"><p class="section-label">DO CONTATO À AVALIAÇÃO</p><div class="santos-process-grid">',
'<div><span>01</span><h3>Informe bairro e CEP</h3><p>Identifique o endereço e envie fotos das janelas, sacadas ou fachadas para orientar a avaliação.</p></div>',
'<div><span>02</span><h3>Especifique o vidro</h3><p>Informe medidas, incidência solar, tipo de vidro, objetivo de privacidade e possíveis regras condominiais.</p></div>',
'<div><span>03</span><h3>Confirme condições e agenda</h3><p>A central verifica a disponibilidade técnica, as opções de película, os valores e a possibilidade de instalação.</p></div>',
'</div></div></section>'
].join("\n");
  const pattern=/<section id="bairros-santos" class="santos-local-area[^"]*" aria-labelledby="santos-bairros-title">[\s\S]*?<\/section>/;
  if(!pattern.test(html))throw new Error("Seção dos bairros não localizada em "+city.city);
  return html.replace(pattern,htmlSection);
}
