# Cuidar & Conectar™ — mídias oficiais da campanha
A rota pública é `/partners/cuidar-e-conectar/`.
A página mantém a identidade própria (preto, branco e verde-lima), apresenta duas artes e dois filmes, e informa de modo explícito que são materiais ilustrativos.

## Arquivos originais recuperados
Colocar no repositório, em `media/ecossistema/`:
- `cuidar-conectar-community.webp` — arte original da comunidade, logo Cuidar & Conectar
- `cuidar-conectar-education.webp` — arte original da oficina educativa
- `cuidar-conectar-community.mp4` — filme do acolhimento / toque de mãos
- `cuidar-conectar-education.mp4` — filme da oficina / crianças com notebook

## Publicação em lote
O ZIP `cuidar-conectar-media.zip` contém exatamente esses quatro arquivos nos caminhos acima.
Se o pacote for enviado à pasta `uploads/` na branch `main`, o workflow `import-cuidar-conectar-media.yml` valida a integridade dos quatro arquivos, comita as mídias e remove o ZIP temporário. Não trocar a campanha por imagens de WINF Select, Ghost Shop ou modelos de franquias.

## Verificação
- Conferir status de CI e existência dos quatro arquivos na árvore da branch main
- Abrir o hero da página na versão desktop e em celular; conferir legibilidade com vídeo silencioso, loop e poster como fallback
- Conferir as duas fotografias intactas (logos e textos embutidos não devem ser cortados)
- Confirmar a rota e o status HTTP no domínio após publicação e expiração de cache
- Somente anunciar que está tudo funcionando após esses testes
