// Dark mode switch. The choice is remembered in this browser.
(() => {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => btn.setAttribute("aria-pressed", String(root.dataset.theme === "dark"));
  btn.addEventListener("click", () => {
    const dark = root.dataset.theme !== "dark";
    if (dark) root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try { localStorage.setItem("theme", dark ? "dark" : "aurora"); } catch (e) {}
    sync();
  });
  sync();
})();
