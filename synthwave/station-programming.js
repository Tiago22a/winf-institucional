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
  {id:'spot-12',title:'Do Brasil para o mundo',kind:'identidade',text:'Do Brasil para o mundo, uma nova frequência de ideias. Você está ouvindo SynthWAVE ponto FM. A próxima faixa começa agora.'}
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
