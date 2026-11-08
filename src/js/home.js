// Home page: search box, tag filter and the live book count.
(() => {
  const search = document.getElementById("search");
  const tagBox = document.getElementById("tags");
  const total = document.getElementById("total");
  const empty = document.getElementById("empty");
  const cards = [...document.querySelectorAll(".card")];
  if (!search || !cards.length) return;

  const items = cards.map((el) => {
    const tags = [...el.querySelectorAll(".chip")].map((c) => c.textContent.trim());
    const text = [el.querySelector("h2").textContent, el.querySelector(".author").textContent, ...tags]
      .join(" ")
      .toLowerCase();
    return { el, tags: tags.map((t) => t.toLowerCase()), text };
  });

  // One button per tag, plus "All"
  const labels = new Map();
  cards.forEach((el) =>
    el.querySelectorAll(".chip").forEach((c) => {
      const label = c.textContent.trim();
      if (!labels.has(label.toLowerCase())) labels.set(label.toLowerCase(), label);
    })
  );
  const button = (label, key) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip chip-btn";
    b.textContent = label;
    b.dataset.tag = key;
    return b;
  };
  tagBox.append(
    button("All", ""),
    ...[...labels].sort(([a], [b]) => a.localeCompare(b)).map(([key, label]) => button(label, key))
  );

  let activeTag = "";
  const books = (n) => `${n} book${n === 1 ? "" : "s"}`;

  function apply() {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    items.forEach(({ el, tags, text }) => {
      const ok = (!activeTag || tags.includes(activeTag)) && words.every((w) => text.includes(w));
      el.hidden = !ok;
      if (ok) shown++;
    });
    tagBox.querySelectorAll("button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.tag === activeTag))
    );
    total.textContent = shown === items.length ? books(items.length) : `${shown} of ${books(items.length)}`;
    empty.hidden = shown !== 0;
  }

  search.addEventListener("input", apply);
  tagBox.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    activeTag = b.dataset.tag === activeTag ? "" : b.dataset.tag;
    apply();
  });
  apply();
})();
