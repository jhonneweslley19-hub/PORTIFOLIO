export function initDeck(cards) {
  const root = document.querySelector("#flashcards");
  const card = root.querySelector(".flashcard");
  const count = root.querySelector(".deck-count");
  const filters = root.querySelector('[data-render="deck-filters"]');
  if (!cards.length) return root.remove();

  let filter = "Todas";
  let deck = [...cards];
  let i = 0;

  const disciplines = ["Todas", ...new Set(cards.map((c) => c.discipline))];
  filters.replaceChildren(...disciplines.map((d) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = d;
    b.setAttribute("aria-pressed", String(d === filter));
    b.onclick = () => {
      filter = d;
      deck = d === "Todas" ? [...cards] : cards.filter((c) => c.discipline === d);
      i = 0;
      filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      show();
    };
    return b;
  }));

  function show() {
    const c = deck[i];
    card.classList.remove("flipped");
    card.querySelectorAll(".tag").forEach((t) => (t.textContent = c.discipline));
    card.querySelector(".q").textContent = c.q;
    card.querySelector(".a").textContent = c.a;
    card.querySelector(".ref").textContent = c.ref ? `Fonte: ${c.ref}` : "";
    card.setAttribute("aria-label", `Pergunta: ${c.q}. Clique para ver a resposta.`);
    count.textContent = `${i + 1} / ${deck.length}`;
  }

  const flip = () => {
    const on = card.classList.toggle("flipped");
    card.setAttribute("aria-label", on ? `Resposta: ${deck[i].a}` : `Pergunta: ${deck[i].q}`);
  };
  const go = (d) => { i = (i + d + deck.length) % deck.length; show(); };
  const shuffle = () => {
    for (let k = deck.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [deck[k], deck[j]] = [deck[j], deck[k]];
    }
    i = 0; show();
  };

  card.addEventListener("click", flip);
  root.querySelector('[data-deck="prev"]').onclick = () => go(-1);
  root.querySelector('[data-deck="next"]').onclick = () => go(1);
  root.querySelector('[data-deck="shuffle"]').onclick = shuffle;

  // Atalhos de teclado enquanto a seção está visível
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.4 }).observe(root);
  addEventListener("keydown", (e) => {
    if (!visible || e.target.closest("input, textarea, dialog")) return;
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === " " && e.target !== card) { e.preventDefault(); flip(); }
  });

  // Gesto de deslizar no celular
  let sx = null;
  card.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  card.addEventListener("touchend", (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) { e.preventDefault(); go(dx < 0 ? 1 : -1); }
    sx = null;
  });

  show();
}
