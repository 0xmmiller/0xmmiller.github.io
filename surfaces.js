(function () {
  const xa = document.getElementById("xa-stage");
  document.querySelectorAll("[data-xatab]").forEach((b) => {
    b.addEventListener("click", () => {
      xa.dataset.view = b.dataset.xatab;
      document.querySelectorAll("[data-xatab]").forEach((x) => x.classList.toggle("on", x === b));
    });
  });
  const collat = document.getElementById("xa-col");
  const mint = document.getElementById("xa-mint");
  const hf = document.getElementById("xa-hf");
  const go = document.getElementById("xa-go");
  function health() {
    const c = Number(collat.value) || 0;
    const m = Number(mint.value) || 0;
    const v = m === 0 ? 5 : (c * 0.8) / m;
    hf.textContent = v.toFixed(2);
    hf.parentElement.classList.toggle("warn", v < 2 && v >= 1.2);
    hf.parentElement.classList.toggle("bad", v < 1.2);
    go.disabled = m <= 0 || c <= 0;
  }
  collat.addEventListener("input", health);
  mint.addEventListener("input", health);
  health();

  const lev = document.getElementById("xa-lev");
  const levn = document.getElementById("xa-levn");
  const liqpx = document.getElementById("xa-liqpx");
  const liq = document.getElementById("xa-liq");
  const px = 182.4;
  function levui() {
    const l = Number(lev.value);
    levn.textContent = l;
    const long = document.querySelector('#xa-side .on').dataset.side !== "short";
    const lp = long ? px * (1 - 0.9 / l) : px * (1 + 0.9 / l);
    liqpx.textContent = lp.toFixed(2);
    liq.setAttribute("y1", String(90 - l * 6));
    liq.setAttribute("y2", String(90 - l * 6));
  }
  lev.addEventListener("input", levui);
  document.getElementById("xa-side").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    document.querySelectorAll("#xa-side button").forEach((x) => x.classList.toggle("on", x === b));
    document.getElementById("xa-line").setAttribute("stroke", b.dataset.side === "short" ? "#ff5a6a" : "#2ee6a6");
    levui();
  });
  levui();
  document.getElementById("xa-open").addEventListener("click", () => {
    document.getElementById("xa-pnl").textContent = "preview, not a fill";
  });

  const pho = document.getElementById("pho-stage");
  document.querySelectorAll("[data-pho]").forEach((b) => {
    b.addEventListener("click", () => {
      pho.dataset.view = b.dataset.pho;
      pho.querySelectorAll(".pho-bar [data-pho]").forEach((x) => x.classList.toggle("on", x.dataset.pho === b.dataset.pho));
    });
  });

  const hs = document.getElementById("h-stage");
  document.querySelectorAll("[data-h]").forEach((b) => {
    b.addEventListener("click", () => {
      hs.dataset.view = b.dataset.h;
    });
  });
  document.getElementById("h-send").addEventListener("click", () => {
    document.getElementById("h-note").textContent = "Preview. Not a TRON transaction.";
  });
})();
