# GitHub + GitHub Pages Setup for Callie's Alpine Canine Apps

This repo has two implementations of the same four apps — this guide covers
hosting the whole repo (both implementations) on one GitHub Pages site. See
the root `README.md` for how the `dc-runtime/` and `vanilla/` folders differ.

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Name it: `callies-alpine-canine` (or whatever you prefer)
3. Choose **Public** (required for free GitHub Pages)
4. **Do NOT** initialize with README, .gitignore, or license yet
5. Click "Create repository"

## Step 2: Push Your Project to GitHub

In your terminal, from your project root:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: walker app, pet parent portal, website, and pet parent app"

# Add GitHub as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/callies-alpine-canine.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** (top right)
3. Go to **Pages** (left sidebar)
4. Under "Source", select **Deploy from a branch**
5. Choose branch: **main**
6. Choose folder: **/ (root)**
7. Click **Save**

GitHub will build and publish in ~1 minute. You'll see a green checkmark and a live URL like:
```
https://USERNAME.github.io/callies-alpine-canine/
```

## Step 4: Access Your Apps

Once live, the "keep as-is" dc-runtime apps are at:

- **Walker App**: `https://USERNAME.github.io/callies-alpine-canine/dc-runtime/Dog%20Walking%20Tracker.dc.html`
- **Pet Parent Portal**: `https://USERNAME.github.io/callies-alpine-canine/dc-runtime/Pet%20Parent%20Portal.dc.html`
- **Website**: `https://USERNAME.github.io/callies-alpine-canine/dc-runtime/Callies%20Alpine%20Canine%20Website.dc.html`
- **Pet Parent App**: `https://USERNAME.github.io/callies-alpine-canine/dc-runtime/Pet%20Parent%20App.dc.html`

The vanilla (no-runtime) rebuild of the same four apps lives at the same
paths under `vanilla/` instead — see `vanilla/README.md`.

## Step 5: Add to Your Phone

1. Open one of the URLs in Chrome on your phone
2. Tap the menu (⋮) → **"Add to Home Screen"**
3. Confirm — it's now installed as a standalone app

## (Optional) Custom Domain

If you have a custom domain (e.g., `calliesalpinecanine.com`):

1. In **Settings → Pages**, under "Custom domain", enter your domain
2. Update your domain's DNS settings to point to GitHub Pages (GitHub will show instructions)
3. Enable "Enforce HTTPS" once DNS is set up

---

## Future Updates

After making changes:

```bash
git add .
git commit -m "Your message"
git push
```

GitHub automatically redeploys in ~1 minute.

---

## Troubleshooting

**404 errors on assets?**
- Make sure CSS/JS/image files are also committed and pushed
- Check the file paths in your HTML match the GitHub folder structure (this variant's apps expect `support.js`, `image-slot.js`, `android-frame.jsx`, `browser-window.jsx`, and `_ds/` to sit next to the `.dc.html` files, inside `dc-runtime/`)

**PWA not installing?**
- Verify `dc-runtime/manifest.json` and `dc-runtime/pet-parent-manifest.json` are committed and pushed
- Clear browser cache and reload the page

**"Settings button not working"**
- GitHub Pages requires HTTPS (automatically enabled) — refresh the page

**Blank page / stuck on a loading shimmer?**
- This variant loads React, ReactDOM, and Babel from unpkg.com at runtime — it needs an internet connection even after the page itself loads. If you're offline or the CDN is blocked, use the `vanilla/` variant instead, which has no such dependency.
