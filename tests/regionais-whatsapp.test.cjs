"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const central = "5513981113001";
const cities = [
  ["Sorocaba", "insulfilm-residencial-sorocaba-sp/index.html", "sorocaba"],
  ["Pilar do Sul", "pelicula-de-controle-solar-pilar-do-sul-sp/index.html", "pilar-do-sul"],
  ["Cuiabá", "pelicula-de-controle-solar-cuiaba-mt/index.html", "cuiaba"]
];

test("Sorocaba, Pilar e Cuiabá usam a mesma central em site, formulário e SEO", () => {
  for (const [city, file, slug] of cities) {
    const html = read(file);
    assert.match(html, /data-whatsapp="5513981113001"/, city);
    assert.match(html, /"telephone":"\+55-13-98111-3001"/, city);
    assert.match(html, /wa\.me\/5513981113001\?text=/, city);
    assert.ok(html.includes("origem=" + slug + "&amp;partner=5513981113001"), city);
    assert.ok(!html.includes("5515997909049"), city);
    assert.ok(html.includes('data-city="' + city + '"'), city);
  }
});

test("links da Baixada Santista permanecem na central oficial sem mudar outras páginas", () => {
  const html = read("index.html");
  for (const city of ["santos", "guaruja", "praia-grande"]) {
    const card = html.match(new RegExp('data-territory="' + city + '"[\\s\\S]*?<\\/article>'));
    assert.ok(card, "card mantido: " + city);
    assert.match(card[0], /wa\.me\/5513981113001\?text=/);
  }
});
