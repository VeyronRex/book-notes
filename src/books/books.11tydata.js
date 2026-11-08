// Applies to everything inside src/books, so notes need no extra headers.
const pretty = (s) =>
  s
    .replace(/^\d+[-_. ]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default {
  eleventyComputed: {
    // Title from the header if there is one, otherwise from the file name
    displayTitle: (d) => d.title || pretty(d.page.fileSlug),
    // "07-something.md" -> 7
    chapterNo: (d) => {
      const m = d.page.fileSlug.match(/^(\d+)/);
      return m ? Number(m[1]) : undefined;
    },
    // index.md is the book page, every other file is a chapter
    layout: (d) =>
      d.page.inputPath.endsWith("/index.md") ? "book.njk" : "chapter.njk",
  },
};
