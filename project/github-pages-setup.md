# GitHub + GitHub Pages Setup for Callie's Alpine Canine Apps

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Name it: `callies-alpine-canine` (or whatever you prefer)
3. Choose **Public** (required for free GitHub Pages)
4. **Do NOT** initialize with README, .gitignore, or license yet
5. Click "Create repository"
`
## Step 2: Push Your Project to GitHub`

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

Once live, your apps are at:

- **Walker App**: `https://USERNAME.github.io/callies-alpine-canine/Dog%20Walking%20Tracker.dc.html`
- **Pet Parent Portal**: `https://USERNAME.github.io/callies-alpine-canine/Pet%20Parent%20Portal.dc.html`
- **Website**: `https://USERNAME.github.io/callies-alpine-canine/Callies%20Alpine%20Canine%20Website.dc.html`
- **Pet Parent App**: `https://USERNAME.github.io/callies-alpine-canine/Pet%20Parent%20App.dc.html`

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
- Check the file paths in your HTML match the GitHub folder structure

**PWA not installing?**
- Verify `manifest.json` and `pet-parent-manifest.json` are in the root of your repo
- Clear browser cache and reload the page

**"Settings button not working"**
- GitHub Pages requires HTTPS (automatically enabled) — refresh the page
