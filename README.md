# ✈️ Flight Ticket Booking

A modern, full-featured **Flight Ticket Booking** web application built with **React + Vite**. This app allows users to search for flights, make bookings, view tickets, and manage booking history — all with a premium, responsive UI.

## 🚀 Features

- 🔍 **Flight Search** — Search flights by origin, destination, and date
- 📋 **Booking Flow** — Seamless passenger details and seat selection
- 🎫 **Ticket Generation** — View and download your confirmed ticket
- 📜 **Booking History** — Track all past and upcoming bookings
- 🔐 **User Authentication** — Secure login and registration
- 💾 **JSON Server Backend** — Persistent data storage via REST API
- 🎨 **Premium UI** — Glassmorphism design with smooth animations

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | Frontend Framework |
| Vite | Build Tool & Dev Server |
| React Router | Client-side Routing |
| Context API | State Management |
| JSON Server | Mock REST API Backend |
| CSS3 | Styling & Animations |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Karthick1242004/Flight-Ticket-Booking.git

# Navigate into the project
cd Flight-Ticket-Booking

# Install dependencies
npm install

# Start JSON Server (backend) — in one terminal
npx json-server --watch db.json --port 3001

# Start the development server — in another terminal
npm run dev
```

## 🌐 Live Demo

> Coming soon — to be deployed on Vercel.

## 📁 Project Structure

```
Flight-Ticket-Booking/
├── public/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # BookingContext (global state)
│   ├── data/           # Static flight data
│   ├── pages/          # Route-level pages
│   └── services/       # API service layer
├── db.json             # JSON Server database
├── index.html
└── vite.config.js
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
