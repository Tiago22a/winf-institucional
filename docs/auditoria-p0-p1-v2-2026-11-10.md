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

## Atualização executada em 11/11/2026

### Código integrado e testes
- PR [#35](https://github.com/Tiago22a/winf-institucional/pull/35), squash `13f8225`: player cinematográfico com fallback declarado, pôster funcional no briefing, iluminação suave das imagens e seis suites de teste aprovadas. O vídeo original é priorizado.
- PR [#36](https://github.com/Tiago22a/winf-institucional/pull/36), squash `347312c`: melhorias de usabilidade no simulador MediaCar (guia em 3 passos e rolagem móvel), links ativos do rodapé para Universo Dark e SYNTHWAVE.fm, URL oficial M.A.W. e três suites aprovadas.
- Alterações feitas na `main`. A execução de testes de repositório **não equivale** à homologação de todos os componentes em produção.

### Arquivos originais ainda não encontrados no repositório
As páginas e os pôsteres existem, mas os seguintes caminhos de vídeos usados pelas experiências editoriais não aparecem no GitHub verificado. Podem existir em hospedagem externa; isso não foi confirmado.

| Página | Vídeo original esperado |
| --- | --- |
| Briefing | `/briefing/media/winf-dominio-absoluto-manha.mp4` |
| MediaCar | `/media/ecossistema/mediacar-bmw.mp4`, `/media/ecossistema/mediacar-team.mp4` |
| SYNTHWAVE.fm | `/media/ecossistema/synthwave-hero.mp4`, `/media/ecossistema/synthwave-experience.mp4` |
| Cuidar & Conectar | `/media/ecossistema/cuidar-conectar-community.mp4`, `/media/ecossistema/cuidar-conectar-education.mp4` |
| Universo Dark | `/media/ecossistema/universo-dark-entry.mp4`, `/media/ecossistema/universo-dark-equity.mp4` |
| GHOST SHOP | `/media/ecossistema/ghost-shop-products.mp4`, `/media/ecossistema/ghost-shop-operation.mp4` |

**Decisão:** não substituir artificialmente os filmes aprovados por vídeos de outra marca. O player agora mantém a imagem de capa e usa somente alternativas explicitamente declaradas até a inclusão dos arquivos originais. Após upload: conferir visual, loop, som silencioso, capa, responsividade e CDN em `https://winf.com.br`.

### A fazer para conclusão global
- Homologar URL pública e cache/CDN após os merges.
- Recuperar e publicar os 11 vídeos originais, ou remapear com evidências de correspondência.
- Auditar integrações e permissões reais do WINF OS/CRM: não foram alteradas neste conjunto de PRs.
- Validar em dispositivos físicos a experiência MediaCar de upload, arraste, redimensionamento, restauração e exportação.
