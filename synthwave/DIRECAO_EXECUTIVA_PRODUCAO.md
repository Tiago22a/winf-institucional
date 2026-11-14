# SynthWAVE.fm™ — Sala de direção / Plano executivo de lançamento
**Edição:** 14/11/2026 · **Natureza:** organização do trabalho; papéis assumidos pelo assistente como funções de análise e produção, não colaboradores humanos contratados.

## Mandato e produto mínimo
A SynthWAVE.fm™ permite abrir a rádio, tocar Play e ouvir gratuitamente **sem login, assinatura nem e-mail**. A mesma experiência deve ser preservada no celular. Não adicionar cobrança Premium, WINF Coins ou formulários obrigatórios. Monetização é hipótese de fase futura e não entra no lançamento.

## Mesa de decisão
| Papel funcional | Responsabilidade | Limite |
| --- | --- | --- |
| Direção de produto (CPO) | Experiência de dois cliques; prioridades; usabilidade | Não declarar funcionalidades planejadas como prontas |
| Direção de tecnologia (CTO) | Integridade do player, CI, autenticação opcional, segurança | Sem chaves reais no GitHub, sem alterações financeiras |
| Direção editorial (CCO) | Pautas, roteiros, créditos, grade e identidade sonora | Não publicar áudio inexistente |
| Direção de operações (COO/PMO) | Dependências, estados, checkpoints, relatório e rollback | Sem inventar equipe, SLA ou datas de lançamento |
| Direção de experiência (CX) | Clareza de botões, inclusão e acessibilidade | Nunca exigir cadastro para ouvir |
| Direção jurídica/compliance | Lista de direitos, revisão de claims, privacidade | Exige revisão humana habilitada para parecer ou autorização jurídica |
| Direção comercial (CMO) | Distribuição e futuras hipóteses de receita | Sem anúncios intrusivos, pacotes de crédito ou cobranças nesta fase |

## Fonte de verdade
- Player: `synthwave/app.js`, `audio-engine.js`, `radio/index.html`.
- Música com arquivos externos e créditos: `music-library.js`, `MUSIC_CREDITS.md`.
- Podcasts e estados de publicação: `podcast-catalog.js`.
- Copys: `COLECOES_COPYS_ORIGINAIS.md`.
- Roteiros: `podcasts/temporada-01/` e `PODCAST_EDITORIAL_IA.md`.
- E-mail opcional: `email/` com `enabled: false`, sem remetente provisionado.

## Fila executiva (ordem por risco e valor)
| ID | Prioridade | Entrega | Estado em 14/11 | Condição para aprovação |
| --- | --- | --- | --- | --- |
| SW-01 | P0 | Player gratuito e navegação por teclado/celular | Implementado no código; testes de browser reais pendentes | Abrir → Play → som, pause/erro, Android/iOS/desktop |
| SW-02 | P0 | Direitos e disponibilidade das 5 músicas externas | Pendente revalidação externa de licenças e links | Documento de créditos, teste de URL e autorização aplicável |
| SW-03 | P0 | Oito coleções e textos próprios | Produzido para revisão | Descrição coerente com catálogo realmente reproduzível |
| SW-04 | P1 | Podcast EP01 | Roteiro produzido | Revisão, locução, mix, transcrição, arquivo aprovado |
| SW-05 | P1 | Podcast EP02 | Roteiro produzido | Revisão de linguagem financeira, locução, mix, transcrição |
| SW-06 | P1 | Podcast EP03 | Roteiro produzido para revisão | Revisão técnica, locução, mix, transcrição |
| SW-07 | P1 | Sequência semanal de divulgação | Planejada | Textos e mídias aprovados; sem prometer áudio não lançado |
| SW-08 | P2 | E-mail de boas-vindas e Hermes | Estrutura lógica testada; desligada | Domínio e remetente comprovados, opt-in confirmado, provedor e descadastro testados |
| SW-09 | P2 | Conta opcional e backup na nuvem | Não homologado | Firebase isolado, Rules, duas contas e teste de revogação |
| SW-10 | P3 | Patrocínio e monetização | Hipótese futura | Audiência consistente, contratos e licenças adequadas |

## Ciclo semanal proposto (não agendado automaticamente)
**Segunda:** revisão de riscos e direitos. **Terça:** roteiro e títulos. **Quarta:** produção técnica de áudio. **Quinta:** QA, revisão de créditos e acessibilidade. **Sexta:** publicar somente o que passou no checklist. **Fim de semana:** observar métricas agregadas, sem coleta invasiva.

## Portas de qualidade
1. **Roteirizado:** texto completo com duração estimada, vozes, fontes e nota de conteúdo.
2. **Áudio produzido:** arquivo gravado, mixado, com créditos e licença de trilha.
3. **Pronto para publicar:** transcrição, normalização/revisão, acessibilidade, direitos revisados e URL estável.
4. **Publicado:** catálogo alterado para `published` apenas com evidências reais e teste do player.

## Futuro canal de aquisição: anúncios pagos no ChatGPT

**Estratégia documentada, não campanha ativada.** Em 14/11/2026, fontes oficiais da OpenAI indicam disponibilidade do Ads Manager por autoatendimento no Brasil. Uma possível campanha de divulgação da SynthWAVE pode usar anúncios claramente patrocinados no ChatGPT, levando diretamente à rádio gratuita, sem cadastro ou cobrança.

Os anúncios do ChatGPT não modificam as respostas do modelo; a compra e a veiculação são independentes desta conversa. **Não criar conta, campanha, faturamento ou gastos sem autorização explícita.** A abordagem editorial inicial contempla quatro mensagens: rádio sem cadastro, foco, descoberta sonora e histórias narradas. Evitar qualquer alegação de recomendação pela OpenAI.

Documento central com fontes, versões criativas, experimento, metas, limitações, riscos e portões de aprovação: [Plano de Anúncios no ChatGPT](PLANO_ANUNCIOS_CHATGPT_2026.md).

**Distinguir dois mercados:** (1) comprar publicidade *dentro do ChatGPT* para trazer visitantes à SynthWAVE e (2) vender espaços publicitários *dentro da rádio SynthWAVE*, ainda não implementados. Não fazer propaganda disfarçada de programa editorial.

## Política de mudança
Produção editorial usa PR e smoke test. Mudanças de playback, pagamentos, e-mail, autenticação ou publicação em massa requerem testes específicos. Não mexer em páginas territoriais e CRM da WINF a partir desta fila.

## Critérios de encerramento do MVP
- Caminho gratuito direto sem cadastro.
- Sem erro de JS e controles de playback acessíveis.
- Créditos e disponibilidade de todas as músicas públicas validados.
- Grade editorial transparente: episódios planejados não aparecem como gravados.
- Nenhuma ativação fictícia de e-mail/Hermes ou monetização.
- Registro de pendências reais e plano reversível.
