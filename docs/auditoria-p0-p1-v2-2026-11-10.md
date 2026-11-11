# WINF — execução P0 / P1 / V2

Data de referência: 2026-11-10. Escopo auditado neste levantamento: `winf-institucional` (branch padrão `main`). Este arquivo é controle de evidências, não homologação de produção.

## Evidências verificadas no código
- `index.html`: meta tag `google-site-verification` presente com o token fornecido.
- `briefing/index.html`: página existente; carrega `/briefing/hero-motion.css`.
- `briefing/hero-motion.css`: vídeo de ambientação com fallback para celular e `prefers-reduced-motion`. Não presumir que a mídia esteja carregando em produção sem teste de rede.
- `partners/index.html`: site da WINF Partners existente.
- `maw/index.html`: site da M.A.W. existente, com hover de brilho nos elementos de imagem do hero e nos cards editoriais, sem alterar as logos.
- `README.md`: documentação de uma conversão estática anterior; não usar isoladamente para concluir o estado atual de todas as marcas.

## P0 — bloqueadores antes de publicar/expandir
- [ ] Inventariar PRs e deploys ativos; comparar branch publicada e `main` antes de merge.
- [ ] Validar permissões e isolamento de dados por território no WINF OS/Firebase; não declarar segurança validada sem testes de acesso.
- [ ] Testar jornada real briefing → candidatura/WhatsApp → CRM → orçamento → OS → aceite, identificando integrações que faltam.
- [ ] Validar dados comerciais, oferta, COF/contratos e LGPD antes de abrir adesão comercial.
- [ ] Conferir links, formulário e disponibilidade real de imagens/vídeos em ambiente publicado.

## P1 — qualidade e funcionamento
- [ ] Testar visual e responsividade em desktop/tablet/mobile para WINF, Select, AeroCore, NeoSkin, Ceramic Armoring, Partners, M.A.W., briefing e catálogos.
- [ ] Validar especificações dos produtos: dados provisórios devem estar marcados como ilustrativos até confirmação do fabricante.
- [ ] Testar hover, foco por teclado, contraste e movimento reduzido; preservar logomarcas oficiais.
- [ ] Validar MediaCar, GHOST SHOP e Academy em seus respectivos repositórios; não afirmar integrações sem evidência.
- [ ] Revisar SEO, links internos e indexação de rotas antigas, preservando redirecionamentos necessários.

## V2 — consolidação
- [ ] Criar página ou site novo **somente** quando não houver rota existente adequada, após verificar estrutura, domínio e propriedade.
- [ ] Consolidar componentes visuais e documentação sem duplicar páginas ou quebrar URLs.
- [ ] Homologar piloto territorial ponta a ponta antes de replicar modelo para 100 territórios.
- [ ] Registar evidência de teste, responsável, commit, deploy e resultado de cada correção.

## Estado
Levantamento inicial concluído somente para os arquivos citados acima. Todos os itens sem teste ficam **pendentes**, e nenhuma correção de produção ou publicação é presumida. A distinção P0/P1/V2 aqui é operacional; V2 não é declaração de release implantado.
