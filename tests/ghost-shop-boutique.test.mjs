import { readFileSync, existsSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
const root = new URL("../", import.meta.url);
const read = p => readFileSync(new URL(p,root),"utf8");
const shop = read("ghost-shop/index.html");
const globalHome = read("index.html");
const aeroHome = read("aerocore/index.html");
const partners = read("partners/index.html");
const footer = read("js/winf-footer.js");
const menu = read("aerocore/assets/brand-menu.js");
const filter = read("js/winf-ghost-shop.js");

test("GHOST SHOP remains editorial until inventory and commerce exist",()=>{
 assert.match(shop,/GHOST SHOP™/);
 assert.match(shop,/sem vendas habilitadas|pedidos ainda não estão habilitados/i);
 assert.doesNotMatch(shop,/href=["'][^"']*checkout/i);
 assert.doesNotMatch(shop,/<button[^>]*>\s*COMPRAR/gi);
});
test("public storefront has SEO, collection controls and independent supply route",()=>{
 assert.match(shop,/rel="canonical" href="https:\/\/winf\.com\.br\/ghost-shop\/"/);
 assert.match(shop,/data-gs-filter="aerocore"/);
 assert.match(shop,/data-gs-filter="neoskin"/);
 assert.match(shop,/ABASTECIMENTO WINF OS™/);
 assert.match(shop,/https:\/\/painel-os\.winf\.com\.br\/login\//);
});
test("global, AeroCore, Partners and shared brand menus link to the boutique",()=>{
 assert.match(globalHome,/href="\/ghost-shop\/"/);
 assert.match(globalHome,/id="ghost-shop-preview"/);
 assert.match(aeroHome,/href="\/ghost-shop\/"/);
 assert.match(aeroHome,/id="aerocore-ghost-collection"/);
 assert.match(partners,/href="\/ghost-shop\/"/);
 assert.match(footer,/ghost-shop/);
 assert.match(menu,/ghost-shop/);
});
test("storefront image assets are already available in the repository",()=>{
 const refs=[...shop.matchAll(/\bsrc=["'](\/images\/[^"']+|\/briefing\/media\/[^"']+|\/aerocore\/assets\/[^"']+)["']/g)].map(m=>m[1]);
 assert.ok(refs.length>=5);
 for(const asset of refs){
  const path=join(new URL(".",root).pathname,asset.slice(1));
  assert.ok(existsSync(path),"Missing image: "+asset);
 }
});
test("no duplicate page identifiers",()=>{
 const ids=[...shop.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);
});
