/**
 * Formulário de contato sem servidor: monta um e-mail com assunto e mensagem
 * e abre o aplicativo de e-mail do visitante. O rascunho fica salvo só no
 * navegador de quem está escrevendo, para não se perder ao recarregar.
 */
const DRAFT_KEY = "contato-rascunho";

export function initComposer(form, email) {
  if (!form) return;
  const msg = form.elements.mensagem;
  const counter = form.querySelector(".counter");

  const save = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        nome: form.elements.nome.value, assunto: form.elements.assunto.value, mensagem: msg.value,
      }));
    } catch {}
  };
  const count = () => { counter.textContent = `${msg.value.length} / ${msg.maxLength}`; };

  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    if (draft) {
      form.elements.nome.value = draft.nome ?? "";
      msg.value = draft.mensagem ?? "";
      const radio = [...form.elements.assunto].find((r) => r.value === draft.assunto);
      if (radio) radio.checked = true;
    }
  } catch {}
  count();

  form.addEventListener("input", () => { count(); save(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.elements.nome.value.trim();
    const subject = [form.elements.assunto.value, nome].filter(Boolean).join(" — ");
    const body = [msg.value.trim(), nome && `\n${nome}`].filter(Boolean).join("\n");
    location.href = mailto(email, subject, body);
  });
}

/** Monta um link mailto com assunto e corpo codificados. */
const mailto = (email, subject = "", body = "") =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
