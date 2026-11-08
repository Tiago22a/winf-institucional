# Biblioteca de identidade WINF™ | Desenvolvimento web

Atualizada em 08/11/2026 para o ecossistema WINF.

## Ativos oficiais (não redesenhar)
- `/winf-logo.svg` — marca-mãe WINF™ oficial, SVG com caminhos vetoriais. Uso institucional em cabeçalhos, rodapés e interfaces.
- `/winf-logo-hd.svg` — versão vetorial anterior, preservada para compatibilidade.
- `/brand/winf-monogram.svg` — monograma **W™** isolado diretamente do caminho vetorial da marca WINF, com trademark discreto. Adequado para elementos mínimos, fichas, ícones decorativos e assinaturas secundárias.
- `/aerocore/assets/ghost-symbol.png` — símbolo original do fantasminha AeroCore; não substituir pelo monograma W nas interfaces dessa marca.

**Nota sobre os arquivos enviados:** `Logo Horizontal.png`, `Logo Reduzido.png` e `Slogan(1).png` enviados na conversa são arquivos de imagem PNG, ainda que representem desenhos vetoriais. Os caminhos SVG oficiais já presentes no repositório são usados para manter nitidez e escalabilidade sem redesenhar o símbolo. Os PNGs originais da conversa não foram adicionados automaticamente à biblioteca GitHub.

## Disposição das assinaturas
| Contexto | Assinatura |
| --- | --- |
| Cabeçalho institucional de `winf.com.br` | WINF™ original `/winf-logo.svg` + **PREMIUM QUALITY WINDOWFILM**, em linha, à direita |
| Hero central da home | Logomarca oficial ampliada; **Premium Quality Windowfilm** logo abaixo |
| WINF Select Glass + Home | WINF™ + divisor + **SELECT™** + **GLASS + HOME** pequeno ao lado |
| Unidade territorial Santos | Mesma marca WINF Select; identificar Santos nos textos e CTAs, não falsificar o logotipo |
| Fichas técnicas do catálogo | Monograma **W™** pequeno, sem competir com a marca de origem AeroCore/NeoSkin/Ceramic |
| Rodapé institucional | WINF™ e slogan **Do Brasil para o Mundo** ou **From Brazil to the World**, conforme o contexto editorial |

## Famílias tipográficas do site
- **Gustavo** — família institucional de identidade e leitura WINF, variações disponíveis no projeto: thin (100), light (300), regular (400), medium (500), bold (700).
- **JetBrains Mono** — navegação técnica, microtextos, metadados e numerais.
- **Outfit** e **Montserrat** — uso pontual em assinaturas específicas das submarcas, onde já aprovado. **Inter** para leitura quando definido na página da submarca.
- No catálogo unificado, Gustavo é a base; a identificação das submarcas preserva o contraste tipográfico correspondente.

Evitar títulos gigantes em fontes conflitantes, misturar famílias indiscriminadamente e recriar logotipos com texto HTML como se fossem substitutos da marca original. Referenciar os arquivos de fonte já existentes; não distribuí-los.

## Implementação
O código atual utiliza os recursos CSS `/css/winf-home-header.css` e `/css/winf-territory-santos.css`, preservando o padrão minimalista e responsivo. Nenhuma mudança nesse diretório deve alterar a operação da WINF OS ou a gestão dos números territoriais.

## Validação pendente
- Revisão visual com capturas em desktop e mobile após disponibilizar preview da branch.
- Confirmar aprovação final da versão horizontal com slogan antes de convertê-la para SVG com caminhos equivalentes aos arquivos enviados.
