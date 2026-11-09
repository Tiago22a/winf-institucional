import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const cfg=JSON.parse(readFileSync('config/winf-active-cities.json','utf8'));
const intents=JSON.parse(readFileSync('config/winf-city-intents.json','utf8')).territories;
for(const city of cfg.cities){
 const html=readFileSync(city.slug+'/index.html','utf8');
 const data=intents[city.origin];
 assert.ok(data && data.segments.length===4,'4 aplicações '+city.city);
 assert.equal((html.match(/id="solucoes-por-necessidade"/g)||[]).length,1,city.city+' bloco único');
 assert.ok(html.includes(data.headline),'Conteúdo editorial '+city.city);
 for(const s of data.segments)assert.ok(html.includes('href="/aplicacoes/'+s[3]+'/"'),'Link canônico '+city.city+' '+s[3]);
 assert.ok(html.includes('href="/peliculas-de-controle-solar-brasil/"'),'Hub nacional '+city.city);
 if(city.origin==='campina-grande')assert.ok(html.includes('pré-ativação'),'Pré-ativação');
 console.log('✓ Intenções e aplicações: '+city.city);
}
