# SynthWAVE Experiências™ — Volume 01
## Pacote editorial completo / direção de conteúdo e som

**Série:** `SYNTHWAVE EXPERIÊNCIAS`  
**Estado desta entrega:** seis roteiros originais integrais, com aproximadamente 230 falas entre LIA e DAVI, estrutura de cinco capítulos, cenas narrativas, notas de sonoplastia e narração sob demanda pelo mecanismo de fala do navegador. **Não são fonogramas de estúdio, nem episódios finais gravados e publicados.**  
**Acesso:** `/synthwave/radio/#experiences`, gratuito, sem cadastro, sem newsletter, sem paywall.

### Por que esta série existe

A rádio não deve ser apenas uma coleção repetida de chamadas de marca. Música constrói atmosfera, mas experiências narrativas dão ao ouvinte motivos novos para voltar. O objetivo não é fazer propaganda disfarçada: é entregar uma história interessante, que comece com uma cena e termine com uma pergunta genuína.

Os temas são deliberadamente cotidianos e acessíveis. WINF e seus programas permanecem como contexto de autoria, sem afirmar que as personagens fictícias são clientes, parceiros, ouvintes reais ou resultados de iniciativas existentes.

### Índice de programas — um por um

| Nº | Programa | Pergunta central | Arco narrativo | Ambiente sonoro sugerido |
| --- | --- | --- | --- | --- |
| 01 | **Cinco sons antes do próximo Play** | O que uma rua diz sem palavras? | Ponto de ônibus → cinco sons → escuta com limites → experiência do ouvinte | Vento e textura urbana inteiramente sintetizados; pulso leve |
| 02 | **A fotografia que ficou na gaveta** | O que uma imagem mostra e o que uma lembrança acrescenta? | Envelope antigo → conversa → privacidade → arquivo responsável → memória aberta | Papel, teclado quente, silêncios e notas espaçadas |
| 03 | **Uma janela para o mundo** | Por que o mesmo cômodo muda de sentido ao longo do dia? | Luz da manhã → reflexo à tarde → privacidade à noite → caderno de observação | Acordes claros que mudam lentamente; nenhum claim de produto |
| 04 | **O dia em que o plano mudou** | Como adaptar algo sem esconder o problema? | Exposição adiada → inventário do que funciona → alternativa → ensaio → decisão transparente | Pulsação digital discreta, sons de papel e espaço de exposição |
| 05 | **A estrada também tem silêncio** | Qual é o papel da música numa viagem? | Estrada → paisagem → parada segura → trilha escolhida antes → memória do percurso | Percussão synthwave moderada e paisagem de asfalto *sintética* |
| 06 | **A máquina que fez uma pergunta** | Uma ferramenta sabe o que não foi informado? | Resposta bonita → erro de contexto → limites da IA → teste humano → perguntas melhores | Três notas digitais e um motivo harmônico sem efeitos de marcas de software |

**Fonte executável dos roteiros:** `experiencias/volume-01/e01-cinco-sons.js` até `e06-maquina-pergunta.js`. Cada script é um objeto com metadata, capítulos, direções sonoras e falas, carregado no navegador antes de `app.js`.

### A experiência de escuta no site

1. O visitante entra na SynthWAVE e pode dar Play na rádio **sem conta**, como já foi aprovado.
2. Se quiser, abre a aba **Experiências** e escolhe um dos seis programas.
3. A leitura completa fica visível por capítulos, com nomes de LIA e DAVI e contexto do conteúdo.
4. **Ouvir narração** solicita a fala do navegador, diferenciando as personagens por voz quando houver duas vozes pt disponíveis; caso contrário, a diferenciação é feita por ritmo e entonação. Isso não pretende simular uma locução humana gravada.
5. A rádio musical é pausada durante a experiência narrada, evitando dois áudios concorrentes.
6. **Parar** cancela a narração. Se o navegador não suportar ou interromper TTS, a história continua inteiramente legível. Nenhum conteúdo obriga inscrição.
7. Não iniciar narração automaticamente sem ação da pessoa; respeitar dispositivos que bloqueiam síntese de fala e testes em segundo plano.

