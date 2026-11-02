# AeroCore — página institucional estática

A rota `/aerocore/` reproduz a página AeroCore do ZIP de referência, sem React, roteador, hidratação ou etapa de build.

- `index.html`: conteúdo completo, menu, cartões, matriz técnica, FAQ nativo (`details`/`summary`) e canais de atendimento. SVGs dos ícones Lucide incluídos diretamente no HTML.
- `assets/page.css`: ajustes da página, estados de navegação, acessibilidade e preferência por movimento reduzido.
- `assets/page.js`: menu com teclado e Escape, canais de atendimento, filtro das colunas da matriz e comportamento do cabeçalho. Não gera conteúdo nem renderiza componentes.
- `assets/ghost-symbol.png`: símbolo original do ZIP.
- `assets/porsche-racing.mp4`: vídeo original do ZIP; o arquivo antigo permanece disponível para as outras páginas.

Tailwind CSS 4.1.14 carrega via CDN. Inter, Montserrat, Outfit e Rock Salt carregam pelo Google Fonts. A hospedagem precisa permitir esses recursos externos. Não é necessário executar `npm install` ou compilar para publicar esta página.

Para visualizar, sirva a raiz do repositório com qualquer servidor HTTP estático e abra `/aerocore/`. Os caminhos absolutos dos recursos e links seguem a estrutura existente de `winf-institucional`.

O restante do site e as subpáginas da AeroCore mantêm seus arquivos e scripts atuais. Esta página não carrega o JavaScript compartilhado antigo da AeroCore.
