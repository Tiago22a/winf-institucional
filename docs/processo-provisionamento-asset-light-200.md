# WINF Partners™ — Processo oficial de provisão de 200 territórios WINF Asset Light™

**Atualização:** 13/11/2026 · **Modalidade:** WINF Asset Light™ · **Lotes:** 20 × 10 territórios.

## 1. Princípio operacional

Os 200 territórios (100 SP + 100 demais estados/DF) são **unidades comerciais digitais disponíveis para ativação**, sem necessidade de loja física. O responsável licenciado pode atender online e coordenar orçamentos, agenda e instalações por profissionais habilitados, desde que a cobertura presencial seja confirmada. Disponível para ativação **não significa** contratado, ativado, com instalador, com conta criada ou indexado no Google.

Cada cidade tem seu arquivo HTML e URL territorial previstos no repositório. Estar no `main` significa código publicado no repositório, **não substitui** comprovação individual de status HTTP 200 no domínio. O CSV de prontidão acompanha essas verificações sem inferir sucesso.

## 2. Fluxo de entrega: 10 territórios por lote

1. **Reservar território:** validar id municipal/IBGE, UF, exclusividade e estado de licença (disponível/contratado/ativado/suspenso).
2. **Publicar site:** exigir URL própria funcionando com HTTPS + HTTP 200, imagens, layout celular/tablet/desktop, canonical, formulários e WhatsApp/central correta; registrar evidência da URL e data. Não chamar de publicado se não testado.
3. **SEO:** conteúdo territorial útil e verificável; inicialmente `noindex` nas páginas de pré-lançamento; remover somente após revisão editorial, canonicals, indexabilidade e conformidade com política de doorway pages. Sitemap apenas para páginas elegíveis. Indexação no Google não é automática nem garantida.
4. **Preparar identidade:** usar `assetlight.<territorio_id>@winf.com.br` como **endereço proposto** sob domínio corporativo (ou convenção aprovada pelo TI). O CSV não cria caixa postal nem conta Google. Verificar posse do domínio, provedor, licenças e políticas de segurança.
5. **Criar conta de trabalho:** quando aprovado pelo administrador, provisionar **identidade Google própria** para o operador via Google Workspace/Cloud Identity conforme licenças e suporte. Um alias compartilhado ou endereço fictício **não equivale** a 200 contas Google independentes.
6. **Instagram:** reservar o @planejado e cadastrar por meios autorizados da Meta; concluir verificações/2FA e registrar status real. Não armazenar senha, códigos de recuperação ou tokens no GitHub. Verificar disponibilidade do nome antes de prometer entrega.
7. **Perfil da Empresa no Google:** só criar/verificar se houver operação elegível com atendimento pessoal no endereço dos clientes ou local físico real. Serviço exclusivamente online, endereço virtual ou ficha apenas para geração de leads não são elegíveis. Uma equipe central única não autoriza 200 perfis locais independentes. Validar por território antes da criação.
8. **WINF OS:** reservar `tenant_key=territorio_id` no inventário, **sem criar credencial**. Depois que o titular for aprovado e formalmente ativado, autenticar via Google Sign-In (OAuth), vincular `Google sub/UID` verificado ao território, autorizar por regra de servidor, MFA e escopos: operador só vê clientes, agenda, documentos, leads e caixa do próprio território; equipe central vê suas regiões; administração global mantém auditoria. **Não** autorizar apenas por correspondência de endereço de e-mail ou por alias. Desabilitar e revogar acesso em suspensão/cessão.
9. **Entrega:** checar site público, Instagram ativo, e-mail provisionado, identidade Google validada, acesso WINF OS liberado ao titular, termo/contrato, central/WhatsApp e instalação disponível ou sob consulta. Registrar provas e aceite do licenciado.

## 3. Estados independentes (não misturar)

- `status_comercial`: disponivel_para_ativacao / reservado / contratado / ativo / suspenso.
- `site_codigo`: no_repositorio_main; `site_http`: http_pendente_validacao / http_200_validado / erro_http.
- `site_indexacao`: noindex_revisao_editorial_pendente / elegivel_indexacao / indexado_confirmado_GSC.
- `email_criado`, `instagram_criado`, `google_identity_status`: cada um validado após existência real.
- `winf_os_acesso`: nao_provisionado / provisionado_bloqueado / ativo / revogado.
- `operacao_presencial`: sujeita_confirmacao / confirmada / indisponivel.
- `handover_status`: pacote_em_preparacao / validado / entregue.

## 4. Segurança, privacidade e propriedade

Contas e ativos devem permanecer sob governança corporativa WINF, com 2FA/MFA, recuperação centralizada, gestor substituto e trilha de auditoria. Evitar e-mails Gmail pessoais em série, números temporários, informações falsas de endereço, uso de um mesmo login por vários operadores e credenciais em repositórios. Não presumir disponibilidade ou posse de nome de usuário social.

## 5. Auditoria por lote

Checklist automático: 10 ids distintos; correspondência com cadastro mestre; URL do site; HTTPS/status; marcação robots; canonical; metadados; mobile/tablet/desktop; Instagram efetivamente registrado; e-mail e identidade confirmados no provedor; tenant WINF OS com ACL testada; licença/operador autorizados. Registrar logs/provas no painel interno protegido, não em página pública.

**Artefato:** `crm/provisionamento-asset-light-200.csv` contém 200 endereços **propostos**, identificadores e status iniciais honestos; não contém senhas ou contas criadas.
