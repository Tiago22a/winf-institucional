# SynthWAVE.fm™ — Implantação de contas e newsletter

**Implementado no código, ainda não habilitado no ambiente público.** A rádio e as playlists locais permanecem livres. Não confundir o merge desta PR com a ativação do Firebase ou a implantação de um Worker.

## 1. Conta Google para o ouvinte

Arquivos:
- `firebase-public-config.json` — chaveamento público **desativado** até homologação
- `cloud-auth.js` — Firebase Auth + Firestore (API modular), conta opcional
- `my-playlists.js` — ações de backup/restauração explícitas
- `firestore-rules.fragment.rules` — **fragmento**, não substituição integral de regras WINF

**Passos de infraestrutura:**

1. Escolher ou criar o projeto Firebase para SynthWAVE, com custos e governança definidos. Evitar compartilhar permissões com áreas críticas do WINF OS sem isolamento.
2. Habilitar Authentication > Google; autorizar `winf.com.br` e `www.winf.com.br`.
3. Criar Firestore e revisar a localização, orçamento, App Check e controles de acesso.
4. Integrar o bloco de `firestore-rules.fragment.rules` às **regras já existentes** do banco, sem sobrescrever outros sistemas. Testar que Alice não pode ler/escrever playlists de Bob, e que usuário anônimo não pode ler playlists.
5. Preencher **somente os campos públicos da configuração web** (`apiKey`, `authDomain`, `projectId`, `appId`) em `firebase-public-config.json`; definir `enabled: true` somente após testes.
6. Verificar login e logout em Android, iOS, desktop; o modo `signInWithPopup` pode exigir tratamentos específicos em navegadores móveis.
7. Testar duas contas, duas abas e dois dispositivos; comparar salvamento/recuperação sem expor bibliotecas entre usuários.

**Importante:** chaves de conta de serviço, tokens administrativos, client secrets e regras permissivas NUNCA devem entrar no front-end. A configuração web Firebase é pública por definição, mas deve ter domínios e políticas adequados.

### Limites intencionais desta fase

As playlists ficam automaticamente **no navegador**. Após autenticação, a pessoa deve clicar em **Salvar cópia na nuvem** ou **Trazer playlists da nuvem**. As duas ações mesclam faixas para evitar perda acidental. Exclusões locais não são propagadas imediatamente para a nuvem; portanto, esta versão faz backup/recuperação, **não sincronização bidirecional automática**. Esse recurso virá numa evolução com controle de versões e resolução explícita de conflitos.

## 2. Newsletter por nome + WhatsApp

Arquivos:
- `newsletter/config.json` — formulário **oculto** até estar pronto
- `newsletter/newsletter.js` — interface opt-in que não bloqueia a rádio
- `backend/worker.js` — endpoint seguro Cloudflare Worker
- `backend/schema.sql` — tabela de inscritos Cloudflare D1
- `backend/wrangler.toml.example` — exemplo de deploy, sem segredos

**Para implantar:**

1. Criar banco D1 para SynthWAVE (separado de dados do WINF OS), aplicar `schema.sql` com Wrangler e verificar política de retenção.
2. Configurar Turnstile e guardar `TURNSTILE_SECRET` exclusivamente nas secrets do Worker.
3. Conferir domínio de API e rota `/synthwave/newsletter`. Definir `ALLOWED_ORIGINS=https://winf.com.br,https://www.winf.com.br` e `CONSENT_VERSION=synthwave-newsletter-v1`.
4. Implantar o Worker pela conta Cloudflare autorizada. Confirmar restrições, logs sem PII, rate limits e proteção contra abuso.
5. Validar/atualizar Política de Privacidade com finalidade, compartilhamento, retenção, procedimento de remoção e contato do responsável. Estabelecer processo de pedido de cancelamento e exclusão antes de enviar mensagens.
6. Testar lista legítima, número inválido, consentimento ausente, robô sem Turnstile, origem não autorizada, duplicata e falha do banco.
7. Preencher o endpoint HTTPS correto e a **chave pública** Turnstile em `newsletter/config.json`; ativar `enabled: true` somente após os testes.
8. O consentimento para WhatsApp é **voluntário** e independente de ouvir música. Não capturar dados silenciosamente.

**Situação:** o Worker e a migração estão versionados; nenhuma instância Cloudflare Worker foi criada, nenhum D1 foi migrado e nenhum número foi salvo por esta PR.

## 3. Catálogo, playlists e podcasts

O editor musical da SynthWAVE já dispõe de um catálogo inicial com faixas licenciadas pelo Wikimedia Commons e sons digitais próprios sintetizados no navegador. Antes de uso comercial ou streaming 24/7 sincronizado, validar direitos autorais, conexos e possíveis obrigações do ECAD.

**Conteúdo:** `PODCAST_EDITORIAL_IA.md` e `podcasts/temporada-01/ep01-cuidar-conectar.md` são materiais de roteiro, **não faixas publicadas**.

**Próximas funções:** editor de catálogo com contas administrativas autorizadas, metadados de licenças, moderação de uploads originais, podcast em MP3 com transcrição e streaming real sincronizado quando infraestrutura e direitos estiverem aprovados.

## 4. Critérios de homologação

- Rádio permanece utilizável sem login, newsletter ou Google.
- Google login só aparece com config válida e regras Firestore restritivas.
- Nenhuma playlist de outro usuário é legível; teste em duas contas.
- Falhas de login, upload ou restore nunca apagam as playlists locais.
- Nenhuma inscrição aparece como sucesso sem escrita D1 confirmada.
- Formulário permanece invisível se endpoint, Turnstile ou consentimento não estiverem configurados.
- Auditoria de privacidade e testes de navegador antes da publicação de funcionalidades autenticadas.

Documentação Firebase: https://firebase.google.com/docs/auth/web/google-signin · https://firebase.google.com/docs/firestore/security/rules-conditions

## 5. Resultado desta etapa

Esta entrega é o **alicerce técnico** para autenticação Google, biblioteca privada e captação opt-in. A ativação real depende de vincular os projetos Firebase e Cloudflare corretos; não prometer login e base de dados ativos enquanto `enabled: false`.
