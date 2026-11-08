# WINF Partners™ — direção da abertura cinematográfica

**Status:** preparação técnica em `/partners/`; **vídeo definitivo ainda não gerado nem aprovado**.

## Referência fornecida
`Apartment_with_view_of_city_6738e3de.mp4` — 10 s, 1280 × 720. A referência mostra uma câmera em movimento em direção à varanda de uma residência premium, mas há inconsistências na geometria das esquadrias e uma segunda camada de vidro/quina que não deve ser reproduzida. **Não publicar esse MP4 como vídeo final.**

## Direção aprovada
- Uma sala sofisticada e uma única fachada alinhada.
- Uma porta deslizante de vidro com trilho físico realista; os painéis fixos não se movem.
- A porta desliza uma única vez. A câmera atravessa um único vão, sem vidro ou pilar à frente, e alcança uma varanda aberta.
- Guarda-corpo de aproximadamente 1,10 m só na borda externa. Nada de fechamento envidraçado adicional ou “varanda dentro de varanda”.
- Emblema Ghost **oficial** pequeno (aprox. 7 cm na escala da cena), como reflexão/gravação sutil no vidro; nenhuma marca redesenhada.
- Duração pretendida: 8–10 s, 16:9, câmera dolly contínua, luz diurna, fade suave nos momentos finais, espaço livre para o logotipo oficial adicionado na edição.
- Legibilidade: tipografia HTML permanece sobre a animação, nunca embutida por IA no vídeo.

## Para evitar deformações
Criar um primeiro frame arquitetônico aprovado, com largura/altura proporcionais, eixo de câmera definido, painel móvel e fixos separados. Produzir uma tomada com geometria constante (sem mudanças de quadro estrutural ou desaparecimento de esquadrias). Se o gerador falhar na passagem, criar duas tomadas curtas: aproximação + travessia já com a porta aberta, e unir por movimento/fade, jamais por um corte seco.

## Critérios de aceite antes de publicar
1. Há **uma única porta e um único limiar**. Nenhuma segunda parede de vidro.
2. Câmera não atravessa vidro fechado; guarda-corpo não se transforma em porta.
3. Os perfis e proporções continuam consistentes, sem quinas fantasma.
4. Logotipo Ghost oficial pequeno e fiel ao arquivo fornecido, sem novo lettering.
5. Tratamento de cor preto/grafite/prata e luz natural, sem paleta dourada obrigatória.
6. Arquivo otimizado para web com poster estático, sem áudio/autoplay sonoro.
7. Versão móvel deve ficar legível com crop responsivo; respeitar movimento reduzido e economia de dados.

## Integração técnica já preparada
- O hero continua com poster existente + movimento leve e reflexos CSS, sem geometria falsa.
- `partners/hero-film.js` contém ativação sob demanda, compatível com navegação móvel, movimento reduzido e economia de dados.
- **Só depois de aprovado e enviado ao servidor**, editar o elemento `[data-wp-hero-film]` em `partners/index.html`:
  - `data-film-src="/partners/media/partners-glass-approved.mp4"`
  - `data-film-poster="/partners/media/partners-glass-poster.webp"` (opcional)
- Os nomes acima são destinos **planejados**, não arquivos que já existam. Não adicionar as propriedades antes de subir os arquivos reais.

## Fora do escopo
Não tocar no WINF OS, Firebase, autenticação ou backend. Não considerar alteração no GitHub como publicação verificada na Hostinger.
