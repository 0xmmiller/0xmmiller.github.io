const CASES = [
  {
    id: "xswap",
    title: "xSwap",
    kind: "live product",
    blurb: "AMM, pools, farm. Reconstruction of the live surface, on one page.",
    slo: [
      { k: "surface", v: "live" },
      { k: "host", v: "xswap.ms" },
    ],
  },
  {
    id: "atlas",
    title: "Atlas",
    kind: "asset operations",
    blurb: "Idempotent intents, outbox, indexer as the only canonical chain reader. Operator board shows lag and degrade, not a marketing dashboard.",
    page: "atlas.html",
    slo: [
      { k: "portfolio p95", v: "< 50ms" },
      { k: "indexer lag", v: "< 12s" },
      { k: "availability", v: "99.9%" },
    ],
  },
  {
    id: "rag",
    title: "AgentKit + RagKit",
    kind: "retrieval with citations",
    blurb: "RAG is a tool that returns paths. Chain state stays on portfolio tools. If it cannot cite, it does not answer.",
    page: "rag.html",
    slo: [
      { k: "citation", v: "path + score" },
      { k: "corpus", v: "owned docs" },
      { k: "chain facts", v: "not in index" },
    ],
  },
  {
    id: "chain",
    title: "ChainKit / PyScale",
    kind: "reorgs + measured Python",
    blurb: "Indexer owns fork choice. Portfolio detaches and replays. Latency numbers come from PyScale on a named machine, not folklore.",
    page: "chain.html",
    slo: [
      { k: "async p95", v: "6.4ms" },
      { k: "sync p95", v: "10.1ms" },
      { k: "singleflight", v: "1 backend call" },
    ],
  },
];

const CSS = `
:host { display: block; font-family: "IBM Plex Sans", "Segoe UI", ui-sans-serif, sans-serif; color: #1b1814; }
* { box-sizing: border-box; }
.grid { display: grid; gap: 1.1rem; }
.card {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 1rem;
  padding: 0.9rem 0 1.15rem;
  border-bottom: 1px solid #c9bfae;
  text-decoration: none;
  color: inherit;
}
.card:hover .title { text-decoration: underline; }
.screen {
  background: #e4dccf;
  border: 1px solid #1b1814;
  min-height: 132px;
  padding: 0.55rem 0.6rem;
  font-family: ui-monospace, "IBM Plex Mono", monospace;
  font-size: 0.62rem;
  line-height: 1.25;
}
.screen .bar { display: flex; justify-content: space-between; color: #5c564c; margin-bottom: 0.4rem; }
.screen .row { display: flex; gap: 0.3rem; flex-wrap: wrap; margin-top: 0.35rem; }
.pill { border: 1px solid #1b1814; padding: 0.12rem 0.28rem; background: #efe8dc; }
.pill.warn { background: #1b1814; color: #efe8dc; }
.cite { border-left: 2px solid #0f4c5c; padding-left: 0.35rem; margin: 0.25rem 0; color: #0f4c5c; }
.blocks { display: flex; gap: 0.25rem; margin-top: 0.45rem; }
.blk { width: 1.35rem; height: 1.35rem; border: 1px solid #1b1814; background: #efe8dc; }
.blk.off { opacity: 0.3; text-decoration: line-through; }
.meta .kind { font-family: ui-monospace, monospace; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: #5c564c; }
.title { margin: 0.15rem 0 0.35rem; font-size: 1.12rem; font-weight: 600; }
.blurb { margin: 0; color: #5c564c; font-size: 0.9rem; }
.slo { display: flex; flex-wrap: wrap; gap: 0.7rem 1rem; margin-top: 0.7rem; font-family: ui-monospace, monospace; font-size: 0.72rem; }
.slo b { font-weight: 600; }
.note { margin: 0.8rem 0 0; font-size: 0.75rem; color: #5c564c; font-family: ui-monospace, monospace; }
@media (max-width: 720px) { .card { grid-template-columns: 1fr; } }
`;

function preview(id) {
  if (id === "xswap") {
    return `<div class="bar"><span>xSWAP</span><span>swap</span></div>
      <div>XFI to USDT, preview quote</div>
      <div class="row"><span class="pill">XFI</span><span class="pill">USDT</span></div>`;
  }
  if (id === "atlas") {
    return `<div class="bar"><span>operator</span><span>degraded: bus</span></div>
      <div>GET /v1/portfolio/0xab.. p95 41ms</div>
      <div class="row">
        <span class="pill">api</span><span class="pill">tx</span>
        <span class="pill warn">indexer 34s</span>
        <span class="pill">portfolio</span>
      </div>`;
  }
  if (id === "rag") {
    return `<div class="bar"><span>retrieve</span><span>k=3</span></div>
      <div>why Kafka, not a second broker?</div>
      <div class="cite">adr/001-message-broker.md  0.86</div>
      <div class="cite">docs/scaling.md  0.71</div>`;
  }
  return `<div class="bar"><span>head</span><span>reorg depth 3</span></div>
    <div>detach [n-2 .. n], replay canonical</div>
    <div class="blocks">
      <span class="blk"></span><span class="blk"></span><span class="blk"></span>
      <span class="blk off"></span><span class="blk off"></span>
    </div>`;
}

function card(c, home) {
  const href = home + "#" + c.id;
  const slo = c.slo.map((s) => `<span><b>${s.v}</b> ${s.k}</span>`).join("");
  return `<a class="card" href="${href}">
    <div class="screen">${preview(c.id)}</div>
    <div class="meta">
      <div class="kind">${c.kind}</div>
      <h3 class="title">${c.title}</h3>
      <p class="blurb">${c.blurb}</p>
      <div class="slo">${slo}</div>
    </div>
  </a>`;
}

class MillerWork extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    const home = new URL("../", import.meta.url).href;
    root.innerHTML = `<style>${CSS}</style>
      <div class="grid">${CASES.map((c) => card(c, home)).join("")}</div>
      ${this.hasAttribute("quiet") ? "" : `<p class="note">Lab reconstructions. Original operator surfaces, not employer product UI. SLOs are lab targets.</p>`}`;
  }
}

customElements.define("miller-work", MillerWork);
