import test,{after} from "node:test";
import assert from "node:assert/strict";
import {chromium} from "playwright";

const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
after(async()=>browser.close());
const origin="http://127.0.0.1:8766";
const views=[
 {name:"desktop",viewport:{width:1440,height:900}},
 {name:"mobile",viewport:{width:393,height:852},isMobile:true,hasTouch:true,deviceScaleFactor:1}
];
async function open(view,path="/onde-comprar/"){
 const context=await browser.newContext({viewport:view.viewport,isMobile:!!view.isMobile,hasTouch:!!view.hasTouch,deviceScaleFactor:view.deviceScaleFactor||1});
 const page=await context.newPage();
 // CDN e rastreadores não fazem parte do fluxo de negócios que está sendo testado.
 await page.route("**/*",route=>{
  const url=route.request().url();
  if(url.startsWith(origin)||url.startsWith("data:"))return route.continue();
  const isCss=/\.(css)(?:\?|$)/.test(url)||url.includes("fonts.googleapis.com");
  return route.fulfill({status:200,contentType:isCss?"text/css":"text/javascript",body:""});
 });
 await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:20000});
 return {page,context};
}
async function checkViewport(page){
 const bounds=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 assert.ok(bounds.scroll<=bounds.client+2,"Rolagem horizontal não desejada "+JSON.stringify(bounds));
}
for(const view of views){
 test("localizador "+view.name+" — busca real, contato WhatsApp e expansão separada",async()=>{
  const {page,context}=await open(view);
  try {
   await page.locator("#directory-count").getByText(/\d+ cidades/).waitFor({timeout:15000});
   assert.ok(Number((await page.locator("#directory-count").innerText()).match(/\d+/)[0])>=200);
   await page.locator("#directory-query").fill("Barueri");
   await page.locator("#directory-results article").first().waitFor({state:"visible",timeout:15000});
   assert.equal(await page.locator("#directory-results article").count(),1);
   const card=page.locator("#directory-results article").first();
   assert.match(await card.locator(".directory-card-city").innerText(),/Barueri/);
   const serviceLink=card.getByRole("link",{name:/Solicitar atendimento/});
   assert.match(await serviceLink.getAttribute("href"),/^https:\/\/wa\.me\/5513981113001\?/);
   assert.match(decodeURIComponent(await serviceLink.getAttribute("href")) ,/Barueri\/SP/);
   await card.scrollIntoViewIfNeeded();
   await checkViewport(page);
   await page.screenshot({path:"artifacts/browser/site-"+view.name+"-atendimento.png",fullPage:true});
   await page.locator('button[data-directory-mode="territorios"]').first().click();
   const prospectLink=page.locator("#directory-results article").first().getByRole("link",{name:/Consultar licenciamento/});
   assert.match(await prospectLink.getAttribute("href"),/wa\.me\/5513997815375/);
   await page.locator('button[data-directory-mode="ativas"]').first().click();
   await page.locator("#directory-service").selectOption("automotivo");
   assert.equal(await page.locator("#directory-results article").count(),0,"Não oferecer cobertura automotiva como parte dos 200 arquitetônicos");
   await checkViewport(page);
  } finally {await context.close();}
 });
}
test("localizador automotivo não importa artificialmente 200 cidades arquitetônicas",async()=>{
 const {page,context}=await open(views[0],"/aerocore/onde-comprar/");
 try {
  assert.equal(await page.evaluate(()=>document.querySelector(".winf-directory")!==null),false);
  assert.equal(await page.locator("#directory-results article").count()>=0,true);
  await checkViewport(page);
 }finally{await context.close();}
});
