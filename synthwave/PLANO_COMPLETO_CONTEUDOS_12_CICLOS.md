# SynthWAVE.fm™ — Plano completo de conteúdo e distribuição (12 ciclos editoriais)
**Versão:** 14/11/2026 · **Estado:** plano de produção, sem lançamento automático de podcasts ou campanhas.  
**Lançamento:** data a definir após QA; "semana" significa *ciclo editorial*, não anúncio de publicação em calendário fixo.

## 1. Promessa editorial
A SynthWAVE é uma **rádio gratuita, simples e acolhedora**: abra, aperte Play e ouça. O conteúdo deve oferecer uma trilha para cada momento do dia, descoberta sonora e conversas interessantes. Não exigir conta, WhatsApp, e-mail ou cartão.

### Pilares de conteúdo
1. **Ouvir agora (70% do esforço de catálogo):** músicas e instrumentais autorais/licenciados, playlists por momento e paisagens sintetizadas.
2. **Descobrir (15%):** histórias dos sons, bastidores de composição, guia simples de uso do mixer e autoria.
3. **Conversar (15%):** oito episódios de `Ouvindo o Amanhã` com duas vozes sintéticas identificadas, roteiros originais e fontes revisadas.

### Tom e identidade
Verde-sálvia, verde-profundo, cobre e creme. Títulos curtos e humanos. Evitar excesso de marcas WINF dentro da rádio: episódios com marcas devem ser identificados como conteúdo institucional, nunca fingir reportagem independente. Não apresentar efeitos sonoros como terapia, música sintética como gravação de artista real ou áudio planejado como lançado.

## 2. Inventário real da produção
| Item | Arquivo de referência | Estado real em 14/11/2026 |
|---|---|---|
| 4 instrumentais originais de aproximadamente 42 s | `audio/original/*.mp3` | Arquivos gerados na CI e verificados no GitHub; integração ao player sob teste nesta entrega |
| 5 músicas externas com créditos | `music-library.js` | No catálogo legado; revisão de licença, disponibilidade e adequação à distribuição ainda pendente |
| 8 presets de síntese em tempo real | `app.js` e `audio-engine.js` | Implementados no código; dependem de teste em dispositivos |
| Mixer de chuva, mar, vento e ruídos | `audio-engine.js` | Implementado no código; não são fonogramas gravados |
| EP01 — Uma conversa pode abrir uma porta | `podcasts/temporada-01/ep01-cuidar-conectar.md` | Roteiro em revisão; sem áudio |
| EP02 — Quando alguém acredita em você | `podcasts/temporada-01/ep02-padrinho.md` | Roteiro em revisão; sem áudio |
| EP03 — Conforto que quase não se vê | `podcasts/temporada-01/ep03-invisivel.md` | Roteiro em revisão técnica; sem áudio |
| EP04–EP08 | `podcasts/temporada-01/BRIEFINGS_04_A_08.md` | Briefings prontos para roteirização; sem áudio |
| 8 coleções e chamadas | `COLECOES_COPYS_ORIGINAIS.md` | Textos em revisão; vincular à disponibilidade real de áudio |
| E-mail editorial | `email/` | Lógica preparada e **desativada**; sem remetente autenticado, sem envios |

