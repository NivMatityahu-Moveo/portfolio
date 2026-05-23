# CLAUDE.md

Sharon Barazani — architecture portfolio. Static HTML/CSS/JS rebuild of a Wix site, hosted on Netlify with auto-deploy from GitHub.

## Where things live

| Thing | Where |
|---|---|
| Local working copy | `/Users/niv.matityahu/Niv/sharon_portfolio/` |
| GitHub repo | https://github.com/NivMatityahu-Moveo/portfolio (public, account: `NivMatityahu-Moveo`) |
| Default branch | `main` |
| Netlify project | https://app.netlify.com/projects/sensational-lebkuchen-46c5ac (initial slug; may be renamed in **Project configuration → General → Project name**) |
| Live URL | `https://<project-slug>.netlify.app` |
| Original Wix site (reference) | https://s0504009197.wixstudio.com/portfolio |

## How auto-deploy works

1. The Netlify project is linked to the GitHub repo `NivMatityahu-Moveo/portfolio` (one-time browser flow done at setup via "Add new site → Import from Git").
2. Every push to the **`main`** branch triggers a new Netlify build automatically. No webhook setup needed — Netlify installed its GitHub App during the link step.
3. There is **no build step**. The repo is a flat static site, so Netlify's build command is empty and the publish directory is the repo root (`.`).
4. Build typically completes in 30–60 seconds. Status is visible at **Project → Deploys**.
5. Previous deploys are kept and can be rolled back to from the same Deploys page.

To verify or change deploy settings:
```
https://app.netlify.com/projects/sensational-lebkuchen-46c5ac/configuration/deploys
```

## Making changes

```bash
cd /Users/niv.matityahu/Niv/sharon_portfolio
# edit files...
git add -A
git commit -m "describe the change"
git push origin main
# Netlify rebuilds automatically — refresh the live URL in ~30 sec
```

Local preview while editing (optional):
```bash
cd /Users/niv.matityahu/Niv/sharon_portfolio
python3 -m http.server 8765
# open http://localhost:8765
```

## File layout

```
sharon_portfolio/
├── index.html              # Home: vertical timeline with 00–06 nodes
├── intro.html              # "00" — bilingual EN/HE intro + CV
├── project-01.html         # 01 Carlebach Parking Lot
├── project-02.html         # 02 Surplus vs Deficiency
├── project-03.html         # 03 The Bins Stadium
├── project-04.html         # 04 Villa Mensa (Conservation Studio)
├── project-05.html         # 05 Carpet Building
├── project-06.html         # 06 Mini Projects
├── css/styles.css          # All styling. Single sheet, no preprocessor.
├── js/main.js              # Hero-title font-size fitting (see below).
├── images/                 # 93 project images scraped from the Wix originals.
├── _scrape/                # Internal tooling (Playwright scraper, raw HTML/JSON
│                           #   snapshots, screenshots). gitignored — not deployed.
└── .gitignore              # Excludes _scrape/, .DS_Store, editor junk.
```

## Design decisions worth knowing

- **Hero title ("SHARON / BARAZANI / PORTFOLIO")**: each word must fill the same horizontal width with natural letter-spacing (matches the Wix original). Implementation in `js/main.js`: measure each `.line`'s natural rendered width at the base CSS size, then set `font-size = baseSize * targetWidth / naturalWidth`. Re-runs on font load and window resize. Don't replace this with CSS `justify-content: space-between` — that stretches letters apart and looks bad (tried and rejected).
- **Fonts**: Work Sans (Latin, weights 200/300/400) and Heebo (Hebrew) loaded from Google Fonts. Wix used `worksans-extralight` — the closest free equivalent is Work Sans 200.
- **Bilingual intro page**: side-by-side EN/HE columns. Hebrew column uses `direction: rtl` and the Heebo font.
- **No build pipeline**: kept intentionally simple so anyone (or Netlify) can serve the folder as-is.
- **Footer**: shows only `© Sharon Barazani.` — no year. (The "© 2035 by Business Name" placeholder from the original Wix template was removed.)

## Image source

All images under `images/` were scraped from the live Wix site using `_scrape/scrape.py` (Playwright + headless Chromium). Filenames are SHA-1 hashes of the original `static.wixstatic.com` URLs. If Sharon ever provides higher-res originals, swap the files in place — the `<img src="">` references in the HTML will continue to work.

## When the source site changes

If Sharon updates content on the Wix site (new project, new text, new photos), re-run the scraper to grab fresh content:
```bash
cd _scrape && python3 scrape.py
```
Then manually merge any new text/images into the corresponding `project-NN.html` or `intro.html`. The scraper writes raw HTML + JSON snapshots into `_scrape/raw/` and downloads new images to `_scrape/images/`.

## Common follow-ups

- **Custom domain** (e.g. `sharonbarazani.com`): buy from any registrar → Netlify **Domain settings → Add custom domain** → follow DNS instructions. HTTPS via Let's Encrypt is automatic.
- **Contact form**: Wix had none, but Formspree or Netlify Forms can be added in <10 min.
- **Rename the Netlify subdomain**: Project configuration → General → Project information → "Change project name".
