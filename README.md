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
