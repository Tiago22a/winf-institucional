# WINF Asset Light™ — revisão de /briefing/

Data: 03/11/2026. Escopo implementado: página comercial `/briefing/`; preservados navegação global, vídeos, reprodução manual do manifesto, diálogo de contato e rodapé compartilhado. Não houve alteração no backend do WINF OS nem em sistemas externos.

## Comunicação corrigida

- Nomenclatura oficial WINF Asset Light™ nos textos, metadados, CTAs e seleção de modelo da página.
- Adesão de R$ 15.000 por território. Removidos parcelamento e disponibilidade imediata sem validação.
- Kit inicial: 15 metros lineares DualReflect™, 15 BlackPro™ e 15 Invisible™; total de 45 metros lineares.
- Núcleo arquitetônico WINF Select Glass + Home™; estoque inicial incluído, estrutura enxuta, sem dependência obrigatória de um Hub para cada corte/entrega.
- Exclusividade restrita à arquitetura, conforme contrato e divisão territorial. AeroCore™, NeoSkin™ e Ceramic Armoring™ opcionais, sem exclusividade automática.
- Quiosque a partir de R$ 95.000 e Flagship Studio & Hub Regional R$ 250.000.
- Retiradas projeções de lucro, faturamento e ROI sem validação, promessa de autoridade instantânea e demonstração de certificado/blockchain apresentada como sistema real.
- Processo MAW com prazo operacional de até 48 horas após solicitação no WINF OS, não após consulta comercial. Configuração para indexação sem garantia de ranking.
- In-House condicionado à avaliação técnica; pontos sujeitos à aprovação e homologação; indicação de profissionais e comissões conforme política oficial.

## Telas e recursos alterados

- `/briefing/index.html`: apresentação dos modelos, operação, kit, exclusividade, ativação, preços, FAQ, galeria e contexto do formulário.
- `/briefing/asset-light.css`: estilos restritos à página, tipografia herdada, contraste e adaptação a celular.
- Quatro WebPs locais em `/briefing/media/`: arquitetura, aplicação, lifestyle e tecnologia. Conversão de formato de artes da biblioteca autorizada pelo usuário, sem recortar ou redesenhar o conteúdo. Sem carregamento de fotografias do Google/Unsplash nesta seção; galeria identificada como conceitual, não como obra executada.
- Nenhum módulo autenticado do WINF OS foi modificado ou simulado.

## Fluxos efetivamente mantidos e verificados

- CTAs abrem o diálogo de consulta com o modelo correspondente selecionado.
- Validação dos campos obrigatórios antes de preparar mensagem para o WhatsApp da central (5513997815375).
- Mensagem contém nome, cidade/UF, WhatsApp, modelo e descrição opcional. Link persistente permite continuar se a nova janela for bloqueada.
- Fechamento do diálogo e reprodução manual do manifesto preservados.
- FAQ com expansão nativa por teclado; galeria com links para imagem integral, lazy loading e dimensões explícitas.
- Consulta comercial não confirma adesão, reserva território ou inicia ativação.

## Integrações pendentes: WINF OS

Não há backend autenticado de ativação nesta página estática. Os requisitos abaixo precisam ser conectados à fonte real de dados; não são considerados entregues:

1. **Onboarding:** autenticação, vínculo ao território e confirmação da adesão; cadastro de responsável, dados comerciais, cidade, WhatsApp e Instagram.
2. **Ativação:** ação confirmada “ATIVAR MEU TERRITÓRIO”; transação idempotente no servidor registra `requested_at`, prazo de 48 h e trilha de auditoria. A consulta pública nunca cria esse registro.
3. **Acompanhamento:** fases reais: solicitação recebida, identidade territorial, Instagram, página geolocalizada, recursos comerciais e conclusão. Card vermelho e contador derivam do horário do servidor; recarregar não reinicia o prazo. Somente entrega validada autoriza verde. Prazo excedido gera alerta de atraso, sem conclusão automática.
4. **Entrega MAW:** ativos territoriais, configuração de SEO/indexação, materiais e suporte das 7h às 20h. Credenciais em área autenticada com armazenamento protegido e controle de acesso; nunca em HTML, JavaScript público ou localStorage.
5. **Pontos e QR:** cadastro e homologação reais, identificador exclusivo, mensagem de origem na central, registro de leads, orçamentos, conversão e agenda integrados ao CRM/WhatsApp. Não gerar pontos fictícios nem QR que aparente atribuição já integrada.
6. **Operação:** clientes, propostas, medidas, ordens de serviço, agenda, estoque e avaliação prévia In-House com aprovação técnica e alternativa quando reprovada.
7. **Rede:** indicação, avaliação conjunta e homologação governada pela central, com estados reais e histórico.
8. **Materiais e comissões:** regras oficiais, elegibilidade, aprovação/ativação de pontos, movimentações, pedidos e conciliação. Sem percentuais, valores ou vencimentos presumidos.
9. **Permissões:** papéis de licenciado, central, MAW e parceiro; isolamento por território; acesso mínimo necessário, logs e testes contra acesso cruzado.

Módulos previstos: Meu Território; Central de Ativação; MAW — Arsenal de Marketing; Operação WINF Select; Operação In-House; Pontos Autorizados; Rede de Aplicadores; Materiais e Comissões.

## Definições comerciais e técnicas necessárias

- Mapa contratual de territórios e condições exatas da exclusividade arquitetônica.
- Política de comissões: elegibilidade, base de cálculo, percentuais, estornos e pagamento.
- Escopo/composição e condições comerciais dos demais formatos; não foi inventado parcelamento.
- Endpoints e repositório do backend WINF OS, autenticação e matriz de permissões.
- Responsáveis pela validação de entregas, critérios de conclusão, alertas de atraso e fuso operacional.
- Integração oficial de WhatsApp/CRM, armazenamento de credenciais e catálogo de materiais aprovados.

## Validação e limite

Testes de DOM e comportamento com jsdom: nomenclatura, valores, kit, ausência de promessas antigas, preservação de vídeos/rodapé, imagens locais, links e modelos válidos, formulário/WhatsApp e manifesto. CSS analisado e imagens WebP decodificadas. A revisão visual em navegador não estava disponível neste ambiente; não se declara teste visual ou conclusão das integrações pendentes.

## Proveniência das artes

- Arquitetura em vidro, luz e privacidade.png — `libfile_d7f24cc3bd84819182f669c665b3f2db`.
- Instalação precisa em vidro arquitetônico.png — `libfile_929483fbe56481918caf3a6eca33b834`.
- Refúgio em vidro ao entardecer.png — `libfile_6486f3333300819186dc01f818056e23`.
- Película arquitetônica em detalhe.png — `libfile_cd758052ad4c81918249cdd1508c723c`.
