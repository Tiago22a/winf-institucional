# WINF Select™ — 10 cidades paulistas | Pacote de revisão controlada

**Data:** 15/11/2026. **Situação:** proposta técnica em revisão, não publicada; não há aprovação de indexação.

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
