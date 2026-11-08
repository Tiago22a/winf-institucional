# Auditoria editorial WINF — 08/11/2026

**Repositório:** `Tiago22a/winf-institucional`

**Princípio de navegação:** `/` e `/aerocore/winf-select/` atendem principalmente cliente final; `/partners/` e `/briefing/` apresentam a oportunidade de licenciamento ao profissional. Ambos seguem dor → desejo → solução → prova → ação; sem prometer rentabilidade ou resultado técnico não demonstrado.

## Aplicado nesta revisão
- [x] WINF Select: hero minimalista, marca-mãe oficial preservada, duas CTAs funcionais para linhas e atendimento, responsividade e acessibilidade.
- [x] Quiosque: modelos P/M/G e imagens independentes preservados; nova área editorial com poster, pronta para receber MP4 homologado sem player quebrado.
- [x] Briefing e Partners: chamadas conectadas ao Quiosque P/M/G e à futura experiência cinematográfica.
- [x] BlackPro, DualReflect, Invisible, SecurityBlinder: cabeçalho semântico H1 invisível, preservando o SVG oficial como protagonista.

## Conteúdo que requer validação antes de considerar finalizado
- [ ] **Fichas técnicas e garantias SELECT:** `blackpro/`, `dual-reflect/`, `invisible/`, `securityblind/` apresentam blocos herdados da Invisible com percentuais de infravermelho/UV, garantias e tabelas que podem não ser da linha correspondente. Exigir documentação para cada SKU, com método de teste, transmitância, TSER/IRER e garantia aplicável; evitar porcentagens sem ficha. **Não alteradas nesta revisão para não inventar números.**
- [ ] **Vídeo AeroCore:** `/aerocore/` ainda aponta a `/aerocore/public/quero_uma_porche_rebaixada.mp4` enquanto `/aerocore/aerocore/` aponta a `/aerocore/public/porsche-911-highway-20261103.mp4`. Vídeo final precisa comprovar Porsche branco, vidro abaixando, sem marca do Gemini. Não substituir por arquivo não inspecionado.
- [ ] **Rotas NeoSkin:** `/neoskin/` e `/aerocore/neoskin/` são duas páginas, com canônica apontando para `/aerocore/neoskin/`. Decidir redirecionamento permanente do legado após checagem de campanhas/SEO.
- [ ] **Rotas Ceramic Armoring:** `/ceramic/` e `/aerocore/ceramic-armoring/`, com canônica na segunda. Mesma regra de migração.
- [ ] **NeoSkin PPF:** página principal já tem arsenal transparente e botões oliva (`aerocore/assets/neoskin-actions-2026.css`), não converter para película de vidro AeroCore. Falta checagem visual de todas as resoluções.
- [ ] **Quiosque vídeo Flow:** gerar e aprovar vídeo P/M/G; inserir no slot `#experiencia` com poster e reprodução sob demanda. **Não existe MP4 final aprovado na página.**
- [ ] **Vídeo hero Partners:** revisar enquadramento desktop/mobile e possível deformação arquitetônica no `partners-varanda-20261108.mp4`; não afirmar geometria corrigida sem nova tomada.
- [ ] **Investimentos:** `/briefing/` contém valores indicativos para licenciamento e quiosque. Conferir tabelas e proposta comercial/COF antes de campanha.
- [ ] **Imagens/marca:** confirmar o arquivo oficial da identidade em todo o catálogo, sem gerar Ghost novo e sem tipografia artificial.
- [ ] **Teste final de deploy:** confirmar publicação no servidor de `winf.com.br`, cache/CDN, menu, teclado, mobile, LCP e reprodução dos vídeos. Commit não equivale a deploy verificado.

## Publicação responsável
Preservar os caminhos legados em funcionamento durante a migração. As páginas de produtos devem transmitir benefício de uso verificável, não promessa absoluta. A página de expansão é destinada a interessados elegíveis, não a clientes que buscam orçamento de películas.
