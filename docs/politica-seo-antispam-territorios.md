# Política antispam de SEO — territórios WINF Asset Light™

**Data da validação:** 13 de novembro de 2026. **Objetivo:** sites territoriais públicos, porém sem publicação prematura de conteúdo repetitivo na Pesquisa Google.

## Situação atual

- 200 páginas `/winf-select/cidades/{id}/` e 200 fichas `/partners/territorios/{id}/`: podem estar disponíveis ao usuário diretamente por URL, mas **permanecem com `noindex,follow` e fora do sitemap** enquanto em pré-lançamento.
- Hubs comerciais relevantes (`/partners/`, `/partners/territorios/`, `/briefing/asset-light/` e `/winf-select/atendimento/`) devem continuar indexáveis com conteúdo original.
- A rede tem 200 **oportunidades de ativação digital WINF Asset Light™**, não 200 lojas nem 200 licenças ativadas. Perfis Google Business Profile só quando forem elegíveis.
- A proteção técnica é conferida automaticamente pelo teste `tests/seo-anti-doorway-200.test.cjs`, executado no GitHub Actions.
- O `robots.txt` deve permitir que o Googlebot acesse a página para encontrar o `noindex`; não bloqueá-la via Disallow geral.

## Risco real identificado nas páginas locais já indexáveis

Em amostra técnica de quatro URLs de cobertura regional em SP, a sobreposição de **vocabulário extraído do HTML** (índice de Jaccard das palavras únicas, aproximação e não detector do Google) variou entre 73% e 97%; Iguape e Ilha Comprida atingiram ~97% nessa métrica. O uso de modelos semelhantes e envio à mesma central pode levantar risco de *doorway abuse* se as páginas forem concebidas para captar buscas similares e não ajudarem os usuários de forma diferenciada. **Isso não significa que o Google aplicou punição.** Revisar editorialmente as páginas indexáveis da cobertura 013/015 antes de ampliar a quantidade.

## Critérios antes de liberar UMA página territorial para `index`

1. Página serve ao cliente (e não apenas ao robô de busca), com informação local substantiva: serviços disponíveis de fato, áreas de atendimento confirmadas, orientação técnica pertinente, casos reais e datas/origens verificáveis, identidade regional honesta.
2. Diferenciar claramente `site_online`, `territorio_disponivel`, `licenciado_ativo`, `atendimento_digital` e `instalacao_presencial_confirmada`; não fingir endereço, filial, técnico local ou resenhas.
3. Demonstrar utilidade distinta de páginas vizinhas — não apenas substituir nome da cidade/UF, lista de bairros e links para o mesmo WhatsApp.
4. Revisar título, descrição, H1, conteúdo responsivo, canonicals, links, mídia, schema apropriado, acessibilidade e desempenho.
5. Aprovação humana do conteúdo, alteração da política/testes em PR específico, remoção de `noindex` e inclusão no sitemap apenas para URLs aprovadas. A decisão final de indexar é do Google.
6. Não utilizar domínios novos, subdomínios ou redes de sites para disfarçar conteúdo duplicado; não usar conteúdo oculto, geolocalização enganosa ou versões diferentes para Googlebot e pessoas.

**Documentação:** https://developers.google.com/search/docs/essentials/spam-policies?hl=pt ; https://developers.google.com/search/docs/crawling-indexing/block-indexing

