/**
 * Cadastro de cidades WINF.
 *
 * EXEMPLOS: substitua os dados abaixo pelos cadastros reais antes de usar no site.
 * O status de um exemplo não indica uma operação real ativa.
 *
 * Status permitidos: "ativa" | "nao_ativa".
 * Tipos de atendimento: "automotivo" | "residencial" | "ambos".
 * Número: telefone/WhatsApp com país e DDD, somente dígitos (ex.: 55 + DDD + número).
 * Use null enquanto o número não estiver cadastrado.
 * URL: página da cidade; os domínios example.com abaixo são apenas exemplos.
 *
 * Uso no HTML:
 *   <script src="/js/cidades.js" defer></script>
 *
 * Acesso à lista:
 *   WINF_CIDADES
 *
 * Somente cidades ativas:
 *   WINF_CIDADES.filter(cidade => cidade.status === "ativa")
 *
 * Ativas que atendem automotivo:
 *   WINF_CIDADES.filter(cidade => cidade.status === "ativa" &&
 *     ["automotivo", "ambos"].includes(cidade.tipoAtendimento))
 *
 * Ativas que atendem residencial:
 *   WINF_CIDADES.filter(cidade => cidade.status === "ativa" &&
 *     ["residencial", "ambos"].includes(cidade.tipoAtendimento))
 */

/**
 * @typedef {Object} CidadeWINF
 * @property {string} id Identificador único e estável.
 * @property {string} cidade Nome da cidade.
 * @property {string} uf Sigla do estado.
 * @property {"ativa"|"nao_ativa"} status Situação do atendimento na cidade.
 * @property {"automotivo"|"residencial"|"ambos"} tipoAtendimento Segmentos atendidos.
 * @property {string|null} numero Telefone/WhatsApp, somente dígitos, ou null.
 * @property {string|null} url URL da página da cidade, ou null.
 * @property {string|null} instagram URL do perfil oficial local, ou null.
 * @property {string} observacoes Informações adicionais sobre o atendimento.
 * @property {boolean} exemplo true para dados demonstrativos; false para cadastros reais.
 */

/** @type {CidadeWINF[]} */
globalThis.WINF_CIDADES = [
  {
    id: "cidade-exemplo-automotivo-sp",
    cidade: "Cidade Exemplo Automotivo",
    uf: "SP",
    status: "ativa",
    tipoAtendimento: "automotivo",
    numero: null,
    url: "https://example.com/cidades/automotivo/",
    instagram: null,
    observacoes: "Exemplo de cadastro que atende apenas o segmento automotivo.",
    exemplo: true,
  },
  {
    id: "cidade-exemplo-residencial-sp",
    cidade: "Cidade Exemplo Residencial",
    uf: "SP",
    status: "nao_ativa",
    tipoAtendimento: "residencial",
    numero: null,
    url: "https://example.com/cidades/residencial/",
    instagram: null,
    observacoes: "Exemplo de cadastro residencial ainda não ativo.",
    exemplo: true,
  },
  {
    id: "cidade-exemplo-ambos-sp",
    cidade: "Cidade Exemplo Ambos",
    uf: "SP",
    status: "ativa",
    tipoAtendimento: "ambos",
    numero: null,
    url: "https://example.com/cidades/ambos/",
    instagram: null,
    observacoes: "Exemplo de cadastro que atende automotivo e residencial.",
    exemplo: true,
  },
];
