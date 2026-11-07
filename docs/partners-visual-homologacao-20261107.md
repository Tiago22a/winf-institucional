# WINF Partners™ | Plano de homologação visual

**Escopo:** `/partners/` é a entrada principal da **franquia tecnológica** WINF Partners™. `/briefing/` é a apresentação detalhada aprovada e não deve ser remodelada neste PR.

## Direção aprovada (07/11/2026)

- Referência de atmosfera: primeira versão provisória com animação de arquitetura premium, amplitude, luz natural e rodapé translúcido.
- Referência editorial: grid Instagram `@winfpartners` — títulos monumentais, azul intenso, coral, preto e branco; aplicar cor como acento, jamais preencher todos os cards.
- Marca: **WINF Partners™** tem marca, menu e rodapé exclusivos. Não herdar o header/footer AeroCore ou trocar assinatura por WINF produto.
- Narrativa: o profissional chega à **Partners**, descobre como funciona a franquia de acessos tecnológicos e navega por `Programa → Ecossistema → Tecnologia → Modalidades → Expansão → Candidatura`.
- A família WINF de produtos é apresentada **dentro** da jornada. AeroCore™ e NeoSkin™ são submarcas irmãs, não nomes da franquia.
- A agência M.A.W.™ apoia o marketing e a expansão.
- O hero preserva a animação `/partners/media/hero.mp4` e o poster. Se o vídeo não tocar, o poster deve cobrir a seção sem erro.
- Efeitos delicados nos cards: borda/iluminação e contraste, com foco de teclado e redução de movimento.
- Rodapé: CTA **PRONTO PARA FAZER PARTE DO ECOSSISTEMA?** + links agrupados + assinatura **WINF PARTNERS™**, com fundo cinematográfico desfocado. Não usar título ou marca AeroCore.

## Checklist de aceitação humana (obrigatório)

| Elemento | O que verificar |
| --- | --- |
| Hero | Vídeo reproduz ou apresenta poster; textos legíveis nas cenas claras e escuras, sem marca-d'água/textos incorporados inadequados |
| Menu | Itens curtos; o dropdown mobile abre e fecha ao clicar fora, em um link ou Esc; nenhum item é cortado |
| Títulos | Sem sobreposição nem palavras cortadas; quebras em 360, 390, 768, 1024 e 1440px |
| Discovery | Ordem entender o programa → explorar o ecossistema → tecnologia → modalidades |
| Modelos | R$ 15 mil / R$ 95 mil / R$ 250 mil e condições exatamente como aprovadas |
| AUREL | Não anunciar funções não homologadas como operacionais; identidade visual final depende de aprovação do mascote |
| Cards | Iluminação mínima em mouse; foco evidente no teclado; cartões informativos não têm cursor de botão |
| Footer | Identidade Partners, título legível, CTA válido, layout em coluna no celular; sem rodapé AeroCore |
| Candidatura | Link `/briefing/#contact` leva ao formulário, WhatsApp/DDD autorizado e mensagem adequada |
| Acessibilidade | Navegação por teclado, Esc, foco visível, zoom a 200%, contraste, `prefers-reduced-motion` |
| Performance | Testar LCP/CLS, peso do vídeo, font-display, carregamento e economia de dados |
| Segurança comercial | Nenhuma promessa de resultado/retorno; modelos e concessões sujeitos a aprovação e contrato |
| Responsividade | Comparar screenshots em 360 / 390 / 768 / 1024 / 1440px |

## Fluxo de publicação

1. Integrar separadamente os PRs de nomes e rotas **#11** e os ajustes de formulário **#10**, após revisão do Tiago.
2. Resolver conflitos com PRs globais **#7** e **#8**, sem substituir o briefing aprovado.
3. Testar este **PR #12** em staging, com screenshots antes/depois. Conferir imagem de capa/OG do WhatsApp e logo oficial da Partners.
4. Após homologação, publicar com rollback e verificar `https://winf.com.br/partners/` em navegador anônimo e celular.
5. Não confundir **testes automáticos** (estrutura e comportamento) com **aprovação visual** (requer navegador real e decisão humana).

**Status:** alterações em branch/PR, não correspondem necessariamente à versão publicada.
