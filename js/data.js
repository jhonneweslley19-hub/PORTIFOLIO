/**
 * ─────────────────────────────────────────────────────────────
 *  CONTEÚDO DO PORTFÓLIO
 *  Edite somente este arquivo para atualizar o site.
 *  Campos vazios ("") ou listas vazias ([]) são ocultados
 *  automaticamente — nada de texto inventado aparece no ar.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: "Jhonne Weslley",
  role: "Estudante de Engenharia de Software",
  semester: "",   // ex.: "3º semestre"
  university: "", // ex.: "Universidade ..."
  city: "",       // ex.: "Recife, PE"
  // Frases que se alternam no topo do site
  roles: ["Engenharia de Software", "Desenvolvimento Web", "JavaScript", "Aprendendo em público"],
  tagline:
    "Estudante de Engenharia de Software construindo projetos para aprender na prática — do código ao deploy.",
  about: [
    "Sou o Jhonne, estudante de Engenharia de Software. Gosto de entender como as coisas funcionam por dentro e de transformar o que aprendo em projetos reais.",
    "Este portfólio reúne meus projetos, as tecnologias que estou estudando e minha evolução ao longo do curso. Ele mesmo é um projeto: foi feito com JavaScript puro, sem frameworks.",
  ],
  email: "jhonne.weslley19@gmail.com",
  links: {
    github: "https://github.com/jhonneweslley19-hub",
    linkedin: "https://www.linkedin.com/in/jhonne-w-038b57127",
  },
  githubUser: "jhonneweslley19-hub",
  cv: "", // caminho do currículo em PDF, ex.: "assets/cv-jhonne.pdf" — ativa o comando `cv` no terminal
  openTo: "Aberto a estágios, projetos open source e colaborações.",
};

/** Indicadores do topo. O número de repositórios é adicionado ao vivo pela API do GitHub. */
export const stats = [
  { value: "ES", label: "Engenharia de Software" },
  { value: "JS", label: "linguagem principal" },
];

/**
 * Stack. Liste só o que você realmente usa ou estuda.
 * status: "uso" | "estudando"
 */
export const stack = [
  {
    group: "Linguagens",
    items: [
      { name: "JavaScript", status: "uso" },
      { name: "HTML", status: "uso" },
      { name: "CSS", status: "uso" },
    ],
  },
  {
    group: "Ferramentas",
    items: [
      { name: "Git", status: "uso" },
      { name: "GitHub", status: "uso" },
      { name: "GitHub Actions", status: "estudando" },
    ],
  },
  {
    group: "Fundamentos",
    items: [
      { name: "Lógica de programação", status: "estudando" },
      { name: "Estruturas de dados", status: "estudando" },
      { name: "Engenharia de requisitos", status: "estudando" },
    ],
  },
];

/**
 * Projetos em destaque (além dos que vêm automaticamente do GitHub).
 */
export const projects = [
  {
    title: "Portfólio pessoal",
    description:
      "Este site. JavaScript puro com ES Modules, terminal interativo, paleta de comandos, tema com View Transitions, PWA offline e deploy automático via GitHub Actions.",
    tags: ["JavaScript", "CSS", "PWA", "GitHub Actions"],
    repo: "https://github.com/jhonneweslley19-hub/PORTIFOLIO",
    demo: "https://jhonneweslley19-hub.github.io/PORTIFOLIO/",
  },
  // {
  //   title: "Nome do projeto",
  //   description: "O que ele faz e o que você aprendeu.",
  //   tags: ["JavaScript"],
  //   repo: "https://github.com/...",
  //   demo: "",
  // },
];

/**
 * Linha do tempo.
 * status: "done" | "current" | "next"
 */
export const timeline = [
  {
    period: "Agora",
    title: "Graduação em Engenharia de Software",
    text: "Estudando fundamentos de programação, engenharia de requisitos e desenvolvimento de software.",
    status: "current",
  },
  {
    period: "Próximos passos",
    title: "Estágio e open source",
    text: "Buscar o primeiro estágio e contribuir com projetos open source.",
    status: "next",
  },
];

/** Certificados e cursos. */
export const certificates = [
  // { title: "Nome do curso", issuer: "Plataforma", year: "2026", url: "" },
];
