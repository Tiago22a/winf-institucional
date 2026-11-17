'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = p => fs.readFileSync(path.resolve(__dirname, '..', p), 'utf8');

test('acesso WINF OS original permanece, com seta e menu acessivel no topo', () => {
  const html = read('partners/index.html');
  assert.match(html, /class="winf-os-power-link"/);
  assert.match(html, /class="wp-os-access"/);
  assert.match(html, /<details class="wp-os-more">/);
  assert.match(html, /<summary aria-label="Mais opções e acesso ao InfoS"/);
  assert.match(html, /href="https:\/\/painel-os\.winf\.com\.br\/login\/"/);
  assert.match(html, /ENTRAR NO WINF OS™ \/ InfoS/);
  assert.match(html, /href="\/partners\/os-more-menu\.css\?v=/);
  assert.match(html, /src="\/partners\/os-more-menu\.js\?v=/);
  assert.match(html, /data-action="open-menu"/, 'menu global original preservado');
});

test('dock publicitario nao recria botao branco; somente WhatsApp', () => {
  const js = read('js/winf-quick-contact.js');
  assert.match(js, /wqc-whatsapp/);
  assert.doesNotMatch(js, /data-wqc="brands"/);
  assert.doesNotMatch(js, /wqc-panel/);
  assert.match(js, /const chosenPhone = forPartners \? partnerPhone : salesPhone/);
});

test('menu tem fechamento externo e Escape e respeita celular', () => {
  const js = read('partners/os-more-menu.js');
  const css = read('partners/os-more-menu.css');
  assert.match(js, /event\.key !== 'Escape'/);
  assert.match(js, /!menu\.contains\(event\.target\)/);
  assert.match(css, /max-height/);
  assert.match(css, /@media\(max-width:600px\)/);
});
