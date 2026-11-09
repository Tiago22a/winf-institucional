/* WINF™ / dock global — sem dependências, acesso por teclado e toque. */
(()=>{'use strict';
const dock=document.getElementById('winf-global-dock');
const toggle=document.getElementById('winf-global-dock-toggle');
if(!dock||!toggle)return;
let open=false;
const setOpen=(next)=>{open=!!next;dock.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open));};
toggle.addEventListener('click',()=>setOpen(!open));
document.addEventListener('pointerdown',(event)=>{if(!dock.contains(event.target))setOpen(false);});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&open){setOpen(false);toggle.focus();}});
const banner=document.getElementById('cookie-banner');
if(banner){
  function refresh(){
    const styles=getComputedStyle(banner);
    const visible=styles.display!=='none'&&styles.visibility!=='hidden'&&banner.getBoundingClientRect().height>0;
    dock.style.setProperty('--winf-cookie-offset',visible?Math.ceil(banner.getBoundingClientRect().height+12)+'px':'0px');
  }
  refresh();
  new MutationObserver(refresh).observe(banner,{attributes:true,attributeFilter:['class','style','hidden']});
  if('ResizeObserver' in window)new ResizeObserver(refresh).observe(banner);
  window.addEventListener('resize',refresh,{passive:true});
}
})();
