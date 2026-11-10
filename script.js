/* =========================================================
   Claudia Pessoa | Corretora de Imóveis
   Para trocar contatos ou imóveis, edite apenas a área CONFIG.
   ========================================================= */

/* ---------- CONFIG ---------- */
const CONFIG = {
  whatsapp: "5583998162630",            // DDI + DDD + número
  instagram: "claudiapessoacorretora"
};

/* Imóveis de demonstração. Troque por imóveis reais:
   - image: caminho da foto (ex.: "assets/imoveis/manaira-1.jpg"). Se vazio, aparece uma ilustração.
   - demo: true mostra a etiqueta "Exemplo". Use false nos imóveis reais.
   - price: texto livre (ex.: "R$ 850.000"). */
const PROPERTIES = [
  { id: "ex-01", name: "Apartamento frente mar", type: "Apartamento", fin: "comprar", bairro: "Cabo Branco", city: "João Pessoa", beds: 3, suites: 2, baths: 3, parking: 2, area: "—", price: "Sob consulta", image: "", demo: true },
  { id: "ex-02", name: "Casa em condomínio", type: "Casa", fin: "comprar", bairro: "Bessa", city: "João Pessoa", beds: 4, suites: 3, baths: 4, parking: 3, area: "—", price: "Sob consulta", image: "", demo: true },
  { id: "ex-03", name: "Apartamento compacto", type: "Apartamento", fin: "alugar", bairro: "Manaíra", city: "João Pessoa", beds: 2, suites: 1, baths: 2, parking: 1, area: "—", price: "Sob consulta", image: "", demo: true },
  { id: "ex-04", name: "Terreno em condomínio", type: "Terreno", fin: "comprar", bairro: "Altiplano", city: "João Pessoa", beds: 0, suites: 0, baths: 0, parking: 0, area: "—", price: "Sob consulta", image: "", demo: true },
  { id: "ex-05", name: "Sala comercial", type: "Comercial", fin: "alugar", bairro: "Tambaú", city: "João Pessoa", beds: 0, suites: 0, baths: 1, parking: 1, area: "—", price: "Sob consulta", image: "", demo: true },
  { id: "ex-06", name: "Cobertura duplex", type: "Apartamento", fin: "comprar", bairro: "Manaíra", city: "João Pessoa", beds: 4, suites: 4, baths: 5, parking: 3, area: "—", price: "Sob consulta", image: "", demo: true }
];

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

