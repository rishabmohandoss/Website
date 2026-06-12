# Rishab Mohandoss — Portfolio

Personal portfolio, deployed via GitHub Pages at https://rishabmohandoss.github.io/Website/

## Structure

```
index.html          Home — hero, stats, quick bio
experience.html     Sticky-timeline of roles and leadership
research.html       Three faculty research collaborations
projects.html       Project grid, AdaptIQ featured
about.html          Bio, education, skills, awards, contact
education.html      Redirect to about.html (kept for old links)
css/style.css       Shared dark-indigo theme
js/animations.js    Particle canvas, scroll reveals, counters, parallax, nav
assets/             Headshot, PDFs, demo video, project screenshots
```

No build step. Vanilla HTML/CSS/JS, zero dependencies (the particle network is a
custom canvas, animations use IntersectionObserver). Push to `main` to deploy.

## Adding project screenshots

Drop images into `assets/` and add inside the matching project card in
`projects.html`:

```html
<img src="assets/adaptiq.png" alt="AdaptIQ screenshot" loading="lazy">
```

Suggested captures: AdaptIQ landing + profile selection, Breathe in action,
Ether mood environments, trading bot equity curve.

## Content gaps (search for `[` brackets in the HTML)

- AdaptIQ: live link, GitHub repo, feature list, status
- Breathe, Resume Tool, Conversational Anki, Stock Bot: links and status
- GDG @ NJIT Events Coordinator: dates and metrics
- Research: yield-model methods, accessibility research question, NFT project scope
