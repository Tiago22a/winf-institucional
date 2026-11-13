# WINF Asset Light™ — primeiro lote de 10 sites territoriais

Data de preparação: 13/11/2026. Branch: `feat/winf-asset-light-piloto-10-cidades-20261113`.

## Premissas

- 200 localidades únicas (100 em SP + 100 em outros estados) permanecem no inventário `crm/winf-assetlight-territorios-200.json`, sem afirmar que todas as páginas estão no ar.
- Primeiro lote: São Paulo, Barueri, Santana de Parnaíba, Osasco, Cotia, Itapevi, Jandira, Carapicuíba, Taboão da Serra, Embu das Artes.
- **Não criar páginas repetitivas só para indexação.** Os primeiros dez sites foram redesenhados com descrições locais, perguntas técnicas e referências de bairros de fontes externas, mas continuam `noindex` e fora do sitemap até revisão comercial/editorial.
- HTML com CSS responsivo compartilhado sem Tailwind CDN e sem vídeos pesados; primeiro quadro com imagem leve já existente na WINF. Testar mobile, tablet, desktop e links antes de anunciar entrega.
- Geografia refere-se à **cidade** (dados de IBGE/centroide do mapa de expansão no backup), nunca à localização de uma loja.
- Os bairros citados são referências de planejamento; **não** significam cobertura presencial confirmada. Endereço, instalador, licença, Instagram local e e-mail Google não foram provisionados.
- Site disponível por URL não é site indexado. Solicitação de indexação somente depois da aprovação de conteúdo e da situação comercial.
- Manter regra `config/seo-territorios-aprovados.json` e workflow antidoorway existente. Liberação gradual, nunca 200 páginas parecidas simultaneamente.

## Próximos passos

1. Auditoria HTTP 200/HTTPS e canônicos dos dez sites após deploy; conferir 360/390/768/1024/1440 px.
2. Validar bairros e informação regional com equipe comercial e fontes municipais, adicionar casos reais sob autorização, regras de condomínios quando disponíveis e atendimento municipal comprovado.
3. Confirmar disponibilidade de instalação por município sem inventar filiais.
4. Liberar cada site para indexação individual só após aprovação editorial registrada.
5. Criar outros lotes usando pesquisas específicas, não duplicando o mesmo texto.

## Fontes de referências locais

- sao-paulo-sp: https://legislacao.prefeitura.sp.gov.br/lei-11220-de-20-de-maio-de-1992/consolidado
- barueri-sp: https://portal.barueri.sp.gov.br/secretarias/secretaria-servicos-municipais/limpeza-urbana
- santana-de-parnaiba-sp: https://www.santanadeparnaiba.sp.gov.br/plano_diretor/pmsb/
- osasco-sp: https://www.osasco.sp.leg.br/vila-yara
- cotia-sp: https://cotia.sp.gov.br/regiao/
- itapevi-sp: https://noticias.itapevi.sp.gov.br/nova-base-da-gcm-garante-mais-seguranca-dentro-do-terminal-de-onibus-no-centro/
- jandira-sp: https://www.jandira.sp.gov.br/
- carapicuiba-sp: https://carapicuiba.sp.gov.br/noticia/view/4184/guarda-civil-de-carapicuiba-realiza-acao-no-final-de-semana-e-recupera-moto-roubada
- taboao-da-serra-sp: https://portaltaboao.com/bairros
- embu-das-artes-sp: https://cidadeembudasartes.sp.gov.br/mapas-dos-bairros/
