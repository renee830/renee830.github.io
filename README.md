# Renée Ocaña — Portfolio 2026

Static website built from the Figma file `ReneeOcana_Portfolio2026`. Plain HTML, CSS and JavaScript with no build step.

## View it

Open `index.html` in a browser, or run a local server from this folder:

```
python3 -m http.server
```

Open **`styleguide.html`** to see the design system: every token and component, with live examples and code you can copy. It isn't linked from the site.

## Publish

Upload the whole folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Design system

```
assets/css/tokens.css      colours, type, spacing, radius, shadow, motion  ← change the look here
assets/css/base.css        reset, type classes (.h1–.h4, .lead, .body, .caption), .container, .reveal
assets/css/components.css  styles for each component
assets/css/pages.css       page layouts (how components are arranged on each page)
assets/js/components.js    the components: markup and behaviour
```

### Tokens

All values come from the Figma styles. Components only use the semantic tokens (`--surface-*`, `--text-*`, `--border-*`, `--action-*`), which point at the primitives (`--color-*`). To change the accent colour everywhere, edit `--color-orange` and `--color-orange-dark`. To change a single role, point that semantic token at a different primitive.

### Components

| Component | Use it for |
| --- | --- |
| `<site-nav current="…">` | Top navigation. Links are set once in `SITE.nav` in `components.js`. |
| `<site-footer>` | Footer. Text and links come from `SITE` in `components.js`. |
| `<case-card>` | Product design case study (`layout="reverse"` or `"secondary"`). |
| `<case-slider>` | Carousel of case cards (home page). |
| `<project-card>` | Visual design project with a hover description. |
| `<pill-list tags="…">` | Row of tags (`variant="outline"` for the tech stack). |
| `<logo-marquee>` | Auto-scrolling row of logos. |
| `<dot-shader>` | Interactive dot effect (RENÉE wordmark, About pill). |
| `<life-stack>` + `<life-moment>` | "Get to know me" statements and photo stack. |
| `.btn`, `.round-btn`, `.logo-r`, `.kpis` | CSS-only components. |

`styleguide.html` lists every option for each component.

### Common edits

- **Add a product case:** copy a `<case-card>` in `product-design.html` and change its attributes and text. To add it to the home slider too, copy it into the `<case-slider>` in `index.html`.
- **Add a visual project:** copy a `<project-card>` in `visual-design.html`.
- **Add a client logo:** put the file in `assets/logos/` and add an `<img … style="--w:WIDTH">` inside `<logo-marquee>` in `index.html`.
- **Change nav, footer, email or LinkedIn:** edit `SITE` at the top of `assets/js/components.js`.
- **Add a new page:** copy an existing page. Keep the `<head>` links and set `<site-nav current="…">`. To add it to the menu, add an entry to `SITE.nav`.

### Adding a new component

1. In `assets/js/components.js`, add a class that extends `Component`, build its markup in `render()`, and register it with `customElements.define("my-thing", MyThing)`. Register children before parents.
2. Add its styles to `assets/css/components.css`, using tokens only.
3. Add the tag name to the `display: block` and `:not(:defined)` lists in `assets/css/base.css`.
4. Add a section with a `data-example` demo to `styleguide.html`.

Components render into the page itself (no shadow DOM), so the normal CSS files style them. Asset paths assume pages sit in the site root, next to `index.html`.

Fonts: Konkhmer Sleokchher and Open Sans, loaded from Google Fonts.
