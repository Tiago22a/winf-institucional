/* SYNTHWAVE.fm — acervo editorial canônico.
 * Cada item representa a situação real do conteúdo, não sua intenção de publicação.
 * Publicar com status "published" SOMENTE com arquivo autorizado, transcrição e direitos.
 * A edição acontece em GitHub por revisão/PR, jamais no navegador público.
 */
(function(global){
 'use strict';
 const catalogue=[
  {
   id:'ep01-cuidar-conectar',series:'CUIDAR & CONECTAR',
   category:'Pessoas e propósito',title:'Uma conversa pode abrir uma porta',
   summary:'Uma história fictícia sobre encontro entre gerações, escuta e oportunidades que começam com respeito.',
   hook:'Quando foi a última vez que uma pergunta mudou o rumo de uma conversa?',
   artwork:'photo-1508739773434-c26b3d09e071',
   status:'scripted',format:'Duas vozes de IA · LIA & DAVI',
   scriptUrl:'/synthwave/podcasts/temporada-01/ep01-cuidar-conectar/',
   projectUrl:'/partners/cuidar-e-conectar/',
   label:'Roteiro original pronto para revisão; áudio ainda não gravado'
  },
  {
   id:'ep02-padrinho',series:'PADRINHO MODERN',
   category:'Talento e mentoria',title:'Quando alguém acredita em você',
   summary:'O que diferencia uma oportunidade responsável de uma promessa que não se sustenta?',
   hook:'Talento precisa de uma porta aberta. Mas de qual tipo?',
   artwork:'photo-1518709268805-4e9042af9f23',
   status:'planned',format:'Duas vozes de IA',
   projectUrl:'/partners/padrinho-modern/'
  },
  {
   id:'ep03-invisivel',series:'O INVISÍVEL QUE PROTEGE',
   category:'Ciência e arquitetura',title:'Conforto que quase não se vê',
   summary:'Entenda por que fazer as perguntas certas importa mais do que repetir promessas sobre películas para vidro.',
   hook:'Quando o vidro parece igual, o que muda no conforto?',
   artwork:'photo-1486406146926-c627a92ad1ab',
   status:'planned',format:'Duas vozes de IA',
   projectUrl:'/invisible/'
  },
  {
   id:'ep04-alem-da-pintura',series:'ALÉM DA PINTURA',
   category:'Automotivo e proteção',title:'Por que proteger o que nos move?',
   summary:'Cuidados, limites e escolhas conscientes sobre PPF e tratamento de superfícies.',
   hook:'O que significa proteger a história de um veículo?',
   artwork:'photo-1542282088-72c9c27ed0cd',
   status:'planned',format:'Duas vozes de IA',
   projectUrl:'/aerocore/'
  },
  {
   id:'ep05-recomeco',series:'A ARTE DE RECOMEÇAR',
   category:'Vida e desenvolvimento',title:'O próximo capítulo começa pequeno',
   summary:'Uma dramatização declaradamente fictícia sobre paciência, aprendizado e recomeços.',
   hook:'E se o próximo passo não precisasse ser gigante?',
   artwork:'photo-1511671782779-c97d3d27a1d4',
   status:'planned',format:'Duas vozes de IA'
  },
  {
   id:'ep06-cidade',series:'A CIDADE QUE CONECTA',
   category:'Comunidade e futuro',title:'Tecnologia serve a quem?',
   summary:'Ferramentas úteis surgem da escuta das pessoas, não só da vontade de lançar aplicativos.',
   hook:'E se o primeiro requisito de uma solução fosse escutar?',
   artwork:'photo-1509198397868-475647b2a1e5',
   status:'planned',format:'Duas vozes de IA'
  },
  {
   id:'ep07-brasil',series:'DO BRASIL PARA O MUNDO',
   category:'Empreendedorismo',title:'Sonhar grande, construir com método',
   summary:'Uma conversa sobre documentar processos, validar hipóteses e crescer com responsabilidade.',
   hook:'Qual a diferença entre expansão e precipitação?',
   artwork:'photo-1519608487953-e999c86e7455',
   status:'planned',format:'Duas vozes de IA'
  },
  {
   id:'ep08-institute',series:'UM NOVO JEITO DE APRENDER',
   category:'WINF Institute',title:'Aprender é um caminho, não um botão',
   summary:'Teoria, prática, segurança e evolução contínua nas formações do WINF Institute™.',
   hook:'Uma aula termina quando alguém fecha a tela?',
   artwork:'photo-1493225457124-a3eb161ffa5f',
   status:'planned',format:'Duas vozes de IA'
  }
 ];
 function validEpisode(item){
  if(!item||typeof item.id!=='string'||!/^[a-z0-9-]{3,70}$/.test(item.id))return false;
  if(!['planned','scripted','published'].includes(item.status))return false;
  if(!item.title||!item.series||!item.category||!item.summary||!item.hook)return false;
  if(item.status==='scripted'&&(!item.scriptUrl||!item.scriptUrl.startsWith('/synthwave/')))return false;
  if(item.status==='published'){
   if(!item.audioUrl||!/^https:\/\//.test(item.audioUrl))return false;
   if(!item.transcriptUrl||!item.transcriptUrl.startsWith('/synthwave/'))return false;
   if(!item.rightsStatement||!item.rightsApprovedAt||!item.productionReviewedAt)return false;
  }
  return true;
 }
 if(!catalogue.every(validEpisode)||new Set(catalogue.map(x=>x.id)).size!==catalogue.length){
  console.error('[SynthWAVE] Catálogo editorial inválido; episódios não serão exibidos.');
  global.SYNTHWAVE_PODCAST_CATALOG=[];
  return;
 }
 global.SYNTHWAVE_PODCAST_CATALOG=Object.freeze(catalogue.map(entry=>Object.freeze({...entry})));
 global.SynthwaveEditorial={validEpisode};
})(window);
