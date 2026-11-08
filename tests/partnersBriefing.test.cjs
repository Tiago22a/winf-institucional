'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const pages = [
  'partners/index.html',
  'partners/distribuidores/index.html',
  'partners/varejistas/index.html',
  'partners/ecossistema/index.html',
  'partners/cuidar-e-conectar/index.html',
  'briefing/index.html',
  'briefing/asset-light/index.html',
  'briefing/quiosque/index.html',
  'briefing/flagship/index.html'
];

test('todas as paginas principais tem metadados essenciais', () => {
  for (const p of pages) {
    const h = read(p);
    assert.match(h, /lang="pt-BR"/i, p);
    assert.match(h, /name="viewport"/, p);
    assert.match(h, /<title>[^<]+<\/title>/, p);
    assert.match(h, /rel="canonical"/, p);
    assert.equal((h.match(/<h1\b/gi)||[]).length, 1, p);
  }
});

test('arquivos locais usados em links, imagens e CSS existem', () => {
  for (const p of pages) {
    for (const m of read(p).matchAll(/\b(?:src|href|poster)="([^"]+)"/g)) {
      const value = m[1];
      if (!value.startsWith('/') || value.startsWith('//')) continue;
      const route = value.split(/[?#]/)[0];
      if (!route) continue;
      const relative = route === '/' ? 'index.html' :
        route.endsWith('/') ? route.slice(1) + 'index.html' : route.slice(1);
      assert.ok(fs.existsSync(path.join(root,relative)), p + ' -> ' + value);
    }
  }
});

test('imagens tem alt e IDs nao se repetem', () => {
  for (const p of pages) {
    const h = read(p);
    for (const tag of h.matchAll(/<img\b[^>]*>/g)) {
      assert.match(tag[0], /\balt=/, p);
    }
    const ids = [...h.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
    assert.equal(ids.length, new Set(ids).size, p);
  }
});

test('Partners liga diretamente as tres paginas dos modelos', () => {
  const h = read('partners/index.html');
  for (const model of ['asset-light', 'quiosque', 'flagship']) {
    assert.ok(h.includes('href="/briefing/'+model+'/"'), model);
  }
  for (const img of ['asset-light-gestao-2026.webp','quiosque-principal-2026.webp','flagship-showroom-2026.webp']) {
    assert.ok(h.includes(img), img);
  }
});

test('mosaicos mostram imagens independentes P, M e G do Quiosque e demais modelos', () => {
  const h = read('briefing/index.html');
  const imgs = [
    'asset-light-gestao-2026.webp','asset-light-mobilidade-2026.webp','asset-light-familia-2026.webp',
    'quiosque-principal-2026.webp','quiosque-p-compacto-2026.webp','quiosque-g-consultoria-2026.webp',
    'flagship-equipe-2026.webp','flagship-showroom-2026.webp','flagship-operacoes-2026.webp'
  ];
  for (const img of imgs) {
    assert.ok(h.includes(img), img);
    assert.ok(fs.statSync(path.join(root,'briefing/media',img)).size > 15000, img);
  }
  assert.ok(read('briefing/asset-light/index.html').includes('asset-light-execucao-2026.webp'));
  assert.ok(read('briefing/flagship/index.html').includes('flagship-estrutura-2026.webp'));
  const kiosk = read('briefing/quiosque/index.html');
  for(const img of ['quiosque-p-compacto-2026.webp','quiosque-principal-2026.webp','quiosque-g-consultoria-2026.webp']) {
    assert.ok(kiosk.includes(img), 'kiosk: '+img);
  }
});

test('as tres paginas individuais tem FAQs e compartilhamento configurados', () => {
  for (const model of ['asset-light','quiosque','flagship']) {
    const h = read('briefing/'+model+'/index.html');
    assert.equal((h.match(/class="model-faq-item"/g)||[]).length, 3, model);
    assert.match(h, /property="og:image"/, model);
    assert.match(h, /application\/ld\+json/, model);
    assert.ok(h.includes('href="#avaliar"'), model);
  }
});

test('nomenclatura e afirmacoes comerciais permanecem corretas', () => {
  const corpus = pages.map(read).join('\n');
  assert.doesNotMatch(corpus, /Satellite|Satélite|Black Shop|R\$\s*450\.000/i);
  const briefing = read('briefing/index.html');
  assert.match(briefing, /45 metros lineares/);
  assert.match(briefing, /R\$\s*15\.000/);
  assert.match(read('briefing/flagship/index.html'), /R\$\s*250\.000/);
  assert.match(read('briefing/quiosque/index.html'), /Asset Light/);
});

test('logo oficial e CSS touch/hover sao preservados', () => {
  for (const p of pages) {
    assert.ok(read(p).includes('winf-logo-white-official.png'), p);
  }
  for (const p of ['partners/landing.css','briefing/partners-experience.css','briefing/model-page.css']) {
    const css = read(p);
    assert.match(css, /hover:none/, p);
    assert.match(css, /pointer:coarse/, p);
    assert.equal((css.match(/\{/g)||[]).length, (css.match(/\}/g)||[]).length, p);
  }
});

test('Partners apresenta parceiros B2B e projetos distintos do licenciamento', () => {
 const main = read('partners/index.html');
 for (const url of ['/partners/distribuidores/','/partners/varejistas/','/partners/ecossistema/','/partners/cuidar-e-conectar/']) {
   assert.match(main, new RegExp('href="'+url.replaceAll('/','\\/')+'"'));
 }
 assert.match(read('partners/distribuidores/index.html'), /proposta.*avaliação|sujeita.*análise/i);
 assert.match(read('partners/varejistas/index.html'), /não é automaticamente uma franquia|não equivale ao Quiosque/i);
 assert.match(read('partners/ecossistema/index.html'), /SYNTHWAVE.*fm/i);
 assert.match(read('partners/ecossistema/index.html'), /CARRO MÍDIA/i);
 assert.match(read('partners/ecossistema/index.html'), /GHOST SHOP/i);
 assert.match(read('partners/cuidar-e-conectar/index.html'), /projeto em estruturação|em planejamento/i);
});

test('B2B e impacto social têm rotas de piloto e responsabilidades explícitas', () => {
  const distributor = read('partners/distribuidores/index.html');
  const retailer = read('partners/varejistas/index.html');
  const social = read('partners/cuidar-e-conectar/index.html');
  assert.match(distributor, /id="piloto-distribuicao"/);
  assert.match(distributor, /FATURAMENTO E ENTREGA/);
  assert.match(distributor, /comissões|remuneração por intermediação/i);
  assert.match(retailer, /id="piloto-varejo"/);
  assert.match(retailer, /VENDA OU INDICAÇÃO/);
  assert.match(retailer, /INSTALAÇÃO/);
  assert.match(social, /id="frentes"/);
  assert.match(social, /ESCOLAS E ESPAÇOS EDUCATIVOS/);
  assert.match(social, /INSTITUIÇÕES PARA IDOSOS/);
  assert.match(social, /consentimento para imagens/);
});
test('Projetos em desenvolvimento não prometem serviços já lançados', () => {
  const ecosystem = read('partners/ecossistema/index.html');
  assert.match(ecosystem, /SYNTHWAVE.*fm/i);
  assert.match(ecosystem, /licenças pertinentes/);
  assert.match(ecosystem, /Não há promessa de streaming/);
  assert.match(ecosystem, /CARRO MÍDIA/);
  assert.match(ecosystem, /GHOST SHOP/);
  assert.doesNotMatch(ecosystem, /Black Shop|MediaK|CityWave/);
});
test('Vídeo hero AeroCore não aponta para filme antigo de derrapagem', () => {
  const h = read('aerocore/index.html');
  assert.match(h, /porsche-911-highway-20261103\\.mp4/);
  assert.doesNotMatch(h, /quero_uma_porche_rebaixada\\.mp4/);
  const n = read('aerocore/assets/neoskin-actions-2026.css');
  assert.match(n, /pointer:coarse/);
  assert.match(n, /background:transparent!important/);
});
