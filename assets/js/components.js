/* ==========================================================================
   Components — Renée Ocaña Portfolio 2026
   Every reusable piece of the site is a custom element defined here.
   Edit a component once and every page that uses it updates.
   Usage, options and live examples: styleguide.html
   Components render into the light DOM, so styles live in assets/css/.
   ========================================================================== */
(() => {
  /* ---------- Site-wide content (edit here) ---------- */
  const SITE = {
    name: "Renée Ocaña",
    linkedin: "https://www.linkedin.com/in/renee-ocana/",
    email: "mailto:renee.oflo@proton.me",
    tagline: "Visual and Product designer, passionate about creating engaging user-centered solutions.",
    copyright: "© 2026 Renée Ocaña",
    nav: [
      { id: "product-design", label: "Product design", href: "product-design.html" },
      { id: "visual-design", label: "Visual design", href: "visual-design.html" },
      { id: "about", label: "About me", href: "about.html" },
    ],
  };
  const ARROW = "assets/icons/arrow-right.svg";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = () => window.matchMedia("(hover: hover)").matches;
  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const splitList = (s = "") => s.split(",").map((t) => t.trim()).filter(Boolean);

  /** Base class: renders once, when first connected. */
  class Component extends HTMLElement {
    connectedCallback() {
      if (this._rendered) return;
      this._rendered = true;
      this.render();
    }
    render() {}
  }

  /* ------------------------------------------------------------------------
     <pill-list tags="Branding, Web design" variant="outline">
       tags     comma-separated labels
       variant  (optional) "outline" = tech-stack chips
     ------------------------------------------------------------------------ */
  class PillList extends Component {
    render() {
      const tags = splitList(this.getAttribute("tags"));
      this.innerHTML = `<ul class="pills">${tags.map((t) => `<li class="pill">${esc(t)}</li>`).join("")}</ul>`;
    }
  }

  /* ------------------------------------------------------------------------
     <site-nav current="about">
       current  id of the active page: product-design | visual-design | about
                (leave out on the home page)
     Links come from SITE.nav above.
     ------------------------------------------------------------------------ */
  class SiteNav extends Component {
    render() {
      const current = this.getAttribute("current");
      const links = SITE.nav
        .map((l) => `<a class="nav-link" href="${l.href}"${l.id === current ? ' aria-current="page"' : ""}>${esc(l.label)}</a>`)
        .join("");
      this.innerHTML = `
        <a class="skip-link" href="#main">Skip to content</a>
        <div class="top-fade" aria-hidden="true"></div>
        <header class="nav">
          <a class="logo-r" href="index.html" aria-label="${esc(SITE.name)} — home"></a>
          <nav class="nav__menu" id="site-menu" aria-label="Main">${links}</nav>
          <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Open menu"><span></span><span></span></button>
        </header>`;

      const nav = this.querySelector(".nav");
      const toggle = this.querySelector(".nav__toggle");
      const setOpen = (open) => {
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      };
      toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
      document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
      document.addEventListener("click", (e) => !nav.contains(e.target) && setOpen(false));
    }
  }

  /* ------------------------------------------------------------------------
     <site-footer></site-footer>
     Content comes from SITE above.
     ------------------------------------------------------------------------ */
  class SiteFooter extends Component {
    render() {
      const [product, visual, about] = SITE.nav;
      this.innerHTML = `
        <footer class="footer">
          <div class="footer__bar">
            <a class="logo-r" href="index.html" aria-label="${esc(SITE.name)} — home"></a>
            <button class="to-top" type="button">
              <span class="to-top__icon"><img src="${ARROW}" alt=""></span>
              to the top
            </button>
          </div>
          <div class="footer__main">
            <p class="footer__tagline">${esc(SITE.tagline)}</p>
            <div class="footer__cols">
              <div class="footer__col">
                <h2>Work</h2>
                <ul>
                  <li><a href="${product.href}">${esc(product.label)}</a></li>
                  <li><a href="${visual.href}">${esc(visual.label)}</a></li>
                </ul>
              </div>
              <div class="footer__col">
                <h2>Contact</h2>
                <ul>
                  <li><a href="${about.href}">${esc(about.label)}</a></li>
                  <li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
                </ul>
              </div>
            </div>
          </div>
          <p class="footer__copy">${esc(SITE.copyright)}</p>
        </footer>`;
      this.querySelector(".to-top").addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
      );
    }
  }

  /* ------------------------------------------------------------------------
     <case-card image="…" alt="…" details="Company · Year · Industry · Place"
                tags="UX/UI design, User research" layout="reverse">
       <h3 slot="title">Verb + action</h3>
       <p>What and how. <strong>Outcome or KPI.</strong></p>
     </case-card>
       layout  (optional) "reverse" = image on the right
                          "secondary" = compact dark card
     The heading level is up to you (h2/h3); everything that is not the
     title becomes the card text.
     ------------------------------------------------------------------------ */
  class CaseCard extends Component {
    render() {
      const title = this.querySelector('[slot="title"]');
      title?.removeAttribute("slot");
      title?.classList.add("case__title");
      const text = document.createElement("div");
      text.className = "case__text";
      [...this.childNodes].filter((n) => n !== title).forEach((n) => text.appendChild(n));

      this.innerHTML = `
        <article class="case">
          <div class="case__media"><img src="${esc(this.getAttribute("image"))}" alt="${esc(this.getAttribute("alt"))}" loading="lazy"></div>
          <div class="case__body">
            <p class="case__details">${esc(this.getAttribute("details"))}</p>
            <pill-list tags="${esc(this.getAttribute("tags"))}"></pill-list>
          </div>
        </article>`;
      const body = this.querySelector(".case__body");
      if (title) body.appendChild(title);
      body.appendChild(text);
    }
  }

  /* ------------------------------------------------------------------------
     <case-slider label="Selected product design work">
       <case-card …></case-card> …
     </case-slider>
     Scrollable carousel with arrows, dots and arrow keys.
     ------------------------------------------------------------------------ */
  class CaseSlider extends Component {
    render() {
      const slides = [...this.querySelectorAll(":scope > case-card")];
      this.setAttribute("role", "region");
      this.setAttribute("aria-roledescription", "carousel");
      this.setAttribute("aria-label", this.getAttribute("label") || "Projects");

      const stage = document.createElement("div");
      stage.className = "slider__stage";
      const viewport = document.createElement("div");
      viewport.className = "slider__viewport";
      const track = document.createElement("div");
      track.className = "slider__track";
      slides.forEach((s, i) => {
        s.setAttribute("role", "group");
        s.setAttribute("aria-roledescription", "slide");
        s.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
        track.appendChild(s);
      });
      viewport.appendChild(track);

      const controls = document.createElement("div");
      controls.innerHTML = `
        <div class="slider__arrows">
          <button class="round-btn round-btn--prev" type="button" aria-label="Previous project"><img src="${ARROW}" alt=""></button>
          <button class="round-btn" type="button" aria-label="Next project"><img src="${ARROW}" alt=""></button>
        </div>
        <div class="slider__dots">${slides.map((_, i) => `<button class="slider__dot" type="button" aria-label="Show project ${i + 1}"></button>`).join("")}</div>`;
      stage.append(viewport, controls.querySelector(".slider__arrows"));
      this.replaceChildren(stage, controls.querySelector(".slider__dots"));

      const dots = [...this.querySelectorAll(".slider__dot")];
      const [prev, next] = this.querySelectorAll(".round-btn");
      let index = 0;
      const setActive = (i) => {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, n) => {
          s.classList.toggle("is-active", n === index);
          s.setAttribute("aria-hidden", String(n !== index));
          s.inert = n !== index;
        });
        dots.forEach((d, n) => d.setAttribute("aria-current", String(n === index)));
      };
      const go = (i, behavior = "smooth") => {
        const target = slides[(i + slides.length) % slides.length];
        setActive(i);
        const targetCenter = target.getBoundingClientRect().left - viewport.getBoundingClientRect().left
          + viewport.scrollLeft + target.offsetWidth / 2;
        viewport.scrollTo({
          left: targetCenter - viewport.clientWidth / 2,
          behavior: reduceMotion ? "auto" : behavior,
        });
      };

      prev.addEventListener("click", () => go(index - 1));
      next.addEventListener("click", () => go(index + 1));
      dots.forEach((d, n) => d.addEventListener("click", () => go(n)));
      slides.forEach((s, n) => s.addEventListener("click", () => n !== index && go(n)));
      this.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      });
      let scrollFrame = 0;
      viewport.addEventListener("scroll", () => {
        if (scrollFrame) cancelAnimationFrame(scrollFrame);
        scrollFrame = requestAnimationFrame(() => {
          const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
          const nearest = slides.reduce((best, slide, n) => {
            const distance = Math.abs(slide.getBoundingClientRect().left + slide.offsetWidth / 2 - center);
            return distance < best.distance ? { index: n, distance } : best;
          }, { index: 0, distance: Infinity });
          setActive(nearest.index);
          scrollFrame = 0;
        });
      });

      let dragStartX = 0;
      let dragStartScroll = 0;
      let isDragging = false;
      let didDrag = false;
      let suppressClick = false;
      viewport.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        isDragging = true;
        didDrag = false;
        dragStartX = e.clientX;
        dragStartScroll = viewport.scrollLeft;
        viewport.setPointerCapture(e.pointerId);
      });
      viewport.addEventListener("pointermove", (e) => {
        if (!isDragging) return;
        const delta = e.clientX - dragStartX;
        if (Math.abs(delta) > 4) {
          didDrag = true;
          viewport.classList.add("is-dragging");
        }
        if (didDrag) viewport.scrollLeft = dragStartScroll - delta;
      });
      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        viewport.classList.remove("is-dragging");
        if (didDrag) {
          suppressClick = true;
          window.setTimeout(() => { suppressClick = false; }, 0);
        }
      };
      viewport.addEventListener("pointerup", endDrag);
      viewport.addEventListener("pointercancel", endDrag);
      viewport.addEventListener("click", (e) => {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }, true);

      window.addEventListener("resize", () => go(index, "auto"));
      requestAnimationFrame(() => go(0));
    }
  }

  /* ------------------------------------------------------------------------
     <project-card name="Lola" image="…" alt="…" tags="Packaging, Illustration">
       Short project description. Two lines only.
     </project-card>
       heading  (optional) heading tag for the name, default "h2"
     The description shows on hover/focus (always on touch screens).
     ------------------------------------------------------------------------ */
  class ProjectCard extends Component {
    render() {
      const h = /^h[2-4]$/.test(this.getAttribute("heading") || "") ? this.getAttribute("heading") : "h2";
      const desc = this.innerHTML.trim();
      const image = `<img src="${esc(this.getAttribute("image"))}" alt="${esc(this.getAttribute("alt"))}" loading="lazy">`;
      const mobileImage = this.getAttribute("mobile-image");
      const media = mobileImage
        ? `<picture><source media="(max-width: 760px)" srcset="${esc(mobileImage)}">${image}</picture>`
        : image;
      this.innerHTML = `
        <article class="project" tabindex="0">
          <div class="project__top">
            <pill-list tags="${esc(this.getAttribute("tags"))}"></pill-list>
            <${h} class="project__name">${esc(this.getAttribute("name"))}</${h}>
          </div>
          <p class="project__desc">${desc}</p>
          <div class="project__media">${media}</div>
        </article>`;
    }
  }

  /* ------------------------------------------------------------------------
     <logo-marquee>
       <img src="assets/logos/gipsy.svg" alt="Gipsy" style="--w:173">
       <a href="https://…"><img src="…" alt="…" style="--w:179"></a>
     </logo-marquee>
     --w is the logo width in px on desktop (60% of it on mobile).
     Wrap a logo in <a> to link it. Scrolls forever, pauses on hover.
     ------------------------------------------------------------------------ */
  class LogoMarquee extends Component {
    render() {
      const track = document.createElement("div");
      track.className = "marquee__track";
      [...this.children].forEach((child) => {
        let item = child;
        if (child.tagName === "A") {
          child.target ||= "_blank";
          child.rel ||= "noopener";
        } else {
          item = document.createElement("span");
          item.appendChild(child);
        }
        item.classList.add("marquee__item");
        track.appendChild(item);
      });
      // second copy makes the loop seamless
      [...track.children].forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("tabindex", "-1");
        track.appendChild(clone);
      });
      this.replaceChildren(track);
    }
  }

  /* ------------------------------------------------------------------------
     <life-stack>
       <life-moment image="…" alt="…">I love photography…</life-moment> …
     </life-stack>
     A list of statements next to a stack of photos; picking a statement
     brings its photo to the front. The first moment starts on top.
     ------------------------------------------------------------------------ */
  class LifeStack extends Component {
    render() {
      const moments = [...this.querySelectorAll("life-moment")].map((m, i) => ({
        key: String(i),
        html: m.innerHTML.trim(),
        image: m.getAttribute("image"),
        alt: m.getAttribute("alt") || "",
      }));
      this.innerHTML = `
        <div class="life__grid">
          <ul class="life__list">${moments.map((m) => `<li><button class="life__item" type="button" data-key="${m.key}" aria-pressed="false">${m.html}</button></li>`).join("")}</ul>
          <div class="life__photos">${[...moments].reverse().map((m) => `<img class="life__photo" data-key="${m.key}" src="${esc(m.image)}" alt="${esc(m.alt)}" loading="lazy">`).join("")}</div>
        </div>`;

      const items = [...this.querySelectorAll(".life__item")];
      const photos = [...this.querySelectorAll(".life__photo")];
      // resting positions (x %, y %, rotation °) taken from the Figma variants
      const back = [{ x: 0, y: 7.6, r: -3.8 }, { x: 0, y: 8.3, r: -1.8 }, { x: 5.9, y: 3.9, r: 2.8 }];
      const front = { x: 3.4, y: 5, r: 1.4 };
      let order = photos.map((p) => p.dataset.key);

      const show = (key) => {
        order = order.filter((k) => k !== key).concat(key);
        order.forEach((k, depth) => {
          const p = photos.find((ph) => ph.dataset.key === k);
          const pos = depth === order.length - 1 ? front : back[depth % back.length];
          p.style.zIndex = String(depth + 1);
          p.style.transform = `translate(${pos.x}%, ${pos.y}%) rotate(${pos.r}deg)`;
        });
        items.forEach((it) => it.setAttribute("aria-pressed", String(it.dataset.key === key)));
      };
      items.forEach((it) => {
        it.addEventListener("click", () => show(it.dataset.key));
        it.addEventListener("mouseenter", () => canHover() && show(it.dataset.key));
      });
      if (items.length) show(items[0].dataset.key);
    }
  }

  /* ------------------------------------------------------------------------
     <dot-shader spacing="4.5" color="#f6f6f6" hot="#ff7e0d" radius="228">
       <svg …>…</svg>
     </dot-shader>
     <dot-shader shape="pill" color="#ff7e0d" hot="#f6f6f6"></dot-shader>
       spacing  distance between dots in px (default 5)
       color    dot colour at rest            hot  colour near the cursor
       radius   cursor influence in px (default 228)
       shape    "pill" draws a rounded bar instead of an inline <svg>
     Recreates the Figma particle shader: the shape becomes a dot grid that
     bulges away from the cursor. Size it with CSS (width/height).
     ------------------------------------------------------------------------ */
  const hexToRgb = (hex) => {
    const n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  class DotShader extends Component {
    render() {
      if (this.getAttribute("shape") === "pill" && !this.querySelector(".dot-shader__shape")) {
        const shape = document.createElement("div");
        shape.className = "dot-shader__shape";
        this.style.setProperty("--dot-color", this.getAttribute("color") || "");
        this.appendChild(shape);
      }
      this.source = this.querySelector("svg, .dot-shader__shape");
      if (!this.source) return;
      this.spacing = parseFloat(this.getAttribute("spacing") || "5");
      this.base = hexToRgb(this.getAttribute("color") || "#f6f6f6");
      this.hot = hexToRgb(this.getAttribute("hot") || "#ff7e0d");
      this.radius = parseFloat(this.getAttribute("radius") || "228");
      this.PAD = 60;
      this.dots = [];
      this.mouse = { x: -9999, y: -9999, active: false };
      this.raf = 0;

      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("aria-hidden", "true");
      this.appendChild(this.canvas);
      this.ctx = this.canvas.getContext("2d");

      if (!reduceMotion) {
        window.addEventListener("pointermove", (e) => this.onPointer(e), { passive: true });
        document.addEventListener("pointerleave", () => { this.mouse.active = false; this.wake(); });
      }
      let t;
      window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => this.sample(), 150); });
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => this.sample());
    }

    async sample() {
      const w = (this.w = this.clientWidth);
      const h = (this.h = this.clientHeight);
      if (!w || !h) return;
      const dpr = (this.dpr = Math.min(window.devicePixelRatio || 1, 2));
      this.canvas.width = (w + this.PAD * 2) * dpr;
      this.canvas.height = (h + this.PAD * 2) * dpr;

      const off = document.createElement("canvas");
      off.width = Math.ceil(w);
      off.height = Math.ceil(h);
      const octx = off.getContext("2d", { willReadFrequently: true });
      let data;
      try {
        if (this.source.tagName.toLowerCase() === "svg") {
          // via a blob URL so the canvas stays readable even from file://
          const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(this.source)], { type: "image/svg+xml" }));
          const img = new Image();
          await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
          octx.drawImage(img, 0, 0, w, h);
          URL.revokeObjectURL(url);
        } else {
          octx.beginPath();
          octx.roundRect(0, 0, w, h, h / 2);
          octx.fill();
        }
        data = octx.getImageData(0, 0, off.width, off.height).data;
      } catch {
        return; // keep the plain shape visible
      }

      const s = this.spacing;
      this.dots = [];
      for (let y = s / 2; y < h; y += s) {
        for (let x = s / 2; x < w; x += s) {
          const a = data[((y | 0) * off.width + (x | 0)) * 4 + 3];
          if (a > 12) this.dots.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, s: a / 255, heat: 0 });
        }
      }
      this.classList.add("is-ready");
      this.draw();
    }

    draw() {
      const { ctx, dpr, PAD, base, hot } = this;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, this.w + PAD * 2, this.h + PAD * 2);
      const r0 = this.spacing * 0.36;
      for (const d of this.dots) {
        const c = base.map((b, i) => (b + (hot[i] - b) * d.heat) | 0);
        ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
        ctx.beginPath();
        ctx.arc(d.x + PAD, d.y + PAD, r0 * d.s * (1 + d.heat * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    step() {
      let moving = false;
      const { mouse, radius, spacing } = this;
      for (const d of this.dots) {
        let tx = d.ox, ty = d.oy, heat = 0;
        if (mouse.active) {
          const dx = d.ox - mouse.x, dy = d.oy - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < radius) {
            const dome = Math.sqrt(1 - (dist / radius) ** 2);
            const n = dist || 1;
            tx += (dx / n) * dome * spacing * 2.2;
            ty += (dy / n) * dome * spacing * 2.2;
            heat = dome;
          }
        }
        d.vx = (d.vx + (tx - d.x) * 0.33) * 0.75; // spring + damping
        d.vy = (d.vy + (ty - d.y) * 0.33) * 0.75;
        d.x += d.vx;
        d.y += d.vy;
        d.heat += (heat - d.heat) * 0.2;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02 || Math.abs(heat - d.heat) > 0.01) moving = true;
      }
      this.draw();
      this.raf = moving || mouse.active ? requestAnimationFrame(() => this.step()) : 0;
    }

    wake() { if (!this.raf) this.raf = requestAnimationFrame(() => this.step()); }

    onPointer(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top, r = this.radius;
      const near = x > -r && y > -r && x < this.w + r && y < this.h + r;
      if (near || this.mouse.active) {
        this.mouse = { x, y, active: near };
        this.wake();
      }
    }
  }

  /* ---------- Register (children before parents) ---------- */
  customElements.define("pill-list", PillList);
  customElements.define("case-card", CaseCard);
  customElements.define("project-card", ProjectCard);
  customElements.define("case-slider", CaseSlider);
  customElements.define("logo-marquee", LogoMarquee);
  customElements.define("life-stack", LifeStack);
  customElements.define("dot-shader", DotShader);
  customElements.define("site-nav", SiteNav);
  customElements.define("site-footer", SiteFooter);

  /* ---------- Reveal on scroll: any element with class="reveal" ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
