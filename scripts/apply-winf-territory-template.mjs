/* Atualização idempotente da seção territorial de Santos, modelo de todas as cidades. */
import {readFileSync,writeFileSync} from 'node:fs';
import {applyTerritorySection} from './winf-city-territory.mjs';
import {applyApplicationSection} from './winf-city-applications.mjs';
import {applyCitySearchLanguage} from './winf-city-search-language.mjs';
import {applyCityIntentClusters} from './winf-city-intent-clusters.mjs';
const cfg=JSON.parse(readFileSync('config/winf-active-cities.json','utf8'));
const city=cfg.cities.find(c=>c.origin==='santos');
if(!city)throw new Error('Modelo Santos não configurado');
const file=cfg.template;
const before=readFileSync(file,'utf8');
const after=applyTerritorySection(applyCityIntentClusters(applyCitySearchLanguage(applyApplicationSection(before,city),city),city),city);
if(after!==before){writeFileSync(file,after,'utf8');console.log('SEÇÃO DE SANTOS ATUALIZADA');}
else console.log('SEÇÃO DE SANTOS JÁ ATUALIZADA');
