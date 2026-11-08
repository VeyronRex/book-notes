// Order chapters by file name, so 1-, 2-, 10- sort the way you expect.
const byPath = (a, b) =>
  a.inputPath.localeCompare(b.inputPath, undefined, { numeric: true });
// "./src/books/<book>/<file>.md" -> "<book>"
const bookOf = (page) => page.inputPath.split("/").slice(-2)[0];
const decode = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, "&");

// On GitHub Pages a project site lives at /<repo-name>/, so every link needs that prefix.
// GitHub sets GITHUB_REPOSITORY while it builds, so this works itself out. On your own
// computer the prefix is "/". For a custom domain, set PATH_PREFIX to "/" in the workflow.
const repo = (process.env.GITHUB_REPOSITORY || "").split("/")[1];
const pathPrefix =
  process.env.PATH_PREFIX ||
  (process.env.GITHUB_ACTIONS && repo && !repo.endsWith(".github.io") ? `/${repo}/` : "/");

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // One entry per book: src/books/<book>/index.md
  eleventyConfig.addCollection("books", (api) =>
    api
      .getFilteredByGlob("src/books/*/index.md")
      .sort((a, b) => a.data.displayTitle.localeCompare(b.data.displayTitle))
  );

  // Every other .md file inside a book folder is a chapter
  eleventyConfig.addCollection("chapters", (api) =>
    api
      .getFilteredByGlob("src/books/*/*.md")
      .filter((p) => !p.inputPath.endsWith("/index.md"))
      .sort(byPath)
  );

  eleventyConfig.addFilter("chaptersOf", (list, book) =>
    list.filter((c) => bookOf(c) === book)
  );
  // The book a chapter belongs to
  eleventyConfig.addFilter("bookFor", (books, page) =>
    books.find((b) => bookOf(b) === bookOf(page))
  );
  // The chapters just before and after the current one
  eleventyConfig.addFilter("neighbors", (list, url) => {
    const i = list.findIndex((c) => c.url === url);
    return i < 0 ? {} : { prev: list[i - 1], next: list[i + 1] };
  });
  // First paragraph (or list item) of a chapter, as short plain text
  eleventyConfig.addFilter("excerpt", (page, max = 150) => {
    const m = (page.templateContent || "").match(/<(?:p|li)[^>]*>([\s\S]*?)<\/(?:p|li)>/);
    if (!m) return "";
    const text = decode(m[1].replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
    return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
  });

  return {
    pathPrefix,
    dir: { input: "src", output: "_site" },
    // Treat notes as plain Markdown, so {{ or {% in your notes never breaks the build
    markdownTemplateEngine: false,
  };
}
