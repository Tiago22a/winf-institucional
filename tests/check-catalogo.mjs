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
const territoryRegistry = JSON.parse(read('catalogo/territorios.json'));

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
check('Registro de unidades ativas valida código, telefone e status', () => {
  assert.equal(territoryRegistry.schemaVersion, 1);
  assert.ok(app.includes('fetch("/catalogo/territorios.json"'));
  assert.match(app, /item\.status !== "active"/);
  for (const [slug, unit] of Object.entries(territoryRegistry.territories)) {
    assert.match(slug, /^[a-z0-9-]{4,60}$/);
    assert.equal(unit.status, 'active');
    assert.match(unit.phone, /^55[1-9][0-9]{9,10}$/);
    assert.ok(unit.name && unit.page.startsWith('/'));
  }
});
check('A landing ativa é conectada ao catálogo sem criar cópias por cidade', () => {
  assert.match(santos, /territorio=santos-sp/);
  assert.equal(territoryRegistry.territories['santos-sp'].page, '/pelicula-de-controle-solar-santos-sp/');
  assert.match(catalog, /https:\/\/winf\.com\.br\/catalogo\//);
  assert.ok(existsSync('brand/winf-monogram.svg'));
});
check('Menu global e menu Santos usam marcas oficiais alinhadas', () => {
  assert.match(home, /winf-home-brand-divider/);
  assert.match(home, /PREMIUM QUALITY WINDOWFILM/);
  assert.match(santos, /winf-territory-lockup/);
  assert.match(santos, /GLASS \+ HOME/);
  assert.match(santos, /winf-ghost-trigger/);
  assert.ok(existsSync('css/winf-home-header.css'));
  assert.ok(existsSync('css/winf-territory-santos.css'));
});
check('Todas as saídas para o catálogo na landing Santos preservam território', () => {
  const links = [...santos.matchAll(/<a\b[^>]*href="([^"]*catalogo\/[^"]*)"[^>]*>/g)].map(x => x[1]);
  assert.ok(links.length >= 15);
  assert.ok(links.every(url => url.includes('territorio=santos-sp')), 'Existe link de Santos sem identificação territorial');
});
check('Guias por marca preservam o atendimento da unidade piloto', () => {
  for(const name of ['aerocore', 'neoskin', 'ceramic']) {
    assert.ok(santos.includes('marca=' + name), 'Falta link territorial ' + name);
  }
  assert.match(app, /params\.get\("marca"\)/);
  assert.match(app, /params\.get\("produto"\)/);
});
check('Fichas possuem Escape, controle de foco e histórico do navegador', () => {
  assert.match(app, /history\.back\(\)/);
  assert.match(app, /e\.key!=="Tab"/);
  assert.match(app, /e\.key==="Escape"/);
  assert.match(app, /history\.pushState/);
});
check('Os contatos vêm de uma única fonte territorial pública', () => {
  assert.ok(existsSync('catalogo/territorios.json'));
  assert.ok(!existsSync('catalogo/territorios-publicos.js'));
});
check('A marca principal é SVG com paths e sem bitmap incorporado', () => {
  const logo = read('winf-logo.svg');
  const monogram = read('brand/winf-monogram.svg');
  assert.match(logo, /<path\b/);
  assert.doesNotMatch(logo, /data:image\/png/);
  assert.match(monogram, /<path\b/);
  assert.match(monogram, /™/);
});

check('Menus WINF global e AeroCore têm identidades trocadas corretamente', () => {
  const aerocoreHome = read('aerocore/index.html');
  const aeroCss = read('aerocore/assets/ac-simple-menu.css');
  const winfCss = read('css/winf-global-menu.css');
  assert.match(home, /id="menu-overlay" class="ac-roadmap-menu winf-global-roadmap hidden"/);
  assert.match(home, /WINF™ \/ UNIVERSO GLOBAL/);
  assert.match(home, /href="\/aerocore\/" data-action="menu-link">02/);
  assert.match(home, /src="\/winf-logo.svg"/);
  assert.match(winfCss, /#menu-overlay\.winf-global-roadmap/);
  assert.match(aerocoreHome, /id="menu-overlay" class="ac-simple-menu ac-shell"/);
  assert.match(aerocoreHome, /href="\/" class="ac-simple-global"/);
  assert.match(aerocoreHome, /href="\/catalogo\/\?marca=aerocore"/);
  assert.match(aeroCss, /#menu-overlay\.ac-simple-menu/);
  assert.doesNotMatch(aeroCss, /#ac-simple-menu/);
  assert.doesNotMatch(aerocoreHome, /id="menu-overlay" class="ac-roadmap-menu/);
});
check('AeroCore mantém controles de menu e canais necessários ao shell', () => {
  const aero = read('aerocore/index.html');
  const aeroShell = read('aerocore/assets/shell.js');
  assert.match(aero, /data-action="open-menu"/);
  assert.match(aero, /data-action="close-menu"/);
  assert.match(aero, /data-toggle-channels/);
  assert.match(aero, /id="contact-channels"/);
  assert.match(aero, /data-close-channels/);
  assert.match(aero, /data-close-menu="true"/);
  assert.match(aeroShell, /menu\.hidden = !open/);
  assert.match(aeroShell, /event\.key === 'Escape'/);
  new vm.Script(aeroShell, {filename:'aerocore/assets/shell.js'});
});
check('Menu global suporta foco, escape, ARIA e fechamento seguro', () => {
  const globalScript = read('script.js');
  new vm.Script(globalScript, {filename:'script.js'});
  assert.match(globalScript, /menuCloseTimer/);
  assert.match(globalScript, /aria-expanded/);
  assert.match(globalScript, /lastMenuTrigger/);
  assert.match(globalScript, /event\.key === 'Escape'/);
  assert.match(globalScript, /event\.key !== 'Tab'/);
});

console.log('\n' + count + ' verificações estáticas concluídas.');