/* ---------- WhatsApp em todos os botões ---------- */
function bindWhatsApp(root = document) {
  $$(".js-wa", root).forEach(a => {
    a.href = waLink(a.dataset.msg || "Olá! Gostaria de conhecer os imóveis disponíveis.");
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ---------- ABERTURA: só foto e nome, depois as informações ---------- */
const portrait = $("#portrait");

function centerPortrait() {
  // desloca o retrato para o centro da tela (FLIP): ele só "vai para o lugar" quando o texto surge
  portrait.style.transition = "none";
  portrait.style.transform = "none";
  const r = portrait.getBoundingClientRect();
  const dx = innerWidth / 2 - (r.left + r.width / 2);
  const dy = innerHeight / 2 - (r.top + r.height / 2);
  portrait.style.transform = `translate(${dx}px, ${dy}px)`;
  void portrait.offsetWidth;
  portrait.style.transition = "";
}

function finishIntro() {
  document.body.classList.remove("is-intro");
  document.body.classList.add("ready");
  portrait.style.transform = "";
  portrait.style.transition = "";
  initParallax();
}

function runIntro() {
  const b = document.body;
  if (reduce) {
    b.classList.add("s-photo", "s-name", "s-text");
    finishIntro();
    return;
  }
  const go = () => {
    centerPortrait();
    setTimeout(() => b.classList.add("s-photo"), 200);   // 1) aparece a foto
    setTimeout(() => b.classList.add("s-name"), 1500);   // 2) aparece o nome
    setTimeout(() => {                                    // 3) foto vai ao lugar e o resto surge
      portrait.style.transform = "translate(0,0)";
      b.classList.add("s-text");
    }, 3600);
    setTimeout(finishIntro, 6400);                        // 4) libera o site
  };
  const img = $("img", portrait);
  if (img.complete) go(); else { img.addEventListener("load", go, { once: true }); img.addEventListener("error", go, { once: true }); }
  addEventListener("resize", () => { if (b.classList.contains("is-intro") && !b.classList.contains("s-text")) centerPortrait(); });
}

/* parallax suave do retrato conforme o cursor */
function initParallax() {
  if (reduce || matchMedia("(hover:none)").matches) return;
  const frame = $(".portrait-frame");
  addEventListener("mousemove", e => {
    const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
    frame.style.transform = `translate3d(${x * 16}px, ${y * 10}px, 0) rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
    $$(".orb").forEach((o, i) => o.style.translate = `${x * (i ? -40 : 40)}px ${y * (i ? -30 : 30)}px`);
  }, { passive: true });
}

/* ---------- Rolagem: barra, nav, revelações ---------- */
function initScroll() {
  const bar = $(".progress"), nav = $("#nav");
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    nav.classList.toggle("scrolled", scrollY > 40);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // atraso em cascata dentro de grupos
  ["feature-list", "cards3", "steps"].forEach(c => {
    $$("." + c + " .reveal").forEach((el, i) => el.style.setProperty("--d", (i * 0.12) + "s"));
  });
  $$(".about-copy .reveal, .sell .wrap > div .reveal").forEach((el, i) => el.style.setProperty("--d", (i * 0.08) + "s"));

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: .15, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(el => io.observe(el));
}

/* ---------- Tilt 3D nos cards ---------- */
function bindTilt(root = document) {
  if (reduce || matchMedia("(hover:none)").matches) return;
  $$("[data-tilt], .prop", root).forEach(el => {
    if (el._tilt) return; el._tilt = true;
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `perspective(900px) rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg) translateZ(0)`;
      el.style.setProperty("--mx", x * 100 + "%"); el.style.setProperty("--my", y * 100 + "%");
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

/* botões magnéticos */
function bindMagnetic() {
  if (reduce || matchMedia("(hover:none)").matches) return;
  $$(".magnetic").forEach(b => {
    b.addEventListener("mousemove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
    });
    b.addEventListener("mouseleave", () => b.style.transform = "");
  });
}

/* brilho que segue o cursor */
function initGlow() {
  const g = $(".cursor-glow");
  addEventListener("mousemove", e => { g.style.left = e.clientX + "px"; g.style.top = e.clientY + "px"; }, { passive: true });
}

/* ---------- Vitrine ---------- */
function houseSVG(seed) {
  // ilustração arquitetônica simples (substituída pela foto quando image estiver preenchido)
  const v = seed % 3;
  const bodies = [
    `<rect x="60" y="120" width="130" height="80" fill="#15151a" stroke="#d8b878" stroke-opacity=".5"/><rect x="190" y="95" width="110" height="105" fill="#101014" stroke="#d8b878" stroke-opacity=".5"/><rect x="80" y="140" width="40" height="26" fill="#d8b878" fill-opacity=".35"/><rect x="140" y="140" width="34" height="26" fill="#d8b878" fill-opacity=".2"/><rect x="210" y="112" width="30" height="34" fill="#d8b878" fill-opacity=".3"/><rect x="255" y="112" width="30" height="34" fill="#d8b878" fill-opacity=".18"/><rect x="50" y="112" width="150" height="8" fill="#d8b878" fill-opacity=".6"/>`,
    `<rect x="90" y="60" width="140" height="140" fill="#111115" stroke="#d8b878" stroke-opacity=".5"/>${[0,1,2,3].map(r => `<rect x="106" y="${74 + r * 32}" width="26" height="18" fill="#d8b878" fill-opacity="${.15 + (r % 2) * .2}"/><rect x="146" y="${74 + r * 32}" width="26" height="18" fill="#d8b878" fill-opacity="${.3 - (r % 2) * .15}"/><rect x="186" y="${74 + r * 32}" width="26" height="18" fill="#d8b878" fill-opacity="${.12 + (r % 3) * .1}"/>`).join("")}<rect x="80" y="52" width="160" height="8" fill="#d8b878" fill-opacity=".6"/>`,
    `<polygon points="70,130 160,78 250,130" fill="#14141a" stroke="#d8b878" stroke-opacity=".5"/><rect x="85" y="130" width="150" height="70" fill="#101014" stroke="#d8b878" stroke-opacity=".5"/><rect x="108" y="146" width="36" height="54" fill="#d8b878" fill-opacity=".3"/><rect x="170" y="146" width="44" height="30" fill="#d8b878" fill-opacity=".22"/>`
  ];
  return `<svg viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração de imóvel"><defs><linearGradient id="g${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1710"/><stop offset="1" stop-color="#070707"/></linearGradient></defs><rect width="360" height="240" fill="url(#g${seed})"/><circle cx="290" cy="50" r="22" fill="#d8b878" fill-opacity=".18"/><line x1="0" y1="200" x2="360" y2="200" stroke="#d8b878" stroke-opacity=".35"/>${bodies[v]}</svg>`;
}

const specs = p => {
  const out = [];
  if (p.beds) out.push(`<span><b>${p.beds}</b> quartos</span>`);
  if (p.suites) out.push(`<span><b>${p.suites}</b> suítes</span>`);
  if (p.baths) out.push(`<span><b>${p.baths}</b> banheiros</span>`);
  if (p.parking) out.push(`<span><b>${p.parking}</b> vagas</span>`);
  if (p.area && p.area !== "—") out.push(`<span><b>${p.area}</b></span>`);
  return out.join("") || `<span>Consulte as características</span>`;
};

function renderProps(list) {
  const box = $("#props");
  box.innerHTML = list.map((p, i) => `
    <article class="prop" style="--d:${i * 0.08}s">
      <div class="prop-img">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : houseSVG(i)}
        ${p.demo ? `<span class="badge">Exemplo</span>` : ""}
      </div>
      <div class="prop-body">
        <span class="prop-type">${p.type} · ${p.fin === "alugar" ? "Alugar" : "Comprar"}</span>
        <h3>${p.name}</h3>
        <p class="prop-loc">${p.bairro}, ${p.city}</p>
        <div class="prop-specs">${specs(p)}</div>
        <p class="prop-price">${p.price}</p>
        <div class="prop-actions">
          <a href="#contato" class="btn btn-sm">Ver detalhes</a>
          <a href="#" class="btn btn-gold btn-sm js-wa" data-msg="Olá! Tenho interesse neste imóvel: ${p.name} (${p.bairro}) [${p.id}].">WhatsApp</a>
        </div>
      </div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
  bindWhatsApp(box);
  bindTilt(box);
}

function initShowcase() {
  const bairros = [...new Set(PROPERTIES.map(p => p.bairro))].sort();
  $("#bairroSel").insertAdjacentHTML("beforeend", bairros.map(b => `<option>${b}</option>`).join(""));
  const form = $("#searchForm");
  const apply = () => {
    const f = new FormData(form);
    const list = PROPERTIES.filter(p =>
      p.fin === f.get("fin") &&
      (!f.get("tipo") || p.type === f.get("tipo")) &&
      (!f.get("bairro") || p.bairro === f.get("bairro")) &&
      p.beds >= Number(f.get("quartos") || 0));
    renderProps(list);
  };
  form.addEventListener("submit", e => { e.preventDefault(); apply(); $("#props").scrollIntoView({ behavior: "smooth", block: "center" }); });
  form.addEventListener("change", apply);
  apply();
}

/* ---------- Formulário de anúncio → WhatsApp ---------- */
function initSellForm() {
  $("#sellForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const msg = [
      "Olá! Gostaria de anunciar meu imóvel.",
      `Nome: ${f.get("nome")}`,
      `Telefone: ${f.get("tel")}`,
      `Tipo: ${f.get("tipo")}`,
      `Local: ${f.get("local")}`,
      f.get("valor") ? `Valor desejado: ${f.get("valor")}` : "",
      f.get("msg") ? `Mensagem: ${f.get("msg")}` : ""
    ].filter(Boolean).join("\n");
    window.open(waLink(msg), "_blank", "noopener");
  });
}

/* ---------- Início ---------- */
$("#year").textContent = new Date().getFullYear();
bindWhatsApp();
initShowcase();
initSellForm();
initScroll();
bindTilt();
bindMagnetic();
initGlow();
runIntro();
