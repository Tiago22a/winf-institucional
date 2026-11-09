# Biblioteca visual regional — WINF Select™

As imagens de **Santos, Praia Grande, Guarujá, Sorocaba, Pilar do Sul e Campina Grande** devem ficar associadas à cidade correta em três camadas, sem depender apenas de metadados internos que WhatsApp ou Instagram podem remover.

## Padrão de armazenamento

- **Nome:** `winf-select-santos-sp-capa-whatsapp-2026-v01.jpg`, `winf-select-pilar-do-sul-sp-feed-conforto-2026-v01.jpg` etc. O nome indica município, UF, uso, assunto e versão.
- **Pasta da cidade:** `assets/cidades/<cidade-uf>/`, com subpastas opcionais `perfil/`, `capa-whatsapp/`, `posts/` e `capas-site/`. Não reutilize a mesma arte final entre cidades simplesmente renomeando-a.
- **Metadados da imagem:** descrição que começa com `WINF_SELECT_CITY=<cidade-uf>`, seguida por WINF Select™, localidade, assunto e aviso de imagem ilustrativa quando aplicável. Preservar atribuição e direitos de uso.
- **Cadastro digital:** `docs/media/winf-city-image-registry.json` relaciona origem, página oficial, arquivo, descrição e uso. O script `scripts/check-winf-city-images.mjs` impede cruzamento entre imagens de páginas regionais.

## Regras editoriais

1. **Não usar cidade errada no material publicado.** Antes de subir a capa, conferir nome do arquivo, visual, cadastro e URL de destino. Cada localidade exige um título, uma mensagem e uma atribuição próprios.
2. **Fotos ilustrativas não são obras realizadas na cidade.** Uma fotografia arquitetônica genérica pode compor uma arte, desde que não seja rotulada como uma instalação real no município.
3. **Metadados não garantem maior alcance.** Para SEO e previews, também importam o conteúdo da página, nome de arquivo, contexto, texto alternativo, imagem OG e dados de desempenho reais.
4. **WhatsApp/Instagram podem reprocessar e remover EXIF/IPTC.** O nome original e a ficha do cadastro são as referências internas; o arquivo publicado na rede pode não preservar os metadados.
5. **A capa do WhatsApp Business não é uma imagem OG do site.** Seu formato e área segura são diferentes. O cadastro deverá marcar o uso correto; não tratar imagens de perfil, capa horizontal e preview de link como intercambiáveis.
6. **Cidades pré-ativação:** evitar afirmações de loja, equipe técnica instalada ou serviço disponível sem confirmação.

## Situação inicial

As capas de compartilhamento dos sites (1200×630 JPG) são geradas automaticamente com marcação EXIF de cidade, vinculadas à página canônica e validadas em CI. Novos criativos para Instagram/WhatsApp deverão ser adicionados à pasta da cidade e cadastrados antes de publicação. Esta preparação **não equivale a carregar capas diretamente nos perfis sociais**, que exigem ação do administrador da conta.
