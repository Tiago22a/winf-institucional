/* Autoplay silencioso e sob demanda no topo do briefing.
   Nunca modifica a VSL (vídeo de manifesto com reprodução voluntária). */
(()=>{
  const video=document.getElementById('briefing-hero-motion');
  if(!video)return;
  const source=video.querySelector('source[data-src]');
  if(!source)return;
  const media=window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  const allowed=()=>media.matches&&!navigator.connection?.saveData;
  let loaded=false;
  const pause=()=>{try{video.pause();}catch(_){}};
  const play=()=>{
    if(!allowed()||document.hidden){pause();return;}
    if(!loaded){source.src=source.dataset.src;video.load();loaded=true;}
    const result=video.play();
    if(result&&typeof result.catch==='function')result.catch(()=>{});
  };
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{
      const active=entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.15);
      if(active)play();else pause();
    },{threshold:[0,.15,.5]});
    observer.observe(video);
  }else if(allowed())play();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(allowed()&&window.scrollY<window.innerHeight)play();});
  media.addEventListener?.('change',()=>{if(!allowed())pause();});
})();
