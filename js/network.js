/**
 * Rede de nós animada em <canvas> — reage ao cursor.
 * Pausa quando sai da tela e respeita prefers-reduced-motion.
 */
export function startNetwork(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouse = { x: -1e4, y: -1e4 };
  const LINK = 130;
  let w, h, nodes = [], raf;

  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.round((w * h) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
    if (reduce) draw();
  }

  function draw() {
    const accent = css("--accent") || "#7c6cff";
    const accent2 = css("--accent-2") || "#22d3ee";
    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      if (!reduce) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        // repulsão suave do cursor
        const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { n.x += (dx / d) * 1.2; n.y += (dy / d) * 1.2; }
      }
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.globalAlpha = (1 - d / LINK) * 0.35;
          ctx.strokeStyle = accent;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const md = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
      if (md < 180) {
        ctx.globalAlpha = (1 - md / 180) * 0.6;
        ctx.strokeStyle = accent2;
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = accent2;
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  const loop = () => { draw(); raf = requestAnimationFrame(loop); };

  new ResizeObserver(resize).observe(canvas);
  const host = canvas.parentElement;
  host.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  host.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; });

  if (reduce) return;
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(loop);
  }).observe(canvas);
}

/** Efeito de digitação alternando frases. */
export function startTyping(el, phrases) {
  if (!el || !phrases?.length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = phrases[0]; return; }
  let p = 0, i = 0, deleting = false;
  (function tick() {
    const word = phrases[p];
    i += deleting ? -1 : 1;
    el.textContent = word.slice(0, i);
    let delay = deleting ? 35 : 70;
    if (!deleting && i === word.length) { deleting = true; delay = 1800; }
    else if (deleting && i === 0) { deleting = false; p = (p + 1) % phrases.length; delay = 350; }
    setTimeout(tick, delay);
  })();
}
