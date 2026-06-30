# Calculator

A modern, beautiful, responsive calculator web app built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

## Features

- Addition, subtraction, multiplication, division, percentage
- Decimal input, clear (C), delete/backspace (⌫), and equals (=)
- Keyboard support
- Responsive, mobile-first design
- Installable as a PWA (offline support via service worker)
- Ready for APK packaging via [PWABuilder](https://www.pwabuilder.com)

## Project structure

```
calculator-app/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```

## Run locally

Just open `index.html` in a browser, or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set the source to your main branch (root).
4. Your live URL will be `https://<username>.github.io/<repo-name>/`.

## Convert to Android APK with PWABuilder

1. Deploy the app (e.g. via GitHub Pages) so it has a public HTTPS URL.
2. Go to [https://www.pwabuilder.com](https://www.pwabuilder.com).
3. Paste your deployed URL and click **Start**.
4. PWABuilder will validate the manifest and service worker.
5. Click **Package for Stores → Android** to generate the APK/AAB.

## License

Free to use and modify.
