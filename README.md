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

O rodapé está incluído diretamente no HTML das 44 páginas de conteúdo, com estilos em `css/winf-footer.css`, e aparece mesmo com JavaScript desativado. `js/winf-footer.js` atualiza o ano e ativa o retorno ao topo; mantém um renderer de fallback para páginas novas sem o markup estático. Ao mudar o conteúdo do rodapé, sincronize também o HTML das páginas. As URLs de CSS e JavaScript usam a versão `20261021-footer-utf8-4`; `_headers` solicita revalidação desses dois arquivos em hosts compatíveis. O antigo `js/current-year.js` não é carregado porque também substituía o rodapé; a atualização do ano fica no script canônico do footer. As bandeiras vetoriais de China, Estados Unidos e Brasil permanecem em `images/flags/`.

`/partners/` reproduz a estrutura de `src/components/LandingPage.tsx` e `LicensingPlans.tsx` do ZIP: hero, manifesto, card Asset Light sem foto, bloco corporativo com dois botões, bloco de especificadores, quatro pilares, certificado, ferramentas para arquitetos, painel financeiro, galeria e soluções avançadas. Mantém os textos, as classes Tailwind e as fontes Gustavo/JetBrains Mono do original. Header, menu e rodapé institucionais conservam os links existentes. O formulário de WhatsApp atual abre em uma janela modal a partir dos CTAs, sem acrescentar uma seção à composição original.

A implementação entregue é HTML, CSS e JavaScript nativos. O CSS Tailwind 4.2.2 está compilado em `partners/partners.css`; a entrada é `partners/tailwind.input.css`. Não há React ou TypeScript no site nem build em produção. Para recompilar com Tailwind 4.2.2 e `@tailwindcss/cli` instalados localmente, execute `npx tailwindcss -i partners/tailwind.input.css -o partners/partners.css --minify`.

### Mídias da Partners

Os MP4 comprimidos de hero e manifesto correspondem a `intro1.mp4` e `intro2.mp4` do ZIP. O hero tem um recorte extra de 16% somente em telas a partir de 1024 px. O manifesto mantém a prévia muda do original; o botão de reprodução ativa áudio e controles. Redução de movimento/economia de dados preservam os pôsteres.

As três imagens `reference-*.webp` são versões comprimidas das URLs exatas usadas pela galeria de `LandingPage.tsx`/`constants.ts`; cada `<img>` conserva sua origem em `data-reference-source`. O quarto card, Lifestyle, permanece com a estrutura e legenda originais, sem imagem substituta: o endereço de anexo do ZIP retorna 404. As fotos conceituais anteriormente acrescentadas aos cards de licenciamento, garantia e arquitetura foram removidas do HTML. O sitemap lista somente as imagens efetivamente usadas pela página e o manifesto. Os arquivos de mídia antigos permanecem disponíveis para não quebrar URLs já compartilhadas.

Os caracteres não ASCII do footer estático são gravados como entidades HTML numéricas; o script declara `charset="utf-8"`. O texto deve ser validado após a renderização, incluindo “Expansão”, “Conexões”, “Políticas”, ™ e setas.

## Tela inicial do ZIP aplicada ao briefing

`/briefing/` adapta a tela inicial com “CONSTRUÍMOS O PADRÃO.” do projeto anexado: fundo cinematográfico fixo, sobreposição escura, header branco, acesso ao WINF OS translúcido, botões de vidro e grade de verticais. Mantém os três destinos anteriores (`https://winf.com.br/partners`, `https://winf.com.br/cliente`, `https://winf.com.br/`) e o rodapé institucional já corrigido. O acesso no topo usa o mesmo destino atual do CTA de território/WINF OS. A página permanece `noindex,nofollow` e fora do sitemap.

### Subir o vídeo depois

Copie seu MP4 para **`briefing/media/briefing-bg.mp4`**. A referência já está no `<source>` do vídeo de fundo e em `briefing/briefing.js`; não é preciso alterar o HTML para ativá-lo. Nenhum vídeo foi incluído neste commit. Enquanto o arquivo não existir, o fundo usa `briefing/media/briefing-poster.webp`, um frame do vídeo do ZIP comprimido em WebP. O erro 404 desse único MP4 é esperado até o upload. Não há mensagem de erro para o visitante. O vídeo usa autoplay mudo, loop, playsinline e object-cover; redução de movimento e economia de dados mantêm a imagem estática.

### Tailwind local, sem React ou TypeScript

O CSS minificado já está versionado em `briefing/briefing.css`; o site não depende de CDN nem de build em produção. As classes estão em `briefing/index.html`, com configuração em `briefing/tailwind.config.cjs` e entrada em `briefing/tailwind.input.css`. Para recompilar a tela, execute na raiz do repositório:

```bash
npx --yes --package tailwindcss@3.4.17 tailwindcss -c briefing/tailwind.config.cjs -i briefing/tailwind.input.css -o briefing/briefing.css --minify
```

Essa compilação é isolada do CSS existente das páginas locais. As fontes Gustavo e JetBrains Mono do projeto são servidas localmente. Interações opcionais do vídeo usam apenas JavaScript nativo.
