# Book Notes

My reading notes, written in Markdown and published as a website with GitHub Pages.
Built with [Eleventy](https://www.11ty.dev/). The notes are plain files in `src/books`.

## Add a book

Create a folder in `src/books/` and put an `index.md` inside it:

    src/books/atomic-habits/index.md

```md
---
title: Atomic Habits
author: James Clear
tags: [self-help, productivity]
color: violet
---
Optional: overall thoughts about the book. This shows on the book page.
```

`color` can be: cyan, blue, violet, magenta, pink, orange, amber or green.

## Add a chapter

Add a Markdown file to the book's folder. Start the file name with the chapter number:

    src/books/atomic-habits/01-the-surprising-power.md

```md
---
title: The Surprising Power of Atomic Habits
---
Your notes go here, in plain Markdown.
```

- The header (`title`) is optional. Without it, the title comes from the file name.
- The number in the file name sets the order and the number badge. `07-...` shows 7, so you can skip chapters.
- Use headings (`##`, `###`) to split long notes. With three or more, an "On this page" list appears.

## See it on your computer

    npm install     (first time only)
    npm start

Open the address it prints, usually http://localhost:8080. It refreshes when you save a file.

## Publish it

First time only:

1. Create a new repository on GitHub. It has to be public, see "Good to know".
2. In this folder, run (use your own username and repository name):

       git init
       git add .
       git commit -m "Book notes site"
       git branch -M main
       git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
       git push -u origin main

   Or use VS Code: Source Control, then "Publish to GitHub".
3. On GitHub open Settings, then Pages, and under "Build and deployment" set Source to **GitHub Actions**.
4. Open the Actions tab. The first run may fail because Pages was not switched on yet when you pushed.
   If so, open that run and click "Re-run all jobs".

After about a minute the site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

From then on, every push updates the site by itself. You can also add or edit notes directly on github.com.

## Good to know

- **Public notes.** Free GitHub Pages only works with public repositories, so anyone with the link can read your notes.
- **Sample books.** Delete `src/books/sample-book` and `src/books/second-sample` when you start adding your own.
- **Links in notes.** Use full `https://` links. Don't start an internal link with `/`, because the site lives under `/YOUR-REPO/`.
- **Images** are not set up yet.
- **Custom domain.** Add `env: PATH_PREFIX: /` to the "Run npm run build" step in `.github/workflows/deploy.yml`.
- Dark mode is remembered in each browser.

## Where things are

    src/books/                      your notes, one folder per book
    src/_includes/                  page layouts: home, book, chapter
    src/css/style.css               the look: colors, fonts, dark mode
    src/js/                         search and filter, dark mode switch, "On this page" list
    eleventy.config.js              site settings
    .github/workflows/deploy.yml    publishes the site when you push
