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
  {id:'spot-24',title:'Uma pergunta depois da música',kind:'editorial',text:'Quando a próxima música terminar, talvez fique uma pergunta interessante. Que lugar tem um som inesquecível para você? SynthWAVE Experiências. Histórias feitas para ouvir, observar e descobrir.'}
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
  const shift=blocks.indexOf(block);
  return spots[(Math.floor(n/songsPerSpot)-1+Math.max(0,shift)*2)%spots.length];
 }
 global.SynthwaveStation=Object.freeze({
  blocks:Object.freeze(blocks.map(b=>Object.freeze({...b,categories:Object.freeze([...b.categories])}))),
  spots:Object.freeze(spots.map(s=>Object.freeze({...s}))),
  songsPerSpot,blockAt,queueFor,spotFor
 });
})(window);
