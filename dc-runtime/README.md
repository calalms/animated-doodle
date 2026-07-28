# Callie's Alpine Canine — dc-runtime build

This is the **"keep the design tool's output as-is"** implementation. It's
the exact prototype produced in Claude Design, fixed up so it actually runs
in production (not just inside the design tool's preview).

Four apps, each a single self-contained `.dc.html` file:

- **`Dog Walking Tracker.dc.html`** — the walker app: home dashboard,
  client list/detail with notes, live GPS-simulated walk tracking with a
  pee/poop counter, post-walk summary + share sheet + photo attach,
  payments (owed balances + package credits), and a sitting calendar with
  daily task checklists. Rover-sourced clients get a badge and route to the
  Rover app instead of in-app messaging/tracking.
- **`Pet Parent Portal.dc.html`** — a browser-based client dashboard
  (login → live walk map, walk history with photos, package/pay balance
  with Venmo + Stripe links, message/call the walker, schedule).
- **`Pet Parent App.dc.html`** — the same portal, phone-first, with SMS
  verification instead of a login form.
- **`Callies Alpine Canine Website.dc.html`** — the public marketing site
  (Home/Services/About/Contact, testimonials, booking form, link into the
  client portal), responsive via a mobile breakpoint listener.

## How it works

Each `.dc.html` file boots `support.js`, a small runtime that:

1. Loads React, ReactDOM, and Babel **from unpkg.com at runtime** (no
   build step, no `node_modules` — but it does need an internet
   connection).
2. Parses the `<x-dc>` template (`<sc-if>`, `<sc-for>`, `{{ bindings }}`)
   and the `<script data-dc-script>` logic class, and renders them as
   React.
3. Loads `android-frame.jsx` / `browser-window.jsx` via `<x-import>`
   (Babel-transpiled in the browser) to draw the device/browser chrome
   around each app.

Visual design tokens (colors, spacing, buttons, cards, etc.) live in
`_ds/organic-.../styles.css`, plain CSS shared by all four apps.

`image-slot.js` implements the `<image-slot>` photo-attach/drop widget
used for the walk photo, walk-history photos, and the website's hero/about
photos. In the original export this only worked inside the Claude Design
preview (writes went through `window.omelette`, which doesn't exist
outside it — the slot was permanently read-only). **This has been patched**
to fall back to `localStorage` when `window.omelette` isn't present, so
drag-and-drop / click-to-upload works for real once deployed, and persists
on that device across reloads.

## Running it

This needs to be served over HTTP(S) — opening the file directly
(`file://`) won't work, because the runtime `fetch()`s its own state and
the CDN scripts need a real origin. Either:

- Deploy via GitHub Pages — see `github-pages-setup.md`.
- Or serve locally: `npx serve .` (or any static file server) from this
  folder, then open `http://localhost:.../Dog%20Walking%20Tracker.dc.html`.

## Building an Android APK

See `android-build-guide.md` for wrapping this in Capacitor, or use
PWABuilder against the hosted URL. `capacitor.config.json` is a starting
point for the Capacitor build.

## Trade-offs vs. the `vanilla/` build

See the root `README.md` for the full comparison. In short: this build has
the exact feature set validated during design iteration and is the
lowest-risk to keep working, but it depends on `support.js`'s custom
templating engine and on unpkg.com being reachable at runtime.
