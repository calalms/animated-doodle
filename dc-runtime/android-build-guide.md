# Building the Callie's Alpine Canine Walker App for Android

## Quick Start

### Prerequisites
- Node.js 14+ (with npm)
- Android Studio & SDK (installed via Android Studio)
- JDK 11+

### Steps

1. **Install Capacitor CLI globally**
   ```bash
   npm install -g @capacitor/cli
   ```

2. **Initialize Capacitor in your project**
   ```bash
   npm init -y
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```

3. **Copy your HTML app**
   - Create a `public/` folder
   - Copy everything from this repo's `dc-runtime/` folder into `public/` (the `.dc.html` files plus `support.js`, `image-slot.js`, `android-frame.jsx`, `browser-window.jsx`, `_ds/`, `manifest.json`, `pet-parent-manifest.json`) — the app needs all of them alongside each other, same as when served from GitHub Pages
   - This `capacitor.config.json` already lives next to this guide; copy it to your project root (the folder containing `public/`)

4. **Add Android platform**
   ```bash
   npx cap add android
   ```

5. **Build the Android project**
   ```bash
   npx cap build android
   ```

6. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

7. **Generate a signed APK**
   - In Android Studio: Build → Generate Signed Bundle / APK
   - Follow the dialog to create a keystore (save it safely — you'll need it for updates)
   - Choose APK (not Bundle)
   - Select Release variant
   - Click Finish

8. **Install on a device**
   - Connect an Android phone (or use an emulator)
   - Android Studio will auto-detect it
   - Click Run → select your device
   - The app installs and launches

### Testing Without a Signed APK
For testing on your own device:
- In Android Studio, just click the green Run button (▶)
- This builds a debug APK and installs it on the connected device

### Keystore Security
Once you create a keystore, **save it somewhere safe**. You'll need it to update the app in the future. Store it outside your project folder and back it up.

---

## Alternative: PWABuilder (No Local Build)

If you don't want to install Android Studio:
1. Go to https://www.pwabuilder.com
2. Enter your app's URL: `https://yourdomain.com/Dog%20Walking%20Tracker.dc.html`
3. PWABuilder will scan your manifest and generate an APK
4. Download the APK and install it on your phone

---

## Troubleshooting

**"Android Studio not found"**
- Install Android Studio from https://developer.android.com/studio
- During setup, ensure "Android SDK" is checked

**"Gradle build failed"**
- Delete `android/` folder and re-run `npx cap add android`

**"Emulator won't launch"**
- In Android Studio, go to Tools → Device Manager and create a virtual device
