# GHOST SHOP™ / Kit de abertura e distribuição — decisão de projeto 06.11.2026

## Escopo confirmado pelo fundador
O kit de boas-vindas Asset Light deverá conter, no mínimo:
- 3 rolos de películas arquitetônicas, **15 m lineares cada** (total **45 m lineares**, não confundir com m²).
- 2 bonés oficiais, 2 camisetas oficiais e 1 toalha grande.
- 3 saquinhos de tecido reutilizáveis personalizados WINF (para transportar/apresentar material na visita).
- Adesivos, flyers e materiais de amostras (quantidade/formato ainda a aprovar).

Linhas preliminares para os três rolos: BlackPro™, DualReflect™ e Invisible™ (15 m cada), **SKU, largura, lote, ensaios, custo e fornecimento sujeitos a validação**.

## Não confundir os dois tipos de embalagem
**A. Sachê protetor do produto** — conceito de embalagem comprida, visual de embalagem lacrada de conveniência, redimensionada para um rolo de película. Deve proteger **o rolo enrolado em tubete**, contra amassamento, abrasão, poeira, umidade e transporte. O formato publicitário “de salgadinho” é uma referência estética, não especificação técnica de barreira ou de resistência. Não dobrar filme.
**B. Saco de tecido** — acessório reutilizável de marca, para o profissional levar **o rolo protegido ou material de apresentação** até a obra; não substitui a embalagem primária nem oferece proteção estrutural suficiente sozinho.
**C. Caixa e transporte** — unidade de distribuição que precisa proteger extremidades/tubete e resistir à compressão e ao manuseio.

## Fluxo de cadeia e responsabilidade
1. **Fábrica ou importador**: matéria-prima com documentação técnica, SKU e lotes; definir qualidade, origem, validade/armazenamento e responsabilidade por garantia.
2. **Beneficiador / indústria**: quando contratado, cortar/rebobinar master roll para 15 m ou 30 m com controle de largura, tensão, perdas e rastreabilidade; embalar rolos e lacrar.
3. **Operador logístico / distribuidor**: manter inventário por lote e formato, embalar kit de boas-vindas, gerar etiqueta, expedir e registrar comprovante/rastreio.
4. **WINF matriz**: aprovar catálogo e identidade, preço por canal, kit, territórios, pedido, política de trocas e reconciliação fiscal/financeira.
5. **Licenciado**: confirma recebimento com checklist (3 rolos + uniformes + tecido + impressos), fotografa avarias, registra lotes no WINF OS; depois repõe estoque pelo GHOST SHOP.
6. **Cliente final**: recebe aplicação com OS e garantia vinculadas ao material/lote; quando cabível, embalagem/lacre e QR podem servir de evidência de autenticidade.

## Três modelos contratuais alternativos — não presumir sociedade
- **A. Atacado**: fornecedor produz, vende para WINF por tabela aprovada; WINF revende e distribui.
- **B. Estoque WINF em 3PL**: WINF compra e é titular; terceiro armazena, separa e entrega por SLA.
- **C. Joint venture industrial**: eventual sociedade para compra, beneficiamento, embalagem e distribuição; exige cap table, aportes, contratos, riscos de qualidade, fiscal e saída.
O termo popular 'dropshipping' é insuficiente para fixar propriedade do estoque, responsabilidade tributária e faturamento. A estrutura escolhida deve constar de contratos e fluxos fiscais reais.

## Padrões técnicos mínimos para embalagem piloto
- **Medições**: comprimento total e diâmetro externo **do rolo já enrolado**, largura/altura da bobina, diâmetro do tubete, gramatura da película e tolerâncias; nenhum tamanho de sachê deve ser chutado.
- **Proteção**: selagem, resistência a perfuração/queda/compressão, proteção das bordas, integridade e compatibilidade do material de contato.
- **Rotulagem**: marca, linha, SKU, variante, largura, metragem, lote, data, fabricante/importador responsável, instruções e armazenamento; QR com rastreio sem dados pessoais expostos.
- **Testes**: 15 m e 30 m separadamente, 5-10 unidades de piloto por versão (quantidade sugerida, não amostra estatística), transporte real, armazenamento e abertura no cliente; taxa de avaria e custo mensurados.
- **Visual**: saco de tecido preto/grafite, tipografia oficial e identificação limpa. Sachê externo com acabamento premium preto/branco e instruções legíveis. Não exagerar em claims de UV/IR ou garantia.
- **Economia**: custo produto por metro vendável + corte/perdas + proteção + tecido (kit) + separação + frete + impostos + reversa.

## Modelo de dados proposto
`product_sku, product_line, supplier_id, origin_format, width_m, roll_length_m, nominal_area_m2, unit_cost, supplier_batch, expiry_or_storage_rule, test_certificate, packaging_revision, pack_id, kit_id, partner_unit_id, order_id, shipping_tracking, delivery_status, inspection_status, approval_actor, timestamps`.

## Aceite do kit — campos sugeridos
`kit_id, unit_id, expected_items, confirmed_items, signed_at, transport_damage, photo_refs, lot_scans, discrepancies, resolution_ticket`.
Sem aceite positivo não marcar unidade como operacional.

## Decisões pendentes
Nome comercial e arte final do sachê, material polímero/barreira, fabricante, modelo fiscal, titularidade da mercadoria, especificação dimensional, custos e SLAs, SKU e largura final das 3 linhas, política de estoque mínimo e reposição.
