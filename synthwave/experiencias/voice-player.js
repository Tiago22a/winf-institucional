/* SynthWAVE Experiências — leitor TTS opcional e explícito.
 * A narração é gerada no navegador. Não há fonograma hospedado ou podcast final publicado.
 * A rádio tradicional continua independente desta experiência.
 */
(function(global){
 'use strict';
 let generation=0,active=false,pending=null,paused=false,story=null,line=0,all=[],watchdog=null;
 const $=id=>document.getElementById(id);
 const available=()=>Boolean(global.speechSynthesis&&global.SpeechSynthesisUtterance);
 const status=(message)=>{const el=$('experienceSpeechStatus');if(el)el.textContent=message};
 const current=(index)=>{
  document.querySelectorAll('[data-exp-line]').forEach(el=>el.classList.toggle('sw-exp-speaking',Number(el.dataset.expLine)===index));
 };
 const clearWatchdog=()=>{if(watchdog){clearTimeout(watchdog);watchdog=null}};
 function stop(){
  generation++;active=false;paused=false;story=null;pending=null;all=[];line=0;
  clearWatchdog();
  if(available())try{global.speechSynthesis.cancel()}catch(_){}
  current(-1);
  const btn=$('expPlayButton');if(btn)btn.textContent='▶ Ouvir narração';
 }
 function voices(){
  if(!available())return [];
  try{return global.speechSynthesis.getVoices().filter(v=>/^pt(?:-BR|-PT)?$/i.test(v.lang))}catch(_){return []}
 }
 function sayNext(token){
  if(!active||token!==generation||paused)return;
  if(line>=all.length){
   active=false;pending=null;current(-1);status('Narração concluída. Você pode voltar à rádio ou escolher outra experiência.');
   const btn=$('expPlayButton');if(btn)btn.textContent='▶ Ouvir novamente';
   return;
  }
  const turn=all[line];
  const message=new global.SpeechSynthesisUtterance(turn.text);
  message.lang='pt-BR';
  message.rate=turn.speaker==='LIA'?.96:1.05;
  message.pitch=turn.speaker==='LIA'?1.12:.90;
  message.volume=.85;
  const list=voices();
  if(list.length>=2){message.voice=turn.speaker==='LIA'?list[0]:list[1]}
  else if(list.length===1)message.voice=list[0];
  pending=message;
  status('Ouvindo '+story.title+' · '+turn.speaker+' · fala '+(line+1)+' de '+all.length);
  current(line);
  message.onend=()=>{if(token!==generation||!active||paused)return;clearWatchdog();line++;setTimeout(()=>sayNext(token),160)};
  message.onerror=()=>{if(token!==generation)return;stop();status('A narração foi interrompida pelo navegador. O roteiro completo continua disponível para leitura.')};
  // Alguns navegadores interrompem SpeechSynthesis sem evento, especialmente em segundo plano.
  watchdog=setTimeout(()=>{
   if(token!==generation||!active||paused)return;
   stop();status('O navegador interrompeu a narração. Você pode continuar lendo ou tentar novamente.');
  },45000);
  try{global.speechSynthesis.speak(message)}
  catch(_){stop();status('Narração não disponível neste dispositivo. Leia o roteiro abaixo.')}
 }
 function play(id){
  const item=(global.SYNTHWAVE_EXPERIENCES||[]).find(v=>v.id===id);
  if(!item){status('Experiência não encontrada.');return}
  if(!available()){status('Seu navegador não oferece narração por voz. O roteiro permanece disponível integralmente.');return}
  stop();
  story=item;active=true;all=item.chapters.flatMap(ch=>ch.lines.map(x=>({speaker:x[0],text:x[1]})));
  if(!all.length){status('Roteiro vazio.');stop();return}
  const btn=$('expPlayButton');if(btn)btn.textContent='■ Parar narração';
  status('Preparando vozes sintéticas locais para '+item.title+'...');
  const token=++generation;
  try{global.speechSynthesis.cancel()}catch(_){}
  sayNext(token);
 }
 function toggle(id){
  if(active&&story?.id===id){stop();status('Narração interrompida.');return}
  play(id);
 }
 global.SynthwaveExperiencesPlayer={available,play,toggle,stop,getState:()=>({active,id:story?.id||null,index:line,total:all.length})};
})(window);
