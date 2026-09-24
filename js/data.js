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
  role: "Estudante de Medicina",
  semester: "2º semestre",
  university: "", // ex.: "Universidade Federal de ..."
  city: "",       // ex.: "São Paulo, SP"
  tagline:
    "Construindo uma base sólida em ciências básicas, com estudo guiado por Medicina Baseada em Evidências e apoio de tecnologia.",
  about: [
    "Sou estudante de Medicina no 2º semestre. Meu foco agora é dominar os fundamentos — anatomia, histologia, embriologia, fisiologia e bioquímica — porque é sobre eles que todo o raciocínio clínico é construído.",
    "Uso tecnologia como ferramenta de estudo: organizo resumos, mapas mentais e flashcards, e publico aqui o que produzo ao longo do curso.",
  ],
  email: "jhonne.weslley19@gmail.com",
  links: {
    github: "https://github.com/jhonneweslley19-hub",
    linkedin: "https://www.linkedin.com/in/jhonne-w-038b57127",
    lattes: "", // ex.: "http://lattes.cnpq.br/..."
  },
  githubUser: "jhonneweslley19-hub",
};

/** Indicadores do topo. Deixe `value` vazio para ocultar. */
export const stats = [
  { value: "2º", label: "semestre" },
  { value: "5", label: "disciplinas-base" },
  { value: "EBM", label: "método de estudo" },
];

/** Disciplinas estudadas e referências clássicas usadas em cada uma. */
export const disciplines = [
  {
    icon: "🦴",
    name: "Anatomia",
    summary: "Estruturas do corpo humano, relações topográficas e bases para o exame físico.",
    refs: ["Moore — Anatomia Orientada para a Clínica", "Netter — Atlas de Anatomia Humana"],
  },
  {
    icon: "🔬",
    name: "Histologia",
    summary: "Organização dos tecidos e correlação entre estrutura microscópica e função.",
    refs: ["Junqueira & Carneiro — Histologia Básica", "Ross — Histologia: Texto e Atlas"],
  },
  {
    icon: "🧬",
    name: "Embriologia",
    summary: "Desenvolvimento humano, gastrulação, organogênese e origem das malformações.",
    refs: ["Langman — Embriologia Médica"],
  },
  {
    icon: "🫀",
    name: "Fisiologia",
    summary: "Mecanismos de funcionamento normal dos sistemas e da homeostase.",
    refs: ["Guyton & Hall — Tratado de Fisiologia Médica", "Berne & Levy — Fisiologia"],
  },
  {
    icon: "⚗️",
    name: "Bioquímica",
    summary: "Metabolismo, enzimas e bases moleculares da saúde e da doença.",
    refs: ["Lehninger — Princípios de Bioquímica", "Harper — Bioquímica Ilustrada"],
  },
];

/**
 * Linha do tempo acadêmica.
 * status: "done" | "current" | "next"
 */
export const timeline = [
  {
    period: "1º semestre",
    title: "Início da graduação",
    text: "Primeiro contato com as ciências básicas e com os métodos de estudo em Medicina.",
    status: "done",
  },
  {
    period: "2º semestre",
    title: "Aprofundamento nas bases",
    text: "Consolidação de anatomia, histologia, embriologia, fisiologia e bioquímica.",
    status: "current",
  },
  {
    period: "Próximos passos",
    title: "Pesquisa e extensão",
    text: "Buscar ligas acadêmicas, iniciação científica e projetos de extensão.",
    status: "next",
  },
];

/**
 * Produções: resumos, mapas mentais, trabalhos, apresentações...
 * type: "Resumo" | "Mapa mental" | "Trabalho" | "Apresentação" | "Flashcards" | "Projeto"
 * Adicione `url` para linkar um PDF, Drive ou repositório.
 */
export const works = [
  // {
  //   type: "Resumo",
  //   title: "Sistema cardiovascular — fisiologia do ciclo cardíaco",
  //   discipline: "Fisiologia",
  //   description: "Resumo com esquemas do ciclo cardíaco e curva pressão-volume.",
  //   url: "https://...",
  //   date: "2026-09",
  // },
];

/** Certificados, cursos, congressos, ligas acadêmicas. */
export const certificates = [
  // { title: "Curso de Suporte Básico de Vida", issuer: "…", year: "2026", url: "" },
];

/**
 * Flashcards de revisão exibidos no site.
 * Mantenha sempre a referência — o conteúdo precisa ser verificável.
 */
export const flashcards = [
  {
    discipline: "Fisiologia",
    q: "Qual é a unidade funcional do rim?",
    a: "O néfron — composto por corpúsculo renal (glomérulo + cápsula de Bowman) e sistema tubular.",
    ref: "Guyton & Hall — Tratado de Fisiologia Médica",
  },
  {
    discipline: "Embriologia",
    q: "Quais são os três folhetos germinativos formados na gastrulação?",
    a: "Ectoderma, mesoderma e endoderma.",
    ref: "Langman — Embriologia Médica",
  },
  {
    discipline: "Histologia",
    q: "Qual epitélio reveste a epiderme?",
    a: "Epitélio estratificado pavimentoso queratinizado.",
    ref: "Junqueira & Carneiro — Histologia Básica",
  },
  {
    discipline: "Anatomia",
    q: "Qual nervo é responsável pela inervação motora do diafragma?",
    a: "O nervo frênico, originado principalmente das raízes C3, C4 e C5.",
    ref: "Moore — Anatomia Orientada para a Clínica",
  },
  {
    discipline: "Fisiologia",
    q: "Onde se origina, normalmente, o impulso elétrico cardíaco?",
    a: "No nó sinoatrial (sinusal), o marca-passo fisiológico do coração.",
    ref: "Guyton & Hall — Tratado de Fisiologia Médica",
  },
  {
    discipline: "Bioquímica",
    q: "Em qual compartimento celular ocorre a glicólise?",
    a: "No citosol.",
    ref: "Lehninger — Princípios de Bioquímica",
  },
];

/** Ferramentas usadas no estudo. */
export const tools = [
  "Anki", "Notion", "Obsidian", "Mapas mentais", "PubMed", "Cochrane Library",
  "Git & GitHub", "JavaScript", "HTML & CSS",
];
