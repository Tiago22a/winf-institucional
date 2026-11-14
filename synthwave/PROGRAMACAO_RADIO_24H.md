# SynthWAVE.fm™ — grade 24 horas, chamadas e trilha editorial

**Versão:** MVP de rádio pessoal, 14/11/2026  
**Princípio:** entrar, apertar Play e ouvir sem cadastro, newsletter nem cobrança.  
**O que esta etapa entrega:** grade editorial por horário local, alternância de faixas existentes e 12 roteiros de vinhetas próprias narráveis por síntese de fala do navegador.  
**O que NÃO entrega:** stream sincronizado 24/7 por servidor, serviço garantido com a página fechada, peças publicitárias gravadas ou novos direitos sobre músicas de terceiros.

## Grade de programação do dia

| Horário local do ouvinte | Nome do bloco | Clima e convite |
| --- | --- | --- |
| 00h–04h | After Hours | Madrugada tranquila, ambient e foco |
| 04h–08h | First Light | Primeira luz, energia suave e ideias |
| 08h–12h | Focus Frequency | Trabalho, estudo e concentração |
| 12h–16h | Creative Current | Pausa, criação e descobertas |
| 16h–20h | City Drive | Movimento, estrada e fim de tarde |
| 20h–00h | Night Glow | Noite, relaxamento e boas histórias |

**Operação:** a fila é formada a partir das faixas disponíveis e organizadas por afinidade com o bloco. Ela também inclui descoberta de outras coleções para evitar excesso de repetição. A mudança de bloco acontece ao avançar para a próxima música, sem cortar uma faixa em andamento.

## Vinhetas entre músicas

- **Frequência de estreia:** uma mensagem editorial a cada **cinco músicas concluídas automaticamente** na rádio.
- **Não entra na contagem:** música pulada manualmente, faixa cujo carregamento falhou ou uso isolado de playlist pessoal.
- **Texto original:** 12 roteiros versionados em `synthwave/station-programming.js`, divididos entre assinatura da estação, experiências, cultura e educação.
- **Temas:** a frequência que conecta, playlists por momento, mixer de chuva e mar, roteiro Cuidar & Conectar™, aprendizagem no WINF Institute™, criatividade, estrada, salvamento local e descoberta.
- **Narração MVP:** `speechSynthesis` com preferência por voz pt-BR disponível no sistema operacional. Isso **não é áudio produzido em estúdio** nem voz oficial de locutor contratado.
- **Fallback:** se a voz não estiver disponível, der erro ou exceder limite, a reprodução deve prosseguir sem exigir interação ou cadastro.
- **Volume:** usar narração moderada, sem efeitos agressivos ou publicidade invasiva.

### Exemplos de chamadas, formato editorial

> “Você está na SynthWAVE ponto FM. Um lugar para ouvir sem cadastro, explorar novas trilhas e encontrar a sua própria frequência.”

> “Toda hora tem uma trilha. Quer estudar, trabalhar, viajar ou relaxar? Explore as coleções da SynthWAVE.”

> “Às vezes, uma boa conversa muda um dia inteiro. Conheça os roteiros da temporada Cuidar e Conectar na área de podcasts.”

Os roteiros completos ficam no catálogo de programação; evitar duplicar textos em HTML.

## Direitos e segurança editorial

As músicas devem ter origem e permissões documentadas antes de serem incluídas. **Não monetizar nem cobrar não elimina, por si só, direitos autorais e conexos**. Para o MVP, usar apenas as gravações próprias, sons procedurais e faixas existentes com crédito/licença identificados, revisando os requisitos de execução pública pertinentes antes de uma emissora 24/7 real.

As vinhetas atuais são **autopromoção e convites editoriais da SynthWAVE**, não inserções comerciais vendidas a anunciantes. Se houver publicidade de terceiros ou patrocínios reais no futuro, identificar claramente o material, obter aprovação das peças e definir política comercial.

Não afirmar que os podcasts estão gravados quando só existe roteiro. Não afirmar operações territoriais, resultados comerciais ou certificações inexistentes.

## Fases de som

**Fase A — ativa nesta implementação:** programação por seis horários; música e soundscapes no navegador; textos de vinhetas narrados pelo sistema; fallback se TTS indisponível.

**Fase B — planejada:** gravar locuções com vozes originais autorizadas e produzir pequenos jingles com masterização, medição de loudness, arquivos de licença, versões alternativas e mixagem consistente. Somente substituir a voz de navegador depois de ouvir e validar os arquivos reais.

**Fase C — futura e separada:** servidor de playout com stream sincronizado, monitoramento de uptime, logs, contingência/CDN, relógio editorial e licenciamento operacional apropriado. Nesse cenário, todos os ouvintes sintonizariam uma grade comum; não confundir com a Fase A.

## Revisão e testes

- Testar a entrada `/synthwave/radio/#live` por dois cliques.
- Testar Play/Pause, próximo, anterior, travessia de cinco faixas e disparo de vinheta.
- Testar manualmente Safari/iOS, Chrome/Android e desktop, inclusive ausência de TTS, falha de música externa e alternância de bloco no relógio.
- Inspecionar créditos e disponibilidade da URL antes de incluir qualquer música de terceiros.
- Rodar os testes automatizados: `node --test synthwave/tests/smoke.test.mjs`.

**Direção de marca:** noite verde-floresta, sálvia, cobre e creme, sem magenta; a mensagem principal é **“Entre. Aperte o Play. A frequência é sua.”**
