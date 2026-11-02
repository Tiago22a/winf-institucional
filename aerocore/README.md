# AeroCore — página inicial estática

A rota `/aerocore/` reproduz a **primeira página (HomePage/HomeView)** do ZIP de referência: abertura AeroCore + NeoSkin, faixa animada, Engineering de Proteção Definitiva, manifesto, divisões, Sobre, pilares, identidade e footer completo. O header e o menu também seguem a página inicial, sem botão Voltar.

- `index.html`: conteúdo completo em HTML; ícones SVG originais incluídos diretamente no documento.
- `assets/page.css`: efeitos de menu, faixa contínua, ícone Ghost, foco acessível e movimento reduzido.
- `assets/shell.js`: controla header, menu e canais de atendimento nas 20 páginas.
- `assets/shell.css`: mantém fontes e detalhes visuais consistentes entre as páginas.
- `assets/page.js`: comportamento de vídeos e Ghost Protocol exclusivo da página inicial. Não renderiza componentes nem gera conteúdo.
- `assets/ghost-symbol.png`: símbolo original.
- `assets/gemini_generated_video_404693f3.mp4`: vídeo original do manifesto.
- `public/quero_uma_porche_rebaixada.mp4` e `public/white-porsche.mp4`: vídeos originais já existentes, reutilizados sem alteração.

Tailwind CSS 4.1.14 via CDN; fontes Inter, Montserrat, Outfit e Rock Salt pelo Google Fonts. HTML, CSS e JavaScript vanilla: sem React, roteador, hidratação, instalação de dependências ou etapa de build.

Sirva a raiz do repositório com qualquer servidor HTTP estático e abra `/aerocore/`. Os links seguem a estrutura existente: “Explorar Arsenal” aponta para `/aerocore/aerocore/`, e NeoSkin para `/aerocore/neoskin/`. Todas as 20 páginas HTML dentro de `/aerocore/` possuem o mesmo header, menu, footer e canais de atendimento em HTML estático. Os conteúdos, metadados e interações específicas de cada página são preservados; os scripts antigos de footer foram removidos das páginas para evitar duplicação. Páginas fora de `/aerocore/` permanecem independentes.
