/* WINF Select™ — bloco de aplicações editoriais em todas as páginas de cidade.
 * Links HTML rastreáveis, conteúdo técnico original e contexto regional explícito.
 */
const guides=[
  {slug:'sacadas-varandas',label:'Sacadas e varandas',text:'Controle de calor, luz natural, preservação da vista e regras condominiais.',img:'/images/dualreflect-poster-2.webp'},
  {slug:'janelas-fachadas',label:'Janelas e fachadas',text:'Conforto térmico em casas, escritórios, fachadas e vitrines.',img:'/images/invisible-poster-2.webp'},
  {slug:'privacidade',label:'Privacidade para vidros',text:'O que muda entre películas refletivas, escuras e jateadas durante o dia e à noite.',img:'/images/blackpro-poster-2.webp'},
  {slug:'seguranca-vidros',label:'Segurança do vidro',text:'Retenção de fragmentos, limitações e avaliação técnica do conjunto de vidro.',img:'/images/securityblind/scene-01.webp'}
];
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export function applyApplicationSection(html,city){
  if(!html.includes('<section id="bairros-santos"'))throw new Error('Anchor ausente '+city.city);
  const intro=city.origin==='campina-grande'
   ? 'Conteúdo técnico para apoiar a escolha. A operação local ainda está em pré-ativação: consulte cobertura e disponibilidade.'
   : 'Entenda as possibilidades antes do orçamento. A seleção final depende do vidro, da orientação solar e da avaliação técnica na sua cidade.';
  const cards=guides.map((g,i)=>'<a class="winf-guide-card" href="/aplicacoes/'+g.slug+'/?origem='+encodeURIComponent(city.origin)+'" aria-label="Guia '+escape(g.label)+' da WINF Select™"><span class="winf-guide-card-photo" style="background-image:url(\''+g.img+'\')" aria-hidden="true"></span><span class="winf-guide-num">0'+(i+1)+' / GUIA DE APLICAÇÃO</span><strong>'+escape(g.label)+'</strong><span class="winf-guide-info">'+escape(g.text)+'</span><span class="winf-guide-link">ENTENDER A APLICAÇÃO ↗</span></a>').join('');
  const section='<section id="guias-aplicacoes" class="winf-guides-section" aria-labelledby="winf-guides-title"><div class="winf-guides-shell"><p class="section-label">CONHECIMENTO WINF SELECT™ / '+escape(city.city.toLocaleUpperCase('pt-BR'))+'</p><h2 id="winf-guides-title">Cada vidro pede<br><span>uma solução.</span></h2><p class="winf-guides-intro">'+escape(intro)+'</p><div class="winf-guide-grid">'+cards+'</div><p class="winf-guides-note">Conteúdo educativo, não laudo técnico. Instalação e disponibilidade sob consulta. Atendimento das 07h às 22h.</p></div></section>\n';
  const remove=/<section id="guias-aplicacoes" class="winf-guides-section"[\s\S]*?<\/section>\s*/g;
  const clean=html.replace(remove,'');
  return clean.replace(/(?=<section id="bairros-santos")/,section);
}
