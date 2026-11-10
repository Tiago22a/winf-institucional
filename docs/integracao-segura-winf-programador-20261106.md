# Operação segura e integração das branches WINF — 06.11.2026

## Inventário de PRs observado (não mesclados nesta rodada)
Institucional: #3 modelos/briefing e #4 B2B ambos alteram `partners/index.html`.
WINF OS licenciado: #1 Academy (index e modularização), #2 GHOST SHOP (index e UI), #3 Técnico (ferramentas/index), #4 Governança (docs), #5 Mapa (ferramentas/index).
Backend: #1 candidatos e #2 Técnico ambos alteram `server.js`.

## Regra
**Não fazer merge automático de PRs que editam os mesmos arquivos.** Fazer revisão funcional, integrar diferenças sobre a ponta mais atual e testar na sequência backend → frontend → segurança → produção. Nunca sobrescrever `server.js`, `partners/index.html` ou `ferramentas/academy/index.html` sem comparar os PRs em aberto e alinhar com Tiago.

## Subtarefas desta branch
- Preview visual isolado `partners/preview-aurel/`, mantendo a home oficial sem mudanças.
- Documento de kit e cadeia de fornecimento acima.
- AUREL™ e WINF Intelligence Academy™ como identidade proposta aprovada em direção. AURON W-NO é identidade legada em código.
- Projeto de mídia externo no Google AI Studio deve ficar em **stand by** até link provisório acessível; não incorporar à home de forma prematura.

## Critérios de prontidão para merge/publicação
1. Revisão de código por Tiago programador e responsável comercial.
2. Teste visual mobile/desktop e acessibilidade; correção de texto, links e CTAs.
3. Homologação de oferta: 45 m no kit; custo, largura, 15 m por rolo, itens físicos, prazo e contrato.
4. Conferência do backend de candidatura e isolamento territorial.
5. Nenhum link quebrado, rastreamento fictício, métrica de conversão inventada ou página prometendo automação inexistente.
6. Rollback registrado, cache e testes no domínio real após deploy.

## VSL
AUREL é o apresentador. Vídeo final precisa preservar imagem de referência, voiceover PT-BR profissional, autorização de uso de marca e revisões técnicas/jurídicas. Sem publicar recursos que apenas constem em protótipo.
