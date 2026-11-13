#!/usr/bin/env node
/**
 * Auditoria SEO estática de HTML e sitemap (somente leitura).
 * Execute: node scripts/audit-seo-sitemap.mjs
 * Resultado: relatórios em reports/seo-audit.json e reports/seo-audit.md
 * Não depende de pacotes externos nem altera páginas publicadas.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const base = 'https://winf.com.br';
const sitemapFile = path.join(root, 'sitemap.xml');
if (!fs.existsSync(sitemapFile)) {
  console.error('sitemap.xml não encontrado na raiz.'); process.exit(1);
}
const text = fs.readFileSync(sitemapFile, 'utf8');
const entries = [...text.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map(m => {
  const loc = m[1].match(/<loc>\s*([^<]+)\s*<\/loc>/i);
  return { url: loc?.[1]?.trim() ?? '', xml: m[1] };
});
const issues = [];
const allFiles = [];
const ignored = new Set(['.git','node_modules','dist','build','.next','.cache','.vercel','coverage']);
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes:true })) {
    if (entry.isDirectory()) { if (!ignored.has(entry.name)) walk(path.join(dir,entry.name)); }
    else if (entry.isFile() && /\.html?$/i.test(entry.name)) allFiles.push(path.join(dir,entry.name));
  }
}
walk(root);
function normalizeUrl(u) {
  try {
    const url = new URL(u, base);
    if (!['https:','http:'].includes(url.protocol) || !['winf.com.br','www.winf.com.br'].includes(url.hostname)) return null;
    return url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  } catch { return null; }
}
function fileFor(u) {
  const route = normalizeUrl(u);
  if (!route) return null;
  const decoded = decodeURIComponent(route);
  const candidate = path.resolve(root, '.' + decoded, 'index.html');
  if (!candidate.startsWith(root + path.sep)) return null;
  return fs.existsSync(candidate) ? candidate : null;
}
function metaRobots(html) {
  const tag = html.match(/<meta\b(?=[^>]*\bname\s*=\s*["'](?:robots|googlebot)["'])[^>]*>/i)?.[0] ?? '';
  return tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
}
function canonical(html) {
  const tag = html.match(/<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/i)?.[0] ?? '';
  return tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
}
const sitemapURLs = new Set(), listedPaths = new Set(), fileCache = new Map();
function getHtml(f) { if (!fileCache.has(f)) fileCache.set(f,fs.readFileSync(f,'utf8')); return fileCache.get(f); }
for (const e of entries) {
  if (!e.url) { issues.push({type:'empty_loc'}); continue; }
  if (sitemapURLs.has(e.url)) issues.push({type:'duplicate_sitemap_url',url:e.url});
  sitemapURLs.add(e.url);
  if (!e.url.startsWith(base + '/')) issues.push({type:'nonpreferred_host_or_protocol',url:e.url});
  if (/[?#]/.test(e.url)) issues.push({type:'sitemap_has_query_or_fragment',url:e.url});
  const route = normalizeUrl(e.url);
  if (route) listedPaths.add(route);
  const file = fileFor(e.url);
  if (!file) { issues.push({type:'sitemap_route_missing_static_html',url:e.url,note:'Pode haver rewrite no servidor: validar antes de remover.'}); continue; }
  const html = getHtml(file);
  if (/\bnoindex\b/i.test(metaRobots(html))) issues.push({type:'sitemap_noindex',url:e.url});
  const can = canonical(html);
  if (!can) issues.push({type:'sitemap_missing_canonical',url:e.url});
  else if (can.replace(/\/$/,'')!==e.url.replace(/\/$/,'')) issues.push({type:'sitemap_canonical_mismatch',url:e.url,canonical:can});
}
const inbound = new Map();
for (const file of allFiles) {
  const html = getHtml(file);
  const source = '/' + path.relative(root,file).replace(/\\/g,'/').replace(/index\.html$/,'');
  // Somente links HTML rastreáveis por Googlebot, não rotas geradas em JS.
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["']/gi)) {
    const href = m[1].trim();
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let dest;
    try { dest = new URL(href, base + source); } catch { continue; }
    if (!['winf.com.br','www.winf.com.br'].includes(dest.hostname)) continue;
    const route = normalizeUrl(dest.href);
    if (route) {
      inbound.set(route,(inbound.get(route)??0)+1);
      // Não gerar falso 404 para recursos, scripts ou rewrites externos.
      if (!/\.[a-z0-9]{2,6}$/i.test(dest.pathname) && !fileFor(dest.href)) {
        issues.push({type:'internal_link_without_static_html',source,target:dest.pathname,note:'Validar rewrite/redirect no servidor.'});
      }
    }
  }
}
const orphaned = entries.map(e=>e.url).filter(u => !inbound.has(normalizeUrl(u)) && u !== base + '/');
for (const url of orphaned) issues.push({type:'sitemap_url_without_html_inlink',url,note:'Verificar links por JS antes de concluir que é órfã.'});
const summary = {
  sitemapURLs:entries.length, htmlFiles:allFiles.length, sitemapWithInboundLink:entries.length-orphaned.length,
  orphanedSitemapURLs:orphaned.length, issueCounts:{}
};
for (const x of issues) summary.issueCounts[x.type]=(summary.issueCounts[x.type]??0)+1;
const out = path.join(root,'reports');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'seo-audit.json'),JSON.stringify({summary,issues},null,2)+'\n');
const lines=['# Auditoria SEO estática — WINF','', 'Este relatório não substitui a inspeção de URLs nem o rastreamento real no Search Console.','',
  '## Resumo','',...Object.entries(summary).filter(([k])=>k!=='issueCounts').map(([k,v])=>'- '+k+': '+v),
  '', '## Ocorrências','',...Object.entries(summary.issueCounts).map(([k,v])=>'- '+k+': '+v),
  '', '## Amostras para análise','',
  ...issues.slice(0,120).map(x=>'- **'+x.type+'** '+(x.url??x.source??'')+(x.target?' → '+x.target:'')+(x.canonical?' (canonical '+x.canonical+')':'')),''];
fs.writeFileSync(path.join(out,'seo-audit.md'),lines.join('\n'));
console.log(JSON.stringify(summary,null,2));
if (process.argv.includes('--strict') && issues.some(x=>['duplicate_sitemap_url','sitemap_noindex','sitemap_canonical_mismatch','nonpreferred_host_or_protocol'].includes(x.type))) process.exitCode=1;
