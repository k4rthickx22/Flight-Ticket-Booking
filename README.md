# ✈️ Frost Airlines — Flight Ticket Booking

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Parcel](https://img.shields.io/badge/Parcel-2.12-B682F5?style=for-the-badge&logo=parcel&logoColor=white)
![JSON Server](https://img.shields.io/badge/JSON_Server-0.17-green?style=for-the-badge)
![React Router](https://img.shields.io/badge/React_Router-6.26-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A modern, full-featured flight ticket booking web application** built with React 18 + Parcel. Search flights across 10 Indian cities, book seats, generate boarding passes, and manage your travel history — all wrapped in a premium glassmorphism dark-mode UI.

[Live Demo](#) · [Report Bug](https://github.com/Karthick1242004/Flight-Ticket-Booking/issues) · [Request Feature](https://github.com/Karthick1242004/Flight-Ticket-Booking/issues)

</div>
---

## 🚀 Features

### Core Booking Flow
- **Flight Search** — Search by city (name or IATA code), date, cabin class and passenger count. Supports autocomplete via `<datalist>` and city-code aliases (e.g. `BOM`, `bombay`, `Mumbai`).
- **Smart Results Page** — Real-time filters (airline, stops, time-of-day, price ceiling slider) + 5-way sort. Powered by pure in-memory computation via `useMemo`.
- **3-Step Booking Wizard** — Passenger Details → Interactive Seat Map → Review & Confirm. Form validation and toast feedback on every step.
- **Interactive Seat Map** — 10-row × 6-col (A–F) cabin grid with pre-taken seats, multi-seat selection up to passenger count, animated pulse on selected seats.
- **Boarding Pass / Ticket** — Premium boarding-pass card with animated confetti burst, pseudo QR code, print button, and airline-branded header.
- **Booking History** — Full list with flight details, travel date, seat, booking reference, and two-step cancel confirm.

### UX & Design
- 🎨 **Glassmorphism Dark Mode** — Navy-deep color palette (`#0A0F1E` → `#13192B`) with layered transparency and backdrop blur.
- ✨ **Micro-animations** — `planeFly`, `seatPulse`, `confettiFall`, `fadeSlideIn` CSS keyframes.
- 📱 **Fully Responsive** — Collapsible hamburger sidebar for mobile; CSS grid/flex wrapping across all breakpoints.
- 🔔 **Toast Notifications** — Contextual success / error / info toasts via `react-toastify`.

### Data & Persistence
- **Offline-first** — BookingContext tries JSON Server API first, silently falls back to `localStorage` (`fa_bookings`) when the backend is not running.
- **User Profile** — Read/write via JSON Server REST (`/users/1`); Settings page shows an inline "API offline" banner when the server is down.
- **Dynamic Flight Generation** — Flights are generated at search time from a route-duration matrix × 6 airlines × 12 departure slots. No hardcoded flight list.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.3.1 | UI Framework |
| **React DOM** | 18.3.1 | DOM rendering |
| **React Router DOM** | 6.26.1 | Client-side routing |
| **Parcel** | 2.12.0 | Zero-config bundler & dev server |
| **JSON Server** | 0.17.4 | Mock REST API backend |
| **Axios** | 1.6.0 | HTTP client |
| **React Icons** | 5.2.1 | Material Design icon set |
| **React Toastify** | 10.0.5 | Toast notification system |
| **UUID** | 9.0.1 | Unique booking ID generation |
| **date-fns** | 3.6.0 | Date formatting utilities |
| **Bootstrap** | 5.3.3 | Utility base + form resets |
| **Concurrently** | 9.2.1 | Run dev + API servers simultaneously |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### 1. Clone the Repository

```bash
git clone https://github.com/Karthick1242004/Flight-Ticket-Booking.git
cd Flight-Ticket-Booking
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Environment

**Option A — Run both servers together (recommended):**

```bash
npm run dev:full
```

This uses `concurrently` to start the Parcel dev server on **port 1234** and the JSON Server API on **port 3001** simultaneously.

**Option B — Run separately in two terminals:**

```bash
# Terminal 1 — JSON Server (REST API backend)
npm run api

# Terminal 2 — Parcel dev server (React frontend)
npm run dev
```

### 4. Open the App

```
http://localhost:1234
```

> **Note:** The app functions fully in offline mode (bookings saved to `localStorage`) even without the JSON Server running. The Settings page will display an "API offline" warning.

---

## 📁 Project Structure

```
flightbooking-project/
│
├── index.html               # Parcel entry point
├── db.json                  # JSON Server database (users + bookings)
├── vite.config.js           # (legacy, unused — Parcel is the bundler)
├── package.json
│
├── public/                  # Static assets
│
└── src/
    ├── main.jsx             # React entry — mounts <App />
    ├── App.jsx              # Root: BrowserRouter + BookingProvider + AppLayout + Routes
    ├── index.css            # Full design system (CSS custom properties + all component styles)
    │
    ├── context/
    │   └── BookingContext.jsx   # Global state: search params, results, bookings CRUD
    │
    ├── data/
    │   └── flightData.js        # CITIES, ROUTE_DURATIONS, flight generator, searchFlights(), getFlightById()
    │
    ├── services/
    │   ├── api.js               # Axios instance (baseURL: http://localhost:3001, timeout: 8s)
    │   ├── bookingService.js    # GET /bookings, POST /bookings, DELETE /bookings/:id
    │   └── userService.js       # GET /users/1, PUT /users/1
    │
    ├── components/
    │   ├── Sidebar.jsx          # Collapsible nav sidebar with booking badge count
    │   ├── FlightSearchCard.jsx # Search form: origin, destination, date, cabin class, passengers
    │   ├── FlightDetailCard.jsx # Single flight card in results list with "Book Now" CTA
    │   ├── Main.jsx             # Search results page: filter sidebar + sorted/filtered flight list
    │   └── FlightDetailSlider.jsx # (Slider component for flight highlights)
    │
    └── pages/
        ├── HomePage.jsx         # Hero + FlightSearchCard + stats row + popular routes + recent bookings
        ├── SearchResultsPage.jsx# Thin wrapper that renders <Main />
        ├── BookingPage.jsx      # 3-step booking wizard (passenger details → seat map → confirm)
        ├── TicketPage.jsx       # Boarding pass card + confetti + QR stub + print button
        ├── HistoryPage.jsx      # Full booking history with cancel flow
        ├── SchedulePage.jsx     # Static daily departure schedule table
        ├── SupportPage.jsx      # Accordion FAQ + contact form
        └── SettingsPage.jsx     # Profile editor + notifications + theme picker + security
```

---

## 🗺️ Application Routes

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` | Landing page with hero, search card, popular routes |
| `/results` | `SearchResultsPage` → `Main` | Flight search results with filters |
| `/booking/:flightId` | `BookingPage` | 3-step booking wizard |
| `/ticket/:bookingId` | `TicketPage` | Boarding pass / confirmation |
| `/history` | `HistoryPage` | All user bookings |
| `/schedule` | `SchedulePage` | Static daily departure schedule |
| `/support` | `SupportPage` | FAQ accordion + contact form |
| `/settings` | `SettingsPage` | Profile, notifications, appearance, security |

---

## 🗃️ Data Architecture

### Flight Data (`src/data/flightData.js`)

Flights are **generated dynamically** at search time — there is no pre-built flight list. The generator uses:

- **10 cities** with IATA codes and aliases for fuzzy matching
- **ROUTE_DURATIONS map** — city-pair-keyed flight durations in minutes
- **6 airlines**: Air India, IndiGo, SpiceJet, Vistara, GoAir, AirAsia India
- **12 departure slots** — generates 2 departures per airline per route = **12 flights per search**
- **3 cabin classes**: Economy (1×), Business (2.4×), First Class (4.2×) with base price randomisation ± ₹1,000

```
searchFlights(from, to, date) → Flight[]
getFlightById(id, from, to)   → Flight | null
```

Each `Flight` object contains:

```js
{
  id, flightNumber, airline, airlineId, airlineColor,
  from, fromCode, to, toCode,
  departure, departureFormatted, arrival, arrivalFormatted,
  duration, durationMinutes,
  class, price, seatsAvailable,
  stops, stopLabel, baggage, meal, refundable
}
```

### JSON Server (`db.json`)

```json
{
  "bookings": [],    // POST /bookings, GET /bookings, DELETE /bookings/:id
  "users": [{ ... }] // GET /users/1, PUT /users/1
}
```

### Booking Object Schema

```js
{
  id: "ABCD1234",           // 8-char UUID slice
  flight: { ...flightObj }, // Full flight snapshot at booking time
  passenger: { firstName, lastName, email, phone, dob, gender },
  seat: "3A, 3B",           // Comma-separated selected seat IDs
  seats: ["3A", "3B"],      // Array form
  passengers: 2,            // Count
  date: "2026-06-15",       // ISO date string
  totalPrice: 9800,         // flight.price × passengers
  bookedAt: "2026-05-13T..."
}
```

---

## 🧩 State Management (`BookingContext`)

```
BookingProvider
├── searchParams      → { from, to, date, passengers, cabinClass }
├── searchResults     → Flight[] (set after search)
├── selectedFlight    → Flight | null (carried into BookingPage)
├── bookings          → Booking[] (from API or localStorage)
├── loading / error
├── addBooking(booking)     → POST to API → updates state
├── removeBooking(id)       → DELETE from API → filters state
├── getBookingById(id)      → local lookup
└── refetchBookings()       → re-GETs /bookings
```

**Offline resilience**: all mutations try the API first; on failure they silently fall back to `localStorage` under key `fa_bookings`.

---

## 🎨 Design System

All styles live in **`src/index.css`** (35 KB). Key CSS custom properties:

```css
--bg-page:      #0A0F1E   /* deepest navy */
--navy-card:    #13192B   /* card surfaces */
--navy-mid:     #1A2236   /* elevated panels */
--border:       rgba(255,255,255,0.07)
--blue-main:    #1A73E8   /* Google Blue — primary CTA */
--blue-light:   #4D94FF
--gold:         #C9A84C   /* accent for schedule / luxury feel */
--cream:        #F0EAD6
--font-heading: 'Playfair Display', serif
--font-body:    'Inter', sans-serif
```

Key animations defined in CSS:

| Keyframe | Used on |
|---|---|
| `fadeSlideIn` | Boarding pass, success banner |
| `planeFly` | ✈ icon on boarding pass route line |
| `seatPulse` | Selected seat in seat map |
| `confettiFall` | Ticket page confetti burst |
| `spin` | Loading spinner |

---

## 📋 npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `parcel index.html --port 1234` | Start Parcel dev server |
| `api` | `json-server --watch db.json --port 3001` | Start JSON Server |
| `dev:full` | `concurrently "npm run dev" "npm run api"` | Both servers together |
| `build` | `parcel build index.html --dist-dir dist` | Production build |
| `clean` | `rm -rf .parcel-cache dist` | Clear build artifacts |

---

## 🏙️ Supported Cities & Routes

| City | IATA | Aliases |
|---|---|---|
| Chennai | MAA | chennai, madras |
| Mumbai | BOM | mumbai, bombay |
| Delhi | DEL | delhi, new delhi, nd |
| Bengaluru | BLR | bengaluru, bangalore |
| Hyderabad | HYD | hyderabad |
| Kolkata | CCU | kolkata, calcutta |
| Pune | PNQ | pune |
| Ahmedabad | AMD | ahmedabad |
| Goa | GOI | goa |
| Jaipur | JAI | jaipur |

> Searches are **case-insensitive** and accept any alias or IATA code.

---

## 🔧 Configuration

### API Base URL
Edit `src/services/api.js` to change the backend URL:

```js
const api = axios.create({
  baseURL: 'http://localhost:3001',  // ← change for production
  timeout: 8000,
});
```

### JSON Server Port
Change the port in `package.json`:

```json
"api": "json-server --watch db.json --port 3001"
```

---

## 🚢 Deployment

### Frontend (Vercel / Netlify)

1. Run `npm run build` — output lands in `dist/`.
2. Deploy the `dist/` folder to Vercel or Netlify.
3. Set `baseURL` in `src/services/api.js` to your deployed JSON Server URL before building.

### Backend (JSON Server on Railway / Render)

Deploy `db.json` + a minimal `server.js` wrapper for `json-server` to any Node.js hosting platform. Set `CORS` to allow your frontend origin.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Karthick Kalaivanan**
- GitHub: [@Karthick1242004](https://github.com/Karthick1242004)
- Email: karthickkalaivanan101@gmail.com

---

<div align="center">
  Made with ❤️ and ✈️ by Karthick · © 2026 Frost Airlines
</div>
