/**
 * WINF public readonly smoke check. No cache purge, deploy or external mutation.
 * HTTP evidence is distinct from GitHub source/Playwright local checks.
 */
import { writeFileSync, appendFileSync, mkdirSync } from "node:fs";
const domains = ["https://www.winf.com.br", "https://winf.com.br"];
const paths = [
  ["/", "home"],
  ["/insulfilm-residencial-sorocaba-sp/", "sorocaba"],
  ["/pelicula-de-controle-solar-pilar-do-sul-sp/", "pilar"],
  ["/pelicula-de-controle-solar-cuiaba-mt/", "cuiaba"]
];
const results=[];
for (const origin of domains) for (const [path,name] of paths) {
  // Avoid stale intermediary cache when testing a deployment. This is a GET-only request.
  const url=origin+path+"?winf_verify=20261128-central-01";
  const row={url,origin,path,name};
  try {
    const response=await fetch(url,{
      redirect:"follow",
      signal:AbortSignal.timeout(18000),
      headers:{"cache-control":"no-cache","pragma":"no-cache","accept":"text/html","user-agent":"WINF-Public-ReadOnly-Check/1.0"}
    });
    row.status=response.status;
    row.effectiveUrl=response.url;
    row.headers=Object.fromEntries(["age","cache-control","cf-cache-status","server","last-modified","etag","x-vercel-cache","x-github-request-id"].map(key=>[key,response.headers.get(key)]).filter(([,val])=>val!==null));
    const body=await response.text();
    row.htmlBytes=body.length;
    row.officialWhatsapp=body.includes("wa.me/5513981113001");
    row.legacyWhatsapp=body.includes("5515997909049");
    row.comingSoon=body.includes("OUTRAS 47 CIDADES EM BREVE");
    row.oldActiveClaim=body.includes("49 cidades com operação ativa");
    row.wrongCuiabaUF=/CUIABÁ\s*\/\s*SP/.test(body);
    row.ok=response.ok && body.length>1000 && row.officialWhatsapp &&
      !row.legacyWhatsapp && (name!=="home" || row.comingSoon && !row.oldActiveClaim) &&
      (name!=="cuiaba" || !row.wrongCuiabaUF);
  } catch(err) {
    row.error=String(err);
    row.ok=false;
  }
  results.push(row);
  console.log(JSON.stringify(row));
}
const summary={
  checkedAt:new Date().toISOString(),
  total:results.length,
  validated:results.filter(x=>x.ok).length,
  issues:results.filter(x=>!x.ok).length,
  note:"Verificação externa sujeita a bloqueios WAF/DNS/CDN; status não comprova experiência real no app WhatsApp.",
  results
};
mkdirSync("test-results",{recursive:true});
writeFileSync("test-results/winf-public-check.json",JSON.stringify(summary,null,2)+"\n");
if(process.env.GITHUB_STEP_SUMMARY){
  const lines=[
    "### WINF — checagem de leitura em domínio público",
    "",
    "Validados: **"+summary.validated+"/"+summary.total+"**. A origem externa pode exigir investigação de deploy ou cache.",
    "",
    "| Domínio | Página | HTTP | Central | Em breve | Erro |",
    "|---|---|---:|---|---|---|",
    ...results.map(x=>"| "+x.origin+" | "+x.name+" | "+(x.status||"—")+" | "+(x.officialWhatsapp?"OK":"não confirmado")+" | "+(x.name==="home"?(x.comingSoon?"OK":"não confirmado"):"—")+" | "+(x.error?"bloqueio":x.ok?"—":"conteúdo divergente")+" |"),
    "",
    "Este teste não altera produção e não faz envio de WhatsApp."
  ];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY,lines.join("\n")+"\n");
}
// Non-blocking report: sources outside the repo can be stale, offline or blocked.
