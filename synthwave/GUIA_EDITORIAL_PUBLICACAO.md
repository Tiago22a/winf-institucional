# SynthWAVE.fm™ — Publicação de músicas e podcasts

**Modelo da etapa atual:** edição por GitHub + revisão de pull request. Não existe um painel administrativo público autenticado; não oferecer botão de publicação direta a visitantes.

## Fontes de verdade

| Tipo de conteúdo | Arquivo | Critério |
| --- | --- | --- |
| Músicas externas | `synthwave/music-library.js` | Só registrar obras com URL estável e licença documentada; rever atribuição e uso público no Brasil |
| Sons sintetizados | `synthwave/app.js` + `audio-engine.js` | Presets próprios do navegador, identificados claramente como síntese |
| Programação de coleções | `synthwave/app.js` | Conferir índices, nomes e experiência de reprodução |
| Podcasts | `synthwave/podcast-catalog.js` | Status validado antes de renderizar; publicação exige arquivo e direitos |
| Texto do piloto | `synthwave/podcasts/temporada-01/ep01-cuidar-conectar.md` | Documento de trabalho para revisão |
| Prévia pública do piloto | `synthwave/podcasts/temporada-01/ep01-cuidar-conectar/index.html` | Apenas leitura; nenhuma alegação de áudio gravado |

## Situações de cada podcast

- **`planned` — Em planejamento:** somente título e conceito; não apresentar como gravado.
- **`scripted` — Roteiro em revisão:** pode ter prévia de leitura; sem player de áudio.
- **`published` — Publicado:** somente se houver `audioUrl` HTTPS válido, `transcriptUrl`, `rightsStatement`, `rightsApprovedAt` e `productionReviewedAt`. O validador impede que itens incompletos se mostrem como publicados.

## Aprovação editorial de um episódio

1. Definir público, argumento central, dúvidas e fontes necessárias.
2. Produzir roteiro original com duas vozes de IA identificadas e revisar claims.
3. Verificar a condição de cada marca WINF e não atribuir resultados fictícios a projetos reais.
4. Gerar áudio com TTS de vozes originais autorizadas (sem imitar personalidades), mixar e medir duração real.
5. Selecionar trilha e efeitos com direitos comprovados; preparar créditos.
6. Criar transcrição acessível e conferir volume, clareza e dispositivos.
7. Submeter PR com evidências de revisão, endereço de áudio estável e informação de direitos.
8. Só após revisão alterar `status` para `published`.

## Diretrizes de UI

- **Cores:** verde-floresta, verde-sálvia, cobre e creme. Nada de magenta/rosa visual; o nome acústico *ruído rosa* permanece como efeito sonoro.
- Um botão `Ouvir` só pode existir se houver áudio efetivamente reproduzível e licenciado.
- A capa aprovada da SynthWAVE não deve ser substituída sem solicitação.
- O catálogo musical estático não oferece upload. Publicação de faixas próprias por membros requer login, moderação, direitos e armazenamento seguros.

## Próxima evolução do painel

Construir o painel privado atrás de autenticação Google **somente após** ativar e testar Firebase Auth, Firestore Rules e controle de papéis editoriais por reivindicações verificáveis no backend. Não basta esconder o botão por CSS. Os membros não recebem permissões de publicação por padrão.

## Testes

```bash
node --test synthwave/tests/smoke.test.mjs
```

A suíte bloqueia: scripts quebrados, podcasts declarados publicados sem direitos/transcrição, vazamento de controles administrativos e regressões de catálogo.
