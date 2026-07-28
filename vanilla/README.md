# Callie's Alpine Canine — vanilla build

The same four apps as `dc-runtime/`, rebuilt from scratch in **plain
HTML/CSS/JS** — no React, no Babel, no CDN scripts, no build step, no
dependency on the design tool's templating runtime.

- **`Dog Walking Tracker.html`** — walker app (`walker-app.js`)
- **`Pet Parent Portal.html`** — browser client dashboard (`portal-app.js`)
- **`Pet Parent App.html`** — SMS-verified phone client app (`parent-app.js`)
- **`Callies Alpine Canine Website.html`** — marketing site (`website-app.js`)

Same seed data, copy, URLs, and behavior as `dc-runtime/` — see the root
`README.md` for the feature list and the full comparison between the two
builds.

## How it works

- `common.js` — a tiny hyperscript-style DOM builder (`h()`), the
  Android-device-frame and Chrome-browser-window chrome (recreated from
  `android-frame.jsx` / `browser-window.jsx` as plain DOM instead of JSX),
  shared SVG icons, and formatting helpers.
- Each app is a small object (`App`, `PortalApp`, `ParentApp`, `Site`) with
  a `state`, a `render()` that rebuilds its screen's DOM from that state
  (no virtual-DOM diffing — `withFocusPreserved()` in `common.js` keeps
  keyboard focus/cursor position stable across rebuilds while typing), and
  plain methods for the actions (start/stop a walk, add a note, mark paid,
  toggle a task, submit the contact form, etc).
- `styles.css` is copied verbatim from the design system
  (`dc-runtime/_ds/.../styles.css`) — same CSS custom properties and
  component classes, so visuals match exactly.
- `image-slot.js` is a from-scratch, much simpler `<image-slot>` custom
  element: click or drag-and-drop an image → `FileReader` → shown via
  `object-fit: cover`, persisted to `localStorage` keyed by page path +
  slot id. It intentionally does **not** replicate the original
  `dc-runtime/image-slot.js`'s pan/zoom/reframe or Unsplash-credit
  machinery — none of the four apps use those (`src`/`credit` attributes
  are never set here, only `id`/`shape`/`placeholder`).
- `sw.js` is a real service worker file (cache-on-fetch) — same behavior
  as `dc-runtime`'s inline `data:` URL-registered worker, just written as
  a normal file since there's no templating layer here to inline it into.

## Running it

No server strictly required — these are static files, so opening
`Dog Walking Tracker.html` directly via `file://` works. For the service
worker / PWA install prompt to register (browsers require a secure
context), serve it over HTTP(S) instead: `npx serve .` locally, or deploy
via GitHub Pages (see `../dc-runtime/github-pages-setup.md`, which covers
hosting this whole repo).

## Trade-offs vs. the `dc-runtime/` build

No CDN dependency (works fully offline after first load, works via
`file://`), and it's ordinary DOM/JS any web developer can read and
extend without learning the design tool's `<sc-if>`/`<sc-for>`/`DCLogic`
dialect. The cost is that it's an independent rebuild rather than the
exact prototype validated during design iteration — if you find a visual
or behavioral difference from `dc-runtime/`, that's a bug in this build,
please compare against the source `.dc.html` files there.
