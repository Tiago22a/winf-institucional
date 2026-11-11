# WINF™ — auditoria das animações do ecossistema
Atualização: 11/11/2026. Status diferenciado entre HTML no GitHub, arquivo de mídia no GitHub e verificação pública.

## Escopo e estado
| Página | Filme 1 | Filme 2 | Estado do código | Mídias no GitHub |
| --- | --- | --- | --- | --- |
| `/briefing/` | `/briefing/media/winf-dominio-absoluto-manha.mp4` | — | seção sob “Domínio Absoluto”, removido fallback duplicado | **Presente** |
| `/synthwave/` | `/media/ecossistema/synthwave-hero.mp4` | `/media/ecossistema/synthwave-experience.mp4` | página com dois filmes | **Presentes** |
| `/mediacar/` | `/media/ecossistema/mediacar-bmw.mp4` | `/media/ecossistema/mediacar-team.mp4` | página com dois filmes, simulador em `/partners/carro-midia/` preservado | **Presentes** |
| `/ghost-shop/` | `/media/ecossistema/ghost-shop-products.mp4` | `/media/ecossistema/ghost-shop-operation.mp4` | página com dois filmes | **Presentes** |
| `/partners/cuidar-e-conectar/` | `/media/ecossistema/cuidar-conectar-community.mp4` | `/media/ecossistema/cuidar-conectar-education.mp4` | página com dois filmes | **Presentes** |
| `/partners/universo-dark/` | `/media/ecossistema/universo-dark-entry.mp4` | `/media/ecossistema/universo-dark-equity.mp4` | página com dois filmes | **Presentes** |
| `/maw/` | campanha institucional editorial; sem MP4 aprovado | — | página e navegação criadas | não se aplica |

## Integridade e critérios de homologação
- Preservar marca e textos oficiais; não gerar versões alternativas do mascote GHOST.
- Não transformar versões conceituais em anúncios de resultados financeiros, disponibilidade de produtos ou serviços operacionais.
- Mídias: MP4 H.264 yuv420p com faststart, poster WebP, sem trilha, 16:9; `muted autoplay playsinline loop`, carregamento responsivo/lazy via `js/winf-cinema.js`.
- O hero do briefing é um filme em **faixa própria abaixo dos CTAs**. Não substituir o vídeo por `/partners/media/hero.mp4`: isso gerou repetição indevida.
- Todos os MP4 e pôsteres faltantes foram gravados no GitHub no commit c2dd5fd32c17d83a55ee28e972639062dc056a70, com 18 arquivos binários. Testes do repositório executados após o envio.
- MP4/WebP confirmados no GitHub. O domínio deve ser conferido separadamente; publicação em main e limpeza de cache não provam atualização do servidor.
- Após copiar os arquivos, conferir status 200, Content-Type correto, primeira imagem e loop em desktop/mobile, menu e botões, acessibilidade com redução de movimento e cache/CDN.
