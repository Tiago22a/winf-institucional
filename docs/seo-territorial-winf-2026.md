# WINF™ — Plano de SEO territorial e replicação comercial
**Revisão de engenharia reversa: 08/11/2026 | Escopo: catálogo global e operação-piloto de Santos**

## 1. Objetivo e limites
- O **catálogo é global**: `/catalogo/`. É uma fonte única para WINF Select™, AeroCore™, NeoSkin™ e Ceramic Armoring™. Produtos de outras marcas aparecem em Glass + Home como complementos, com origem visível e avaliação de compatibilidade.
- Cada **unidade ativa** possui sua landing page única com contexto local real, atendimento e links de produtos preservando a origem do território.
- Não criar ou indexar cem páginas genéricas sem operadores e fatos verificáveis. As 100 cidades são um **plano de expansão**, não 100 unidades ativas.
- Não copiar textos de terceiros, ocultar palavras-chave, produzir city-doorways ou publicar avaliações fictícias.

## 2. Auditoria pública: peliculassantos.com.br
Observado no site e mapa público em novembro de 2026:
1. Menu orientado a busca: películas para janelas, jateada, espelhada, residencial, automotiva, fachada e apartamento.
2. Páginas específicas por serviço e bairros; mapa de conteúdo extenso.
3. CTAs de orçamento/agendamento em vários pontos da navegação.
4. Conteúdo editorial para várias intenções de busca.
5. Repetição intensa de conteúdo e alguns temas desconexos — **não reproduzir**.

**Estratégia WINF:** vencer em utilidade, confiabilidade, marca e conversão, não em quantidade de palavras repetidas. A posição efetiva no Google só pode ser comprovada com consultas e dados do Search Console, não por supostas garantias de fornecedores.

Referências:
- https://peliculassantos.com.br/
- https://peliculassantos.com.br/mapa-do-site/
- https://developers.google.com/search/docs/essentials/spam-policies

## 3. Arquitetura da busca por intenção
| Intenção | Página / canal | Exemplo de tema |
|---|---|---|
| Navegação e marca | `/`, `/aerocore/`, `/catalogo/` | WINF películas, produtos |
| Serviço e cidade | landing da cidade ativa | película de controle solar em Santos |
| Problema residencial | seções locais + WINF Journal | calor em sacadas e apartamentos |
| Comparação técnica | WINF Journal + ficha do catálogo | VLT x TSER, transparente x refletiva |
| Produto específico | `/catalogo/?produto=ID` | WINF Invisible, DualReflect, PPF |
| Conversão | botão local + WhatsApp territorial | solicitar análise, agendar avaliação |

Somente páginas com conteúdo e operação reais entram no sitemap; URLs com `?partner`, `?territorio`, `?produto` são variações funcionais e compartilham a canonical `/catalogo/`.

## 4. Padrão de landing geolocalizada
- H1 real de serviço + cidade + UF, sem variações artificiais.
- H2/H3 específicos para imóveis e demandas locais.
- Descrição precisa de atendimento, abrangência, fotos e endereço *somente quando comprovados*.
- Linha editorial WINF Select™ / Gustavo, com vídeos leves e imagem principal otimizada.
- Um CTA principal de análise e um de catálogo com **telefone autorizado do território**.
- Cards da categoria com URLs de ficha individuais, preservando `?partner=...` e `?territorio=...`.
- FAQ visível, com respostas originais que tratam de compatibilidade de vidro, condomínio, luz e orçamento.
- Schema `Service`, `WebPage`, `BreadcrumbList`, `Organization`. Usar `LocalBusiness` e endereço apenas com presença física verificada.
- Interlinking entre landing local, `/catalogo/` e artigos técnicos reais.
- Não prometer posição #1, percentuais técnicos sem laudos, economia garantida ou certificações sem documentação.

## 5. Primeiro piloto: Santos / SP
**Status: unidade piloto em operação, confirmado pelo fundador.**
- URL: https://winf.com.br/pelicula-de-controle-solar-santos-sp/
- Contato oficial indicado pelo fundador: 5513981113001
- Catálogo legado: `/catalogo/?partner=5513981113001`
- Catálogo territorial: `/catalogo/?partner=5513981113001&territorio=santos-sp`
- Conteúdo local: apartamentos e sacadas, compatibilidade, fachadas, escritórios e ligação ao Journal.
- Páginas do Journal: `/blog/peliculas-para-sacadas-santos/` e outros artigos especializados.
- Nunca declarar loja física, horário fixo ou bairros atendidos como exclusividade se não confirmados.

## 6. Ativação das próximas cidades (proposta técnica)
1. A WINF OS registra **id de território**, cidade/UF, status, telefone autorizado, licença, slug e data/hora de ativação.
2. Um aprovador confirma condições comerciais/jurídicas e acessos disponíveis.
3. Nas 48 horas acordadas, o time entrega credenciais por canal seguro, páginas, canais sociais, Google Business quando legítimo e treinamento. **Não incluir senhas em repositório, páginas públicas ou mensagens sem proteção.**
4. A landing somente passa de rascunho/noindex para indexável após revisão, conteúdo local verificado, contato testado e ativação da operação.
5. O sitemap inclui apenas a URL canônica pública ativa. O catálogo não precisa ser duplicado por território.
6. O registro do telefone e do slug é sincronizado ao mapa do catálogo ou a uma API autenticada (integração futura).
7. A unidade ativa usa links de catálogo com parâmetro territorial, mas o servidor **nunca confia em número de WhatsApp arbitrário enviado na URL**.

## 7. Medição e governança
- Google Search Console: impressões, consultas, posição e CTR por landing e por intenção.
- GA4 ou outro analytics consentido: origem do tráfego, clique em catálogo, clique no WhatsApp e solicitação de orçamento.
- Core Web Vitals: LCP, CLS, INP e desempenho mobile; validar com PageSpeed e dispositivos reais.
- Google Business Profile apenas quando a unidade se qualificar, com nome/endereço/serviço reais.
- Revisar trimestralmente conteúdo, links quebrados, serviços, mudanças de domínio e dados estruturados.
- Tráfego, conversão, custo por lead e taxa de fechamento devem ser medidos separadamente.

## 8. Lista de 100 cidades
A lista definitiva **ainda precisa de homologação** (mercado, densidade de condomínios e fachadas, presença de instaladores, exclusividade contratual e logística).
**Não gerar automaticamente 100 cópias de landing.** Preparar um cadastro com status: `candidata`, `em-selecao`, `aprovada`, `ativacao`, `ativa` e `suspensa`.
Reservar as cidades estratégicas já estudadas para revisão comercial, mas só publicar unidades ativas, começando por Santos.

## 9. Pendências futuras
- Integração WINF OS/API para cadastro autenticado de telefones e páginas por cidade.
- Inventário e homologação técnica de fichas VLT/TSER por SKU/vidro.
- Teste real em navegador e Search Console após deploy.
- Finalização e seleção conjunta das 100 cidades.