### Expansão do giro de rádio

O catálogo `station-programming.js` passa de 12 para **24 chamadas originais**. As 12 novas fazem pontes curtas para os seis programas, com temas de percepção, memória, criação e tecnologia. A frequência permanece **uma vinheta após cada cinco músicas concluídas automaticamente**, sem fazer isso em playlists individuais ou quando uma pessoa pula manualmente uma faixa.

As chamadas mencionam onde a história pode ser encontrada, mas **não abrem janelas nem pausam a reprodução para exigir cliques**. A voz das chamadas também depende de síntese do navegador; o fallback mantém a música.

### Direção sonora para a produção final

**Assinatura da rádio:** duas notas percussivas graves, uma nota aguda breve e silêncio suficiente para a fala respirar. Criar como composição original; não amostrar jingles reconhecíveis.

**LIA:** tom acolhedor e investigativo, pausas naturais, ritmo menos acelerado. **DAVI:** tom curioso e de contraste, respostas claras e momentos de humor discreto. São personagens originais; não imitar indivíduos reais nem usar depoimentos sem autorização.

**Ritmo:** abertura com imagem sonora e pergunta, desenvolvimento em cinco atos, pequena virada perceptiva e encerramento com uma atitude opcional, sem promessa de transformação.

**Mix de referência para futura masterização:** priorizar inteligibilidade de voz e evitar excesso de grave no leito; revisar clipping, picos, ruído, equilíbrio em fones e no alto-falante do telefone. Definir parâmetros definitivos de loudness após medições das gravações, não inventar conformidade técnica. Manter efeitos discretos e separados para facilitar edição. Não utilizar bancos comerciais sem licença explícita.

**Componentes sonoros a produzir posteriormente:**
- abertura instrumental exclusiva (2–4 segundos);
- assinatura curta de passagem entre capítulos, sem interferir na fala;
- seis camas originais diferentes conforme a história, cada uma com versão sem bateria;
- seis efeitos autorais mínimos derivados de síntese ou gravação própria;
- encerramento da série e transição para música, com volume medido;
- versões acessíveis com transcrição e identificação explícita de vozes de IA.

### Cartelas de apresentação para divulgação

- **01 — Ouvir a cidade:** “Uma rua também tem uma trilha. Você já encontrou a sua?”
- **02 — Memórias sem legenda:** “Tem histórias que começam quando alguém pergunta: quem está nesta foto?”
- **03 — A casa muda de hora:** “Uma janela às oito da manhã não é a mesma às duas da tarde.”
- **04 — Plano B com responsabilidade:** “Improvisar pode ser criativo. Esconder o problema não.”
- **05 — Estrada e silêncio:** “O trajeto continua mesmo quando a música termina.”
- **06 — IA e perguntas:** “A resposta mais útil talvez seja descobrir o que ainda falta saber.”

Uso de cartelas: rede social ou descrição editorial após revisão, sempre com link para o conteúdo realmente disponível no momento. Não anunciar um MP3 final quando existe apenas a narração temporária do navegador.

### Checklist de qualidade por experiência

- [x] Roteiro integral, cinco capítulos e duas vozes originais
- [x] Ficção identificada e ausência de depoimento fictício vendido como real
- [x] Metadados de organização e estado `scripted`
- [x] Leitura aberta e opcional de narração sintetizada
- [x] Vinhetas complementares vinculadas à programação local
- [ ] Ensaio de voz e medição de duração real
- [ ] Arquivos de vozes finais aprovados e comprovação de uso dos modelos
- [ ] Trilha e efeitos produzidos, mixados e documentados
- [ ] Revisão de acessibilidade em Safari/iOS e Chrome/Android reais
- [ ] Publicação de áudio final após revisão editorial, técnica e direitos

**Não afetar:** códigos do WINF OS, SEO ou sitemap territorial, rotas de parceiros, índice de cidades, coleções musicais existentes ou dados de progresso do Institute.
