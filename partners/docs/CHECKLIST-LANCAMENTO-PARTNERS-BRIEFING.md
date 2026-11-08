# WINF Partners™ + Briefing — Checklist de publicação

**Referência:** 08/11/2026  
**Escopo:** `/partners/`, `/briefing/`, `/briefing/asset-light/`, `/briefing/quiosque/` e `/briefing/flagship/`.  
**Repositório/branch:** `Tiago22a/winf-institucional` / `main`.  
**Critério de status:** [x] verificado no repositório; [ ] depende de homologação, publicação ou teste real.

## 1. Identidade e experiência
- [x] Logomarca WINF oficial e assinatura visual preservadas.
- [x] Família tipográfica editorial e linguagem WINF Partners.
- [x] Imagens próprias e mosaicos para Asset Light, Quiosque e Flagship.
- [x] Desktop com fotos P&B revelando cor no hover; celular/tablet com fotos coloridas.
- [x] Layout CSS responsivo com tratamento para telas horizontais e preferências de movimento.
- [ ] Validar visualmente no celular (320–430 px), tablet (768–1024 px), desktop (1366–1920 px) e paisagem.
- [ ] Conferir navegador de central multimídia quando houver suporte; não confundir com CarPlay/Android Auto nativos.

## 2. Modelos e posicionamento
- [x] Asset Light™: investimento de referência R$ 15.000; kit de 45 m lineares (15 m de Invisible, BlackPro e DualReflect); arquitetura como atividade principal.
- [x] Quiosque: ponto físico complementar, destinado a licenciados Asset Light elegíveis.
- [x] Flagship: referência de R$ 250.000 e possibilidade de Hub Regional mediante homologação.
- [x] AeroCore, NeoSkin e Ceramic Armoring opcionais no Asset Light.
- [x] GHOST SHOP™ na comunicação atual (preservar referências técnicas legadas quando necessário).
- [x] Sem prometer ganhos, payback, exclusividade além do contrato ou 100 territórios já vendidos.
- [ ] Validar oficialmente o preço definitivo do Quiosque (R$ 95.000 é indicativo).
- [ ] Homologar afirmações comerciais, COF e instrumentos jurídicos antes de campanha de franquia/licenciamento.

## 3. Navegação e conversão
- [x] Cards da página Partners direcionam aos três modelos dedicados.
- [x] Botões do briefing levam às páginas correspondentes.
- [x] As três páginas dedicadas contêm FAQ e CTA comercial.
- [x] Auditoria estática dos links e âncoras internos.
- [ ] Testar CTAs WhatsApp e links em celulares reais.
- [ ] Validar recepção dos contatos e rastreamento de origens no atendimento.

## 4. SEO, acessibilidade e mídia
- [x] Títulos, descrições, canonical, Open Graph e dados estruturados aplicados.
- [x] H1 único por página, imagens com alt e sem IDs repetidos (revisão estática).
- [x] Imagens em WebP e ajustes de carregamento nas páginas dedicadas.
- [ ] Verificar Core Web Vitals/Lighthouse e contrastes em produção.
- [ ] Testar indexação no Search Console e prévias de WhatsApp/redes sociais.
- [ ] Incorporar vídeos institucionais aprovados após edição e compressão; não bloqueia o site atual.

## 5. Publicação Hostinger — PENDENTE DE CONFIRMAÇÃO
- [x] Alterações de código enviadas à branch `main`.
- [x] Workflow existente `investor-pages.yml` identificado como verificador, não deploy; não acompanha push na `main`.
- [x] Criada automação de **testes de integridade** Partners/Briefing para pushes na `main` — não configura deploy.
- [ ] Identificar método real da Hostinger: Git deployment (hPanel), webhook, FTP/SFTP ou rotina externa.
- [ ] Fazer snapshot/backup antes de alterar configuração de publicação.
- [ ] Acionar/sincronizar `main` à hospedagem, sem remover outros módulos do site.
- [ ] Confirmar HTTP 200 e conteúdo novo nas cinco rotas em `winf.com.br` e `www.winf.com.br`.
- [ ] Confirmar CSS, imagens, fontes e scripts com HTTP 200 no domínio.
- [ ] Realizar smoke test de navegação, mobile, links WhatsApp e versão publicada.
- [ ] Registrar o commit publicado e a data da homologação.

**Regra de encerramento:** commit na `main` **não equivale** a publicação comprovada na Hostinger. Marcar “PRONTO EM PRODUÇÃO” somente após verificar o domínio e aprovar as telas e CTAs reais.

**Limite do escopo:** não alterar WINF OS, autenticação, Firebase, checkout ou módulos de terceiros nesta etapa.
