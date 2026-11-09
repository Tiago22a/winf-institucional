# WINF Select™ — entrega técnica para Google Search Console

Data de preparação: 09/11/2026.
Responsável pelo acesso/autorizações: Tiago. A WINF pode ter páginas e sitemap preparados **sem** ter Google Search Console verificado. Não registrar como indexado antes de ler o relatório real.

## Ações do responsável pela conta

1. Acessar https://search.google.com/search-console e selecionar a propriedade **Domínio** de `winf.com.br`. Se ainda não existir, criar uma propriedade de domínio e verificar por DNS conforme o código fornecido pelo Google. Não enviar tokens de DNS, senhas ou códigos no chat.
2. Adicionar usuários autorizados conforme as permissões de cada profissional, sem compartilhar credenciais pessoais.
3. Confirmar que `https://winf.com.br/robots.txt` e `https://winf.com.br/sitemap.xml` são acessíveis ao Googlebot. O site já retornou 403 para alguns acessos automatizados; o teste de inspeção do URL publicado no Search Console precisa confirmar o acesso real do Googlebot. Caso haja 403, verificar WAF/CDN, firewalls e regras para bots legítimos.
4. Em **Sitemaps**, enviar `https://winf.com.br/sitemap.xml`. Verificar resposta, URLs descobertas e erros.
5. Inspecionar, com **Testar URL publicado**, cada uma das 11 URLs abaixo; verificar status HTTP, indexação permitida, canonical declarada e canonical selecionada pelo Google. A primeira indexação pode levar tempo e não é garantida.
6. Exportar os relatórios de desempenho em períodos comparáveis de 28 e 90 dias para consultas e páginas; anotar clicks, impressions, CTR e position sem alterar os valores.
7. Conectar o Google Search Console ao Windsor.ai apenas depois de autorizar a conta que possui acesso à propriedade. Não confundir a conta de login Windsor com a conta Google que concede a permissão.

## URLs essenciais para inspeção

### Cidades
- https://winf.com.br/pelicula-de-controle-solar-santos-sp/
- https://winf.com.br/pelicula-de-controle-solar-praia-grande-sp/
- https://winf.com.br/pelicula-de-controle-solar-guaruja-sp/
- https://winf.com.br/insulfilm-residencial-sorocaba-sp/
- https://winf.com.br/pelicula-de-controle-solar-pilar-do-sul-sp/
- https://winf.com.br/pelicula-de-controle-solar-campina-grande-pb/

### Guias
- https://winf.com.br/aplicacoes/sacadas-varandas/
- https://winf.com.br/aplicacoes/janelas-fachadas/
- https://winf.com.br/aplicacoes/privacidade/
- https://winf.com.br/aplicacoes/seguranca-vidros/

### Catálogo
- https://winf.com.br/catalogo/

O parâmetro `?origem=<cidade>` é usado para contextualizar o atendimento de cada guia e **não** deve receber uma canonical distinta. As URLs dos guias acima são as canônicas.

## Rotina operacional de performance

- **Semanal:** inspecionar erros novos de indexação, ações manuais, páginas que caíram de cobertura, indisponibilidade de imagens e requisições 403 para Googlebot.
- **A cada 28 dias:** comparar período atual e período anterior: cliques, impressões, CTR, posição média, consultas com intenção de serviço, páginas que recebem novas impressões e oportunidade por cidade.
- **Mensal:** cruzar consultas com conteúdo por aplicação (sacada, varanda, janela, privacidade, fachada, segurança); otimizar respostas e links internos relevantes; não criar dezenas de páginas idênticas mudando só o bairro.
- **Conforme dados disponíveis:** analisar por dispositivo, consulta, página, país e comportamento da indexação. Atribuição de orçamento no WhatsApp exige medição complementar; o Search Console não informa conversões comerciais sozinho.

### Modelo mínimo de relatório

`periodo,unidade,url,consulta,cliques,impressoes,ctr,posicao_media,indexacao,observacao,acao_proposta`

Nenhum valor é preenchido até haver exportação real do Google.

## Critérios de aceitação

- Sitemap validado e lido pelo Search Console.
- As 11 URLs inspecionadas e classificadas entre indexadas, descobertas e não indexadas, com motivo registrado.
- Nenhuma página estratégica bloqueada por `robots.txt`, `noindex` ou 403 do WAF.
- Dados compartilhados para a equipe em relatório de 28 e 90 dias, sem estimativas tratadas como resultados.

**Referências oficiais:** 
https://developers.google.com/search/docs/monitor-debug/search-console-start?hl=pt-BR
https://support.google.com/webmasters/answer/9008080
