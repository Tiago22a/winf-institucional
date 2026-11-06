# WINF Partners™ — Comando mestre executado e formatação comercial

Data: 06/11/2026. Estado: **alterações em branch, não publicadas em produção.**

## Objetivo do comando
Reestruturar a experiência WINF Partners a partir da tese atual: encontrar bons instaladores com pouca estrutura comercial, desenvolver suas operações e selecionar territórios. Manter a identidade visual aprovada, explicar dor, desejo, dúvida e solução e conectar o marketing a um cadastro verdadeiro, com rastreabilidade. Não prometer resultados, prazos impossíveis ou território automático.

## Modelos — definição revisada

| Dimensão | WINF Asset Light™ | Quiosque Arquitetônico | Flagship Studio & Hub Regional |
|---|---|---|---|
| Posição | Entrada operacional | Evolução física do Asset Light | Operação regional de maior porte |
| Público | Instalador experiente | Operador Asset Light habilitado | Empresário/operador com estrutura e gestão |
| Dor central | Falta de marca, gestão e vendas | Falta de presença presencial | Necessidade de infraestrutura completa |
| Benefício previsto | Método, identidade e apoio comercial | Ponto físico de apresentação homologado | Projeto comercial e operacional específico |
| Referência publicada | R$ 15.000 | A partir de R$ 95.000 | R$ 250.000 |
| Kit no site atual | 45 m lineares, 15 m de cada linha | A definir em projeto | A definir em projeto |
| Entrada | Avaliação de perfil e cidade | Somente para membros Asset Light | Aprovação após estudo regional |

A exclusividade do Asset Light está restrita à arquitetura conforme contrato. AeroCore/NeoSkin e Ceramic Armoring são opcionais, sem exclusividade automática. Quiosque não gera novas exclusividades por si. Flagship não assume o controle de territórios alheios.

**Divergência comercial obrigatória:** material anterior mencionava 90 m lineares; o site atual indica 45 m e R$ 15.000. A versão publicada foi preservada por segurança. Confirmar custo e composição antes de mudar.

## O que já foi codificado nesta rodada

- Página briefing: posicionamento da tese, dor/desejo/dúvida/solução, comparativo detalhado de modelos, FAQ e CTAs para candidatura.
- Página Partners: corrigido link principal que retornava à própria página; inserida candidatura Asset Light; retirada alegação de blockchain no texto de acesso comercial.
- Candidatura: formulário mobile em três etapas, origem da campanha/convite, consentimento, protocolo, confirmação de recebimento e consulta de status.
- API na branch correspondente de winf_node: criação de candidatura, consulta por chave segura, consulta administrativa owner e alteração de status com registro de evento.
- Dados armazenados no Firebase pelo backend. Não existe aprovação automática nem reserva territorial nesta implantação.

## O que falta para poder publicar

1. Homologar a API com Firebase e autenticação owner reais, incluindo cenários de erro, rede e duplicidade.
2. Construir a tela administrativa dentro da Central WINF: lista, filtros, entrevistas, validação de território e decisão humana.
3. Revisar CORS, rate limiting distribuído, proteção anti-bot, logs, retenção e conformidade LGPD.
4. Publicar backend antes do frontend, verificar DNS/deploy e executar testes completos mobile/desktop.
5. Confirmar os preços e kits, condições contratuais e a estratégia oficial de comercialização.
6. Concluir a documentação legal aplicável à franquia: a Lei 13.966/2019 exige COF com antecedência mínima de dez dias para o contrato ou o pagamento quando o negócio for franquia.

## Comando para o próximo ciclo de execução
Integrar a jornada mobile e a API com a Central real, com painel de territórios, candidaturas e decisões auditáveis. Testar a trajetória de um instalador fictício de Sorocaba: origem Instagram → briefing → inscrição → pré-qualificação → análise territorial → entrevista → formalização → ativação, sem fingir etapas não implementadas. Usar a identidade WINF e manter os módulos opcionais Padrinho, GHOST, W Rank, W12 e Universo Dark fora do caminho crítico da primeira venda.

## Economia obrigatória — antes de ofertar franquias formalmente
Para cada modelo, definir custo real de implantação, kit, marketing, software, tributos, apoio, operação, taxas periódicas, capital de giro, responsabilidades, margem da WINF e cenários de viabilidade. Não presumir ROI ou rentabilidade.

## Critérios mínimos de aceite
Candidato envia e recebe confirmação **somente após registro real**; dados protegidos; Central owner pode alterar status com histórico; público não vê cadastro de terceiros; operação independe de automações pagas; site responsivo e sem regressão visual; todas as promessas comerciais sustentadas por documentação.
