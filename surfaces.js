(function () {
  const xa = document.getElementById("xa-stage");
  const xaUrl = document.getElementById("xa-url");
  document.querySelectorAll("[data-xatab]").forEach((b) => {
    b.addEventListener("click", () => {
      xa.dataset.view = b.dataset.xatab;
      document.querySelectorAll("[data-xatab]").forEach((x) => x.classList.toggle("on", x === b));
      if (xaUrl) xaUrl.textContent = "xassets / " + b.dataset.xatab;
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
  const sz = document.getElementById("xa-sz");
  const notional = document.getElementById("xa-not");
  const openBtn = document.getElementById("xa-open");
  const line = document.getElementById("xa-line");
  const area = document.getElementById("xa-area");
  const px = 182.4;
  function side() {
    return document.querySelector("#xa-side .on").dataset.side !== "short";
  }
  function levui() {
    const l = Number(lev.value);
    const long = side();
    levn.textContent = l;
    const lp = long ? px * (1 - 0.9 / l) : px * (1 + 0.9 / l);
    liqpx.textContent = lp.toFixed(2);
    const y = String(long ? 110 - 12 - l * 6 : 18 + l * 6);
    liq.setAttribute("y1", y);
    liq.setAttribute("y2", y);
    notional.textContent = ((Number(sz.value) || 0) * l).toFixed(0);
    openBtn.textContent = "Open " + (long ? "long" : "short") + " (preview)";
    openBtn.classList.toggle("short", !long);
    const stroke = long ? "#2ee6a6" : "#ff5a6a";
    line.setAttribute("stroke", stroke);
    area.setAttribute("fill", long ? "url(#xa-fill)" : "#ff5a6a22");
  }
  lev.addEventListener("input", levui);
  sz.addEventListener("input", levui);
  document.getElementById("xa-side").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    document.querySelectorAll("#xa-side button").forEach((x) => x.classList.toggle("on", x === b));
    levui();
  });
  levui();
  openBtn.addEventListener("click", () => {
    document.getElementById("xa-pnl").textContent = "preview, not a fill";
  });

  const pho = document.getElementById("pho-stage");
  const phoUrl = document.getElementById("pho-url");
  document.querySelectorAll("[data-pho]").forEach((b) => {
    b.addEventListener("click", () => {
      pho.dataset.view = b.dataset.pho;
      pho.querySelectorAll(".pho-bar [data-pho]").forEach((x) =>
        x.classList.toggle("on", x.dataset.pho === b.dataset.pho)
      );
      if (phoUrl) phoUrl.textContent = "pholend / " + b.dataset.pho;
    });
  });

  const hs = document.getElementById("h-stage");
  const hUrl = document.getElementById("h-url");
  document.querySelectorAll("[data-h]").forEach((b) => {
    b.addEventListener("click", () => {
      hs.dataset.view = b.dataset.h;
      if (hUrl) hUrl.textContent = "helios / " + (b.dataset.h === "send" ? "send" : "popup");
    });
  });
  document.getElementById("h-send").addEventListener("click", () => {
    document.getElementById("h-note").textContent = "Preview. Not a TRON transaction.";
  });
})();
