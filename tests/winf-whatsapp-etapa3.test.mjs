import test,{after} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {chromium} from "playwright";

const origin="http://127.0.0.1:8766";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const raw=JSON.parse(read("config/winf-territorios-consumidor-200.json"));
const pageMarkup=read("onde-comprar/index.html");
test("inventário possui 200 cidades únicas, 100 em SP e número WINF único",()=>{
 const list=raw.territories;
 assert.equal(list.length,200);
 assert.equal(new Set(list.map(t=>t.id)).size,200);
 assert.equal(list.filter(t=>t.uf==="SP").length,100);
 assert.equal(list.filter(t=>t.uf!=="SP").length,100);
 assert.equal(raw.whatsapp,"5513981113001");
 assert.ok(list.every(t=>t.consumerContactPhone==="5513981113001"&&t.routingStatus==="pre_licenca"));
});
test("sem novas páginas regionais e com aviso de atendimento sob demanda",()=>{
 assert.match(pageMarkup,/id="winf-turnkey-consumer"/);
 assert.match(pageMarkup,/js\/winf-turnkey-consumidor\.js/);
 assert.match(pageMarkup,/não necessariamente possui unidade física/);
 assert.match(pageMarkup,/200 municípios/);
});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
after(async()=>browser.close());
const profiles=[
 {label:"desktop",viewport:{width:1440,height:900}},
 {label:"celular",viewport:{width:393,height:852},isMobile:true,hasTouch:true}
];
const targets=[
 {query:"Barueri",name:"Barueri",uf:"SP"},
 {query:"Cuiaba",name:"Cuiabá",uf:"MT"},
 {query:"Campina Grande",name:"Campina Grande",uf:"PB"}
];
for(const profile of profiles){
 test("fluxo de 3 cidades para WhatsApp WINF - "+profile.label,async()=>{
  const context=await browser.newContext({...profile,deviceScaleFactor:1});
  const page=await context.newPage();
  await page.route("**/*",route=>{
   const url=route.request().url();
   if(url.startsWith(origin)||url.startsWith("data:"))return route.continue();
   const css=/\.(css)(\?|$)/.test(url)||url.includes("fonts.googleapis.com");
   return route.fulfill({status:200,contentType:css?"text/css":"text/javascript",body:""});
  });
  try{
   await page.goto(origin+"/onde-comprar/",{waitUntil:"domcontentloaded"});
   await page.getByText("200 territórios encontrados",{exact:true}).waitFor({timeout:15000});
   const input=page.locator("#turnkey-city-search");
   for(const target of targets){
    await input.fill(target.query);
    const cards=page.locator("#turnkey-city-results li");
    await cards.first().waitFor();
    assert.equal(await cards.count(),1,"Resultado único: "+target.name);
    const card=cards.first();
    assert.match(await card.locator("strong").innerText(),new RegExp(target.name+" \/ "+target.uf));
    const link=card.locator("a");
    assert.equal(await link.getAttribute("target"),"_blank");
    const href=await link.getAttribute("href");
    assert.match(href,/^https:\/\/wa\.me\/5513981113001\?text=/);
    const decoded=decodeURIComponent(href);
    assert.ok(decoded.includes(target.name+"/"+target.uf),"Cidade e estado devem constar na mensagem");
    assert.ok(decoded.includes("Podem confirmar a disponibilidade"));
   }
   await input.fill("");
   await page.locator("#winf-turnkey-consumer").scrollIntoViewIfNeeded();
   const metrics=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
   assert.ok(metrics.scroll<=metrics.width+2,"Rolagem horizontal fora do padrão: "+JSON.stringify(metrics));
   await page.screenshot({path:"artifacts/whatsapp/200-territorios-"+profile.label+".png",fullPage:true});
  }finally{await context.close();}
 });
}
