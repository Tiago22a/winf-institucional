'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

test('Partners: preservar logo, menu global e remover InfoS redundante do topo', () => {
  const html = read('partners/index.html');
  assert.match(html, /class="partners-landing-lockup"/);
  assert.match(html, /class="wp-menu-trigger menu-trigger"/);
  assert.doesNotMatch(html, /class="winf-os-power-link"/);
  assert.doesNotMatch(html, /class="wp-os-more"/);
  assert.doesNotMatch(html, /os-more-menu\.(?:css|js)/);
  assert.match(html, /src="\/js\/winf-quick-contact\.js\?/);
});

test('Dock inferior: botão GHOST abre menu e mantém WhatsApp independente', () => {
  const src = read('js/winf-quick-contact.js');
  assert.match(src, /data-wqc="brands"/);
  assert.match(src, /<span class="wqc-label">GHOST<\/span>/);
  assert.match(src, /wqc-panel/);
  assert.match(src, /wqc-whatsapp/);
  assert.match(src, /chosenPhone = forPartners \? partnerPhone : salesPhone/);
  assert.doesNotMatch(src, /<span class="wqc-label">WINF<\/span>/);
});

test('Menu GHOST: link oficial do InfoS primeiro, demais marcas e Escape', () => {
  const src = read('js/winf-quick-contact.js');
  assert.match(src, /const commonBrandLinks = \[\s*\['INFOS™ — Entrar no WINF OS™', 'https:\/\/painel-os\.winf\.com\.br\/login\/'\]/);
  assert.match(src, /NeoSkin™/);
  assert.match(src, /WINF Partners™/);
  assert.match(src, /if\(event\.key==='Escape'&&active\)/);
  assert.match(src, /!dock\.contains\(event\.target\)/);
  const css = read('css/winf-quick-contact.css');
  assert.match(css, /max-height:/);
  assert.match(css, /@media\(max-width:580px\)/);
});
