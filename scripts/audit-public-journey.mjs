#!/usr/bin/env node
/**
 * WINF™ — Auditoria estática de jornadas públicas.
 * Não envia formulários, não acessa contas e não altera nenhum dado.
 * Uso: node scripts/audit-public-journey.mjs
 *
 * O teste não substitui Playwright/manual em viewport real ou links externos HTTP:
 * hrefs criados via JS, servidor, query params e comportamento de terceiros
 * requerem homologação com navegador e rede.
 */
import fs from "node:fs";
import path from "node:path";
import {URL} from "node:url";

const root=process.cwd();
const ignored=new Set([".git",".github","node_modules","dist","coverage",".next",".cache"]);
const list=[];
function crawl(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(entry.name.startsWith(".")&&entry.name!==".well-known")continue;
  if(entry.isDirectory()){if(!ignored.has(entry.name))crawl(path.join(dir,entry.name));continue;}
  if(entry.isFile()&&entry.name.toLowerCase().endsWith(".html"))list.push(path.join(dir,entry.name));
 }
}
crawl(root);
const toRelative=abs=>path.relative(root,abs).split(path.sep).join("/");
const publicUrl=file=>{
 const rel="/"+toRelative(file);
 return rel==="/index.html"?"/":rel.endsWith("/index.html")?rel.slice(0,-"index.html".length):rel;
};
const pages=new Map(list.map(f=>[publicUrl(f),{file:f,source:fs.readFileSync(f,"utf8")}]));
const knownDomains=new Set(["winf.com.br","www.winf.com.br"]);
const nodes=[],stats={pages:list.length,links:0,buttons:0,forms:0,scripts:0,styles:0,missingInternal:0,missingAnchors:0,placeholders:0,notInSitemap:0};
const attribute=(tag,name)=>{
 const re=new RegExp("(?:^|\\s)"+name+"\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))","i");
 const m=tag.match(re);return m?(m[1]??m[2]??m[3]):null;
};
function resolve(sourceUrl,href){
 if(!href||/^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(href))return null;
 try{const u=new URL(href,"https://winf.com.br"+sourceUrl);if(!knownDomains.has(u.hostname))return null;return {pathname:decodeURIComponent(u.pathname),hash:u.hash};}catch{return null;}
}
function diskPath(pathname){
 if(pathname==="/")return "index.html";
 const rel=pathname.replace(/^\/+/, "");
 if(!rel||rel.includes(".."))return null;
 const opts=[rel,rel.endsWith("/")?rel+"index.html":rel+"/index.html",rel.endsWith("/")?rel+"index.htm":rel+"/index.htm"];
 return opts.find(p=>fs.existsSync(path.join(root,p))&&fs.statSync(path.join(root,p)).isFile())||null;
}
function issue(severity,page,kind,target,description){
 nodes.push({severity,page,kind,target,description});
 if(kind==="missing_internal")stats.missingInternal++;
 if(kind==="missing_anchor")stats.missingAnchors++;
 if(kind==="placeholder")stats.placeholders++;
}
const sitemapSource=fs.existsSync(path.join(root,"sitemap.xml"))?fs.readFileSync(path.join(root,"sitemap.xml"),"utf8"):"";
const listed=new Set([...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>resolve("/",m[1])?.pathname).filter(Boolean));
for(const [page,data] of pages){
 const source=data.source;
 const anchors=new Set([...source.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]));
 const rawLinks=[...source.matchAll(/<a\b[^>]*>/gi)].map(m=>m[0]);
 const rawButtons=[...source.matchAll(/<button\b[^>]*>/gi)].map(m=>m[0]);
 const rawForms=[...source.matchAll(/<form\b[^>]*>/gi)].map(m=>m[0]);
 const rawScripts=[...source.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m=>m[0]);
 const rawCss=[...source.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)].map(m=>m[0]);
 stats.links+=rawLinks.length;stats.buttons+=rawButtons.length;stats.forms+=rawForms.length;stats.scripts+=rawScripts.length;stats.styles+=rawCss.length;
 for(const tag of rawLinks){
  const href=attribute(tag,"href");
  if(!href||href==="#"){if(href==="#")issue("aviso",page,"placeholder","#","Âncora sem destino; verificar tratamento JavaScript");continue;}
  const target=resolve(page,href);if(!target)continue;
  if(target.pathname==="/"&&href.includes("origin="))continue;
  const file=diskPath(target.pathname);
  if(!file){
   if(!target.pathname.startsWith("/api/")&&!target.pathname.startsWith("/.netlify/"))issue("alta",page,"missing_internal",href,"Link interno sem arquivo HTML/rota encontrada no repositório");
   continue;
  }
  if(target.hash&&target.hash!=="#"&&file.toLowerCase().endsWith(".html")){
   const id=decodeURIComponent(target.hash.slice(1));
   const dest=target.pathname===page?anchors:new Set([...fs.readFileSync(path.join(root,file),"utf8").matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]));
   if(!dest.has(id))issue("aviso",page,"missing_anchor",href,"Destino de âncora não presente no HTML; pode ser gerado por JavaScript");
  }
 }
 for(const tag of [...rawScripts,...rawCss]){
  const ref=attribute(tag,"src")||attribute(tag,"href");const target=resolve(page,ref);
  if(!target)continue;
  if(!diskPath(target.pathname))issue("alta",page,"missing_internal",ref,"Recurso local JS/CSS sem arquivo correspondente");
 }
 if(page.startsWith("/pelicula-de-controle-solar-")||page==="/partners/"||page==="/briefing/asset-light/"){
  if(!listed.has(page))issue("media",page,"not_in_sitemap",page,"Página comercial de prioridade não encontrada no sitemap");
 }
}
for(const loc of listed)if(!diskPath(loc))issue("alta","/sitemap.xml","missing_internal",loc,"Página declarada no sitemap sem arquivo correspondente");
nodes.sort((a,b)=>({alta:0,media:1,aviso:2}[a.severity]||3)-({alta:0,media:1,aviso:2}[b.severity]||3));
const unique=new Map(nodes.map(x=>[[x.page,x.kind,x.target].join("|"),x]));
const findings=[...unique.values()];
const report={generatedAt:new Date().toISOString(),method:"Links, formulários e recursos HTML estáticos — sem execução de JS ou submissão",stats,scannedPages:[...pages.keys()].sort(),sitemapPages:listed.size,findings};
fs.mkdirSync(path.join(root,"audit"),{recursive:true});
fs.writeFileSync(path.join(root,"audit","jornada-publica-relatorio.json"),JSON.stringify(report,null,2)+"\n");
console.log("WINF JORNADA AUDIT | "+JSON.stringify({pages:stats.pages,links:stats.links,buttons:stats.buttons,forms:stats.forms,assets:stats.scripts+stats.styles,sitemapPages:listed.size,findings:findings.length}));
for(const x of findings.slice(0,100))console.log(x.severity.toUpperCase()+" "+x.page+" → "+x.target+" | "+x.description);
if(findings.length>100)console.log("... Outros "+(findings.length-100)+" apontamentos no relatório JSON.");
if(process.argv.includes("--strict")&&findings.some(x=>x.severity==="alta"))process.exitCode=1;
