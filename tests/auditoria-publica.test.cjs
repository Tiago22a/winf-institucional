'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('P0: cadastro distingue operações ativas de páginas em pré-ativação', () => {
  const sandbox = {};
  sandbox.globalThis = sandbox;
  vm.runInNewContext(read('js/cidades.js'), sandbox);
  const list = sandbox.WINF_CIDADES || [];
  const extras = sandbox.WINF_UNIDADES_EXTRAS || [];
  assert.ok(list.length >= 100, 'cadastro territorial preservado');
  const active = list.concat(extras).filter(x => x.status === 'ativa' && x.exemplo === false);
  assert.equal(active.length, 2, 'somente as duas operações declaradas');
  assert.deepEqual(Array.from(active, x => x.cidade).sort(), ['Pilar do Sul', 'Santos']);
  assert.ok(list.some(x => x.status === 'pre_ativacao' && x.siteAtivo === true), 'páginas publicadas e sem operação existem');
});

test('P0: locator AeroCore só inclui status ativa em unidades operacionais', () => {
  const src = read('aerocore/assets/onde-comprar.js');
  assert.match(src, /mode === 'ativas'\s*\? city\.status === 'ativa'/);
  assert.doesNotMatch(src, /mode === 'ativas'\s*\? city\.siteAtivo === true/);
  assert.match(src, /city\.siteAtivo === true \|\| city\.disponivelParaAtivacao === true/);
  assert.match(src, /em análise \(sem ativação confirmada\)/);
  const html = read('aerocore/onde-comprar/index.html');
  assert.match(html, /Somente Santos e Pilar do Sul possuem operação confirmada/);
  assert.match(html, /Unidades operacionais/);
});

test('P1: aviso de cookies e privacidade válido em todo WINF Journal', () => {
  const entries = [
    'blog/index.html',
    'blog/blindagem-transparente/index.html',
    'blog/ceramica-nanometrica/index.html',
    'blog/persianas-no-vidro/index.html',
    'blog/ppf-armadura-invisivel/index.html',
    'blog/privacidade-arquitetonica/index.html',
    'blog/rejeicao-infravermelha/index.html',
    'winf-home/index.html'
  ];
  assert.match(read('aerocore/policies/index.html'), /id=["']privacidade["']/);
  for (const file of entries) {
    const src = read(file);
    assert.match(src, /href="\/aerocore\/policies\/#privacidade"/, file);
    assert.match(src, /Aceitar cookies/, file);
    assert.doesNotMatch(src, /href="#privacy"/, file);
    assert.doesNotMatch(src, /We use cookies on this website/, file);
  }
});

test('P1: páginas duplicadas ou legadas não competem com a canônica', () => {
  const src = read('winf-home/index.html');
  assert.match(src, /name="robots" content="noindex,follow/);
  assert.match(src, /rel="canonical" href="https:\/\/winf\.com\.br\/"/);
  const ceramic = read('ceramic/index.html');
  assert.match(ceramic, /name="robots" content="noindex,follow/);
  assert.doesNotMatch(ceramic, /IMUNIDADE CONTRA ÁCIDOS/);
  assert.doesNotMatch(ceramic, /BLINDAGEM MOLECULAR ABSOLUTA/);
});

test('P2: Universo Dark existe como apresentação preliminar sem oferta financeira', () => {
  const src = read('partners/universo-dark/index.html');
  assert.match(src, /<h1>UNIVERSO <span>DARK™<\/span><\/h1>/);
  assert.match(src, /noindex,follow/);
  assert.match(src, /não constitui oferta pública/);
  assert.match(src, /href="\/partners\/"/);
  const map = read('sitemap.xml');
  assert.doesNotMatch(map, /https:\/\/winf\.com\.br\/partners\/universo-dark\//);
});
