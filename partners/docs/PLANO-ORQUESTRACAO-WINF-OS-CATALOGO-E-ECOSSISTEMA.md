# WINF.inc® — Plano de orquestração do catálogo, WINF OS e ecossistema
Data de planejamento: 08/11/2026 | Status: **especificação de implementação, não sistema ativo**.

## 1. Decisão arquitetural
**WINF OS™ será o painel administrativo autorizado; o catálogo mestre será a fonte única de verdade**, e os sites WINF Select™, AeroCore™, NeoSkin™, Ceramic Armoring™, WINF Partners™, orçamentos, ordens de serviço e GHOST SHOP™ deverão consumir versões publicadas desse catálogo. Não duplicar manualmente preço, garantia ou desempenho técnico em HTML.

Os repositórios atuais são independentes:
- **Site institucional**: `Tiago22a/winf-institucional`.
- **WINF OS**: `Tiago22a/winf-arealicenciados` (Firebase Auth / Firestore em código existente).
- **SYNTHWAVE.fm**: `Tiago22a/synthwave.fm` (protótipo estático HTML/JS, **sem** streaming ou podcasts reais).

Nada nesta especificação implica que essas integrações já funcionem ou que as funcionalidades citadas estejam disponíveis ao público.

## 2. Catálogo mestre e versões (primeiro produto integrador)
Separar **marca**, **linha comercial**, **SKU técnico**, **versão do SKU**, **lote**, **tabela de preços** e **material comercial**. Exemplo: a linha Invisible pode continuar existindo após trocar a película técnica, sem sobrescrever a especificação usada em instalações anteriores.

### Campos mínimos a construir
- `brands/{brandId}`: identificador imutável, nome público, símbolo oficial, cor e URLs autorizadas.
- `productLines/{lineId}`: marca dona, categoria (arquitetura / PPF / automotivo / cerâmica), descrição, status público.
- `skus/{skuId}`: linha, fabricante/código interno quando autorizado, unidade, dimensões, embalagem, estoque mínimo e status.
- `skuRevisions/{skuId}/{revisionId}`: VLT, TSER, UV, IR quando medidos e **método de ensaio**, tolerâncias, validade, fichas técnicas, prazo de garantia, aplicações permitidas, compatibilidade do vidro/superfície, data de vigência, responsável e evidência.
- `priceLists/{listId}/items/{skuId}`: moeda, unidade (m² / linear / rolo / kit), valor, impostos/regras aplicáveis, território e vigência. Preço não é uma propriedade física do SKU.
- `stockMovements`: entrada, saída, reserva, transferência e acerto com rastreabilidade por unidade/lote; não sobrescrever quantidade silenciosamente.
- `publicationSnapshots/{version}`: snapshot público de campos aprovados; **sem dados de custo, dados pessoais ou margens restritas**.

**Alegações técnicas exigem evidência antes de publicar:** não converter “99% UV” em “100% UV” por solicitação textual. Informar faixa espectral, método, condições e arredondamento da medição, conforme laudo; disponibilizar ficha técnica atualizada. A mesma exigência vale para PPF, dureza 9H, rejeição de calor, segurança e garantias.

### Ciclo de alteração
1. Colaborador autorizado prepara rascunho com justificativa, documentos e escopo.
2. Validador técnico aprova/reprova características; área comercial aprova preços; responsável de marca aprova copy/logos.
3. Publicação atômica cria nova versão **imutável** e snapshot público; alterações de preço têm data de vigência.
4. Sites e aplicações obtêm versão publicada com cache e fallback para **última versão válida**.
5. Orçamentos aprovados, OS antigas, NF e garantias preservam os valores e as especificações fotografados na versão original; nunca recalcular retroativamente.
6. Auditoria registra quem alterou, antes/depois, data, razão e eventual rollback.

### Regras de segurança
- `public/catalogSnapshots`: leitura pública apenas de documentos publicados e higienizados.
- `drafts`, custos, tabelas internas e movimentos de estoque: Firestore Rules por cargo e unidade (custom claims e escopo territorial). Evitar regras globais do tipo `allow write: if request.auth != null`.
- Toda alteração privilegiada e publicação devem ser validadas em **ambiente confiável** (função serverless / Cloud Functions), nunca confiar só em checagens do navegador.
- Regras e índices versionados, tests emulator, logs, rate limiting e idempotência dos comandos.

## 3. Mapa das integrações
| Consumidor | Consulta autorizada | Escrita autorizada / ação |
| --- | --- | --- |
| Site WINF Select | linha, benefícios, evidência, garantia, CTA, SKU publicado | nenhuma; exibe snapshot versionado |
| AeroCore / NeoSkin / Ceramic | dados públicos da marca e características validadas | nenhuma |
| WINF OS Orçamento | produtos, preço territorial vigente, disponibilidade | cria proposta com snapshot imutável |
| WINF OS OS/Agenda | orçamento aprovado, técnico, horário e status | reserva material / agenda por unidade com validação |
| Estoque | SKUs, lotes, saldo por unidade | eventos transacionais auditáveis |
| GHOST SHOP™ | catálogo elegível, preços e disponibilidade confirmados | pedido com cálculo servidor; pagamento e estoque só após confirmação |
| WhatsApp / Hermes (se contratado) | somente dados da unidade e do cliente autorizado | consulta/ação com confirmação e trilha de auditoria |
| SYNTHWAVE.fm | marca, programas e publicidade pública aprovada | mídia editorial em sistema próprio |

