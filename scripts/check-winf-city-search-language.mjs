import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const cfg=JSON.parse(readFileSync('config/winf-active-cities.json','utf8'));
for(const c of cfg.cities){const h=readFileSync(c.slug+'/index.html','utf8');
assert.equal((h.match(/id="nomes-da-pelicula"/g)||[]).length,1,'Seção ausente ou repetida: '+c.city);
assert.ok(h.includes('insulfilm em '+c.city),'Busca contextual '+c.city);
assert.ok(h.includes('isofilm ou isolfilm'),'Grafias usuais '+c.city);
assert.ok(h.includes('película fumê'),'Intenção informacional '+c.city);
assert.ok(!h.includes('display:none')||h.includes('id="nomes-da-pelicula"'),'Seção de conteúdo presente');
console.log('✓ Busca natural em '+c.city)}
