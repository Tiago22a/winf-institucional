# WINF — Homologação etapa 3: atendimento WhatsApp de municípios reais

**Data:** 14/11/2026. **Status:** branch de homologação, sem merge/deploy/envio real de mensagens.

## Regra comercial validada em código
- 200 territórios comerciais únicos: 100 em São Paulo e 100 distribuídos nos demais estados.
- O consumidor pode solicitar atendimento sobre películas arquitetônicas a partir do localizador único `/onde-comprar/`.
- Todos os 200 registros sem canal licenciado verificado encaminham exclusivamente para **+55 13 98111-3001**, com cidade/UF no texto inicial.
- Solicitação **não significa** loja física, prestador local cadastrado, agendamento confirmado ou execução garantida.
- A aba de licenciamento é distinta do atendimento de clientes. A futura transferência de WhatsApp exige contrato, responsável e canal verificados no backend; essa troca ainda não foi implementada.
- Nenhuma página geográfica nova foi gerada; sitemap e indexação não foram modificados.

## Cidades-piloto de teste no Chromium
| Município | Cadastro | WhatsApp esperado | Mensagem identifica a cidade |
| --- | --- | --- | --- |
| Barueri/SP | Sim | 5513981113001 | Sim |
| Cuiabá/MT | Sim | 5513981113001 | Sim |
| Campina Grande/PB | Sim | 5513981113001 | Sim |

Testes com viewport desktop 1440×900 e celular 393×852 validam busca, acentuação, links HTTPS `wa.me`, texto pré-preenchido, proteção `target=_blank`, responsividade e integridade do inventário. **Não enviam mensagem.**

## Regressão e limpeza de links
- O estado atual da main havia removido páginas territoriais e o catálogo de 200, enquanto páginas HTML mantinham links obsoletos.
- Nesta branch foram marcados `siteAtivo: false` somente 166 registros comprovadamente associados a diretórios removidos; telefone e status de licenciamento não foram alterados.
- Os cinco links locais removidos da vitrine da home (Praia Grande, Guarujá, Pilar do Sul, Cuiabá e Campina Grande) foram retirados, preservando o botão de WhatsApp de cada card.
- Testes legados foram atualizados para refletir a ausência real de páginas físicas publicadas, **sem restaurar URLs removidas**.

## Evidências de conclusão
1. CI e screenshots Chromium em GitHub Actions da PR atual.
2. Abrir manualmente `/onde-comprar/` em dispositivo físico, buscar uma cidade de SP e duas fora do estado.
3. Abrir o link da cidade, verificar que o WhatsApp mostra **+55 13 98111-3001** e cidade/UF no texto.
4. Enviar, com autorização do responsável pelo número, uma mensagem marcada como **TESTE DE HOMOLOGAÇÃO**; conferir efetivo recebimento e resposta no WhatsApp Business da WINF.
5. Verificar se o responsável consegue identificar cidade, produto, viabilidade e próximo passo. Só após isso registrar como `recebimento_real_confirmado`.
6. Se houver CRM ou automação de WhatsApp, integração e rastreio de lead devem ser testados separadamente; `wa.me` sozinho **não registra lead automaticamente** no WINF OS.

## Restrições de liberação
- Publicação requer revisão da PR e homologação de atendimento humano, não só CI.
- Um número inválido, indisponibilidade do WhatsApp Business ou conta sem resposta bloqueia a homologação operacional.
- Nenhum claim de `200 unidades físicas`, `200 licenciados` ou instalação imediata deve ser feito.
- A página atual em produção não deve ser tratada como já atualizada pela PR.

## Plano de retorno
Se a página de consulta não funcionar, reverter somente a nova seção, script e cadastro desta PR; preservar os links existentes para WhatsApp central. Não restabelecer páginas removidas ou colocar URLs em sitemap.
