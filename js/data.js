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
  semester: "2º período",
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
  { value: "2º", label: "período de Eng. de Software" },
  { value: "JS", label: "linguagem principal" },
  // a média do último período concluído é calculada a partir de `curriculum`
];

/**
 * Stack. Liste só o que você realmente usa ou estuda.
 * status: "uso" | "estudando" | "concluído" (disciplina já aprovada)
 */
export const stack = [
  {
    group: "Linguagens",
    items: [
      { name: "JavaScript", status: "uso" },
      { name: "TypeScript", status: "uso" },
      { name: "HTML", status: "uso" },
      { name: "CSS", status: "uso" },
      { name: "Python", status: "estudando" },
      { name: "PHP", status: "estudando" },
      { name: "SQL", status: "estudando" },
    ],
  },
  {
    group: "Ferramentas",
    items: [
      { name: "Git", status: "uso" },
      { name: "GitHub", status: "uso" },
      { name: "React", status: "uso" },
      { name: "Supabase", status: "uso" },
      { name: "GitHub Actions", status: "estudando" },
    ],
  },
  {
    group: "Fundamentos",
    items: [
      { name: "Redes de computadores", status: "concluído" },
      { name: "Segurança da informação", status: "concluído" },
      { name: "Computação em nuvem", status: "concluído" },
      { name: "Matemática e lógica", status: "concluído" },
      { name: "Banco de dados", status: "estudando" },
      { name: "Arquitetura de computadores", status: "estudando" },
    ],
  },
];

/**
 * Projetos em destaque (além dos que vêm automaticamente do GitHub).
 */
export const projects = [
  {
    title: "Calculadora Nutri",
    description:
      "Transforma uma receita em rótulo nutricional no padrão ANVISA (IN 75/2020), com exportação em PNG/PDF. Migrei uma planilha com Apps Script para um app web, corrigi dois erros de cálculo (cobertos por testes) e criei uma busca no USDA com tradução PT→EN e ranking de resultados, protegida numa Edge Function.",
    tags: ["React", "TypeScript", "Supabase", "Tailwind", "Vitest"],
    repo: "https://github.com/jhonneweslley19-hub/APP-CALCULADORANUTRI",
    demo: "", // coloque aqui a URL da Vercel quando quiser mostrar o app no ar
  },
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
    period: "2026.1 · 1º período",
    title: "Início da graduação em Engenharia de Software",
    text: "Aprovado nas 6 disciplinas: redes, segurança da informação, computação em nuvem, programação, matemática e lógica.",
    status: "done",
  },
  {
    period: "2026.3 · 2º período",
    title: "Banco de dados, web e Python",
    text: "Cursando banco de dados, desenvolvimento web (HTML5, CSS, JavaScript e PHP), paradigmas de programação em Python e arquitetura de computadores.",
    status: "current",
  },
  {
    period: "Próximos passos",
    title: "Estágio e open source",
    text: "Buscar o primeiro estágio e contribuir com projetos open source.",
    status: "next",
  },
];

/**
 * Grade curricular (conforme o histórico acadêmico).
 * status do período: "done" | "current". `grade` vazio = disciplina em andamento.
 */
export const curriculum = [
  {
    period: "2026.1",
    label: "1º período",
    status: "done",
    courses: [
      { code: "DGT0284", name: "Fundamentos de Redes de Computadores", hours: 80, grade: 10 },
      { code: "DGT0288", name: "Introdução à Segurança da Informação", hours: 80, grade: 10 },
      { code: "DGT2198", name: "Matemática e Lógica", hours: 80, grade: 10 },
      { code: "DGT3285", name: "Introdução à Programação de Computadores", hours: 80, grade: 10 },
      { code: "DGT3290", name: "Computação em Nuvem", hours: 80, grade: 9.8 },
      { code: "DGT5129", name: "Labvida em Engenharia de Software 1", hours: 10, grade: 10 },
    ],
  },
  {
    period: "2026.3",
    label: "2º período",
    status: "current",
    courses: [
      { code: "DGT0281", name: "Arquitetura de Computadores", hours: 80 },
      { code: "DGT2191", name: "Banco de Dados", hours: 80 },
      { code: "DGT3288", name: "Paradigmas de Linguagens de Programação em Python", hours: 80 },
      { code: "DGT3291", name: "Desenvolvimento Web em HTML5, CSS, JavaScript e PHP", hours: 80 },
      { code: "DGT5130", name: "Labvida em Engenharia de Software 2", hours: 1 }, // o histórico mostra 1 h — confirmar com a secretaria
      { code: "DGT5887", name: "Sistemas de Informação e Sociedade", hours: 80 },
    ],
  },
];

/** Média das notas de um período, ponderada pela carga horária. */
export function periodAverage(period) {
  const graded = period.courses.filter((c) => typeof c.grade === "number");
  const hours = graded.reduce((sum, c) => sum + c.hours, 0);
  return hours ? graded.reduce((sum, c) => sum + c.grade * c.hours, 0) / hours : null;
}

/** Certificados e cursos. */
export const certificates = [
  // { title: "Nome do curso", issuer: "Plataforma", year: "2026", url: "" },
];
