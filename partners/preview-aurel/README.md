# WINF Partners — prévia AUREL / 06.11.2026

**Escopo:** uma alternativa visual de home de expansão, criada em nova rota isolada (`/partners/preview-aurel/`). NÃO altera `/partners/` em produção nem `/briefing/`.  
**Estado:** protótipo estático para revisão editorial/visual. **Não publicar como oferta oficial.**

## Referências de marca
- Manter as fontes institucionais WINF (Gustavo para headlines; JetBrains Mono para microcopy), preto, branco, cinza.
- A foto original enviada pelo fundador para AUREL™ é a referência visual; **não recriar nem redesenhar o personagem**.
- Colocar o arquivo aprovado em `partners/preview-aurel/assets/aurel-reference.jpg`. Sem esse arquivo, o layout mostra placeholder honesto.
- Não misturar GHOST SHOP™ (abastecimento) com o programa de convite GHOST (captação), que possuem funções distintas.
- A página não ativa franquias e não deve anunciar retorno, renda, taxa ou garantia sem decisão jurídica/econômica.

## Testes manuais do PR
1. Abrir em 360, 390, 768, 1024 e 1440 px, sem overflow horizontal.
2. Verificar links internos e `/briefing/`, navegação por teclado e foco.
3. Conferir imagem Aurel, textos, contraste e layout sem arquivo de mídia.
4. Verificar acessibilidade com movimento reduzido.
5. Comparar com a prévia Google AI Studio **quando Tiago publicar URL acessível**.
6. Validar copys, kit (3×15m; 2 bonés; 2 camisetas; 1 toalha; 3 sacos tecido; adesivos, flyers, amostras) e termos comerciais.

## Coordenação
Os PRs existentes que tocam `partners/index.html` não devem ser mesclados automaticamente entre si. Integrar em sequência definida por Tiago programador.
