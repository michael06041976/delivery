# delivery

Simple MVP web app for salon appointment management, based on the Hebrew planning content in `barbershop-journal-benefits-he.md`.

## Quick preview (2 steps)
1. Open `index.html` in your browser.
2. Click **"טען נתוני דמו"** to instantly load sample appointments and preview all app sections.

## What is included
- `index.html` – RTL Hebrew UI for adding appointments, viewing schedule, client history, daily report, and quick preview controls.
- `style.css` – lightweight responsive styles.
- `app.js` – localStorage-based logic for:
  - adding appointments,
  - conflict prevention (same stylist + same time),
  - deleting appointments,
  - searching client history by phone,
  - generating a basic daily report,
  - loading demo data for instant preview.

## Run locally
Because this is a static app, open `index.html` directly in a browser.

Optionally, run a local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
