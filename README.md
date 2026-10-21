# WINF™ — versão estática

Esta pasta contém a conversão da landing principal para **HTML estático**, **Tailwind CSS** e **JavaScript vanilla**. Não há React, JSX, Vite ou runtime de componentes. O JavaScript está limitado a menu overlay, navegação por âncoras, scroll progressivo, carregamento lazy de vídeos, formulário de contato/WhatsApp e consentimento de cookies.

## Estrutura

| Arquivo | Função |
| --- | --- |
| `index.html` | Markup completo da landing principal WINF Select™. |
| `styles.css` | Gustavo/JetBrains Mono, tokens visuais, animações, fallback de mídia e responsividade. |
| `script.js` | Interações vanilla sem estado React. |
| `winf-logo.svg` | Asset SVG importado no header e footer; usa o lockup recuperado como fallback local. |
| `assets/live-logo.png` | Imagem auxiliar embutida pelo SVG da logo principal. |

## Páginas convertidas

Além da raiz `/`, o pacote inclui `winf-home`, `aerocore`, os catálogos `aerocore/ghost`, `aerocore/phantom`, `aerocore/spectre` e `aerocore/wraith`, `neoskin`, `neoskin/bunker`, `neoskin/apocalypse`, `ceramic`, `invisible`, `dual-reflect`, `blackpro`, `securityblind`, `miniblind-venetian`, `partners`, `blog` e seis páginas individuais do WINF Journal. A **BlackShop não foi convertida nem linkada**, conforme solicitado.

## Assets do projeto original

Os arquivos pesados não vieram no ZIP recebido. Por isso, a conversão mantém os caminhos originais usados pelos componentes React: `/fonts/gustavo-*.otf`, `/fonts/jetbrains-mono-var.woff2`, `/images/**` e `/videos/**`. Basta copiar as pastas `public/fonts`, `public/images` e `public/videos` do projeto original para a raiz pública ao lado de `index.html` para recuperar as imagens e vídeos sem mudar o markup.

Enquanto esses arquivos não são adicionados, a página preserva a composição usando o fundo escuro técnico e wordmarks de fallback nos cards, sem quebrar o layout ou esconder conteúdo.

## Execução local

Sirva esta pasta por HTTP, pois as referências de fonte e mídia usam caminhos absolutos do projeto original. Por exemplo:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

Depois, abra `http://localhost:4173/`.


## Landing pages locais e Tailwind

As páginas locais focadas em intenção de busca usam CSS Tailwind compilado em `assets/src/css/output.css`, sem depender do CDN:

- `/pelicula-de-controle-solar-santos-sp/`
- `/insulfilm-residencial-sorocaba-sp/`

Para recompilar o CSS depois de alterar classes nessas páginas:

```bash
npm install
npm run build:css
```

O arquivo-fonte é `assets/src/css/input.css`. As fontes Gustavo e JetBrains Mono continuam servidas localmente pela pasta `/fonts/`.

## Compressão de imagens e vídeos

O utilitário `scripts/optimize_media.py` encontra mídias referenciadas pela home e pelas páginas AeroCore e tenta reduzir o tamanho mantendo **o mesmo nome, caminho e formato do arquivo**.

Configuração atual, priorizando qualidade visual:

- MP4: H.264, CRF 22, `faststart` e áudio preservado quando existir;
- JPEG: qualidade 90;
- WebP: qualidade 88;
- PNG: mantém PNG e aplica compressão/remoção de metadados;
- um arquivo só substitui o original quando a economia é de pelo menos 5%.

### Windows

Instale as dependências:

```powershell
winget install Gyan.FFmpeg
winget install ImageMagick.ImageMagick
```

Feche e abra o PowerShell e confirme:

```powershell
ffmpeg -version
magick -version
```

Faça primeiro uma simulação:

```powershell
python scripts/optimize_media.py --dry-run
```

Se o resultado estiver adequado:

```powershell
python scripts/optimize_media.py
git status
git add .
git commit -m "Compress images and videos for performance"
git push origin main
```

