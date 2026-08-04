# AGENTS.md

## Cursor Cloud specific instructions

This repository is a **static website** (plain HTML/CSS/JS) for the "Misie Empatisie" preschool, deployed via GitHub Pages (see `CNAME` → `misie-empatisie.pl`). There is no build system, package manager, dependencies, tests, or lint config.

- Source of truth: `index.html` (page content + inline JSON-LD SEO schema), `assets/css/styles.css`, `assets/js/main.js`, and images in `assets/img/`.
- External libraries (boxicons, ScrollReveal) are loaded from CDNs at runtime, so an internet connection is needed for full styling/animations in the browser.

### Run (development)

Serve the repo root with any static file server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. There is no hot reload — refresh the browser after editing files.

### Lint / Test / Build

None exist. There is nothing to build; editing files and refreshing the browser is the full dev loop. If validating the inline JSON-LD, parse the `<script type="application/ld+json">` block in `index.html` as JSON.
