import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { runInNewContext } from "node:vm";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const official = "5513981113001";
const legacy = "5515997909049";
const context = { globalThis: {} };
runInNewContext(read("js/cidades.js"), context, { filename: "js/cidades.js", timeout: 3000 });
const cities = context.globalThis.WINF_CIDADES;
const extra = context.globalThis.WINF_UNIDADES_EXTRAS;
const regions = context.globalThis.WINF_PAGINAS_REGIONAIS;
const record = id => [...cities, ...extra, ...regions].find(x => x.id === id);

test("cadastro mantém 100 territórios e três cidades de atendimento unificado", () => {
  assert.equal(cities.length, 100);
  const targets = [
    ["sorocaba-sp", "/insulfilm-residencial-sorocaba-sp/"],
    ["pilar-do-sul-sp", "/pelicula-de-controle-solar-pilar-do-sul-sp/"],
    ["cuiaba-mt", "/pelicula-de-controle-solar-cuiaba-mt/"]
  ];
  for (const [id, url] of targets) {
    const entry = record(id);
    assert.ok(entry, id);
    assert.equal(entry.status, "ativa", id);
    assert.equal(entry.siteAtivo, true, id);
    assert.equal(entry.numero, official, id);
    assert.equal(entry.url, url, id);
    assert.ok(existsSync(new URL("../" + url.slice(1) + "index.html", import.meta.url)), "página não existe: " + url);
  }
  assert.equal(record("itapetininga-sp").status, "pre_ativacao");
  const ddd015 = regions.filter(x => x.numero === legacy || (x.status === "ativa" && x.uf === "SP" && !x.numero));
  assert.equal(ddd015.length, 0, "cadastro regional não deve anunciar 015 sem confirmação");
  for (const x of [...cities, ...extra, ...regions]) {
    if (x.status === "ativa") assert.notEqual(x.numero, legacy, "número antigo em cidade ativa: " + x.id);
  }
  // A Baixada Santista não foi desativada nesta tarefa.
  assert.equal(record("santos-sp").status, "ativa");
  assert.equal(record("praia-grande-sp").status, "ativa");
  assert.equal(record("guaruja-sp").status, "ativa");
});

test("home mostra 015 em breve, Cuiabá atendida e WhatsApp único", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /49 cidades com operação ativa|22 cidades com operação ativa/i);
  assert.match(html, /OUTRAS 47 CIDADES EM BREVE/);
  assert.match(html, /Cuiabá \/ MT/);
  assert.doesNotMatch(html, /5515997909049/);
  assert.doesNotMatch(html, /data-territory="campina-grande"/);
  for (const id of ["sorocaba", "pilar-do-sul", "cuiaba"]) {
    const entry = html.match(new RegExp('<article class="winf-active-card" data-territory="' + id + '"[\\s\\S]*?<\\/article>'));
    assert.ok(entry, "cartão não encontrado: " + id);
    assert.match(entry[0], /ATENDIMENTO ONLINE/);
    assert.ok(entry[0].includes("https://wa.me/" + official), "WhatsApp incorreto: " + id);
  }
});

test("páginas comerciais preservam links, formulário e schema de cidades", () => {
  const targets = [
    ["insulfilm-residencial-sorocaba-sp", "Sorocaba", "SP"],
    ["pelicula-de-controle-solar-pilar-do-sul-sp", "Pilar do Sul", "SP"],
    ["pelicula-de-controle-solar-cuiaba-mt", "Cuiabá", "MT"]
  ];
  for (const [slug, city, uf] of targets) {
    const html = read(slug + "/index.html");
    assert.ok(html.includes("<title>") && html.includes(city));
    assert.ok(html.includes('href="https://winf.com.br/' + slug + '/"'));
    assert.ok(html.includes('data-whatsapp="' + official + '"'));
    assert.doesNotMatch(html, /5515997909049|\+55-15-99790-9049/);
    const whatsappLinks = [...html.matchAll(/https:\/\/wa\.me\/(55\d{10,11})/g)].map(m => m[1]);
    assert.ok(whatsappLinks.length >= 3, "WhatsApp links não encontrados: " + slug);
    assert.ok(whatsappLinks.every(phone => phone === official), "contato errado: " + slug);
    const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLd, "JSON-LD ausente: " + slug);
    const graph = JSON.parse(jsonLd[1])["@graph"];
    const org = graph.find(x => x["@type"] === "Organization" && x.contactPoint);
    const service = graph.find(x => x["@type"] === "Service");
    assert.equal(org.contactPoint.telephone, "+55-13-98111-3001");
    assert.equal(org.contactPoint.areaServed.name, city);
    assert.equal(service.areaServed.containedInPlace.name, uf);
    if (uf === "MT") assert.doesNotMatch(html, /CUIABÁ SP|CUIABÁ · SP|Cuiabá\/SP/);
    assert.doesNotMatch(html, /images\/og\/images\//, "imagem social incorreta");
  }
});

test("localizador não anuncia cidades não ativas como em atendimento", () => {
  const locator = read("aerocore/assets/onde-comprar.js");
  assert.match(locator, /'◌ Em breve'/);
  assert.match(locator, /active && city\.siteAtivo === true/);
  assert.match(locator, /Em breve · sem atendimento local ativo/);
  assert.match(locator, /whatsapp =/);
  assert.doesNotMatch(locator, /city\.siteAtivo \? '◌ Estrutura digital publicada'/);
});
