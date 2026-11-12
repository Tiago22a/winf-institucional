import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const partners=fs.readFileSync(path.join(root,'partners/index.html'),'utf8');
const hub=fs.readFileSync(path.join(root,'hub/index.html'),'utf8');
const login='https://painel-os.winf.com.br/login/';
test('WINF Partners abre a URL de login diretamente no navegador, sem pop-up',()=>{
 const anchor=partners.match(/<a class="wp-header-action"[^>]+>WINF OS™/);
 assert.ok(anchor,'Botão do WINF OS não encontrado');
 assert.ok(anchor[0].includes('href="'+login+'"'));
 assert.doesNotMatch(anchor[0],/target="_blank"/);
 assert.match(anchor[0],/login sem instalar aplicativo/);
});
test('cartão do hub aponta para a mesma microtela e não para formulário de interesse',()=>{
 const card=hub.match(/<a class="card " href="https:\/\/painel-os\.winf\.com\.br\/login\/"[\s\S]{0,380}?<\/a>/);
 assert.ok(card,'Cartão de acesso não encontrado no hub');
 assert.match(card[0],/WINF OS™/);
 assert.match(card[0],/sem instalar aplicativo/);
 assert.doesNotMatch(card[0],/partners\/#contact/);
});

test('cabeçalho WINF oficial | PARTNERS sem slogan sob a marca',()=>{
 const top=partners.match(/<header class="wp-header"[\s\S]*?<\/header>/);
 assert.ok(top,'Cabeçalho não encontrado');
 assert.match(top[0],/winf-logo\.svg\?v=winf-official-vector-20261111/);
 assert.match(top[0],/alt="WINF™"/);
 assert.match(top[0],/partners-lockup-wordmark"[^>]*>PARTNERS<sup>™<\/sup>/);
 assert.doesNotMatch(top[0],/FROM BRAZIL TO THE WORLD/);
});
