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
  university: "Estácio",
  city: "", // ex.: "Recife, PE"
  status: "Aberto a oportunidades de estágio", // selo no topo; deixe "" para ocultar
  headline: "Construo aplicações web que resolvem problemas reais.",
  tagline:
    "Estudante de Engenharia de Software na Estácio. Crio aplicações web com o apoio de ferramentas de IA enquanto aprofundo os fundamentos no curso.",
  about: [
    "Sou estudante de Engenharia de Software na Estácio, no 2º período. Gosto de pegar um processo manual ou confuso e transformá-lo em software simples de usar. Foi o que fiz com a Calculadora Nutri, que substituiu uma planilha cheia de fórmulas por uma aplicação web testada.",
    "Já concluí disciplinas de redes, segurança da informação, computação em nuvem e programação. Agora estou me aprofundando em banco de dados, desenvolvimento web e Python. Busco um estágio para crescer com um time e entregar código de qualidade.",
  ],
  email: "jhonne.weslley19@gmail.com",
  links: {
    github: "https://github.com/jhonneweslley19-hub",
    linkedin: "https://www.linkedin.com/in/jhonne-w-038b57127",
  },
  githubUser: "jhonneweslley19-hub",
  cv: "", // caminho do currículo em PDF, ex.: "assets/cv-jhonne.pdf" — mostra o botão "Currículo"
};

/**
 * Projetos em destaque (os repositórios públicos do GitHub aparecem sozinhos abaixo deles).
 * `slug`: identificador usado no link direto (#projeto/slug).
 * `problem` / `solution`: aparecem no painel "Ver detalhes".
 * `highlights`: 2–4 frases curtas sobre o que você fez / decisões técnicas.
 * `uses`: tecnologias usadas que não aparecem nas etiquetas do cartão.
 * `visual`: ilustração do cartão — "label" (tabela nutricional) | "pos" (painel de vendas) | "terminal" | "" (nenhuma).
 */
