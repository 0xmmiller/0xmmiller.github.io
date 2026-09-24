(function () {
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
  document.getElementById("xa-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    document.querySelectorAll("#xa-tabs button").forEach((x) => x.classList.toggle("on", x === b));
    go.textContent = b.dataset.tab === "repay" ? "Repay (preview)" : b.dataset.tab === "edit" ? "Edit (preview)" : "Mint (preview)";
  });

  const kpis = document.getElementById("ph-borrowed");
  document.getElementById("ph-table").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    document.getElementById("ph-note").textContent =
      b.dataset.act + " " + b.dataset.asset + " is a preview. No chain call.";
    if (b.dataset.act === "Borrow") kpis.textContent = "$1,200";
    if (b.dataset.act === "Supply") document.getElementById("ph-supplied").textContent = "$8,400";
  });

  const amt = document.getElementById("h-amt");
  const note = document.getElementById("h-note");
  document.getElementById("h-pad").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.k === "del") amt.textContent = amt.textContent.slice(0, -1) || "0";
    else if (amt.textContent === "0") amt.textContent = b.dataset.k;
    else amt.textContent += b.dataset.k;
  });
  document.getElementById("h-send").addEventListener("click", () => {
    note.textContent = "Hold-to-send preview. Not a TRON transaction.";
  });
})();
