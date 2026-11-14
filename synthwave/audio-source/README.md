# SynthWAVE.fm — Produção de áudio autoral / lote 01

Arquivos gerados pelo script `audio-source/render_originals.py`, exclusivamente com síntese matemática e ruído gerado por software (sem músicas, gravações, samples ou vozes de terceiros).

| Arquivo | Coleção | Uso | Estado |
| --- | --- | --- | --- |
| `foco-frequencia-clara.mp3` | Foco / Estudar / Trabalhar | Instrumental original de 42s | Aguardando render e QA |
| `estrada-horizonte.mp3` | Estrada / Viajar | Instrumental original de 42s | Aguardando render e QA |
| `refugio-chuva-sintetica.mp3` | Refúgio / Relaxar | Instrumental original de 42s; efeito de chuva inteiramente sintetizado | Aguardando render e QA |
| `depois-das-20h.mp3` | Depois das 20h / Descansar | Instrumental original de 42s | Aguardando render e QA |

**Direitos:** criação original procedural produzida para SynthWAVE.fm, sem interpolação de obras existentes. A geração não presume autorização para músicas comerciais nem resolve por si só todas as obrigações de uma rádio na internet. Metadados das faixas indicam autoria de produção SynthWAVE.fm. Não confundir com as cinco músicas externas listadas em `music-library.js`.

**Fluxo técnico:** PR revisado → GitHub Actions gera MP3 → ffprobe valida duração/formato → workflow grava os binários em `synthwave/audio/original/` → QA verifica URLs e playback → só então os índices do player passam a incluir as novas faixas. A geração não publica podcasts nem ativa premium ou e-mail.

**Como repetir:** `python -m pip install numpy scipy`, executar `python synthwave/audio-source/render_originals.py`; requer ffmpeg no PATH.

**Critérios para aparecer no player:** arquivo MP3 realmente presente no branch principal, tamanho/duração conferidos, URL HTTPS servindo áudio, teste de reprodução no celular. A composição é um instrumental de curta duração, não uma canção com vocais.