export const projects = [
  {
    slug: "calculadora-nutri",
    visual: "label",
    title: "Calculadora Nutri",
    summary:
      "Aplicação web que transforma a receita de um produto alimentício em rótulo nutricional no padrão ANVISA (IN 75/2020), com exportação em PNG e PDF.",
    problem:
      "O cálculo era feito numa planilha do Google Sheets com Apps Script. As fórmulas tinham dois erros de cálculo, e a busca automática no USDA aceitava sempre o primeiro resultado, o que gerava associações erradas (\"açúcar cristal\" virava \"HONEY + AJI CRISTAL\").",
    solution:
      "Uma aplicação web em React e TypeScript com Supabase: o motor de cálculo ficou isolado e testado, a busca no USDA passou a mostrar os melhores candidatos para revisão e o rótulo pode ser exportado em PNG ou PDF.",
    highlights: [
      "Migrei uma planilha com Apps Script para uma aplicação web e corrigi dois erros de cálculo da versão original.",
      "Motor de cálculo isolado e coberto por testes com os valores reais da planilha.",
      "Busca no banco de alimentos do USDA com tradução PT→EN, ranking de resultados e revisão manual.",
      "Chave de API protegida no servidor com Supabase Edge Functions.",
    ],
    tags: ["React", "TypeScript", "Supabase", "Tailwind CSS", "Vitest"],
    uses: ["PostgreSQL", "Edge Functions", "HTML", "CSS", "Git e GitHub", "Desenvolvimento com IA"], // tecnologias de bastidor (ligam competências a projetos)
    repo: "https://github.com/jhonneweslley19-hub/APP-CALCULADORANUTRI",
    demo: "", // URL do app no ar, quando quiser divulgar
  },
  {
    slug: "saas-perfumaria",
    visual: "pos",
    title: "SaaS de Vendas · Perfumaria",
    summary:
      "Sistema web de vendas feito para uma perfumaria: ponto de venda, estoque, clientes, despesas e relatórios, no computador ou no celular.",
    problem:
      "Uma perfumaria de pequeno porte precisava sair do controle em cadernos e planilhas soltas e ter visão clara do que vende, do que entra e do que está acabando no estoque.",
    solution:
      "Um sistema com ponto de venda, estoque com leitor de código de barras pela câmera do celular, cadastro de clientes, despesas, dashboard com gráficos e relatórios em PDF, com uma API em Node.js no Firebase.",
    highlights: [
      "Ponto de venda com várias formas de pagamento, parcelas e cálculo de troco.",
      "Leitura de código de barras pela câmera e controle de estoque.",
      "Segurança na API: 2FA (TOTP), proteção contra força bruta, CSRF, limite de requisições e log de auditoria.",
      "55 testes automatizados com Jest e backup agendado do banco de dados.",
    ],
    tags: ["JavaScript", "Node.js", "Express", "Firebase", "Jest"],
    uses: ["HTML", "CSS", "PWA", "Git e GitHub", "Desenvolvimento com IA"],
    repo: "https://github.com/jhonneweslley19-hub/MIni-Saas-de-venda",
    demo: "",
  },
  {
    slug: "portfolio",
    visual: "terminal",
    title: "Este portfólio",
    summary:
      "Site pessoal feito sem frameworks, com foco em desempenho, acessibilidade e automação.",
    problem:
      "Reunir projetos, formação e contato num lugar só, rápido e acessível, que também servisse de exemplo de como eu escrevo código.",
    solution:
      "Um site em JavaScript puro, sem frameworks, com todo o conteúdo em um arquivo de dados, testes automatizados, auditoria de qualidade e publicação contínua.",
    highlights: [
      "JavaScript moderno com ES Modules e conteúdo centralizado em um único arquivo de dados.",
      "Testes de ponta a ponta com Playwright e auditoria Lighthouse a cada push.",
      "Funciona offline (PWA), tem busca rápida com Ctrl+K e um terminal interativo.",
    ],
    tags: ["JavaScript", "CSS", "Playwright", "GitHub Actions"],
    uses: ["HTML", "Acessibilidade", "PWA", "Git e GitHub", "Desenvolvimento com IA"],
    repo: "https://github.com/jhonneweslley19-hub/PORTIFOLIO",
    demo: "",
  },
];

/** Competências, agrupadas. `learning` = o que você está estudando agora. */
export const skills = [
  { group: "Linguagens", items: ["JavaScript", "TypeScript", "HTML", "CSS"] },
  { group: "Front-end", items: ["React", "Tailwind CSS", "Acessibilidade", "PWA"] },
  { group: "Back-end e dados", items: ["Node.js", "Express", "Firebase", "Supabase", "PostgreSQL", "Edge Functions"] },
  { group: "Qualidade e ferramentas", items: ["Desenvolvimento com IA", "Git e GitHub", "GitHub Actions", "Vitest", "Playwright"] },
];
export const learning = ["Python", "PHP", "SQL", "Banco de dados", "Arquitetura de computadores"];

/** Formação acadêmica. */
export const education = {
  degree: "Bacharelado em Engenharia de Software",
  institution: "Estácio",
  period: "2026 – atual",
  current: "Cursando o 2º período",
};

/**
 * Grade curricular (conforme o histórico acadêmico).
 * status do período: "done" (concluído) | "current" (em andamento).
 */
export const curriculum = [
  {
    period: "2026.1",
    label: "1º período",
    status: "done",
    courses: [
      { code: "DGT0284", name: "Fundamentos de Redes de Computadores", hours: 80 },
      { code: "DGT0288", name: "Introdução à Segurança da Informação", hours: 80 },
      { code: "DGT2198", name: "Matemática e Lógica", hours: 80 },
      { code: "DGT3285", name: "Introdução à Programação de Computadores", hours: 80 },
      { code: "DGT3290", name: "Computação em Nuvem", hours: 80 },
      { code: "DGT5129", name: "Labvida em Engenharia de Software 1", hours: 10 },
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

/** Certificados e cursos. */
export const certificates = [
  // { title: "Nome do curso", issuer: "Plataforma", year: "2026", url: "" },
];
