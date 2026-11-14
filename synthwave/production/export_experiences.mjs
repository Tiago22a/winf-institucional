#!/usr/bin/env node
/**
 * SynthWAVE: exporta os 18 roteiros originais em JSON para o renderizador TTS.
 * Não publica episódios e não depende de network/Firebase.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const original=['e01-cinco-sons','e02-fotografia-gaveta','e03-janela-mundo',
'e04-plano-mudou','e05-estrada-silencio','e06-maquina-pergunta']
.map(name=>'experiencias/volume-01/'+name+'.js');
const capsules=['after-hours','first-light','focus-frequency','creative-current','city-drive','night-glow']
.map(name=>'experiencias/capsulas/'+name+'.js');
const files=[...original,...capsules];
const sandbox={window:{}};
for(const name of files){
 const text=fs.readFileSync(path.join(root,name),'utf8');
 vm.runInNewContext(text,sandbox,{timeout:3000,filename:name});
}
const stories=JSON.parse(JSON.stringify(sandbox.window.SYNTHWAVE_EXPERIENCES||[]));
const ids=new Set();
if(stories.length!==18)throw Error('Esperados 18 roteiros, obtidos '+stories.length);
for(const story of stories){
 if(!/^[a-z0-9-]+$/.test(story.id)||ids.has(story.id))throw Error('ID inválido ou duplicado: '+story.id);
 ids.add(story.id);
 if(story.status!=='scripted'||!story.title||!Array.isArray(story.chapters)||story.chapters.length<3)throw Error('Roteiro inválido: '+story.id);
 const turns=story.chapters.flatMap(ch=>ch.lines||[]);
 if(turns.length<15||!turns.some(x=>x[0]==='LIA')||!turns.some(x=>x[0]==='DAVI'))throw Error('Falas incompletas: '+story.id);
 if(turns.some(x=>!['LIA','DAVI'].includes(x[0])||typeof x[1]!=='string'||x[1].length<10))throw Error('Fala inválida: '+story.id);
 story.turns=turns.map(([speaker,text])=>({speaker,text}));
}
console.log('SynthWAVE: '+stories.length+' histórias, '+stories.reduce((n,s)=>n+s.turns.length,0)+' falas originais, prontas para o pipeline de prévias.');
if(process.argv.includes('--validate-only'))process.exit(0);
const i=process.argv.indexOf('--output');
const destination=i>=0?process.argv[i+1]:path.join(os.tmpdir(),'synthwave-experiences.json');
if(!destination)throw Error('Caminho --output ausente');
fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.writeFileSync(destination,JSON.stringify({version:1,status:'preview_source_only',stories},null,2)+'\n');
console.log('Arquivo JSON gerado: '+destination);
