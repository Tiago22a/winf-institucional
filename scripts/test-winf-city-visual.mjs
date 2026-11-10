/**
 * WINF Select: smoke test visual real em Chromium (desktop e mobile).
 * Confere a página publicada, CSS crítico, blocos de bairros, OG, imagens e largura.
 * Capturas são evidência para revisão humana, não substituem aprovação visual.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const BASE = process.env.WINF_TEST_BASE || 'https://winf.com.br';
const CANONICAL_BASE = 'https://winf.com.br';
const cities = [
  ['santos','pelicula-de-controle-solar-santos-sp'],
  ['praia-grande','pelicula-de-controle-solar-praia-grande-sp'],
  ['guaruja','pelicula-de-controle-solar-guaruja-sp'],
  ['sorocaba','insulfilm-residencial-sorocaba-sp'],
  ['pilar-do-sul','pelicula-de-controle-solar-pilar-do-sul-sp'],
  ['campina-grande','pelicula-de-controle-solar-campina-grande-pb'],
  ['cuiaba','pelicula-de-controle-solar-cuiaba-mt'],
];
const modes = [
  { name:'desktop', viewport:{width:1440,height:900}, isMobile:false },
  { name:'mobile', viewport:{width:390,height:844}, isMobile:true },
];
const outDir = 'test-results/winf-city-visual';
mkdirSync(outDir,{recursive:true});
const browser = await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
const results = [];
for(const mode of modes) {
  const ctx = await browser.newContext({viewport:mode.viewport,isMobile:mode.isMobile,hasTouch:mode.isMobile,deviceScaleFactor:1});
  const page = await ctx.newPage();
  for(const [slug,path] of cities) {
    const url = BASE+'/'+path+'/';
    const check = {city:slug,mode:mode.name,url,errors:[],warnings:[]};
    try {
      const response = await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
      check.status = response?.status() ?? null;
      if(check.status!==200)check.errors.push('HTTP '+check.status);
      await page.evaluate(()=>Promise.race([document.fonts?.ready, new Promise(resolve=>setTimeout(resolve,2500))])).catch(()=>{});
      await page.locator('#guias-aplicacoes').waitFor({state:'attached',timeout:15000});
      const a = await page.evaluate(()=>{
        const css=(selector)=>{const el=document.querySelector(selector);return el?getComputedStyle(el):null};
        const size=(selector)=>{const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect();return {width:r.width,height:r.height,left:r.left,right:r.right}};
        const h1=document.querySelectorAll('h1');
        const canon=document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const og=document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const robots=document.querySelector('meta[name="robots"]')?.getAttribute('content')||'';
        const grids=['.winf-guide-grid','.winf-intent-grid'];
        const nav=document.querySelector('a[href*="wa.me/5513981113001"]');
        return {
          h1Count:h1.length,
          canonical:canon,og,robots,
          guides:document.querySelectorAll('.winf-guide-card').length,
          intentCards:document.querySelectorAll('.winf-intent-card').length,
          neighborhoods:document.querySelectorAll('#bairros-santos .winf-territory-tags li').length,
          grids:grids.map(s=>({selector:s,display:css(s)?.display,area:size(s)})),
          headingSize:parseFloat(css('#winf-guides-title')?.fontSize||'0'),
          overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
          whatsapp:!!nav,
          logo:[...document.querySelectorAll('img')].filter(x=>x.src.includes('winf-logo')).map(x=>({loaded:x.complete&&x.naturalWidth>0,width:x.naturalWidth})),
          badAlt:[...document.querySelectorAll('img')].filter(x=>!x.hasAttribute('alt')).length,
          wrongRegionText:(document.body.innerText.match(/(?:CUIABÁ|CAMPINA GRANDE)\s*\/\s*SP\b/)||[])[0]||null
        }
      });
      check.metrics = a;
      if(a.h1Count!==1)check.errors.push('H1: '+a.h1Count);
      if(a.canonical!==CANONICAL_BASE+'/'+path+'/')check.errors.push('Canonical incorreto');
      if(a.robots.toLowerCase().includes('noindex'))check.errors.push('Página noindex');
      if(a.guides!==4)check.errors.push('Guias: '+a.guides);
      if(a.intentCards!==4)check.errors.push('Cards de aplicações: '+a.intentCards);
      if(a.neighborhoods<12)check.errors.push('Bairros insuficientes: '+a.neighborhoods);
      if(a.grids.some(g=>g.display!=='grid'||!g.area?.width))check.errors.push('Grid sem layout CSS');
      if(a.headingSize<25)check.errors.push('Heading sem escala tipográfica: '+a.headingSize+'px');
      if(!a.whatsapp)check.errors.push('WhatsApp da central ausente');
      if(a.logo.length<1||a.logo.some(x=>!x.loaded))check.errors.push('Logo WINF não carregou');
      if(a.badAlt>0)check.errors.push('Imgs sem alt: '+a.badAlt);
      if(a.wrongRegionText)check.errors.push('UF herdada incorreta: '+a.wrongRegionText);
      if(a.overflow>32)check.warnings.push('Possível scroll horizontal: '+a.overflow+'px');
      if(!a.og)check.errors.push('Meta OG image ausente');
      else {
        try {
          const previewImage = new URL(a.og);
          const testOgUrl = BASE+previewImage.pathname;
          const ogRes = await ctx.request.get(testOgUrl,{timeout:12000});
          check.ogStatus=ogRes.status();
          if(check.ogStatus!==200)check.errors.push('OG imagem HTTP '+check.ogStatus);
          else if(!(ogRes.headers()['content-type']||'').includes('image/'))check.warnings.push('OG sem content-type image/');
        } catch(err){check.errors.push('OG fetch: '+String(err).slice(0,120))}
      }
      await page.screenshot({path:outDir+'/'+slug+'-'+mode.name+'-hero.png',fullPage:false,animations:'disabled'});
      const guide=page.locator('#guias-aplicacoes');
      await guide.scrollIntoViewIfNeeded();
      await guide.screenshot({path:outDir+'/'+slug+'-'+mode.name+'-guias.png',timeout:20000,animations:'disabled'});
    } catch(err) {
      check.errors.push(String(err).slice(0,450));
      await page.screenshot({path:outDir+'/'+slug+'-'+mode.name+'-erro.png',fullPage:false}).catch(()=>{});
    }
    results.push(check);
    console.log(JSON.stringify({city:slug,mode:mode.name,status:check.status,ogStatus:check.ogStatus,errors:check.errors,warnings:check.warnings}));
  }
  // A página inicial tem sete cards, cada um com três canais de contato visíveis.
  const homeCheck={city:'home-cards',mode:mode.name,url:BASE+'/',errors:[],warnings:[]};
  try{
    const response=await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:45000});
    homeCheck.status=response?.status()??null;
    if(homeCheck.status!==200)homeCheck.errors.push('HTTP '+homeCheck.status);
    await page.locator('#winf-active-cards > article.winf-active-card').first().waitFor({timeout:12000});
    await page.locator('#winf-quick-contact .wqc-launchers .wqc-circle').first().waitFor({state:'visible',timeout:15000});
    const cards=await page.locator('#winf-active-cards > article.winf-active-card').evaluateAll(items=>items.map(el=>{
      const links=[...el.querySelectorAll('.winf-active-card-link')];
      return {
        id:el.getAttribute('data-territory'),
        cardWidth:el.getBoundingClientRect().width,
        navDisplay:getComputedStyle(el.querySelector('.winf-active-card-links')).display,
        links:links.map(a=>({href:a.getAttribute('href'),width:a.getBoundingClientRect().width,height:a.getBoundingClientRect().height,visible:getComputedStyle(a).visibility!=='hidden'}))
      };
    }));
    homeCheck.metrics={cards};
    if(cards.length!==7)homeCheck.errors.push('Esperados 7 cards: '+cards.length);
    for(const card of cards){
      if(card.links.length!==3)homeCheck.errors.push(card.id+' com '+card.links.length+' canais');
      if(card.navDisplay!=='grid')homeCheck.errors.push(card.id+' sem grid de contatos');
      if(card.links.some(x=>x.width<40||x.height<34||!x.visible))homeCheck.errors.push(card.id+' com botão invisível/pequeno');
      if(!card.links.some(x=>x.href?.startsWith('/')))homeCheck.errors.push(card.id+' sem site local');
      if(!card.links.some(x=>x.href?.includes('wa.me/5513981113001?text=')))homeCheck.errors.push(card.id+' sem WhatsApp central');
      if(!card.links.some(x=>x.href?.includes('instagram.com/')))homeCheck.errors.push(card.id+' sem Instagram');
    }
    const dockState=await page.evaluate(()=>{
      const controls=document.getElementById('winf-quick-contact');
      const items=controls?[...controls.querySelectorAll('.wqc-launchers .wqc-circle')]:[];
      const wa=controls?.querySelector('.wqc-whatsapp');
      return {totalQuick:document.querySelectorAll('#winf-quick-contact').length,
        legacy:document.querySelectorAll('#winf-global-dock,.winf-global-floating-dock').length,
        count:items.length,
        whatsapp:wa?.getAttribute('href')||null,
        widths:items.map(x=>x.getBoundingClientRect().width),
        inViewport:items.every(x=>{const r=x.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}),
        labelsVisible:controls?[...controls.querySelectorAll('.wqc-label')].every(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}):false,
        labelsOverlap:(()=>{
          const labels=controls?[...controls.querySelectorAll('.wqc-label')]:[];
          if(labels.length<2)return false;
          const a=labels[0].getBoundingClientRect(),b=labels[1].getBoundingClientRect();
          return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
        })(),
        cookieOverlap:(()=>{
          const cookie=document.getElementById('cookie-banner');
          if(!controls||!cookie||cookie.hidden||getComputedStyle(cookie).display==='none')return false;
          const a=controls.getBoundingClientRect(),b=cookie.getBoundingClientRect();
          return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
        })()
      };
    });
    homeCheck.metrics.dock=dockState;
    if(dockState.totalQuick!==1||dockState.legacy!==0)homeCheck.errors.push('Dock fixo duplicado ou ausente');
    if(dockState.count!==2)homeCheck.errors.push('Esperado fantasma e WhatsApp únicos');
    if(!dockState.whatsapp?.includes('wa.me/5513981113001'))homeCheck.errors.push('WhatsApp não usa a central');
    if(!dockState.inViewport||!dockState.labelsVisible)homeCheck.errors.push('Dock/rótulos extrapolam viewport');
    if(dockState.labelsOverlap||dockState.cookieOverlap)homeCheck.errors.push('Dock/rótulos sobrepostos');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    if(overflow>32)homeCheck.warnings.push('Overflow horizontal '+overflow+'px');
    const section=page.locator('#unidades-ativas');
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({path:outDir+'/homepage-cards-'+mode.name+'.png',timeout:25000,animations:'disabled'});
  }catch(err){homeCheck.errors.push(String(err).slice(0,450));}
  results.push(homeCheck);
  console.log(JSON.stringify({city:'home-cards',mode:mode.name,status:homeCheck.status,errors:homeCheck.errors,warnings:homeCheck.warnings}));
  await ctx.close();
}
await browser.close();
const summary={when:new Date().toISOString(),total:results.length,passed:results.filter(x=>!x.errors.length).length,failed:results.filter(x=>x.errors.length).length,results};
writeFileSync(outDir+'/report.json',JSON.stringify(summary,null,2)+'\n');
console.log('RESULTADO: '+summary.passed+'/'+summary.total+' páginas/dispositivos sem erros');
if(summary.failed)process.exitCode=1;
