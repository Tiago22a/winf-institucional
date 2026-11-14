/* SynthWAVE.fm — grade editorial local de 24 horas.
 * Não cria uma transmissão sincronizada: cada navegador inicia sua própria fila.
 * Vinhetas são textos originais para narração TTS do dispositivo; sem peças pagas.
 */
(function(global){
 'use strict';
 const blocks=[
  {start:0,end:4,range:'00:00–04:00',label:'AFTER HOURS',description:'Atmosferas discretas para a madrugada.',categories:['Ambient','Focus','WINF Select'],icon:'🌙'},
  {start:4,end:8,range:'04:00–08:00',label:'FIRST LIGHT',description:'Acordar com leveza e descobrir novos caminhos.',categories:['Focus','Ambient','Originals'],icon:'🌅'},
  {start:8,end:12,range:'08:00–12:00',label:'FOCUS FREQUENCY',description:'Concentração, estudo e trabalho criativo.',categories:['Focus','Ambient','WINF Select'],icon:'☀️'},
  {start:12,end:16,range:'12:00–16:00',label:'CREATIVE CURRENT',description:'A pausa que inspira o próximo projeto.',categories:['Originals','Focus','AeroCore'],icon:'🎨'},
  {start:16,end:20,range:'16:00–20:00',label:'CITY DRIVE',description:'Movimento, estrada e energia para o fim da tarde.',categories:['Drive','NeoSkin','AeroCore'],icon:'🚗'},
  {start:20,end:24,range:'20:00–00:00',label:'NIGHT GLOW',description:'Música para desacelerar e abrir espaço às ideias.',categories:['Ambient','Drive','Originals'],icon:'🌃'}
 ];
 const spots=[
  {id:'spot-01',title:'Entre na frequência',kind:'identidade',text:'Você está na SynthWAVE ponto FM. Um lugar para ouvir sem cadastro, explorar novas trilhas e encontrar a sua própria frequência. A música continua agora.'},
  {id:'spot-02',title:'Descubra seu momento',kind:'experiencia',text:'Toda hora tem uma trilha. Quer estudar, trabalhar, viajar ou relaxar? Explore as coleções da SynthWAVE. Você escolhe o momento. A gente cuida da atmosfera.'},
  {id:'spot-03',title:'Mar e chuva',kind:'experiencia',text:'Experimente ouvir sua música com o som da chuva ou do mar. No mixer da SynthWAVE, você ajusta a música e o ambiente separadamente. É só explorar.'},
  {id:'spot-04',title:'A força de uma conversa',kind:'editorial',text:'Às vezes, uma boa conversa muda um dia inteiro. Conheça os roteiros da temporada Cuidar e Conectar na área de podcasts da SynthWAVE. Uma nova frequência para pensar.'},
  {id:'spot-05',title:'Conhecer antes de escolher',kind:'educacao',text:'O que não enxergamos também pode fazer diferença. No WINF Institute, aprender começa pelas perguntas certas. Conhecimento é uma experiência que continua fora da tela.'},
  {id:'spot-06',title:'Recomeçar é movimento',kind:'experiencia',text:'Não precisa de um grande plano para experimentar algo novo. Às vezes, basta mudar a trilha, abrir a janela ou começar uma boa ideia. Continue na sua frequência.'},
  {id:'spot-07',title:'Na estrada',kind:'experiencia',text:'Se a sua experiência é na estrada, descubra as coleções de movimento e noite da SynthWAVE. E, se estiver dirigindo, ajuste o som antes de sair e mantenha o foco no caminho.'},
  {id:'spot-08',title:'Crie sua seleção',kind:'experiencia',text:'Achou uma faixa que combina com seu dia? Salve nos favoritos ou monte sua playlist. Você pode fazer isso no próprio navegador, sem cadastro obrigatório.'},
  {id:'spot-09',title:'Cuidar do tempo',kind:'editorial',text:'Entre uma tarefa e outra, existe espaço para respirar, observar e escutar. A SynthWAVE é um convite para encontrar o seu ritmo, sem pressa e sem cobrança.'},
  {id:'spot-10',title:'Ideias em movimento',kind:'educacao',text:'Conhecimento e criatividade se encontram quando fazemos novas perguntas. Explore os conteúdos da SynthWAVE e do WINF Institute. Novas experiências começam pela curiosidade.'},
  {id:'spot-11',title:'Seu universo sonoro',kind:'identidade',text:'Aqui não existe fila para entrar nem formulário para dar o play. SynthWAVE ponto FM. Música, histórias, movimento e uma atmosfera para chamar de sua.'},
  {id:'spot-12',title:'Do Brasil para o mundo',kind:'identidade',text:'Do Brasil para o mundo, uma nova frequência de ideias. Você está ouvindo SynthWAVE ponto FM. A próxima faixa começa agora.'},
  {id:'spot-13',title:'Cinco sons na sua rua',kind:'experiencia',text:'Uma cidade tem muitas histórias pequenas. Já reparou no som de uma porta, de uma folha ou de um ônibus chegando? Conheça Cinco sons antes do próximo Play na nova seção Experiências da SynthWAVE.'},
  {id:'spot-14',title:'A fotografia na gaveta',kind:'experiencia',text:'Uma fotografia antiga pode abrir uma conversa que não cabe numa legenda. Na SynthWAVE Experiências, descubra A fotografia que ficou na gaveta. Uma história fictícia sobre escuta e memórias.'},
  {id:'spot-15',title:'A janela às duas da tarde',kind:'experiencia',text:'O mesmo cômodo muda com a luz e com a hora do dia. Uma janela para o mundo é uma história da SynthWAVE sobre observar antes de escolher. Ela está na seção Experiências.'},
  {id:'spot-16',title:'Quando o plano muda',kind:'experiencia',text:'Um projeto pode mudar sem perder a responsabilidade. O dia em que o plano mudou é uma história original sobre colaboração, improviso e escolhas honestas. Leia ou ouça a narração na SynthWAVE.'},
  {id:'spot-17',title:'A estrada tem silêncio',kind:'experiencia',text:'A viagem também é feita de intervalos. Descubra A estrada também tem silêncio na SynthWAVE Experiências. Se estiver dirigindo, não ajuste o aparelho: escolha a música antes de sair.'},
  {id:'spot-18',title:'A pergunta da máquina',kind:'experiencia',text:'E se a melhor resposta de uma inteligência artificial fosse mostrar o que ainda precisamos perguntar? Ouça A máquina que fez uma pergunta, uma história original com LIA e DAVI na SynthWAVE.'},
  {id:'spot-19',title:'Duas vozes, seis histórias',kind:'identidade',text:'LIA e DAVI apresentam seis histórias completas no Volume Um de SynthWAVE Experiências. Memórias, cidades, luz, criatividade e descobertas. Roteiros gratuitos para ler ou ouvir com a voz do navegador.'},
  {id:'spot-20',title:'Escutar de outra forma',kind:'experiencia',text:'Tente mudar a forma de ouvir. Escolha uma música tranquila, ajuste o volume e perceba o que acontece ao redor. Nenhuma obrigação, nenhuma promessa. A SynthWAVE é sua companhia sonora.'},
  {id:'spot-21',title:'A rua que se transforma',kind:'editorial',text:'A paisagem de um bairro não termina nos prédios. Tem pessoas, sons, histórias e silêncios. Conheça nossos relatos fictícios de cotidiano em SynthWAVE Experiências. A próxima faixa começa agora.'},
  {id:'spot-22',title:'Nem todo conteúdo é anúncio',kind:'identidade',text:'Aqui, uma história pode existir apenas para te fazer pensar. SynthWAVE Experiências reúne conversas originais entre duas vozes de IA. Não é preciso comprar nada para ouvir.'},
  {id:'spot-23',title:'Uma página, uma pausa',kind:'experiencia',text:'Se hoje você quer menos informações, tudo bem. Pode deixar a rádio tocar. Se quiser descobrir algo novo, há seis experiências completas para escolher e escutar. A frequência acompanha o seu ritmo.'},
  {id:'spot-24',title:'Uma pergunta depois da música',kind:'editorial',text:'Quando a próxima música terminar, talvez fique uma pergunta interessante. Que lugar tem um som inesquecível para você? SynthWAVE Experiências. Histórias feitas para ouvir, observar e descobrir.'},
  {"id":"spot-25","kind":"capsula","title":"Janelas da madrugada","slot":"AFTER HOURS","contentId":"c01-cidade-madrugada","text":"Algumas luzes seguem acesas quando a cidade parece dormir. Na cápsula A cidade que não dorme inteira, LIA e DAVI descobrem histórias sem invadir a vida de ninguém. Encontre em Experiências."},
  {"id":"spot-26","kind":"capsula","title":"Uma página pode esperar","slot":"AFTER HOURS","contentId":"c02-caderno-inacabado","text":"Um caderno de ideias interrompidas não precisa virar uma coleção de cobranças. Ouça O caderno das coisas inacabadas em SynthWAVE Experiências. Uma história breve para a madrugada."},
  {"id":"spot-27","kind":"capsula","title":"Manhã sem notificação","slot":"FIRST LIGHT","contentId":"c03-primeiro-som","text":"Uma xícara, uma cortina, o som do dia começando. Conheça O primeiro som da manhã, nova cápsula da SynthWAVE. Não é uma receita para render mais, é apenas um convite para perceber."},
  {"id":"spot-28","kind":"capsula","title":"Uma esquina, duas rotas","slot":"FIRST LIGHT","contentId":"c04-rua-caminhos","text":"O caminho mais curto não conta a história inteira. A rua tem dois caminhos é uma pequena ficção sobre acessibilidade, contexto e escolhas. Disponível na seção Experiências da SynthWAVE."},
  {"id":"spot-29","kind":"capsula","title":"Intervalo sem obrigação","slot":"FOCUS FREQUENCY","contentId":"c05-pausa-no-dia","text":"Nem toda pausa precisa ser transformada em mais uma tarefa. Em Uma pausa que cabe no dia, LIA e DAVI conversam sobre escolher o próprio ritmo. Descubra a cápsula em Experiências."},
  {"id":"spot-30","kind":"capsula","title":"A frase que não chegou","slot":"FOCUS FREQUENCY","contentId":"c06-palavra-rascunho","text":"Às vezes, uma página em branco pede uma pergunta antes da primeira frase. A palavra que não saía é uma história curta para quem cria. Está na seção Experiências da SynthWAVE."},
  {"id":"spot-31","kind":"capsula","title":"Objeto, nova pergunta","slot":"CREATIVE CURRENT","contentId":"c07-objeto-funcao","text":"Uma luminária quebrada pode virar o começo de uma exposição imaginária. Descubra O objeto que mudou de função, uma cápsula sobre olhar de outro jeito para o que já conhecemos."},
  {"id":"spot-32","kind":"capsula","title":"O cartaz mais claro","slot":"CREATIVE CURRENT","contentId":"c08-cartaz-tres-versoes","text":"Uma peça bonita pode esquecer a informação mais importante. Em O cartaz de três versões, criatividade encontra clareza e acessibilidade. Uma cápsula original na SynthWAVE."},
  {"id":"spot-33","kind":"capsula","title":"O olhar de quem acompanha","slot":"CITY DRIVE","contentId":"c09-banco-passageiro","text":"Uma viagem pode ter duas paisagens: a de quem dirige e a de quem observa do banco do passageiro. Ouça O mundo pelo banco do passageiro. No volante, sua atenção é para a estrada."},
  {"id":"spot-34","kind":"capsula","title":"Além do ponto no mapa","slot":"CITY DRIVE","contentId":"c10-mapa-incompleto","text":"Dez pontos no mapa cabem num dia? Talvez a melhor viagem peça menos pressa. Descubra O mapa que não mostra tudo, uma cápsula sobre lugares, tempo e experiências."},
  {"id":"spot-35","kind":"capsula","title":"O jantar sem playlist perfeita","slot":"NIGHT GLOW","contentId":"c11-jantar-trilha","text":"Nem toda conversa precisa de uma trilha que chame atenção. Conheça O jantar sem trilha perfeita, uma história com LIA e DAVI. Encontre na seção Experiências da SynthWAVE."},
  {"id":"spot-36","kind":"capsula","title":"A varanda ainda acesa","slot":"NIGHT GLOW","contentId":"c12-luz-varanda","text":"Uma luz numa varanda não revela quem mora ali. Mas pode iniciar uma brincadeira criativa. Ouça A última luz da varanda, uma cápsula sobre imaginação, respeito e uma boa noite."}
 ];
 const songsPerSpot=5;
 function blockAt(date){
  const hour=Number(date?.getHours?.());
  if(!Number.isInteger(hour)||hour<0||hour>23)return blocks[0];
  return blocks.find(b=>hour>=b.start&&hour<b.end)||blocks[0];
 }
 function queueFor(tracks,block){
  if(!Array.isArray(tracks)||!tracks.length)return [];
  const wanted=block?.categories||[];
  const preferred=[],other=[];
  tracks.forEach((track,index)=>{
   if(!track||(!track.audioUrl&&!track.synthPreset))return;
   if(wanted.includes(track.category))preferred.push(index);
   else other.push(index);
  });
  if(!preferred.length)return other;
  // A cada duas faixas relacionadas ao horário, uma descoberta de outra coleção.
  const order=[],seen=new Set();
  while(preferred.length||other.length){
   for(let i=0;i<2&&preferred.length;i++){
    const index=preferred.shift();if(!seen.has(index)){seen.add(index);order.push(index)}
   }
   if(other.length){
    const index=other.shift();if(!seen.has(index)){seen.add(index);order.push(index)}
   }
  }
  return order;
 }
 function spotFor(completed,block){
  const n=Number(completed);
  if(!Number.isInteger(n)||n<=0||n%songsPerSpot!==0)return null;
  const shift=blocks.findIndex(b=>b.start===block?.start);
  const slot=blocks[Math.max(0,shift)];
  const segment=n/songsPerSpot;
  const generalSpots=spots.filter(s=>s.kind!=='capsula');
  // Uma entre cada três chamadas de intervalo apresenta cápsulas do horário atual.
  if(segment%3===0){
   const capsuleSpots=spots.filter(s=>s.kind==='capsula'&&s.slot===slot.label);
   if(capsuleSpots.length)return capsuleSpots[(Math.floor(segment/3)-1)%capsuleSpots.length];
  }
  return generalSpots[(segment-1+Math.max(0,shift)*2)%generalSpots.length];
 }
 global.SynthwaveStation=Object.freeze({
  blocks:Object.freeze(blocks.map(b=>Object.freeze({...b,categories:Object.freeze([...b.categories])}))),
  spots:Object.freeze(spots.map(s=>Object.freeze({...s}))),
  songsPerSpot,blockAt,queueFor,spotFor
 });
})(window);
