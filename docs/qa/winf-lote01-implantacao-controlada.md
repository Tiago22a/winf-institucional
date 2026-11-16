# WINF Select™ — 10 cidades paulistas | Pacote de revisão controlada

**Início:** 15/11/2026. **Atualização:** 16/11/2026. **Situação:** 10/10 páginas integradas à main, 10/10 URLs confirmadas HTTP 200 por auditorias externas, com acesso comercial e WhatsApp central; **noindex** permanece e a indexação Google NÃO foi aprovada/confirmada.

## Problemas observados e correções

1. **Colisão potencial de arquivos:** o pacote antigo referenciava `/assets/territorio.css` e `/assets/territorio.js`, caminhos globais que podiam misturar recursos com a página institucional. Passaram para `/winf-select/assets/territorio.css` e `/winf-select/assets/territorio.js`, com referências relativas corrigidas nas dez páginas.
2. **Formulário WhatsApp:** limitados os campos a 240 caracteres no script; preservados links HTML diretos para a central mesmo sem JavaScript. Removido código de elementos `data-quick-wa` não presentes no HTML.
3. **Segurança e privacidade:** inclusão de política de referência `strict-origin-when-cross-origin` em cada HTML. Sem coleta de dados pessoais em backend, sem cookies adicionados.
4. **Canais e operação:** nenhum instalador local, Google Business Profile ou conta Instagram foi apresentado como instalado ou confirmado. CTA secundário de parceria não se confunde com pedido de orçamento.
5. **SEO:** todas as páginas permanecem `noindex,follow`; nenhuma entrou no sitemap, no Google Business ou em publicação. Canonical individual permanece apenas como referência técnica planejada.
6. **Automação pré-existente do repositório:** `sync-winf-city-sites.yml` pode fazer commits em `main` quando caminhos de páginas mudarem. Por isso o pacote deve ser avaliado em branch isolada/PR draft e **não integrado a main sem revisão**.
7. **Teste CI antigo:** `tests/winf-assetlight-piloto-10.test.cjs` presumia a presença de dez páginas históricas já revertidas; foi proposta versão focada nas dez URLs do Lote 01 e em validações de segurança/CRM, para que o gate continue relevante.

## Critérios para eventual liberação

- Inspeção visual em desktop e celular em preview isolado (bloqueada por política de navegador neste ambiente).
- Verificação HTTP 200 e carregamento CSS/JS em preview com domínio real.
- Revisão manual do valor local de cada página, fontes de bairros e ausência de conteúdo repetido em escala.
- Verificação de canônicos de páginas existentes, eventual sobreposição com páginas regionais já indexadas e clareza sobre disponibilidade de operação.
- Aprovação comercial, editorial e jurídica por cidade.
- Somente após aceite explícito: publicação controlada individual, alteração do `noindex`, atualização de sitemap e monitoramento pelo Search Console. Indexação depende do Google, não é garantida.

**Proibições neste pacote:** não alterar Santos; não criar perfil Google Business fictício; não inventar prestadores; não alterar `main`, `sitemap.xml`, `robots.txt` ou `config/seo-territorios-aprovados.json` por esse pacote.


## Atualização de homologação — 16/11/2026

**Verificação concluída:** as dez páginas abaixo apresentaram HTTP 200 e conteúdo próprio durante auditorias OpenSEO. O domínio usa WAF/Cloudflare: um auditor encontrou 429 inicialmente em Jundiaí e runners do GitHub recebem 403 nas páginas HTML; por isso, a evidência de acessibilidade veio do auditor externo, não do teste de rede do GitHub.

| Cidade | HTTP | Auditoria OpenSEO |
|---|---:|---|
| Barueri | 200 | `9c5a1de9-ffd8-4267-bf52-8a4a113a99e2` |
| Cotia | 200 | `17f5de61-6e76-45ef-897a-c22604668ebb` |
| Santana de Parnaíba | 200 | `6c5a0c3e-ff28-42de-b87d-0d63954159af` |
| Itapevi | 200 | `f1e26f5f-11b1-444a-af29-3a9da625428e` |
| Indaiatuba | 200 | `3f6ef1f0-bd9a-4f86-877f-5f6d6b6a7a7e` |
| Jundiaí | 200 | `81aebbd4-9768-4f98-9948-1932fec008d2` (renderização de navegador) |
| Osasco | 200 | `871bc793-8834-4cbd-98b3-718a4798177d` |
| Campinas | 200 | `f6b5a11e-e095-4f1d-88e8-5c396cf63b92` |
| Vinhedo | 200 | `5e2f6fc9-b4ee-4ac6-8f5d-3f1cff408c77` |
| Vargem Grande Paulista | 200 | `ceedbbf1-6260-4edd-b865-a8f3c189a17e` |

- PR de produção: https://github.com/Tiago22a/winf-institucional/pull/132 (merge 15/11/2026).
- GitHub Actions auditoria territorial e SEO: sucesso no PR e em `main`.
- Recursos CSS e JS: ambos responderam HTTP 200 no GitHub runner 16/11/2026.
- WhatsApp: HTML aponta para central `wa.me/5513981113001`, com origem territorial. O formulário JS passou no teste unitário, mas a **entrega da mensagem ao WhatsApp real** ainda não foi verificada com uma conversa humana.
- Cadastro de 200 territórios mantido; dez registros do Lote 01 atualizados com HTTP 200 individual, sem declarar atuação local ou licenciamento concedido.
- **Não homologado para indexação:** `noindex,follow` continua nas dez páginas e elas estão fora do sitemap. Antes de liberar SEO orgânico, revisar conteúdo local e concorrência/canônicos, corrigir metadescrições longas, validar experiência mobile em produção, e confirmar a política de cobertura/encaminhamento de solicitações.

**Escopo da homologação técnica atual:** páginas existentes e acessíveis (HTTP 200) 10/10; publicabilidade comprovada. **Não afirmar** dez páginas indexadas, dez instaladores operando, dez territórios concedidos ou mensagens WhatsApp entregues.
