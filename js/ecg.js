/**
 * Traçado estilizado de ECG em <canvas>, desenhado continuamente.
 * É uma ilustração decorativa (ritmo sinusal esquemático), não um sinal real.
 */
function beat(t) {
  // t ∈ [0,1): um ciclo — onda P, complexo QRS e onda T
  const g = (mu, sigma, amp) => amp * Math.exp(-((t - mu) ** 2) / (2 * sigma ** 2));
  return g(0.18, 0.025, 0.12)   // P
       + g(0.36, 0.008, -0.12)  // Q
       + g(0.38, 0.010, 1.0)    // R
       + g(0.40, 0.009, -0.25)  // S
       + g(0.62, 0.045, 0.28);  // T
}

export function startECG(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const period = 260; // px por batimento
  let w, h, dpr, x = 0, last = performance.now(), prev = null;

  const color = () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#38d9b4";

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    x = 0; prev = null;
    if (reduce) drawStatic();
  }

  const y = (px) => h * 0.62 - beat((px % period) / period) * h * 0.5;

  function drawStatic() {
    ctx.strokeStyle = color(); ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) px ? ctx.lineTo(px, y(px)) : ctx.moveTo(px, y(px));
    ctx.stroke();
  }

  function frame(now) {
    const dt = Math.min(now - last, 50); last = now;
    const speed = 0.22 * dt; // px/ms
    ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.strokeStyle = color();

    // "apaga" uma faixa à frente do traço, como num monitor
    ctx.clearRect(x, 0, 40, h);

    const nx = x + speed;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(x, prev ?? y(x));
    for (let px = x; px <= nx; px += 1) ctx.lineTo(px, y(px));
    ctx.stroke();
    prev = y(nx);
    x = nx;
    if (x > w) { x = 0; prev = null; }
    raf = requestAnimationFrame(frame);
  }

  let raf;
  new ResizeObserver(resize).observe(canvas);
  if (reduce) return;

  // Pausa quando o hero sai da tela (economia de bateria)
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }).observe(canvas);
}
