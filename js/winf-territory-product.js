/* WINF™ | Atendimento territorial em páginas individuais.
   Catálogo público, destino local no WhatsApp. Somente altera links de atendimento
   quando a URL contém origem/partner. Não altera SEO canonical nem a identidade da marca. */
(()=>{'use strict';
  const params=new URLSearchParams(window.location.search);
  const origin=(params.get('origem')||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,42);
  const raw=(params.get('partner')||'').replace(/\D/g,'');
  const valid=/^55\d{10,11}$/.test(raw);
  const fallback=origin==='santos'?'5513981113001':null;
  const phone=valid?raw:fallback;
  const variant=(params.get('variant')||'').replace(/[^0-9a-zA-Z-]/g,'').slice(0,15);
  const pathname=window.location.pathname.replace(/\/+/g,'/');
  const names={
    '/aerocore/ghost/':'AeroCore™ Ghost',
    '/aerocore/phantom/':'AeroCore™ Phantom',
    '/aerocore/spectre/':'AeroCore™ Spectre',
    '/aerocore/wraith/':'AeroCore™ Wraith',
    '/aerocore/bunker/':'NeoSkin™ BKR-150 Bunker',
    '/aerocore/apocalypse/':'NeoSkin™ APX-190 Apocalypse',
    '/aerocore/ghostliquid/':'Ceramic Armoring™ Ghost Liquid'
  };
  const product=names[pathname]||document.title.split('|')[0].trim();
  const variantSeries=['/aerocore/ghost/','/aerocore/phantom/','/aerocore/spectre/'];
  const validSeriesVariant=/^(05|15|35)$/.test(variant);
  const productDetail=(variantSeries.includes(pathname)&&validSeriesVariant)?product+' '+variant:
    (pathname==='/aerocore/wraith/'&&variant==='70')?product+' 70':product;
  if(!phone&&!origin&&!variant)return;
  const carriedParams=new URLSearchParams();
  if(origin)carriedParams.set('origem',origin);
  if(valid)carriedParams.set('partner',raw);
  const allowedLocal=/^\/(catalogo|aerocore\/(ghost|phantom|spectre|wraith|bunker|apocalypse|ghostliquid)|invisible|blackpro|dual-reflect|securityblind|miniblind-venetian)\/?$/;
  const sameNumber=(a,b)=>a.replace(/\D/g,'')===b.replace(/\D/g,'');
  function rewrite(a){
    if(!a||!a.href)return;
    let target;try{target=new URL(a.href,location.href)}catch{return}
    if(phone&&target.hostname.toLowerCase()==='wa.me'){
      const pathDigits=target.pathname.replace(/\D/g,'');
      const msg=target.searchParams.get('text')||'';
      if(!sameNumber(pathDigits,phone)||!msg.includes(productDetail)){
        const helpful='Olá! Vim pelo catálogo WINF e gostaria de atendimento para '+productDetail+'.'+(origin?' Origem: '+origin.toUpperCase()+'.':'');
        const message=msg&&msg.length>18?helpful+' '+msg:helpful;
        target.pathname='/'+phone;
        target.search='';
        target.searchParams.set('text',message.slice(0,1400));
        a.href=target.href;
      }
      return;
    }
    if(target.origin===location.origin&&allowedLocal.test(target.pathname)&&carriedParams.size){
      for(const [key,value] of carriedParams)target.searchParams.set(key,value);
      if(target.href!==a.href)a.href=target.href;
    }
  }
  function scan(node){
    if(!(node instanceof Element))return;
    if(node.matches('a[href]'))rewrite(node);
    node.querySelectorAll('a[href]').forEach(rewrite);
  }
  function focusVariant(){
    if(!(variantSeries.includes(pathname)&&validSeriesVariant))return;
    const heading=document.querySelector('main h1');
    const label=pathname.split('/').filter(Boolean).pop();
    if(heading&&heading.textContent.trim().toUpperCase()===label.toUpperCase()){
      heading.textContent=(label+' '+variant).toUpperCase();
      document.title=(label+' '+variant)+' | AEROCORE™ Window Film';
    }
  }
  function ready(){
    focusVariant();
    scan(document.body);
    // Dock/CTA podem ser montados depois por outros scripts.
    const observer=new MutationObserver(records=>{for(const r of records){for(const item of r.addedNodes)scan(item)}});
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  document.addEventListener('click',event=>{
    const a=event.target instanceof Element?event.target.closest('a[href]'):null;
    if(a)rewrite(a);
  },true);
})();