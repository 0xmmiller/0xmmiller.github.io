(function () {
  const stage = document.getElementById("xswap-stage");
  function xview(v) {
    stage.dataset.view = v;
    stage.querySelectorAll(".x-links [data-xview]").forEach((b) => b.classList.toggle("on", b.dataset.xview === v));
  }
  document.querySelectorAll("[data-xview]").forEach((b) => {
    b.addEventListener("click", () => xview(b.dataset.xview));
  });

  const rate = 0.42;
  const input = document.getElementById("x-in");
  const output = document.getElementById("x-out");
  const rateEl = document.getElementById("x-rate");
  const tok = document.getElementById("x-tok");
  const tok2 = document.getElementById("x-tok2");
  function quote() {
    const n = Number(String(input.value).replace(",", ".")) || 0;
    const a = tok.textContent;
    const b = tok2.textContent;
    const r = a === "XFI" ? rate : 1 / rate;
    output.value = (n * r).toFixed(4);
    rateEl.textContent = "preview quote 1 " + a + " = " + r.toFixed(2) + " " + b + ", not a feed";
  }
  input.addEventListener("input", quote);
  document.getElementById("x-flip").addEventListener("click", () => {
    const a = tok.textContent;
    tok.textContent = tok2.textContent;
    tok2.textContent = a;
    input.value = output.value;
    quote();
  });

  const acopy = {
    healthy: ["healthy", "p95 41ms, lag 4s", "All routes fresh. as_of_block matches indexer head.", []],
    rpc: ["degraded: rpc", "p95 44ms, lag 34s", "Indexer paused. No synthetic blocks.", ["idx"]],
    bus: ["degraded: bus", "p95 39ms, lag n/a", "Intent create returns 202. Header X-Atlas-Degraded: bus.", ["bus", "nt"]],
    intent: ["healthy", "p95 47ms, lag 4s", "POST /v1/intents -> outbox -> bus -> portfolio.", ["api", "tx", "bus", "port"]],
  };
  const aHdr = document.getElementById("a-hdr");
  const aSlo = document.getElementById("a-slo");
  const aLog = document.getElementById("a-log");
  document.getElementById("a-ops").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const [h, s, msg, hot] = acopy[b.dataset.mode];
    aHdr.textContent = h;
    aSlo.textContent = s;
    aLog.textContent = msg;
    document.querySelectorAll("#a-graph .node").forEach((n) => n.classList.toggle("hot", hot.includes(n.dataset.n)));
    document.querySelectorAll("#a-ops button").forEach((x) => x.classList.toggle("on", x === b));
  });

  const rdata = {
    kafka: {
      h: "corpus: architecture/",
      l: "Answer allowed. Owned ADRs.",
      rows: [
        ["adr/001-message-broker.md", "0.86", "Redpanda for the lab."],
        ["docs/scaling.md", "0.71", "Scale partitions on atlas.chain.log."],
      ],
    },
    reorg: {
      h: "corpus: architecture/",
      l: "Indexer is the only canonical reader.",
      rows: [
        ["adr/006-reorg-handling.md", "0.91", "Emit atlas.chain.reorg. Detach by block."],
        ["docs/failure-scenarios.md", "0.77", "Do not smooth balances."],
      ],
    },
    balance: { h: "retrieve skipped", l: "Chain state. Call get_portfolio.", rows: [] },
  };
  const rHits = document.getElementById("r-hits");
  const rLog = document.getElementById("r-log");
  const rHdr = document.getElementById("r-hdr");
  function rpaint(q) {
    const d = rdata[q];
    rHdr.textContent = d.h;
    rLog.textContent = d.l;
    rHits.innerHTML = d.rows.length
      ? d.rows.map(([p, s, t]) => "<div class=\"hit\"><code>" + p + "</code> " + s + "<div>" + t + "</div></div>").join("")
      : "<div class=\"hit\">tool: get_portfolio(address)</div>";
    document.querySelectorAll("#r-ops button").forEach((b) => b.classList.toggle("on", b.dataset.q === q));
  }
  document.getElementById("r-ops").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) rpaint(b.dataset.q);
  });
  rpaint("kafka");

  const cEl = document.getElementById("c-chain");
  const cLog = document.getElementById("c-log");
  const cHdr = document.getElementById("c-hdr");
  const cSlo = document.getElementById("c-slo");
  const cstates = {
    canon: {
      h: "canonical head n", s: "as_of_block n",
      m: "Head matches parent hashes.",
      b: [["n-4", "a1"], ["n-3", "b2"], ["n-2", "c3"], ["n-1", "d4"], ["n", "e5"]],
      c: ["", "", "", "", ""],
    },
    reorg: {
      h: "reorg: parent mismatch at n-2", s: "as_of_block n-3",
      m: "Detach [n-2 .. n]. Do not smooth.",
      b: [["n-4", "a1"], ["n-3", "b2"], ["n-2", "c3"], ["n-1", "d4"], ["n", "e5"]],
      c: ["", "", "dead", "dead", "dead"],
    },
    replay: {
      h: "replay canonical fork", s: "as_of_block n'",
      m: "Re-emit from ancestor. New hashes.",
      b: [["n-4", "a1"], ["n-3", "b2"], ["n-2", "f8"], ["n-1", "g9"], ["n'", "h0"]],
      c: ["", "", "new", "new", "new"],
    },
  };
  function cpaint(mode) {
    const d = cstates[mode];
    cHdr.textContent = d.h;
    cSlo.textContent = d.s;
    cLog.textContent = d.m;
    cEl.innerHTML = d.b.map((pair, i) => "<div class=\"block " + d.c[i] + "\">" + pair[0] + "<br>" + pair[1] + "</div>").join("");
    document.querySelectorAll("#c-ops button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
  }
  document.getElementById("c-ops").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) cpaint(b.dataset.mode);
  });
  cpaint("canon");
})();
