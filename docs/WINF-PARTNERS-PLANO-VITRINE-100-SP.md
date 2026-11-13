# WINF Partners™ — Implantação da vitrine de 100 territórios (proposta v1)

**Data:** 13/11/2026. **Ambiente:** branch de implementação; não presumir produção.

## Decisões consolidadas

- Duas centrais regionais próprias — DDD 013 (Baixada Santista e Vale do Ribeira) e DDD 015 (Sorocaba e região) — agrupadas na vitrine como atendimento operacional. Elas **não entram na conta** das 100 oportunidades de expansão.
- Cadastro de 100 municípios de SP preparado em `config/winf-expansion-100-sp.json`. Seleção editorial preliminar, para revisão da expansão. Não reutilizar o cadastro legado `js/cidades.js` como se fossem 100 novas licenças: ele mistura cidades, bairros e operações próprias.
- Na capital, bairros como Pinheiros, Jardins, Itaim Bibi, Moema e Morumbi são palavras de busca para o município São Paulo; não são licenças independentes. Alphaville é referência geográfica que alcança Barueri e Santana de Parnaíba. Desmembramento de exclusividade só com perímetro contratual.
- Três dimensões obrigatórias: `operacao` (atendimento prestado), `sitePublicado` (URL acessível) e `statusExclusividade` (disponível, em validação, reservado, licenciado). **Não deduzir uma da outra.**
- Nesta versão, os 100 estão `em_validacao`, não `disponivel`, pois precisamos reconciliar contratos, reservas e prioridades da empresa. Pode haver manifestação de interesse, mas nenhuma garantia de disponibilidade.
- Cada município tem ficha em `/partners/territorios/<slug>/`, inicialmente com `noindex,follow`. Não publicar páginas comerciais locais falsamente operacionais; remover `noindex` somente após revisão editorial com dados locais verificados e conteúdo único útil.
- Página de consulta: `/partners/territorios/`. Busca sem acento, atalhos por bairro, centrais próprias, status e links para Asset Light / Padrinho Modern / Universo Dark.
- Geolocalização é voluntária. A versão inicial usa consulta única externa ao OpenStreetMap após clique; antes de escalar, substituir por serviço próprio ou contratado conforme política de privacidade, disponibilidade e limites de uso.
- Padrinho Modern e Universo Dark são jornadas distintas de investimento. Não realizar operações financeiras ou anunciar participações sem contrato e revisão jurídica/CVM quando aplicável.

## CRM tático — Operação Território

O CSV `crm/territorios-100-sp.csv` prepara uma linha para cada município, com meta de **até 10 prospecções comerciais verificadas por cidade** (1.000 oportunidades potenciais; **nenhum lead pessoal foi inventado**). O dossiê de cada candidato é privado e deve separar dados profissionais públicos de dados pessoais, respeitando LGPD, origem da informação e oposição ao contato.

Fluxo: `MAPEAR` → `QUALIFICAR` → `CONVOCAR` → `CONVERSA` → `EM_ANALISE` → `HOMOLOGAR` / `DESCARTAR`. Candidato descartado permanece apenas pelo prazo justificado de retenção e bloqueio de recontato; não exibir dossiês publicamente. Registrar WhatsApp comercial, Instagram, fonte, avaliações com data e origem, resumo verificável, operador, histórico de consentimento/oposição e próxima ação.

## Próximos testes antes do merge/publicação

1. Revisão dos 100 municípios e conflitos com todas as cidades atendidas pelos dois DDDs; validação de limites de exclusividade com contratos.
2. Testar busca, acentos, alternativas de nome, mobile, geolocalização permitida/negada, links para Padrinho Modern e Universo Dark.
3. Integração do cadastro oficial com backend do CRM e leituras públicas somente dos status permitidos, sem exposição de candidatos ou investidores.
4. Revisão de conteúdo/SEO local, Lighthouse, Search Console e testes de publicação. O Search Console **não garante** indexação ou posicionamento.
5. Auditoria geral do ecossistema **depois** de construir e validar a vitrine, conforme decisão do projeto.
