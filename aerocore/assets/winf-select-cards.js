/* WINF Select product video cards: lazy and respectful of mobile data / reduced motion. */
(() => {
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const cards=[...document.querySelectorAll('.select-line-card')];
 const io=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{
   entries.forEach(entry=>{const video=entry.target.querySelector('video[data-src]');if(!video)return;
     if(!entry.isIntersecting){video.pause();return;}
     if(window.matchMedia('(hover: none)').matches&&!reduced){load(video);const promise=video.play();if(promise)promise.catch(()=>{});}
   });
 },{rootMargin:'100px',threshold:.3}):null;
 const load=(v)=>{if(v.dataset.src&&v.dataset.src!==v.getAttribute('src')){v.src=v.dataset.src;v.load()}};
 cards.forEach(card=>{
   const v=card.querySelector('video[data-src]');if(!v)return;io?.observe(card);
   const start=()=>{if(reduced)return;load(v);const promise=v.play();if(promise)promise.catch(()=>{})};
   const stop=()=>{if(window.matchMedia('(hover: hover)').matches)v.pause()};
   card.addEventListener('mouseenter',start);
   card.addEventListener('mouseleave',stop);
   card.addEventListener('focusin',start);
   card.addEventListener('focusout',e=>{if(!card.contains(e.relatedTarget))stop()});
 });
})();
