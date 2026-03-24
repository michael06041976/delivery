# delivery

Simple MVP web app for salon appointment management, based on the Hebrew planning content in `barbershop-journal-benefits-he.md`.

## What is included
- `index.html` – RTL Hebrew UI for adding appointments, viewing schedule, client history, and a daily report.
- `style.css` – lightweight responsive styles.
- `app.js` – localStorage-based logic for:
  - adding appointments,
  - conflict prevention (same stylist + same time),
  - deleting appointments,
  - searching client history by phone,
  - generating a basic daily report.

## Run locally
Because this is a static app, open `index.html` directly in a browser.

Optionally, run a local server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.
