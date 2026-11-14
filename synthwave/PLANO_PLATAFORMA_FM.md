# SynthWAVE.fm™ — mapa de implantação da plataforma musical

Atualizado em 14/11/2026. Implementação progressiva, sem anunciar como operacionais os recursos ainda previstos.

## Situação atual da base

| Recurso | Estado | Onde |
| --- | --- | --- |
| Página institucional retrô | Publicada anteriormente | `/synthwave/` |
| Rádio contínua no navegador após clique em Play | Implementação no app, depende de teste com arquivos externos | `/synthwave/radio/` e `app.js` |
| Catálogo com cinco faixas externas CC0/CC BY e oito presets digitais sintetizados | Código existente; audios externos dependem do provedor | `music-library.js`, `audio-engine.js` |
| Oito coleções por ocasião | Implementadas com catálogo inicial reduzido | `app.js` |
| Mixer: música + sons do ambiente, volumes independentes | Implementado com Web Audio, controle do ouvinte | `audio-engine.js`, `app.js` |
| Favoritas e minhas playlists | Implementado **somente no navegador** | `my-playlists.js` |
| Pautas de podcasts com duas vozes de IA | Temporada editorial estruturada; sem arquivos de áudio | `PODCAST_EDITORIAL_IA.md` |
| Cadastro com nome e WhatsApp em banco de dados | **Ainda não implementado** | Backend e consentimento pendentes |
| Login com Google, sincronização multiaparelho | **Ainda não implementado** | Firebase Auth + domínio autorizado |
| Envio público de música por membros | **Ainda não implementado** | Storage, licenciamento e moderação |
| Rádio sincronizada 24 horas no servidor | **Ainda não implementada** | Provedor de streaming, licenças, infraestrutura |

## Arquitetura de experiência

**Porta 1 — Rádio livre:** abrir a página e apertar Play. Sem senha, sem login, sem cadastro. O serviço continua tocando no navegador até que o ouvinte pause, saia ou o sistema suspenda a aba. Não prometer web rádio sincronizada.

**Porta 2 — Minha frequência:** acesso com Google após configuração do provedor de autenticação. Migrar a playlist local do navegador somente com consentimento, sem expor conteúdo entre usuários.

**Newsletter opcional:** nome e WhatsApp fornecidos com checkbox de opt-in específico para informações SynthWAVE.fm, política de privacidade acessível, registro de consentimento (finalidade, instante, origem, versão do texto), mecanismo de cancelamento de mensagens e armazenamento em backend com regras. O formulário não poderá afirmar que salvou dados se o servidor não responder sucesso.

## Modelo de dados sugerido (Firestore ou serviço equivalente)

- `synthwave_listeners/{id}`: `name`, `phoneE164`, `consentAt`, `consentVersion`, `source`, `status`, `createdAt`. Nunca deixar leitura pública.
- `synthwave_users/{uid}`: provedor autenticado, nome de exibição, preferências, consentimento.
- `synthwave_users/{uid}/playlists/{playlistId}`: nome, data, ordenação de IDs de faixas autorizadas. Security Rules: dono somente.
- `synthwave_tracks/{trackId}`: título, artista, URL, direitos, licença, atribuição, revisão, status e origem.
- `synthwave_podcasts/{episodeId}`: descrição, vozes sintéticas, roteiro, transcrição, arquivo, status em desenvolvimento/publicado.
- `synthwave_submissions/{submissionId}`: titular, comprovantes, autorização de exibição e status de moderação. Sem reprodução até revisão.
- `synthwave_radio_schedule/{programId}`: seleção editorial, janela, versão e status de publicação.

Backends: validação server-side, rate limits, logs, consentimento, controles de acesso, anti-spam, privacidade, criptografia em trânsito e separação do WINF OS por papéis. Não embutir credenciais ou chaves privadas no front-end.

## Fases

1. **MVP musical:** coleções, favoritos locais, rádio sequencial, mixer sem login; verificar áudio em Chrome/Android/iOS e a licença de cada faixa.
2. **Dados e autenticação:** definir projeto de Firebase, domínio OAuth, política de privacidade, endpoint de opt-in newsletter, verificação WhatsApp e Rules; testar com contas de homologação.
3. **Meu FM:** login Google, playlists em nuvem, migração consentida das listas locais e exclusão/exportação de dados.
4. **Podcasts:** produzir as duas vozes originais, revisar scripts, publicar áudios com transcrição, créditos e episódios de temporada.
5. **Comunidade musical:** upload restrito a conteúdo próprio/licenciado, moderação, reclamação e remoção, controle de direitos e preservação de créditos.
6. **Emissora sincronizada:** avaliar infraestrutura de áudio, direitos autorais/ECAD, programação compartilhada, direitos conexos e operação contínua.

## Direitos musicais no Brasil

O catálogo inicial é pequeno e cada obra deve ter direitos verificados. A licença Creative Commons da gravação não substitui automaticamente outras autorizações necessárias à disponibilização pública. Consulte https://www4.ecad.org.br/servicos-digitais-informacoes-gerais/ antes de ativar catálogo comercial ou retransmissão de obras protegidas.

Os efeitos de ambiente desta fase são ruídos sintetizados pelo navegador, controlados pelo ouvinte, não gravações comerciais de chuva, mar ou terceiros.

## Critérios de aceite

- Play funciona após clique, faixas pulam quando terminam, navegação SPA não interrompe o player.
- Slider música não altera o ganho do ambiente; slider ambiente não altera a música.
- Playlists locais funcionam após recarregar e não vazam entre navegadores.
- Nenhum botão anuncia Login Google ou publicação de episódio quando esses recursos não existem.
- Fontes de música, autoria, créditos e condições de licença visíveis.
- Layout responsivo, foco de teclado, controles de volume legíveis no celular.
- Newsletter não armazena número em serviço terceiro sem opt-in explícito e confirmação do backend.
