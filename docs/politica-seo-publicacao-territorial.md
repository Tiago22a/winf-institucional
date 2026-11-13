# WINF Asset Light™ — proteção contra spam e publicação territorial

Revisado em 13/11/2026. Referências: [políticas do Google](https://developers.google.com/search/docs/essentials/spam-policies?hl=pt) e [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Por que a proteção é necessária?

São 200 oportunidades de ativação comercial (100 SP e 100 em outras UFs), **não 200 estabelecimentos operacionais**. A criação em massa de páginas semelhantes por cidade, com texto trocado e mesma central, pode se aproximar de *doorway abuse* e *scaled content abuse*. Uma página publicada pode continuar disponível ao cliente por URL sem estar elegível à indexação.

## Situação após a revisão da main

A branch principal recebeu um **revert que retirou os 200 conjuntos de páginas e seus inventários**, seguido de correção do sitemap, dos CTAs e da automação. A branch de backup foi criada pelo processo anterior; **não republicar o lote antigo automaticamente**. A retirada do repositório não prova que a hospedagem já apagou todos os URLs: verificar deploy, redirecionamentos e eventual cache.

## Política obrigatória de liberação

1. **Manter noindex e fora do sitemap** para qualquer página municipal recém-gerada sob `/winf-select/cidades/<id>/` ou `/partners/territorios/<id>/`, até aprovação de conteúdo.
2. O teste `tests/seo-territory-release-gate.test.cjs` impede que a liberação seja acidental. Para liberar uma página, é preciso registrar em `config/seo-territorios-aprovados.json` o caminho, o responsável editorial, a data e a evidência da revisão, remover `noindex` e inserir somente a URL canônica no sitemap.
3. **Uma cidade deve ter utilidade real**: cobertura confirmada, informações específicas verificáveis (sem inventar escritório, instalador, endereço ou Google Meu Negócio), prova de atendimento e conteúdo que resolva necessidades locais. A troca de topônimo, lista automática de bairros, mapa genérico e link para o mesmo WhatsApp não bastam.
4. Usar hubs indexáveis para catálogo, serviços, licenciamento e busca de territórios. A interface pública e os painéis internos podem listar as 200 oportunidades sem gerar 200 páginas repetitivas indexáveis.
5. Auditar especialmente as páginas regionais já indexáveis da cobertura 013/015. Amostra de Iguape e Ilha Comprida exibiu ~97% de sobreposição de vocabulário HTML, índice interno simplificado de palavras únicas, **não** laudo ou sanção do Google. Melhorar conteúdo primeiro, consolidar páginas quando não houver valor local independente.
6. No cadastro, distinguir `site_publicado`, `indexavel`, `licenca_ativa`, `atendimento_digital`, `instalacao_presencial` e `Google Business Profile elegivel`.
7. Não usar `Disallow` para páginas cujo `noindex` precisa ser lido pelo Googlebot; não aplicar redirecionamentos enganosos.
8. Auditoria mobile/tablet/desktop e comprovação HTTP 200, canonical e Search Console precedem indexação. Não há garantia de indexação ou ranking.

**Nota:** a presença de um item no inventário ou de uma URL acessível não comprova indexação no Google. A nova liberação deve seguir lotes pequenos, revisados editorialmente, não um único lote de 200.
