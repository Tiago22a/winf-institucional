# WINF Partners™ — Expansão Estado de São Paulo / Expansão Brasil (200 territórios)

**Preparação:** 13/11/2026, PR #66 em rascunho. A publicação não ocorreu automaticamente.

## Estrutura

- **Expansão Estado de São Paulo:** 100 municípios-alvo do cadastro já existente `config/winf-expansion-100-sp.json`. As 71 localidades cobertas pelas centrais 013 e 015 continuam em registro **separado**, como atendimento regional — não são licenças extras nem estão automaticamente disponíveis ou ocupadas.
- **Expansão Brasil:** 100 municípios-alvo, um município por ficha, abrangendo **26 capitais fora de SP (incluindo Brasília)** e **74 polos adicionais**. Nenhum município paulista aparece neste grupo.
- **CRM consolidado:** `crm/territorios-200.csv`, 200 fichas para importação no sistema administrativo. CSV não equivale a escrita no banco de dados do WINF OS.
- **Mapa:** `config/winf-expansion-map.json`, 200 pontos geográficos por sede municipal aproximada, não endereço de loja. Fontes de coordenadas identificadas no JSON; a malha de municípios e códigos foi cruzada com a base pública de Municípios Brasileiros.
- **Fichas:** 100 novas rotas `/partners/territorios/<slug>/` para o Brasil; 100 fichas paulistas existentes são preservadas. Todas as fichas permanecem `noindex,follow` até curadoria individual e comprovação de operação.
- **Bairros:** propostas locais para prospecção, sinalizadas como `pendente_validacao_local`. Não implicam ranking oficial de renda, equipes, endereço, disponibilidade ou Google Business Profile.

## Fontes e método de prioridade

- IBGE: [Estimativas municipais de população de 2026](https://www.ibge.gov.br/estatisticas/sociais/populacao/9103-estimativas-de-populacao.html).
- IBGE: [PIB dos Municípios, série de 2023](https://www.ibge.gov.br/estatisticas/economicas/industria/9088-produto-interno-bruto-dos-municipios.html).
- Geografia e código IBGE: [Municípios Brasileiros, CSV](https://github.com/kelvins/Municipios-Brasileiros/blob/master/csv/municipios.csv).

**Critério de seleção v1:** priorizar capitais, polos metropolitanos, corredores imobiliários, cidades litorâneas e centros regionais reconhecíveis. A classificação `capital / polo_prioritario / polo_regional` é editorial e **não é ranking matemático derivado do PIB ou renda**. Próxima revisão: cruzar populações, PIB e indicadores imobiliários por cidade e bairro, com pesos auditáveis.

## Governança para publicação e CRM

O cadastro deve preservar três dimensões: atendimento operacional, URL existente/publicada e status jurídico-comercial da exclusividade. `em_validacao` não significa disponível. Registrar responsável comercial, candidato, prioridade, agenda e instaladores **somente em backend privado**, não em arquivos do site. Não publicar perfil de empresa local fictícia, reviews, endereço, telefone de loja ou páginas em escala para manipular buscas. Se o conteúdo permanecer genérico, manter `noindex` para cumprir orientações [Google Search Central](https://developers.google.com/search/docs/essentials/spam-policies).

## Critérios de aceite

1. 100 SP e 100 Brasil (26 capitais + 74 polos), 200 IDs e códigos IBGE distintos.
2. Mapa com pontos e alternância de camadas, filtros separados e botão ver mais/ver menos.
3. 200 fichas navegáveis, `noindex` até revisão, sem dados operacionais inventados.
4. 71 cidades com atendimento regional permanecem visíveis, sob as centrais 013 e 015.
5. CSV importável para CRM, sem revelar contatos pessoais.
6. Somente após revisão visual no celular, testes, integração do CRM e aprovação, liberar o PR para publicação.
