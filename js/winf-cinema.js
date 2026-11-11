/* WINF Cinematic Experience - load each motion only when visible, pause off-screen, support still posters. */
(()=>{'use strict';
 const films=[...document.querySelectorAll('[data-winf-cinema]')];
 if(!films.length)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const dataSaver=()=>navigator.connection?.saveData===true;
 const on=(v)=>{const s=v.querySelector('source[data-src]');if(!s||v.dataset.wcLoaded)return;s.src=s.dataset.src;v.dataset.wcLoaded='yes';v.load()};
 const halt=(v)=>{try{v.pause()}catch(e){}};
 const visible=(v)=>{const r=v.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0};
 // Uma mídia alternativa só é usada quando declarada no HTML; nunca substitui
 // silenciosamente o filme original, que continua sendo a fonte prioritária.
 const fallback=(v)=>{
  const s=v.querySelector('source[data-src]'),url=s?.dataset.fallbackSrc;
  if(!url||v.dataset.wcFallbackUsed==='yes')return false;
  v.dataset.wcFallbackUsed='yes';s.src=url;v.load();
  if(!reduced.matches&&!dataSaver()&&!document.hidden&&visible(v)){
   const p=v.play();if(p&&p.catch)p.catch(()=>{});
  }
  return true;
 };
 const play=(v)=>{if(reduced.matches||dataSaver()||document.hidden)return;on(v);const p=v.play();if(p&&p.catch)p.catch(()=>{})};
 const error=(v)=>{
  if(fallback(v))return;
  const figure=v.closest('.wc-film');
  if(figure)figure.dataset.wcError='video-unavailable';
  halt(v);v.classList.remove('wc-playing');
 };
 for(const v of films){v.muted=true;v.loop=true;v.playsInline=true;v.addEventListener('playing',()=>{v.classList.add('wc-playing');v.closest('.wc-film')?.removeAttribute('data-wc-error')});v.addEventListener('error',()=>error(v));v.querySelector('source')?.addEventListener('error',()=>error(v));}
 if('IntersectionObserver'in window){
  const io=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)play(e.target);else halt(e.target)}},{rootMargin:'80px 0px',threshold:0.08});
  films.forEach(v=>io.observe(v))
 }else films.forEach(play);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)films.forEach(halt);else films.filter(v=>v.getBoundingClientRect().top<innerHeight&&v.getBoundingClientRect().bottom>0).forEach(play)});
 reduced.addEventListener?.('change',()=>{if(reduced.matches)films.forEach(halt);else films.filter(v=>v.getBoundingClientRect().top<innerHeight&&v.getBoundingClientRect().bottom>0).forEach(play)})
})();