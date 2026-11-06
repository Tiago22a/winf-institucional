# Auditoria WINF Partners™ — Diretrizes 06/11/2026

## Modelo comercial que prevalece
1. **Asset Light™:** entrada principal para profissionais que já dominam a aplicação de películas. Foco obrigatório em arquitetura WINF Select; AeroCore/NeoSkin opcionais conforme habilitação.
2. **Quiosque:** expansão física vinculada ao Asset Light, não franquia independente.
3. **Flagship Studio & Hub Regional:** projeto operacional de maior porte com territorialidade, responsabilidades e escopo específicos.
4. **Padrinho:** empresário-investidor associado ao operador técnico. Pode apoiar Asset Light e eventual Quiosque. Não é quarta franquia nem dá participação na holding.
5. **GHOST SHOP™:** abastecimento e expedição (preservar temporariamente rotas técnicas /blackshop/).
6. **Atacado/varejo assistido:** canal de fornecimento B2B para redes de construção, distribuidores, importadores e indústria, com opção DIY ou atendimento por técnico onde houver cobertura real.

## Código nesta branch
- `partners/atacado-varejo/index.html`: página B2B preparada, apresentação de modelos e formulário de proposta que abre WhatsApp oficial. **Ainda não registra no CRM**.
- `partners/index.html`: corrigida a âncora circular de "Ativar Território" e criada a entrada do novo canal corporativo. Alegação não comprovada de blockchain removida.

## Não reativar
- Planos genéricos antigos Básico/Advanced, OITAVA e propostas para leigos como oferta principal.
- Preços históricos R$ 5 mil, R$ 6 mil, R$ 8 mil; promessas de retorno ou renda garantida; margens 70–75%; faturamento R$ 150–750 mil sem lastro documental.
- Avatares sintéticos apresentados como empregados/embaixadores reais.
- Vínculos fictícios com grandes redes apenas por mockups com suas marcas.
- Versão W-Rank anterior; há alterações recentes no repositório que o retiraram.

## Pontos comerciais a validar
- Preço Asset Light (o briefing menciona R$ 15 mil), composição do kit e divergência de 45 vs. 90 metros lineares.
- Quiosque a partir de R$ 95 mil: especificar inclusão da adesão, montagem e capital de giro.
- Flagship referência R$ 250 mil: plano executivo e custos reais.
- Região/território, condições de exclusividade, publicidade e encargos periódicos.
- Modelo de supply: (A) tabela e fornecimento; (B) estoque próprio em 3PL; (C) sociedade/joint venture apenas após diligência e valuation.

## Produtos e compliance
- Embalagens DIY exigem testes, lote, instruções, compatibilidade com vidro, garantia e política de troca.
- Biblioteca BIM para arquitetos só com propriedades técnicas ensaiadas; honorários por trabalho contratado, nunca comissão ilícita por indicação de insumo (CAU).
- Se a relação caracterizar franquia, observar a Lei 13.966/2019, inclusive COF e antecedência legal.
- CRM integrado com segregação de dados por território e finalidade; não criar fluxos falsos.
- Comunicação de resultados deve se basear em dados reais; parceiros e lojas só quando contratados.

## Dependências para publicação
A `feature/partners-briefing-funil-20261106` também altera `partners/index.html`; mesclagem deve resolver conflitos manualmente. O backend de candidaturas e a API técnica também têm branches próprias. Homologar Firebase/Auth, CORS, LGPD e ponta a ponta antes de publicar. Esta branch é de **revisão**, não oferta final.
