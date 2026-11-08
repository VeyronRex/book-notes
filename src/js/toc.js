// "On this page" list for a chapter, built from its own headings.
(() => {
  const rail = document.getElementById("toc-rail");
  const article = document.querySelector(".prose");
  if (!rail || !article) return;
  const heads = [...article.querySelectorAll("h1, h2, h3")];
  if (heads.length < 3) return; // short notes don't need one

  // Give every heading an id (works for any language)
  const slug = (t) =>
    t.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
  const used = new Set();
  heads.forEach((h) => {
    if (!h.id) {
      const base = slug(h.textContent);
      let id = base;
      let n = 2;
      while (used.has(id) || document.getElementById(id)) id = `${base}-${n++}`;
      h.id = id;
    }
    used.add(h.id);
  });

  const toc = document.createElement("details");
  toc.className = "toc";
  const summary = document.createElement("summary");
  summary.textContent = "On this page";
  const list = document.createElement("ul");
  const links = heads.map((h) => {
    const a = document.createElement("a");
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    if (h.tagName === "H3") a.className = "sub";
    const li = document.createElement("li");
    li.append(a);
    list.append(li);
    return a;
  });
  toc.append(summary, list);
  rail.append(toc);
  rail.hidden = false;

  // Open beside the notes on wide screens, collapsed on phones
  const wide = matchMedia("(min-width: 80rem)");
  const sync = () => { toc.open = wide.matches; };
  wide.addEventListener("change", sync);
  sync();

  // Highlight the section being read
  let ticking = false;
  const mark = () => {
    ticking = false;
    let current = 0;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top <= 120) current = i; });
    links.forEach((a, i) =>
      i === current ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")
    );
  };
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(mark); }
  }, { passive: true });
  mark();
})();
