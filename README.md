# delivery

SalonFlow MVP with two separated experiences:

1. **Client self-service interface** for booking requests and status tracking.
2. **Back Office interface** for salon staff to manage appointments, assign stylists, and control status.
3. **Price list + client billing** so you can calculate a customer invoice from confirmed treatments.

## Quick start
1. Open `index.html`.
2. Click **"טען נתוני דמו"** to preview all flows.

## Main capabilities
- Client portal:
  - Create booking request.
  - Track booking status by phone.
- Back Office:
  - Add confirmed appointments manually.
  - Confirm/cancel/delete appointments.
  - Assign stylist per appointment with overlap prevention.
- Price list:
  - Editable prices by service.
  - Persisted in localStorage.
- Billing:
  - Calculate total invoice by client phone based on confirmed appointments.

## Run with local server (optional)
```bash
python3 -m http.server 8080
```
Then open `http://localhost:8080`.
