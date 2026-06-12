# Rishab Mohandoss — Portfolio

Personal portfolio, deployed via GitHub Pages at https://rishabmohandoss.github.io/Website/

## Structure

```
index.html          Home — hero, stats, bio, featured work
experience.html     Sticky-timeline of roles and leadership
research.html       Three faculty research collaborations
projects.html       Project grid, AdaptIQ featured
about.html          Bio, education, skills, awards, contact
education.html      Redirect to about.html (kept for old links)
css/style.css       Monochromatic light theme
js/animations.js    Scroll reveals + animated counters
assets/             Headshot, PDFs, demo video, project screenshots
```

No build step. Vanilla HTML/CSS/JS, zero dependencies. Push to `main` to deploy.

## Design decisions

- **Monochromatic**: white background, charcoal (#1a1a1a) as the single accent,
  grays for hierarchy (#666 secondary, #999 tertiary, #e5e7eb borders). No
  gradients, no color ramps.
- **Typography**: Inter throughout. Headlines up to 4rem at weight 600 with
  tight letter-spacing; body 1rem at line-height 1.7. Counters use the system
  monospace stack for a precision feel.
- **Motion is functional only**: scroll reveals are a 12px fade-slide at 400ms
  with the Material standard curve; counters run 1.5s ease-out-cubic. No
  particles, parallax, or stagger. `prefers-reduced-motion` disables everything.
- **Whitespace**: 8rem between sections, bordered (not shadowed) cards with
  2rem padding, 4px corner radius maximum.

## Adding project screenshots

Drop images into `assets/` and add inside the matching project card in
`projects.html`:

```html
<img src="assets/adaptiq.png" alt="AdaptIQ screenshot" loading="lazy">
```

Keep images under 200KB (JPEG/WebP preferred).

## Content gaps (search for `[` brackets in the HTML)

- AdaptIQ: live link, GitHub repo, feature list, status
- Breathe, Resume Tool, Conversational Anki, Stock Bot: links and status
- GDG @ NJIT Events Coordinator: dates and metrics
- Research: yield-model methods, accessibility research question, NFT project scope
