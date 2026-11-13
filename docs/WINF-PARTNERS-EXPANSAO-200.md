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

## Estrutura das 200 páginas WINF Select com SEO local — verificação de 13/11/2026

- Foram criadas **200 URLs de páginas locais de pré-lançamento**, além das 200 fichas de expansão, em `/winf-select/cidades/<id>/`.
- A identidade visual e o repertório de imagens, vídeos e logos oficiais são compartilhados entre as páginas e seguem a direção do site WINF Select Santos. A página operacional de Santos não foi alterada.
- Cada local possui `title`, `meta description`, `og:title`, `og:url`, canonical, região geográfica, dados `Organization` e `Place` sem endereço comercial nem falso `LocalBusiness`, código IBGE e ponto municipal OSM.
- O cadastro de pesquisa dos bairros é **preliminar** e não equivale a informação estatística de renda nem disponibilidade de aplicação.
- As **200 URLs permanecem noindex**, pois uma franquia/unidade regional não pode ser anunciada como operante sem validação. Só depois de conteúdo local próprio, comprovação de equipe e atendimento regional, remoção de noindex e nova revisão do sitemap/Search Console.
- A planilha CSV do CRM lista as 200 rotas preparadas, com campo `site_local_publicado=nao`; sem importação automática no banco privado.
- O teste `tests/winf-select-200.test.cjs` verifica todas as 200 páginas, canônicos, schema, geocódigos, logos, links, SEO e ausência de endereço/contato falso.

**Atenção**: conteúdo programático igual ao de Santos não significa que os 200 territórios possuem 200 unidades operacionais. O material de pré-lançamento é de expansão e pesquisa local.

## Contato e Instagram de territórios inativos (13/11/2026)
Os 200 sites WINF Select em expansão recebem automaticamente links no hero, na seção de pesquisa e no botão fixo para **https://wa.me/5513981113001** com mensagem identificando cidade/UF e código. O Instagram oficial apontado é **@winf.ofc**. Cada cidade tem um `@winfselect.<municipio>` como **proposta**; o link aparece claramente marcado como não verificado, sem afirmar que o perfil local já existe ou pertence à WINF. Centralização em `config/winf-territory-contacts.json`. O CSV de CRM foi ampliado com os dados de contato e um arquivo `crm/inventario-publicacao-200.csv` permite listar todos os 200 locais e seus status. Sites de operação já ativa mantêm contatos anteriores.

## Descoberta orgânica e links do atendimento regional (13/11/2026)
Criado diretório indexável `/winf-select/atendimento/`, com 71 URLs HTML estáticas de municípios com cobertura comercial pelas centrais 013 (22) e 015 (49). O guia nacional indexável conecta ao diretório; sitemap inclui esse hub e a vitrine nacional `/partners/territorios/`. Os 200 sites de pré-lançamento e fichas individuais permanecem fora do sitemap e com `noindex`. CI inclui `tests/winf-coverage-seo.test.cjs`.
