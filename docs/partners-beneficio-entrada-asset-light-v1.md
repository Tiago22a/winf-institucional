# WINF Partners™ — Política comercial do benefício inicial WINF Asset Light™
**Versão:** 1.0 • 10/11/2026  
**Situação:** comunicação padronizada em desenvolvimento. A opção de crédito depende de homologação financeira, jurídica e contratual.

## Regra única para a franquia/licença territorial
Cada nova unidade elegível pode receber **um benefício de abastecimento inicial**, em uma das modalidades abaixo, conforme contrato e disponibilidade:

### A — Kit físico de referência
- **45 metros lineares** de películas arquitetônicas, com largura da bobina e especificações conforme fornecedor.
- Distribuição de referência: **15 metros lineares de WINF DualReflect™, 15 de WINF BlackPro™ e 15 de WINF Invisible™**.
- A composição final, estoque, frete, impostos, prazo e custo serão confirmados na oferta contratual e com o fornecedor.
- 45 m lineares × largura nominal 1,52 m = 68,4 m² de superfície nominal, sem representar área de instalação nem promessa de aproveitamento de corte.

### B — Crédito de abastecimento interno WINFCOIN™ (alternativa futura)
- Crédito **equivalente ao custo de fornecimento do kit A** na tabela de custo homologada pela WINF, **não** um valor arbitrário em reais nem uma promessa de crédito já disponível.
- Usado somente para pedidos de produtos de abastecimento autorizados no sistema de compras B2B da unidade.
- **Não é criptomoeda**, dinheiro em conta, meio de investimento, cashback ou ativo resgatável em espécie. Sem saque, conversão em dinheiro ou transferência livre entre territórios.
- A habilitação depende de fornecedor oficial, preços/custos, políticas de frete e impostos, regras de validade, livro-razão por território e integração com pedido/estoque.
- **Nunca emitir créditos automaticamente** com a mera seleção da preferência no CRM. Não prometer valor nominal ou data de liberação enquanto pendente.

## Não cumulação e rastreabilidade
**Kit e WINFCOIN™ são opções mutuamente excludentes para a mesma licença territorial**. O proprietário da rede registra a escolha no WINF OS™ e a administração pode consultá-la. O contrato e a implantação precisam identificar a modalidade aprovada. Uma pessoa pode gerir várias unidades, mas cada uma tem seus registros individuais.

Na versão atual do WINF OS™ a escolha é **registro administrativo**, sem emissão financeira: `GET/PATCH /api/partners/territorios/:id/beneficio-entrada`. A opção WINFCOIN™ não pode ser marcada como formalizada antes da homologação. Uma seleção ou um checklist como “conferido” não comprova liberação de créditos, entrega de produto, contrato ou pagamento.

## Texto comercial padrão
> No WINF Asset Light™, está previsto um benefício inicial de abastecimento para cada unidade elegível: kit de referência de 45 metros lineares de películas arquitetônicas ou, quando homologada, opção por crédito interno WINFCOIN™ equivalente ao custo do kit para aquisição de produtos autorizados. O benefício não é cumulativo e as condições de fornecimento, valor e disponibilidade dependem da oferta e do contrato final. A modalidade WINFCOIN™ ainda não está habilitada para crédito automático.

## Onde deve constar
- `/partners/` — visão do modelo Asset Light™.
- `/briefing/` — detalhes do benefício e FAQ.
- `/briefing/asset-light/` — descrição e dúvidas do plano.
- WINF OS™ → Administração → Inteligência Territorial → Implantação da unidade / Benefício de entrada.
- Arsenal Comercial → conteúdo da modalidade marcado `em revisão` até aprovação jurídica e operacional.

## Itens pendentes antes da oferta vinculante
1. Aprovar o valor do pacote e os custos por produto com importadora/fornecedor.
2. Definir a fórmula do crédito e a base de custos para toda a rede, inclusive frete e tributos.
3. Revisar COF, contrato, política de troca, devolução, validade e restrições territoriais com assessoria jurídica.
4. Implementar e testar livro-razão por unidade, conciliação de pedidos, saldos e estornos.
5. Homologar um fluxo de compra e confirmar que a opção escolhida não é entregue duas vezes.

**Não confundir esta especificação com a efetiva implementação do saldo WINFCOIN™ em produção.**
