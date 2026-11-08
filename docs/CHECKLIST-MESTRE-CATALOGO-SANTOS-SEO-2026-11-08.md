# WINF.inc® | Checklist Mestre de Desenvolvimento
**Data:** 08/11/2026  |  **Prioridade:** Catálogo > Unidade piloto Santos > SEO territorial > Home > Expansão tecnológica
**Branch de revisão:** `fix/aerocore-porsche-catalogo-tipografia-20261108`
**Observação:** itens marcados concluídos referem-se ao código nessa branch, não à homologação visual ou publicação no site.

## 1. Catálogo Global — Prioridade máxima
- [x] Quatro divisões: WINF Select Glass + Home, AeroCore, NeoSkin, Ceramic Armoring.
- [x] Identidade compartilhada em Gustavo, com tipografia especializada nas assinaturas das marcas.
- [x] Identificar origem de tecnologia dos produtos, inclusive **InfiSpectre™ by AeroCore™** na arquitetura.
- [x] Mostrar NeoSkin PPF e Ceramic Armoring como possibilidades arquitetônicas com ressalva de compatibilidade.
- [x] Trocar `Master Specs` por identificação institucional WINF.
- [x] Usar fantasminha oficial nos cards AeroCore e NeoSkin e nos acessos do catálogo.
- [x] Fichas individuais com URL compartilhável `/catalogo/?produto=...`.
- [x] Simulador visual de controle solar sem cozinha e sem temperatura em °C fabricada, com cálculo didático de incidência e TSER cadastrado.
- [x] Botões fixos de universos WINF e WhatsApp, com contexto de marca e produto.
- [x] Preservar `?partner=5513981113001` para Santos e incluir suporte a `?territorio=santos-sp`.
- [x] Restringir números arbitrários de `?partner`: somente contatos homologados podem redirecionar.
- [x] Metadados e JSON-LD consistentes com as marcas; URL canônica global sem `?partner`.
- [ ] Homologar visualmente no navegador real, em desktop, tablet e smartphone (menu, cartões, rolagem, overlays, seleção, imagem e fontes).
- [ ] Conferir todas as fichas de materiais com ensaios oficiais, SKUs, VLT, TSER, IRER, UV, garantia, espessura, fotos e aplicações autorizadas.
- [ ] Avaliar o lettering da AeroCore com a referência visual oficial; evitar redesenho incorreto de logomarcas.
- [ ] Rever indexação individual de fichas, caso a estratégia exija URLs canônicas próprias por produto.
- [ ] Integrar endereçamento seguro de territórios com cadastro autenticado WINF OS; sincronizar o mapa após homologação.

## 2. Unidade piloto — Santos/SP
- [x] Preservar WhatsApp oficial do piloto: **5513981113001**.
- [x] Conectar cartões a fichas específicas via parâmetros `produto=` e `partner=`.
- [x] Acrescentar orientação local sobre sacadas, varandas, fachadas, janelas, privacidade e técnicas de escolha.
- [x] Adicionar CTA de agendamento/avaliação, com mensagens contextualizadas.
- [x] Incluir fantasminha e acesso ao catálogo preservando o canal do piloto.
- [x] Ajustar conteúdo e estrutura sem inventar endereço de loja nem resultados de clientes.
- [ ] Testar links, CTAs e comportamento real de menu em celular e desktop.
- [ ] Validar fatos operacionais, áreas efetivas de atendimento, agenda e dados públicos da unidade.

## 3. SEO / WINF Journal / Páginas geolocalizadas
- [x] Analisar concorrente público peliculassantos.com.br: hierarquia de serviços, páginas, bairros, calls to action e estrutura de conteúdo.
- [x] Publicar na branch guia editorial original `/blog/peliculas-para-sacadas-santos/`.
- [x] Linkar artigo no WINF Journal e na página de Santos.
- [x] Incluir o novo artigo no sitemap e atualizar data de alteração das páginas afetadas.
- [x] Revisar títulos, descrições, dados estruturados, canonical, FAQ editorial e links internos.
- [ ] Homologar indexação via Google Search Console, estado HTTP, cobertura, Core Web Vitals e resultados após publicação.
- [ ] Montar matriz de temas por intenção: película residencial, proteção solar, jateada, espelhada, privacidade, sacadas, condomínios, fachada, VLT/TSER.
- [ ] Selecionar os 100 territórios pretendidos após concluir o piloto, sem anunciar todos como ativos.
- [ ] Gerar páginas por cidade somente quando houver serviço real, conteúdo útil original e área atendida validada.
- [ ] Não usar texto oculto para SEO, keyword stuffing ou páginas doorway; seguir Google Search Essentials.

## 4. Home WINF e identidade visual
- [x] Aplicar à revisão do cabeçalho a marca oficial com assinatura **Premium Quality Windowfilm**.
- [x] Trocar `/winf-logo.svg` rasterizado por caminhos vetoriais da marca já presentes no repositório; preservar logotipo central com assinatura abaixo.
- [x] Criar `/brand/winf-monogram.svg` (W™) derivado da marca original e `/brand/README.md` com regras de uso e tipografia.
- [x] Alinhar os cabeçalhos da home institucional e da unidade Santos ao padrão aprovado WINF Select Glass + Home.
- [x] Inserir seção de soluções complementares AeroCore, NeoSkin e Ceramic Armoring na página territorial de Santos, com links ao catálogo e WhatsApp local.
- [x] Permitir abertura direta de aba do catálogo pelo parâmetro `?marca=` e manter `?produto=` com prioridade para a ficha escolhida.
- [x] Menu com fantasminha e botão único visível **WINF OS™** no cabeçalho.
- [x] Remover link visual redundante do WINF OS no conjunto secundário da home.
- [ ] Homologar espaçamentos e quebra de linha no desktop e mobile comparando com os prints aprovados.
- [ ] Inspecionar títulos grandes e tipografia de todas as páginas, rodapés e páginas de carregamento.
- [ ] Retomar vídeo da AeroCore: Porsche 911 branco, na estrada e em velocidade, vidro abrindo, sem marca d’água na área visível; **não substituir** pelo vídeo de estrada com detritos da NeoSkin.
- [ ] Conferir vídeos de hero AeroCore e NeoSkin separadamente, inclusive na home WINF.

## 5. WINF OS / Implantação e operação — etapa posterior
- [ ] Registrar início do prazo de **48 h** ao ativar um território com rastreabilidade de cada entrega.
- [ ] Configurar página local geolocalizada, perfil Google, Instagram e entregas de instruções/credenciais.
- [ ] Entregar credenciais por procedimento seguro, nunca expostas em páginas públicas.
- [ ] Configurar catálogo com canal WhatsApp autorizado do território.
- [ ] Concluir homologação de permissões e segregação de dados territoriais.
- [ ] Marcar tarefas como entregues somente com confirmação da disponibilização; relógio por si só não conclui ativação.

## Critérios antes de merge/publicação
1. Revisão de diff sobre main e conciliação de PRs paralelos.
2. JS sintaticamente válido, JSON-LD válido e links sem erro.
3. Teste funcional real de filtro, ficha, simulador, copiar link, retorno, mobile e WhatsApp de Santos.
4. Conferência de SEO: canonical, sitemap, título, estrutura de headings, imagens, links internos.
5. QA visual (Gustavo, logos oficiais, menu, ghost, responsividade), acessibilidade e performance.
6. Aprovação para merge e monitoramento pós-deploy.

**Nota de SEO:** domínio com palavra-chave não garante posição. Não replicar páginas em massa sem experiência local real ou esconder palavras-chave; isso pode prejudicar a indexação.
