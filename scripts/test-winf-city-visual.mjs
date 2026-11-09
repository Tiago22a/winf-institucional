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
          badAlt:[...document.querySelectorAll('img')].filter(x=>!x.hasAttribute('alt')).length
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
  await ctx.close();
}
await browser.close();
const summary={when:new Date().toISOString(),total:results.length,passed:results.filter(x=>!x.errors.length).length,failed:results.filter(x=>x.errors.length).length,results};
writeFileSync(outDir+'/report.json',JSON.stringify(summary,null,2)+'\n');
console.log('RESULTADO: '+summary.passed+'/'+summary.total+' páginas/dispositivos sem erros');
if(summary.failed)process.exitCode=1;