## 3. Oito ambientes, com função e direção musical
| Coleção | Em que momento | Identidade musical | Primeiro item autoral | Próxima composição (briefing) |
|---|---|---|---|---|
| Foco / Estudar | leitura e trabalho | pads harmônicos, poucos ataques, variações suaves | **Frequência Clara** (42s) | `Janela Aberta`: peça instrumental de 3–4 min com desenvolvimento discreto |
| Estrada / Viajar | deslocamentos e paisagens | pulsos synthwave contidos, sensação de movimento | **Horizonte** (42s) | `Linha do Horizonte`: instrumental de 3–4 min sem distrair motorista |
| Refúgio / Relaxar | pausas e espaços internos | textura de chuva inteiramente sintetizada, ambiente leve | **Chuva Sintética** (42s) | `Chuva na Vidraça`: peça de 5–8 min com ambiente e música em camadas |
| Depois das 20h / Descansar | fim de tarde, noite | baixas frequências suaves, timbres quentes, sem picos repentinos | **Luzes Baixas** (42s) | `Rua Vazia`: instrumental de 4–6 min, dinâmica suave |
| Encontro / Namorar | conversas e encontros | teclas macias, pouca percussão, espaço entre notas | *Nenhuma composição dedicada ainda* | `Conversa de Janela`: instrumental original de 3 min |
| Criar / Trabalhar | escrita, design e produção | ritmo hipnótico, progressão curta, variações controladas | **Frequência Clara** (uso cruzado) | `Primeiro Esboço`: instrumental de 3 min |
| Começo de Dia | início das atividades | harmonia clara, andamento moderado, energia gradual | *Curadoria do catálogo atual, a revisar* | `Primeira Luz`: instrumental de 3 min |
| Pausa / Descansar | intervalos curtos | peças de baixa densidade e ambientes sintetizados | **Chuva Sintética** (uso cruzado) | `Cinco Minutos`: peça de 5 min |

**Importante:** os oito títulos novos citados como *briefing* ainda NÃO possuem arquivo de áudio. Para músicas existentes de terceiros, revisar direitos e disponibilidade. Para instrumentais novos, produzir a gravação final, mixagem, créditos e arquivo antes de adicionar ao catálogo.

## 4. Primeira temporada de podcasts — 8 episódios
Publicação planejada: **quinzenal**, mas somente após arquivo final, transcrição, direitos e teste de reprodução. O podcast nunca deve bloquear a rádio.

| EP | Título | Público e pergunta central | Tratamento | Estado |
|---|---|---|---|---|
| 01 | Uma conversa pode abrir uma porta | Pessoas e conexões: como oferecer apoio com respeito? | Ficção identificada; cuidado e escuta | Roteiro em revisão |
| 02 | Quando alguém acredita em você | Quem começa um projeto: apoio é investimento? | Ficção identificada; apoio sem promessa de retorno | Roteiro em revisão |
| 03 | Conforto que quase não se vê | Moradores e arquitetos: como avaliar películas para vidro? | Educativo, dados técnicos revisados | Roteiro em revisão técnica |
| 04 | Por que proteger o que nos move? | Motoristas: o que PPF faz e o que ele não faz? | Conversa educativa sobre manutenção, limites e custo | Briefing pronto |
| 05 | O próximo capítulo começa pequeno | Pessoas em transição: como testar uma mudança sem se precipitar? | Ficção identificada, sem aconselhamento clínico | Briefing pronto |
| 06 | Tecnologia serve a quem? | Criadores e usuários: como tecnologia pode começar pela escuta? | Entrevista dramatizada fictícia, explicitamente identificada | Briefing pronto |
| 07 | Sonhar grande, construir com método | Empreendedores: como validar antes de escalar? | Método e documentação sem promessa financeira | Briefing pronto |
| 08 | Aprender é um caminho, não um botão | Aprendizes: como unir teoria, prática e segurança? | Orientação educativa, sem certificado fictício | Briefing pronto |

### Pacote mínimo de cada episódio
Roteiro com falas separadas de LIA e DAVI; revisão de factualidade; indicação de vozes sintéticas; arquivo de áudio em formato adequado; trilha e efeitos originais/licenciados; transcrição revisada; capa/crédito; publicação `published` **somente** com `audioUrl`, `transcriptUrl`, `rightsStatement`, `rightsApprovedAt`, `productionReviewedAt`; teste no player em desktop e mobile.

## 5. Calendário editorial de 12 ciclos
Este calendário é uma **fila**, não um agendamento automático. Se um episódio não passar nos testes, publicar uma curadoria já existente em vez de anunciar estreia fictícia.

