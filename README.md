# Callie's Alpine Canine

Four apps for a one-person dog-walking/pet-sitting business: a walker app
(GPS walk tracking, client management, payments), a pet-parent web portal,
a pet-parent phone app (SMS-verified), and a marketing website. Originally
designed in Claude Design (see `chats/` for the full design conversation);
implemented here as two parallel, independently-deployable builds.

## The two builds

| | `dc-runtime/` | `vanilla/` |
|---|---|---|
| **What it is** | The design tool's own output, patched to run in production | A from-scratch rebuild, same visuals & behavior |
| **Stack** | React + Babel, loaded from unpkg.com at runtime; a custom HTML templating engine (`support.js`) | Plain HTML/CSS/JS — no framework, no build step |
| **Dependencies at runtime** | Needs internet access (unpkg.com CDN) even after the page loads | None — works offline after first load |
| **Works via `file://`?** | No — needs an HTTP server | Yes |
| **Maintainability** | Tied to the design tool's `<sc-if>`/`<sc-for>`/`DCLogic` dialect | Ordinary DOM/JS, approachable to any web developer |
| **Risk** | Lowest — it's the exact build validated during design iteration | Rebuilt independently; see its README for anything simplified |

Both are pixel- and functionally-equivalent. Pick whichever you want to
actually run — there's no need to keep both live long-term, they're just
offered as two options. Each folder has its own README with more detail.

## The four apps (in each build)

- **Dog Walking Tracker** — the walker's app: home dashboard, client
  list/detail with structured + free-form notes, live GPS-tracked walks
  with a pee/poop counter and post-walk photo/share/payment logging,
  payments (owed balances + package credits), and a sitting calendar with
  daily task checklists. Clients sourced from Rover are flagged and routed
  to the Rover app for messaging/booking instead of in-app.
- **Pet Parent Portal** — a browser dashboard for clients: live walk
  tracking, walk history with photos, payment balance (Venmo/Stripe),
  message/call the walker, upcoming bookings.
- **Pet Parent App** — the same portal, phone-first, with SMS
  verification instead of a login form.
- **Callie's Alpine Canine Website** — the public marketing site (Home,
  Services, About, Contact with a booking form), linking into the portal
  for existing clients.

## Deploying

See `dc-runtime/github-pages-setup.md` for step-by-step GitHub Pages
setup — it covers hosting this whole repo (both builds) from one Pages
site, since each build lives in its own subfolder and the paths don't
collide.

Once live, apps are reachable at (for either build, swap the folder name):

- `https://USERNAME.github.io/REPO/dc-runtime/Dog%20Walking%20Tracker.dc.html`
- `https://USERNAME.github.io/REPO/vanilla/Dog%20Walking%20Tracker.html`
- (and similarly for the other three apps)

Each is installable to a phone home screen as a PWA (Chrome → menu → "Add
to Home Screen").

## Building an Android APK

`dc-runtime/android-build-guide.md` covers wrapping the app in Capacitor
for a real APK, or using PWABuilder against a hosted URL.
`dc-runtime/capacitor.config.json` is a starting point.

## Repo layout

```
chats/                   design conversation transcript
dc-runtime/               build 1 — design tool output, patched for production
vanilla/                  build 2 — plain HTML/CSS/JS rebuild
```
