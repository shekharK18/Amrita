# Amrita Bhattacharjee — Portfolio Website

A stunning, cursor-interactive fashion designer portfolio. Built with pure HTML / CSS / JS — **no build step required**.

---

## 🗂 Project Structure

```
amrita-portfolio/
├── index.html              ← Open this in your browser
├── assets/
│   ├── css/style.css       ← All styles
│   ├── js/
│   │   ├── cursor.js       ← Custom cursor + sparkle trail
│   │   └── animations.js   ← All interactive effects
│   ├── images/             ← Drop Amrita's photos here
│   └── pdfs/               ← Drop PDFs here (see below)
└── README.md
```

---

## 📄 How to Add Your PDFs

Place your PDF files inside `assets/pdfs/` with these names:

| File name | Used for |
|---|---|
| `resume.pdf` | CV / Resume section (embedded viewer + download) |
| `lookbook.pdf` | Portfolio card 1 & 4 |
| `collection-2.pdf` | Urban Sutra S/S card |
| `collection-3.pdf` | Kantha Reimagined card |
| `collection-5.pdf` | Midnight Drape card |
| `collection-6.pdf` | Terracotta Lines card |

> **Tip**: You can rename PDFs to anything — just update the `data-pdf="..."` attribute on the matching `<article>` card in `index.html`.

---

## 🖼 How to Add a Photo

1. Drop `amrita.jpg` (or any image) into `assets/images/`
2. In `index.html`, find the About section and replace:
   ```html
   <div class="about-photo-placeholder">...</div>
   ```
   with:
   ```html
   <img src="assets/images/amrita.jpg" alt="Amrita Bhattacharjee" />
   ```

---

## ✏️ Updating Content

- **Name / tagline / bio** → edit `index.html` directly (clearly commented)
- **Contact email / phone** → search `amrita@example.com` in `index.html`
- **Timeline (work history)** → update the `.timeline-item` blocks in the Resume section
- **Skills %** → change `data-pct="95"` on each `.skill-bar-fill`
- **Color palette** → edit CSS variables at the top of `style.css`

---

## 🚀 Running Locally

Just open `index.html` in any modern browser — no server needed for most features.

> ⚠️ **PDF embedding** requires a local server due to browser security.
> Run one instantly:
> ```bash
> # Python
> python -m http.server 8080
>
> # Node (npx)
> npx serve .
> ```
> Then open `http://localhost:8080`

---

## ✨ Interactive Features

| Feature | How it works |
|---|---|
| 🔴 Custom cursor | Red dot + ring that follows the mouse with lerp smoothing |
| ✦ Sparkle trail | Canvas particles emitted on every mousemove |
| 🧲 Magnetic hero title | Hero name moves toward cursor position |
| 🃏 3D card tilt | Portfolio cards tilt in 3D following cursor |
| 📜 Scroll reveals | Elements fade+slide up when entering viewport |
| 📊 Skill bars | Animate to target % when scrolled into view |
| 🎊 Confetti on submit | Contact form triggers confetti burst |
| 📄 PDF Lightbox | Click any portfolio card to open PDF in overlay |
| 🎠 Testimonials slider | Auto-play + manual prev/next navigation |

