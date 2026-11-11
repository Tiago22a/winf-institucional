# Publicação de mídias da GHOST SHOP™

Para completar a publicação, envie **um único arquivo ZIP** com o nome `ghost-shop-media.zip` nesta pasta `uploads/` na branch `main`.

O GitHub Actions `GHOST SHOP — Publicar mídias originais` confere os cinco arquivos originais, extrai para `media/ecossistema/`, versiona e elimina o ZIP temporário.

O pacote deve conter exatamente estes caminhos: 

- `media/ecossistema/ghost-shop-products.webp`
- `media/ecossistema/ghost-shop-operation.webp`
- `media/ecossistema/ghost-shop-products.mp4`
- `media/ecossistema/ghost-shop-operation.mp4`
- `media/ecossistema/ghost-shop-team.mp4`

Os arquivos originais são as duas fotos e os três vídeos de campanha fornecidos pelo proprietário. Sem reimaginar ou substituir mídias por materiais de outras marcas.

**Atenção:** a publicação da branch `main` no domínio `winf.com.br` depende da configuração do deploy da hospedagem. Não confundir push com deploy confirmado.
