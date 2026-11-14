# SynthWAVE.fm™ — Plano editorial e lançamento simples
**14/11/2026 — planejamento, não confirmação de conteúdo publicado**

## Princípio do produto
**Ouvir gratuitamente, em poucos cliques, sem login nem pagamento.** Acessar `/synthwave/`, tocar em `Ouvir agora`, escolher música ou coleção e pressionar Play. Autoplay só após ação do ouvinte. Favoritos e playlists locais são gratuitos. Conta Google é opcional para backup futuro, após homologação Firebase. Não criar assinatura premium neste MVP.

## Experiência
Paleta: verde-floresta, verde-sálvia, cobre e creme. Sem magenta/rosa. O conteúdo deve ser licenciado para reprodução pública ou autoral; preservar créditos. Mixer com chuva, mar e ruídos sintetizados, separado do volume musical. Não prometer rádio sincronizada 24h se o streaming não estiver implantado.

## Coleções e linha editorial
| Coleção | Proposta | Curadoria | Ritmo de produção planejado |
|---|---|---|---|
| Foco | Estudar e trabalhar | Instrumentais suaves e ambient | Quinzenal |
| Estrada | Viajar e descobrir | Instrumentais fluidos e paisagens sonoras | Quinzenal |
| Depois das 20h | Relaxar | Downtempo, piano e clima noturno | Semanal |
| Refúgio | Chuva, mar e ambiente | Sons próprios/sintetizados e faixas licenciadas | Semanal |
| Encontro | Namorar, conversar | Instrumental delicado | Mensal |
| Criar | Trabalhar com ideias | Trilhas rítmicas sem voz intrusiva | Quinzenal |
| Começo de dia | Rotina | Ambiente leve e música moderada | Semanal |
| Pausa | Intervalos | Sessões curtas de som ambiental | Semanal |

São metas editoriais, não listas de músicas já gravadas. O catálogo atual tem faixas externas de licença documentada a revalidar e presets sintetizados. Não incluir fonogramas famosos sem direito de execução.

## Podcasts
A primeira temporada **Ouvindo o Amanhã** mantém as oito pautas de `PODCAST_EDITORIAL_IA.md`, com LIA e DAVI como vozes **sintéticas identificadas**. Quadros futuros: `Histórias por Trás do Som` (história musical e fontes), `Paisagens do Brasil` (ambientes autorais) e `5 Minutos para Criar` (criatividade sem alegações terapêuticas). Áudio só é publicado depois de roteiro, revisão factual, licença, transcrição e controle de qualidade.

## E-mail e Hermes — infraestrutura pendente
- Definir endereço oficial em domínio **já controlado** e provisionar caixa real, SPF/DKIM/DMARC; não publicar `ola@synthwave.fm` como existente antes de confirmar domínio e DNS.
- **Não exigir e-mail para ouvir.** Inscrição voluntária, consentimento específico para e-mail, opt-out e supressão de descadastrados. O opt-in de WhatsApp atualmente planejado é separado: não permite enviar e-mail.
- Quando houver provedor de e-mail e configuração de Hermes homologados: 1 mensagem de boas-vindas após confirmação, 1 seleção editorial na semana seguinte e no máximo newsletter quinzenal. Horário escolhido pelo assinante, sem disparos intrusivos.
- Testar fila, deduplicação, retries, unsubscribe, prevenção de abuso e entregabilidade antes de ativar mensagens reais.

## MVP comercial
**GHOST SHOP™:** compra direta convencional. Não implementar WINF Coins como produto novo, bônus por depósito, crédito promocional, combos ou carteira pré-paga no MVP. Legados de WINF Coins devem ser auditados e saldos existentes preservados; nada de exclusão sem reconciliação, política de reembolso e migração. A loja não interfere na SynthWAVE.
