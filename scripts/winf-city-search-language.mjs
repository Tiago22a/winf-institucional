/* WINF Select: responda à linguagem real de busca sem keyword stuffing ou textos ocultos. */
const context={
 santos:'Apartamentos e sacadas envidraçadas da orla pedem equilíbrio entre vista, luz e conforto.',
 'praia-grande':'Em sacadas e janelas de apartamentos, o controle solar deve respeitar a fachada e as condições de luz.',
 guaruja:'Casas e apartamentos próximos à orla podem exigir soluções diferentes para privacidade e incidência solar.',
 cuiaba:'Em apartamentos, condomínios e escritórios, a posição do sol e o tipo de vidro orientam a escolha da película.',
 sorocaba:'Em casas, condomínios e home offices, a escolha depende do vidro, da iluminação e do uso do ambiente.',
 'pilar-do-sul':'Residências e chácaras podem combinar janelas amplas, vista aberta e necessidade de conforto térmico.',
 'campina-grande':'A central recebe consultas sobre soluções para janelas e fachadas; a atuação local ainda depende de confirmação.'
};
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
export function applyCitySearchLanguage(html,city){
 const subject=escape(city.city);
 const copy=context[city.origin]||'A escolha depende das condições do seu vidro e do ambiente.';
 const note=city.origin==='campina-grande'?'Disponibilidade e cobertura em pré-ativação, sempre sob consulta.':'Consulte a central para verificar possibilidades de avaliação e agenda.';
 const block='<section class="winf-search-language" id="nomes-da-pelicula" aria-labelledby="winf-search-language-title">'+
 '<div class="winf-search-language-shell">'+
 '<p class="winf-search-language-eyebrow">ENTENDA O PRODUTO / '+subject.toLocaleUpperCase('pt-BR')+'</p>'+
 '<h2 id="winf-search-language-title">Chamam de insulfilm.<br><span>Nós falamos de solução para vidro.</span></h2>'+
 '<p class="winf-search-language-lead">Quem pesquisa por <strong>insulfilm em '+subject+'</strong> normalmente procura películas para controlar calor, reduzir luminosidade, ganhar privacidade ou proteger superfícies de vidro. O nome técnico é <strong>película de controle solar para vidros</strong>, também conhecida como <em>window film</em>. '+escape(copy)+'</p>'+
 '<div class="winf-search-language-faq">'+
 '<details><summary>Insulfilm, insulfilme, isofilm ou isolfilm: é a mesma coisa?</summary><p>São termos populares e variações de grafia que aparecem nas buscas. Algumas pessoas usam “Insulfilm” como nome genérico; a linha oferecida neste site é <strong>WINF Select™</strong>. Os produtos diferem em transmissão de luz, rejeição de energia solar, reflexão e compatibilidade com o vidro.</p></details>'+
 '<details><summary>“Plástico preto no vidro”, película fumê e película tingida são a mesma solução?</summary><p>Não necessariamente. “Plástico preto” é uma forma informal de descrever o escurecimento do vidro. Existem películas fumê, refletivas e opções mais transparentes. Escolher apenas pela cor pode trazer um resultado inadequado; avalie o tipo de vidro e o conforto desejado.</p></details>'+
 '<details><summary>Quero escurecer a janela, mas sem perder toda a luz. Qual escolher?</summary><p>Depende do nível de luminosidade, da vista e da privacidade desejada. Conheça <a href="/invisible/">Invisible™</a>, <a href="/blackpro/">BlackPro™</a> e <a href="/dual-reflect/">Dual Reflect™</a>; a indicação final exige avaliação das condições reais.</p></details>'+
 '</div><p class="winf-search-language-foot">Está procurando por película residencial, insulfilm para apartamento ou proteção solar para vidro em '+subject+'? Informe as medidas, fotos e o bairro para receber orientação. '+escape(note)+'</p>'+
 '</div></section>\n';
 const before=html.replace(/<section class="winf-search-language" id="nomes-da-pelicula"[\s\S]*?<\/section>\s*/g,'');
 const marker=/<section id="bairros-santos"/;
 if(!marker.test(before))throw new Error('Âncora territorial ausente: '+city.city);
 return before.replace(marker,block+'<section id="bairros-santos"');
}
