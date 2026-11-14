/* SynthWAVE.fm — exibir uma prévia sonora APENAS quando o MP3 real estiver publicado.
 * Esta prévia não altera o estado editorial do catálogo para 'published'.
 */
(()=>{
  'use strict';
  const episodeId=document.documentElement.dataset.audioEpisode;
  const ids=new Set(['ep01-cuidar-conectar','ep02-padrinho','ep03-invisivel','ep04-alem-da-pintura','ep05-recomeco','ep06-cidade','ep07-brasil','ep08-institute']);
  if(!ids.has(episodeId))return;
  const source='/synthwave/podcasts/audio-previews/'+episodeId+'-previa.mp3';
  fetch(source,{method:'HEAD',cache:'no-store'})
    .then(res=>{
      if(!res.ok||!/audio\/(mpeg|mp3)/i.test(res.headers.get('Content-Type')||''))return;
      const main=document.querySelector('main');
      if(!main)return;
      const panel=document.createElement('section');
      panel.setAttribute('aria-label','Prévia sonora do podcast');
      panel.style.cssText='background:#284b3b;color:#eff5ed;border:1px solid #74977c;padding:20px;margin:20px 0 32px';
      const heading=document.createElement('h2');
      heading.textContent='Ouça a prévia narrada';
      const description=document.createElement('p');
      description.textContent='Duas vozes sintéticas: LIA e DAVI. Trilha instrumental gerada para este episódio. Prévia em revisão, não edição final.';
      const audio=document.createElement('audio');
      audio.controls=true;
      audio.preload='none';
      audio.src=source;
      audio.style.cssText='width:100%;max-width:700px';
      const transcript=document.createElement('p');
      transcript.textContent='A transcrição integral do roteiro está disponível nesta página, abaixo.';
      panel.append(heading,description,audio,transcript);
      const first=main.querySelector('article')||main.firstElementChild;
      if(first&&first.parentNode===main)main.insertBefore(panel,first);
      else main.prepend(panel);
    })
    .catch(()=>{});
})();
