/* QA estático WINF — executável com: node tests/check-catalogo.mjs */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

const read = (file) => readFileSync(file, 'utf8');
const catalog = read('catalogo/index.html');
const app = read('catalogo/catalogo-app.js');
const css = read('catalogo/catalogo-winf.css');
const home = read('index.html');
const santos = read('pelicula-de-controle-solar-santos-sp/index.html');
const journal = read('blog/peliculas-para-sacadas-santos/index.html');
const journalIndex = read('blog/index.html');
const sitemap = read('sitemap.xml');
let count = 0;
function check(name, callback) {
  callback();
  count++;
  console.log('✓ ' + name);
}
check('JavaScript do catálogo compila', () => new vm.Script(app, { filename: 'catalogo-app.js' }));
check('Scripts inline do catálogo compilam', () => {
  for (const m of catalog.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (m[1].includes('src=') || m[1].includes('application/ld+json')) continue;
    new vm.Script(m[2], {filename:'catalogo-inline.js'});
  }
});
check('Navegação por quatro marcas', () => {
  for (const key of ['select','aerocore','neoskin','ceramic']) {
    assert.match(catalog, new RegExp('id="tab-' + key + '"'));
  }
});
check('Controlador único do catálogo', () => {
  assert.match(catalog,/src="\/catalogo\/catalogo-app\.js/);
  assert.doesNotMatch(catalog, /src="\/catalogo\/catalogo-experience\.js/);
});
check('Identidade tipográfica Gustavo', () => {
  assert.match(css, /font-family:Gustavo/);
  assert.ok(existsSync('fonts/gustavo-regular.otf'));
});
check('Ícones oficiais de marca', () => {
  assert.match(app, /\/aerocore\/assets\/ghost-symbol\.png/);
  assert.ok(existsSync('aerocore/assets/ghost-symbol.png'));
  assert.ok(existsSync('winf-logo.svg'));
});
check('InfiSpectre permanece identificado como AeroCore', () => {
  assert.match(catalog, /InfiSpectre™ by AeroCore™/);
  assert.match(app, /spectre\.line="aerocore"/);
});
check('URLs de ficha de produto', () => {
  assert.match(app,/data-open-product/);
  assert.match(app,/URL\(location\.href\)/);
});
check('Comparador não inventa temperaturas ou cenas de cozinha', () => {
  assert.doesNotMatch(catalog, /40°C|photo-1600585154340/);
  assert.match(app,/1-tser\/100/);
  assert.match(app,/TSER ainda não cadastrado/);
});
check('Contato de Santos autorizado por catálogo', () => {
  assert.match(app, /knownLegacy/);
  assert.match(app, /5513981113001/);
  assert.match(santos,/partner=5513981113001/);
});
check('Todos os cartões de Santos apontam para IDs de produto existentes', () => {
  const ids = new Set([...catalog.matchAll(/id:\s*'([^']+)',\s*\n\s*name:\s*'/g)].map(m => m[1]));
  assert.ok(ids.size >= 12, 'Catálogo inesperadamente incompleto');
  for (const m of santos.matchAll(/(?:&amp;|&)produto=([a-z0-9-]+)/g)) {
    assert.ok(ids.has(m[1]), 'Produto do link de Santos não encontrado: ' + m[1]);
  }
});
check('Imagens locais do catálogo existem', () => {
  const images = [...catalog.matchAll(/\bimage:\s*'(\/images\/[^']+)'/g)].map(m=>m[1]);
  assert.ok(images.length >= 12);
  for (const path of images) assert.ok(existsSync(path.slice(1)), 'Imagem ausente: ' + path);
});
check('Dados estruturados são JSON válido', () => {
  for (const source of [catalog, santos, journal]) {
    const found = [...source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    assert.ok(found.length > 0);
    for (const m of found) assert.ok(JSON.parse(m[1])['@context']);
  }
});
check('Conteúdo editorial e sitemap estão conectados', () => {
  assert.match(santos, /\/blog\/peliculas-para-sacadas-santos\//);
  assert.match(journalIndex, /\/blog\/peliculas-para-sacadas-santos\//);
  assert.match(sitemap, /https:\/\/winf\.com\.br\/blog\/peliculas-para-sacadas-santos\//);
});
check('Home com assinatura e um acesso WINF OS', () => {
  assert.match(home, /winf-home-brand-signature/);
  assert.match(home, /winf-home-ghost-trigger/);
  assert.equal((home.match(/href="https:\/\/painel-os\.winf\.com\.br\/login\//g)||[]).length,1);
});
console.log('\n' + count + ' verificações estáticas concluídas.');
