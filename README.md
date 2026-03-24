# delivery

SalonFlow MVP with two separated experiences:

1. **Client self-service interface** for booking requests and status tracking.
2. **Back Office interface** for salon staff to manage appointments, assign stylists, and control status.
3. **Price list + client billing** so you can calculate a customer invoice from confirmed treatments.
4. **Menu-style modern UI** inspired by: https://www.evolvehairsalonfrankfort.com/menu

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
