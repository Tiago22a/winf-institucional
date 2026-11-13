"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const sitemap = read("sitemap.xml");
const approved = JSON.parse(read("config/seo-territorios-aprovados.json")).approved || [];
const allowed = new Map(approved.map(x => [x.path, x]));
function cityFiles(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => dir + "/" + e.name + "/index.html")
    .filter(p => fs.existsSync(path.join(root, p)));
}
test("URLs de pre-lancamento nao entram no sitemap por acidente", () => {
  const found = [
    ...cityFiles("winf-select/cidades"),
    ...cityFiles("partners/territorios")
  ];
  for (const file of found) {
    const html = read(file);
    const url = "https://winf.com.br/" + file.replace(/index\.html$/, "");
    const approval = allowed.get(file);
    if (!approval) {
      assert.match(html, /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i,
        file + " deve permanecer noindex ate revisao");
      assert.ok(!sitemap.includes("<loc>" + url + "</loc>"), file + " nao deve entrar no sitemap");
    } else {
      assert.ok(approval.reviewer && approval.evidence && /^\d{4}-\d\d-\d\d$/.test(approval.approvedAt),
        file + " exige aprovacao editorial documentada");
      assert.doesNotMatch(html, /<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b/i,
        file + " aprovado ainda tem noindex");
      assert.ok(sitemap.includes("<loc>" + url + "</loc>"), file + " aprovado fora do sitemap");
    }
    assert.doesNotMatch(html, /"@type"\s*:\s*"LocalBusiness"/i,
      file + " nao declarar estabelecimento local ficticio");
  }
  for (const entry of approved) {
    assert.ok(found.includes(entry.path), entry.path + " aprovado sem arquivo");
  }
});
test("noindex continua rastreavel e sitemap tem dominio correto", () => {
  const robots = read("robots.txt");
  assert.match(robots, /User-agent:\s*\*/i);
  assert.doesNotMatch(robots, /Disallow:\s*\/(?:\s|$)/im);
  assert.match(robots, /Sitemap:\s*https:\/\/winf\.com\.br\/sitemap\.xml/i);
});
