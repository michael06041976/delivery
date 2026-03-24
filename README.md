# delivery

SalonFlow MVP with two separated experiences:

1. **Client self-service interface** for booking requests and status tracking.
2. **Back Office interface** for salon staff to manage appointments, assign stylists, and control status.
3. **Price list + client billing** so you can calculate a customer invoice from confirmed treatments.
4. **Modern UI refresh** with hero visual image (`assets/salon-hero.svg`), gradients and glass-style cards.

## How can I see a preview?
### Option A (fastest)
```bash
./preview.sh
```
Then open: `http://localhost:8080`

### Option B (manual)
```bash
python3 -m http.server 8080
```
Then open: `http://localhost:8080`

After opening the app, click **"טען נתוני דמו"** to instantly see sample appointments.

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
