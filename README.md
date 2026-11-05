# Griz — AI & Technology

A personal portfolio created under Griz’s direction, with interactive liquid glass, a particle field, and a scroll-driven story.

The site is plain HTML, CSS, JavaScript, and WebGL. No package installation or build step is required. All files served to visitors are in `public/`.

## Edit the placeholders

| What to change | Where to edit |
| --- | --- |
| Intro headline, page title, metadata | `public/index.html` |
| Animated chapters, biography, interests, project titles, experience | The `layer.innerHTML` template in `public/story.js` |
| Reading-mode biography, projects, and experience | The matching sections in `public/index.html` |
| Project detail popups | The `projects` array in `public/script.js` |
| Contact details | The contact handlers in `public/script.js` and contact text in `public/story.js` and `public/index.html` |
| Project artwork | `artwork()` in `public/story.js`, and the corresponding styles in `public/style.css` |
| Opening prompts | `public/experience.js`, `public/opening-prompts.css` |

The animated story and the ordinary reading view share the same subject matter but have separate markup. Update both when changing biography, projects, or experience.

Contact currently opens an honest placeholder dialog. Replace its handler with your email address, profile, or booking link when ready. No messages are submitted or stored.

## Preview locally

From the repository root:

```sh
python -m http.server 5173 --directory public
```

Open `http://localhost:5173`. Use the chapter dots to jump through the story. “Read as a page” switches to the ordinary reading layout. Reduced-motion users receive that layout automatically.

## Deploy to Vercel

Import this GitHub repository into Vercel. The included `vercel.json` selects **Other**, skips the build, and serves `public/`. There are no environment variables or secrets to configure.

With Git integration enabled, pushes to the production branch publish updates automatically.

## Files

- `scene.js` and `droplet.frag`: shared WebGL scene and refractive glass.
- `experience.js`: entrance animation and glass dragging.
- `story.js`: chapter content, scroll timeline, flying notes, and scene compositions.
- `motion.js`: reversible scroll mapping, character focus, and paper trajectories.
- `cinematic.css`: later chapters, note wall, toolkit selector, menu and loader motion.
- `neural-field.js`: interactive layered neural sculpture on page 3, with cursor parallax and click-triggered signal propagation.
- `script.js`: navigation and detail dialogs.
- CSS files: base styling, glass/entrance styling, story layout, and opening prompts.

See `ASSET-SOURCES.md` for visual provenance.

## Motion checks

Run `node scripts/check.cjs` and `node scripts/check-motion.cjs`. The latter checks
that chapter links invert the stretched timeline, characters reveal and disappear
fully, and paper trajectories remain finite at phone, tablet, and desktop sizes.

The animated journey now has 14 chapters. Edit the early content in `layer.innerHTML`
and the later content in `extraScenes`, `notes`, and `toolData` in `public/story.js`.
The reading layout is in `public/index.html`. Keep both views in sync when replacing
placeholders. The project and contact dialogs still deliberately identify missing
content; no real career history or project outcomes have been invented.

The paper headline is composited in `paperTypography()` in `story.js`: it enters
from the right, blooms amber, then scales and moves continuously into the gallery
heading. Its reversible timing lives in `paperText()` in `motion.js`.
