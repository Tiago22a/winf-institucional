# SynthWAVE.fm™ — Regra oficial de entrada: ouvir em até dois cliques

**Decisão de produto:** o usuário final esclareceu em 14/11/2026 que a palavra "newsletter" foi apenas um exemplo equivocado. **Não criar uma obrigação de cadastro, de newsletter ou de informar WhatsApp para escutar música.** A rádio aberta e simples é parte central da experiência.

## Caminho principal aprovado

1. Na página `/synthwave/`, tocar em **Entrar na rádio**.
2. Acessar diretamente `/synthwave/radio/#live` e tocar em **▶ Ouvir agora**.
3. A reprodução acontece após o gesto do usuário, como exigem navegadores modernos. Em `/synthwave/radio/`, a tela de início também tem um CTA que sintoniza a rádio em um toque.

**Não exigir:** nome, número, WhatsApp, newsletter, e-mail, conta Google, login, aceite de marketing ou plano premium. Nenhuma tela intermediária, popup comercial ou formulário antes do player.

## Quando a conta Google faz sentido

**Somente depois**, se o ouvinte quiser: salvar e recuperar playlists em outros dispositivos, manter preferências pessoais na nuvem ou usar funcionalidades futuras de comunidade. A conta deve continuar facultativa; listas locais permanecem utilizáveis sem conta.

Autenticação Google e backups remotos só serão anunciados como ativos depois de projeto Firebase, regras privadas e testes aprovados. No estado atual, a configuração pública pode estar `enabled:false`.

## Newsletter foi descartada como fluxo do produto

O código experimental de newsletter, Worker e D1 desenvolvido em etapa anterior permanece arquivado/desativado, mas foi **desconectado da interface da rádio**. A presença de arquivos técnicos inativos não autoriza ativar inscrição posteriormente. A reintrodução de mensagens promocionais precisaria de outra decisão explícita do produto e de avaliação de privacidade.

Não confundir formulário com cadastro de conta: nenhum deles integra a entrada da rádio.

## Controles que devem permanecer livres

- Play/Pause, Próxima/Anterior, navegação pela biblioteca.
- Coleções para estudar, trabalhar, viajar, namorar, relaxar e outras ocasiões.
- Combinação de música com chuva, mar, vento e ruídos (nomes acústicos, não cores da identidade).
- Favoritos e playlists **locais** sem conta.
- Podcasts publicados com áudio e direitos válidos; roteiros não gravados devem ser apresentados como prévia.

## Critérios de aceite

- **Dois cliques** desde o CTA da página institucional até a reprodução; **um clique** se a pessoa já entrou na rádio e está no botão Play.
- Nenhuma chamada de API para salvar dados pessoais é realizada como pré-requisito de reprodução.
- Botões de conta, quando exibidos, dizem claramente **Opcional**.
- Os controles de reprodução não dependem do funcionamento de Firebase, Cloudflare D1 ou Turnstile.
- Navegação responsiva no Android/iOS/desktop; na prática, a reprodução depende da política de áudio do navegador, compatibilidade da faixa e conexão.
- Testes automáticos protegem a ausência de formulários e de popups de assinatura antes do Play.

## Linguagem pública

**"Entre. Aperte o Play. A frequência é sua."**

Não criar linguagem que faça o ouvinte acreditar que precisa **dar dados para receber música**. A experiência principal oferece escuta livre; recursos complementares são uma escolha.
