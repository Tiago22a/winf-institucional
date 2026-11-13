# Localizador WINF Select™ — proximidade nacional

Criado em 13/11/2026. A rede comercial tem 200 municípios-alvo WINF Asset Light™ / Turnkey, e a Central 013 atende solicitações digitais de fora da cobertura regional 015.

## Dados
- [Municípios Brasileiros](https://github.com/kelvins/municipios-brasileiros), licença MIT: CSV com **5.571** códigos municipais, nomes, latitude e longitude e 27 UFs. **Não** usar estes pontos como limites municipais oficiais ou coordenadas de loja. Fonte cruzada pelo IBGE ID com `config/winf-expansion-map.json` (200 cidades) e `js/cidades.js` (71 municípios sob 013/015).
- O índice `config/winf-proximidade-brasil.json` armazena cada cidade e os índices dos três municípios comerciais geograficamente mais próximos. Para desempate, usa índice estável do cadastro WINF.
- Distância: Haversine, R=6.371,0088 km, **em linha reta**. Não informa distância por estrada, horário de deslocamento, rota, cobertura operacional ou instalador disponível.
- Seleção de cidade usa nome + UF, código IBGE e ordenação por correspondência de busca. Geolocalização só é processada no navegador após permissão expressa, sem envio de coordenadas para backend.
- Se a cidade coincide com uma das 71 localidades de cobertura, exibe também o link da página e WhatsApp central 013/015 correspondente. Fora dessas localidades, o sistema **não** presume que proximidade signifique atendimento local.

## SEO
- Página nacional indexável `/winf-select/proximo/`. Complementação com diretórios úteis por UF, sem criar milhares de páginas doorway sobre buscas muito semelhantes.
- Diretórios por UF: `/winf-select/proximo/<uf>/`; cada um inclui lista municipal e o polo mais próximo, além de links reais para os 200 sites WINF Select.
- Não usar `LocalBusiness` ou `PostalAddress` de loja fictícia. Os 200 territórios podem estar disponíveis para licenciamento enquanto execução técnica e titularidade local ainda dependem de formalização.

## Fontes de validação
- [IBGE — cidades e estados](https://www.ibge.gov.br/cidadesat/)
- [Políticas do Google — doorway abuse](https://developers.google.com/search/docs/essentials/spam-policies)
