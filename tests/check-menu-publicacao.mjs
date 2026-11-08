import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const read = name => readFileSync(name, 'utf8');
const home = read('index.html');
const aero = read('aerocore/index.html');
const partners = read('partners/index.html');
const globalJs = read('script.js');
const aeroJs = read('aerocore/assets/shell.js');
const homeCss = read('css/winf-home-header.css');
const globalMenuCss = read('css/winf-global-menu.css');
const aeroMenuCss = read('aerocore/assets/ac-simple-menu.css');
const logo = read('winf-logo.svg');
const pCss = read('partners/landing.css');

const checks = [
  ['one menu per website', () => {
    assert.equal((home.match(/id="menu-overlay"/g)||[]).length,1);
    assert.equal((aero.match(/id="menu-overlay"/g)||[]).length,1);
  }],
  ['global WINF uses editorial AeroCore-inspired navigation', () => {
    assert.match(home,/id="menu-overlay" class="ac-roadmap-menu winf-global-roadmap hidden"/);
    assert.match(home,/WINF™ \/ UNIVERSO GLOBAL/);
    for (const href of ['/aerocore/winf-select/','/aerocore/','/aerocore/neoskin/','/aerocore/ceramic-armoring/','/catalogo/','/blog/','/partners/']) {
      assert.ok(home.includes('href="'+href+'"'), 'Missing '+href);
    }
    assert.match(globalMenuCss, /#menu-overlay\.winf-global-roadmap/);
  }],
  ['global header uses official W trademark only, hamburger and ghost; full brand remains in hero', () => {
    const header = home.match(/<header\b[\s\S]*?<\/header>/)?.[0]||'';
    assert.ok(header);
    assert.match(header,/class="winf-home-w-mark"/);
    assert.match(header,/src="\/brand\/winf-monogram\.svg"/);
    assert.doesNotMatch(header,/winf-home-brand-signature|PREMIUM QUALITY WINDOWFILM/);
    assert.match(home,/src="\/winf-logo-hd\.svg"/);
    assert.match(read('brand/winf-monogram.svg'),/<path\b/);
    assert.match(header,/winf-home-ghost-lines/);
    assert.match(header,/ghost-symbol\.png/);
    assert.match(header,/aria-expanded="false"/);
    assert.doesNotMatch(header,/WINF OS|painel-os/);
    assert.match(homeCss,/max-width:1280px/);
    assert.match(homeCss,/\.winf-home-header/);
    assert.match(homeCss,/\.winf-home-ghost-trigger/);
  }],
  ['hero has brand below, two restrained CTAs and slogan', () => {
    assert.match(home,/class="winf-home-global-slogan"/);
    assert.match(home,/DO BRASIL PARA O MUNDO/);
    assert.equal((home.match(/class="winf-home-hero-actions"/g)||[]).length,1);
    assert.match(home,/EXPLORAR MARCAS/);
    assert.match(home,/VER CATÁLOGO/);
  }],
  ['only WINF Partners has WINF OS header access', () => {
    const p = partners.match(/<header\b[\s\S]*?<\/header>/)?.[0]||'';
    const h = home.match(/<header\b[\s\S]*?<\/header>/)?.[0]||'';
    const a = aero.match(/<header\b[\s\S]*?<\/header>/)?.[0]||'';
    assert.match(p,/painel-os\.winf\.com\.br\/login/);
    assert.match(p,/WINF OS™/);
    assert.doesNotMatch(h,/WINF OS™/);
    assert.doesNotMatch(a,/WINF OS™/);
    assert.match(pCss,/WINF OS: acesso exclusivo/);
  }],
  ['AeroCore has minimal menu with local routes and return to the WINF universe', () => {
    assert.match(aero,/id="menu-overlay" class="ac-simple-menu ac-shell"/);
    assert.match(aero,/ac-simple-main/);
    assert.match(aero,/VOLTAR AO UNIVERSO WINF/);
    assert.match(aero,/href="\/" class="ac-simple-global"/);
    assert.match(aero,/catalogo\/\?marca=aerocore/);
    assert.match(aero,/data-toggle-channels/);
    assert.match(aero,/data-close-channels/);
    assert.match(aero,/data-action="close-menu"/);
    assert.match(aeroMenuCss,/#menu-overlay\.ac-simple-menu/);
    assert.doesNotMatch(aeroMenuCss,/#ac-simple-menu/);
  }],
  ['global/AeroCore menu scripts are valid', () => {
    new vm.Script(globalJs, {filename:'script.js'});
    new vm.Script(aeroJs, {filename:'aerocore/assets/shell.js'});
    assert.match(globalJs,/lastMenuTrigger/);
    assert.match(globalJs,/event\.key === 'Escape'/);
    assert.match(aeroJs,/menu\.hidden = !open/);
  }],
  ['official WINF logo is vector and not an embedded bitmap', () => {
    assert.match(logo,/<path\b/);
    assert.doesNotMatch(logo,/data:image\/png/);
  }],
  ['new files exist', () => {
    for (const f of ['css/winf-home-header.css','css/winf-global-menu.css','aerocore/assets/ac-simple-menu.css']) assert.ok(existsSync(f),f);
  }]
];
let count=0;
for (const [name,check] of checks) {
  check();
  console.log('✓ '+name);
  count++;
}
console.log('\n'+count+' menu deployment checks passed');