Não acoplar deploy do site à alteração interna não aprovada. Para SEO, gerar páginas estáticas ou dados públicos versionados na publicação, com invalidação de cache e testes.

## 4. Orquestração conversacional e financeira
- A integração com **Hermes** está condicionada à recontratação, verificação de API, termos, provedores WhatsApp oficiais e ambiente de testes. Não assumir acesso atual.
- Autorização por **usuário + unidade + ação**, revogável; sessão do WhatsApp não substitui autorização forte do WINF OS.
- A IA pode **ler** estoque e agenda autorizados e **preparar rascunhos** de orçamento e OS; criar OS, reservar agenda, cancelar, comprar, movimentar saldo e enviar cobrança exigem confirmação explícita, política de limites e checagem por servidor.
- Compras automáticas, se futuramente habilitadas, exigem orçamento máximo, alçada, estoque atualizado, fornecedor aprovado, antifraude e confirmação de saldo. **WinfCoin não equivale a dinheiro disponível** sem mecanismo financeiro aprovado.
- Toda ação passa por chave de idempotência, logs, retentativas limitadas e tratamento de falhas; mensagens WhatsApp e push devem respeitar consentimento e opt-out (LGPD).

## 5. SYNTHWAVE.fm: produto e conteúdo
**Produto desejado:** experiência gratuita para clientes, visitantes e licenciados, com rádio programada, playlists, podcasts e conteúdos WINF, incluindo o programa **Cuidar & Conectar**.

**Produto atual:** protótipo estático que reproduz áudio sintetizado e aceita URLs de áudio; não há emissora FM real, catálogo de fonogramas licenciados ou podcast com episódio publicável. O uso de “FM” é nome comercial, não licença de radiodifusão.

Fases:
1. Identidade editorial, descrição de programas, biblioteca de capas e grade de episódios.
2. Infraestrutura de áudio e CMS protegido, direitos de transmissão/reprodução, URLs seguras, monitoramento, player resiliente e métricas consentidas.
3. Playlists persistidas por usuário, favoritos, feed RSS de podcasts e programação contínua; inserções institucionais claramente identificadas, com frequência administrável.
4. PWA mobile confiável, integração Android Media Session e testes em segundo plano.
5. **Android Auto** somente após produto Android compatível com as diretrizes da plataforma (Media3/Android for Cars, mídia, UX para direção, política de publicação, testes em aparelhos e aprovação). PWA sozinho não entrega experiência nativa no Android Auto.

Não copiar interface ou catálogo do Spotify; usar princípios de navegação familiares e identidade WINF própria.

## 6. Cuidar & Conectar — programa de impacto, não promessa pública
- **Ciclo piloto:** indicação de instituição → triagem da necessidade → inspeção técnica do vidro → escolha de produto compatível → orçamento e doação/fornecimento autorizado → convocação voluntária de aplicadores habilitados → execução documentada → aferição e prestação de contas.
- A WINF pode propor fornecimento de película e a rede pode colaborar com aplicação **somente quando houver aprovação formal e condições viáveis**. Não anunciar doações, parcerias ou aplicações já efetivadas sem documentação.
- Priorizar conforto e proteção solar em espaços sociais, escolas e instituições para idosos; não usar propriedades da película como substitutos de diagnósticos arquitetônicos e segurança do vidro.
- Cadastro de pilotos deve registrar responsável, local, autorizações, custos, material, equipe, medição, fotos com consentimento e resultado.

## 7. Critérios de aceite obrigatórios antes do lançamento
- [ ] Um SKU alterado no admin atualiza **todos** os locais de publicação correspondentes sem edição duplicada.
- [ ] Revisão aprovada, histórico, rollback e snapshot preservado em OS/propostas anteriores.
- [ ] Testes de segurança: usuário Santos não lê/edita dados privados de Sorocaba; usuários sem autorização não publicam preços.
- [ ] Testes de preços: diferença entre preço por m², metro linear e rolo; impostos e orçamento não mudam silenciosamente.
- [ ] Rotas e mídias publicadas retornam 200; testes mobile real/desktop; acessibilidade e performance.
- [ ] Teste de queda: sem Firestore ou com falha de rede, site exibe última informação válida identificada.
- [ ] Integração Hermes/WhatsApp bloqueia comandos sem autorização ou confirmação de ação financeira.
- [ ] GHOST SHOP só confirma pedido conforme pagamento e reserva de estoque real.
- [ ] SYNTHWAVE só transmite faixas/episódios com direitos suficientes e players compatíveis.
- [ ] GitHub Actions verde e deploy **produção** conferido separadamente.

## 8. Sequência de execução sugerida
**P0 — Base confiável:** finalizar CI, provas de mídia, rotas, conteúdo e conformidade técnica das especificações.
**P1 — Fonte única:** esquema, regras, admin do produto e aprovação; teste em ambiente de homologação.
**P2 — Consumidores:** orçamentos, site e estoque primeiro, depois GHOST SHOP; migração monitorada.
**P3 — Operação:** OS/agenda, notificações, atendimento e autorização de ações.
**P4 — Ecossistema:** SYNTHWAVE real, Cuidar & Conectar e Android Auto em etapas separadas.

**Regra de lançamento:** não anunciar que está funcional aquilo que ainda está planejado, em demonstração ou dependente de terceiros.