| Ciclo | Conteúdo musical central | Produção longa | Comunicação de divulgação |
|---|---|---|---|
| 01 | Foco: Frequência Clara + guia de rádio gratuita | Revisar EP01 | Como entrar e ouvir em dois cliques |
| 02 | Estrada: Horizonte + curadoria | Editar/narrar EP01 | A trilha da próxima viagem |
| 03 | Refúgio: Chuva Sintética + mixer | Revisar EP02 | Sua própria mistura de chuva e música |
| 04 | Depois das 20h: Luzes Baixas | Editar/narrar EP02 | Nem toda noite precisa de pressa |
| 05 | Encontro: revisar playlist existente | Revisar EP03 | Música que acompanha uma conversa |
| 06 | Criar: Frequência Clara + presets | Editar/narrar EP03 | O som de uma primeira ideia |
| 07 | Começo de Dia: playlist revisada | Produzir roteiro EP04 | Comece com um primeiro Play |
| 08 | Pausa: sons e volume independente | Produzir roteiro EP05 | Um intervalo que é seu |
| 09 | Foco: nova faixa somente se pronta | Produzir roteiro EP06 | Bastidores de um som original |
| 10 | Estrada: nova faixa somente se pronta | Produzir roteiro EP07 | Descubra o que já está disponível |
| 11 | Refúgio: nova peça se pronta | Produzir roteiro EP08 | Por que usamos vozes sintéticas? |
| 12 | Seleção de favoritas com direitos revisados | Revisão geral da temporada | Obrigado por ouvir; escolha sua coleção |

### Cadência leve de publicação nas redes
- **Segunda:** card da coleção da semana, com link direto para `/synthwave/radio/#live`.
- **Quarta:** demonstração em vídeo curto de um recurso realmente disponível (Play, mixer, playlist local), sem inventar alcance nem testemunhos.
- **Sexta:** recomendação editorial ou bastidor original; quando houver episódio realmente publicado, divulgar seu áudio e transcrição.
- **Newsletter:** *desativada* até autorização técnica. Depois de confirmada pelo inscrito, poderá ser quinzenal; sem compra de listas ou envio para contatos WINF sem consentimento específico.

## 6. Checklist de publicação e qualidade
1. **Integridade:** MP3 existe em local correto, duração é real, link HTTP(S) responde, MIME compatível; nome do arquivo imutável após publicação.
2. **Direitos:** origem, titularidade/licença e créditos; conteúdo institucional claramente identificado.
3. **Áudio:** ouvir começo/meio/fim, checar silêncio não intencional, cortes, clipping, picos, equilíbrio entre canais e volume no celular.
4. **Experiência:** dois cliques até o Play, ausência de cadastro, teclado acessível e fallback para erro de mídia.
5. **Podcasts:** não mostrar botão de ouvir sem arquivo real, nem trocar `planned`/`scripted` por `published` antecipadamente.
6. **Publicação:** PR revisado, teste CI verde, verificação na URL pública e rollback documentado.
7. **Métricas:** acompanhar somente indicadores agregados, com coleta transparente; nenhuma meta de crescimento inventada.

## 7. Indicadores do produto
Indicadores-alvo a instrumentar (não números observados): início do Play, falhas de áudio, abandono na primeira faixa, coleções mais escolhidas, reprodução de conteúdo autoral, retorno voluntário e pedidos de descadastro. Usar primeiro telemetria agregada, de baixa coleta, sem exigir identidade do ouvinte.

## 8. O que fica FORA do lançamento
Assinatura Premium; cartão para ouvir; saldos, moedas ou bônus; reprodução de música sem direitos; uploads públicos sem moderação; anúncios intrusivos; e-mail automático sem double opt-in; alegação de programa 24h sincronizado sem streaming próprio; simulação de audiência ou de patrocínio contratado.

## 9. Governança
Direção de produto: manter acesso gratuito. Direção editorial: elaborar, revisar e creditá-los. Direção técnica: estabilidade e arquivos. Jurídico/compliance: direitos e privacidade sujeitos à revisão profissional humana. PMO: acompanhar entrega e aprovar publicação somente após as evidências. As funções são papéis de trabalho do assistente, não funcionários contratados.