No Windows o script usa apenas o comando `magick` para ImageMagick, evitando confundir com o `convert.exe` nativo do sistema.

## Hub oficial — `/hub/`

Diretório de marcas, redes sociais, unidades e soluções Partners. Usa logo e fontes locais, sem dependências de CDN. As três unidades regionais direcionam ao WhatsApp comercial central +55 13 98111-3001, conforme definido para o hub. Produtos sem página própria direcionam ao contato Partners.

A página fica fora do sitemap e traz `noindex, nofollow, noarchive, nosnippet, noimageindex` para robots, Googlebot e Bingbot. O cabeçalho `X-Robots-Tag` está configurado em `_headers` (hosts compatíveis) e `hub/.htaccess` (Apache com mod_headers). Em outros servidores, configure o mesmo cabeçalho para `/hub` e `/hub/*` e valide após o deploy. Não bloquear o crawling no robots.txt: buscadores precisam ler o `noindex`. Essas diretivas impedem indexação por buscadores compatíveis, mas não são controle de acesso; a URL continua pública.

## Rodapé e Partners — outubro de 2026

Os headers e menus originais foram preservados em todas as páginas, incluindo o catálogo e o hub. O visual do rodapé adapta `WinfPartnersFooter` do anexo para CSS e JavaScript nativos: faixa de expansão, grade de quatro colunas, identificação de ecossistema, links institucionais e retorno ao topo. Os destinos de links e os perfis de Instagram por marca continuam os atuais do site. Não há React, TypeScript ou migração de framework.

O rodapé está incluído diretamente no HTML das 44 páginas de conteúdo, com estilos em `css/winf-footer.css`, e aparece mesmo com JavaScript desativado. `js/winf-footer.js` atualiza o ano e ativa o retorno ao topo; mantém um renderer de fallback para páginas novas sem o markup estático. Ao mudar o conteúdo do rodapé, sincronize também o HTML das páginas. As URLs de CSS e JavaScript usam a versão `20261021-footer-static3`; `_headers` solicita revalidação desses dois arquivos em hosts compatíveis. O antigo `js/current-year.js` não é carregado porque também substituía o rodapé; a atualização do ano fica no script canônico do footer. As bandeiras vetoriais de China, Estados Unidos e Brasil permanecem em `images/flags/`.

`/partners/` usa HTML, CSS e JavaScript nativos, sem React, TypeScript, Tailwind CDN ou etapa de build. O visual adapta a landing do anexo: hero cinematográfico, manifesto, modelos de operação, pilares, arquitetura, galeria e contato. As ações apontam para âncoras e páginas existentes. O formulário apenas prepara uma mensagem no WhatsApp comercial já usado na home (`5513997815375`); o usuário conclui o envio no WhatsApp. Não há gravação em banco nem simulação de envio. As imagens dos modelos são identificadas como conceituais.

### Mídias da Partners

As mídias do anexo estão em `partners/media/`, sem dependência de URLs temporárias:

- Imagens WebP, qualidade 83, com versões de 640 e 1280 px, `srcset`, dimensões declaradas e carregamento lazy.
- Hero: MP4 H.264, 1280 × 720, 24 fps, CRF 26, sem áudio, `faststart`.
- Manifesto: MP4 H.264, 1280 × 720, 24 fps, CRF 25, áudio AAC 96 kbps preservado, `faststart` e controles nativos.
- Pôsteres WebP para ambos os vídeos. O hero pausa fora da tela, em aba oculta e com redução de movimento; economia de dados e redução de movimento evitam seu download. O manifesto carrega próximo à área visível e só reproduz por ação do usuário.

Os dois vídeos passaram de 19,32 MB para 2,97 MB. O conjunto de mídias utilizado, incluindo versões para celular e pôsteres, ocupa aproximadamente 3,9 MB. O sitemap mantém as URLs anteriores, atualiza `lastmod` e inclui imagens e manifesto de Partners. Hub, cliente, briefing e 404 continuam fora do sitemap; os redirecionamentos de cidades foram preservados.
