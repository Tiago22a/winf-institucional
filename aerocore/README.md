# AeroCore — página inicial estática

A rota `/aerocore/` reproduz a **primeira página (HomePage/HomeView)** do ZIP de referência: abertura AeroCore + NeoSkin, faixa animada, Engineering de Proteção Definitiva, manifesto, divisões, Sobre, pilares, identidade e footer completo. O header e o menu também seguem a página inicial, sem botão Voltar.

- `index.html`: conteúdo completo em HTML; ícones SVG originais incluídos diretamente no documento.
- `assets/page.css`: efeitos de menu, faixa contínua, ícone Ghost, foco acessível e movimento reduzido.
- `assets/page.js`: abre e fecha menu/canais, controla o cabeçalho e o Ghost Protocol. Não renderiza componentes nem gera conteúdo.
- `assets/ghost-symbol.png`: símbolo original.
- `assets/gemini_generated_video_404693f3.mp4`: vídeo original do manifesto.
- `public/quero_uma_porche_rebaixada.mp4` e `public/white-porsche.mp4`: vídeos originais já existentes, reutilizados sem alteração.

Tailwind CSS 4.1.14 via CDN; fontes Inter, Montserrat, Outfit e Rock Salt pelo Google Fonts. HTML, CSS e JavaScript vanilla: sem React, roteador, hidratação, instalação de dependências ou etapa de build.

Sirva a raiz do repositório com qualquer servidor HTTP estático e abra `/aerocore/`. Os links seguem a estrutura existente: “Explorar Arsenal” aponta para `/aerocore/aerocore/`, e NeoSkin para `/aerocore/neoskin/`. As demais páginas e seus arquivos compartilhados permanecem independentes desta página inicial.
