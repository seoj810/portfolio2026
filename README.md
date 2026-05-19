# Portfolio

Static HTML/CSS portfolio site. No build step, no dependencies.

## Preview locally

The site uses relative paths (`assets/styles.css`, `assets/site.js`, etc.) so it works two ways:

**Option 1: Double-click `index.html`** in Finder. Loads in your browser, no setup. Some browsers occasionally cache fonts/CSS aggressively for `file://` URLs; if that bites you, use option 2.

**Option 2: Run a tiny local server** (recommended while editing):

```bash
cd ~/Desktop/portfolio
python3 -m http.server 8000
```

Then open <http://localhost:8000/> in your browser. Python ships with macOS, no install needed. Hit `Ctrl+C` to stop.

## Structure

```
portfolio/
├── index.html                          Home: hero + work index + about preview
├── about.html                          About page
├── contact.html                        Contact page
├── assets/
│   ├── styles.css                      Shared site styles
│   ├── site.js                         Scroll reveals, progress bar, nav highlight, missing-image fallback
│   └── ji-seo-resume.pdf               (drop your résumé here; see TODOs)
├── images/                             Case study images (empty for now)
└── work/
    ├── ai-native-communications.html   Shared design system + embedded interactive prototype (~7MB)
    ├── unified-inbox.html              Scrolling case study with inline CSS (matches main visual style)
    ├── marcel.html                     Shared design system
    ├── madewell.html                   Shared design system
    ├── kiko.html                       Shared design system
    └── sr-branding.html                Shared design system
```

## TODOs before going live

- [ ] Add your résumé as `assets/ji-seo-resume.pdf` (filename is referenced from nav + contact + footer)
- [ ] Drop case study images into `images/` to replace the "image coming soon" placeholders:
  - `images/marcel/hero.png`, `connect.png`, `color.png`, `icons.png`, `chips.png`, `desktop.png`, `screens.png`, `conversation.png`, `asset.png`
  - `images/madewell/grid.png`, `hover.png`, `category.png`, `pair.png`, `topnav.png`, `topnav2.png`, `content.png`, `insta.png`
  - `images/kiko/kisses.png`, `kisses2.png`
  - (See each case study file for the exact `<img src>` paths)
- [ ] Verify the LinkedIn URL (`https://www.linkedin.com/in/jiseo/`) is correct
- [ ] If you have screenshots for the Unified Inbox case study, drop them in `images/inbox/` and replace the inline `.img-placeholder` divs in `work/unified-inbox.html`
- [ ] Decide on a favicon (none currently)

## Notes on individual case studies

- `work/ai-native-communications.html` uses the shared design system. It also embeds an **interactive prototype** as a ~7MB base64 blob; click "View prototype →" in section 06 to open it in an overlay (Esc to close). If you ever need to regenerate the file structure, the base64 blob is the long string assigned to `_protoB64` near the end of the file; don't accidentally break that line.
- `work/unified-inbox.html` uses its own inline CSS but visually matches the rest of the site. Its nav header links back to portfolio. Image placeholders inside use the file's own dashed-border style (different from the JS-based fallback used by the other case studies). You can port this to the shared CSS later if you want full visual consistency.

## Theme toggles

The CSS supports several variants you can switch by adding a `data-*` attribute to the `<html>` or `<body>` tag, e.g. `<body data-palette="ink" data-fonts="instrument" data-density="airy">`.

| Attribute       | Values                                              |
| --------------- | --------------------------------------------------- |
| `data-palette`  | (default cream + blue), `paper`, `clay`, `ink`      |
| `data-fonts`    | (default Fraunces+DM Sans), `newsreader`, `garamond`, `instrument` |
| `data-density`  | (default comfortable), `cozy`, `airy`               |
| `data-hero`     | (default), `editorial`, `index`                     |
| `data-cards`    | (default list rows), `image`, `numbered`            |

## Deploying (when you're ready)

The simplest no-fuss options for a static site like this:

- **Netlify Drop.** Drag the `portfolio/` folder onto <https://app.netlify.com/drop>. Free.
- **Vercel.** Run `vercel` from the folder, takes <1 min. Free.
- **GitHub Pages.** Push to a `username.github.io` repo. Free.

All three give you a real URL + free HTTPS.
