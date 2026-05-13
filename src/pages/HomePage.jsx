import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearchCard from '../components/FlightSearchCard';
import { useBooking } from '../context/BookingContext';
import { searchFlights } from '../data/flightData';

const POPULAR_ROUTES = [
  { from: 'Chennai',   to: 'Mumbai',    price: '₹3,800', icon: '🌊', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=70&auto=format' },
  { from: 'Delhi',     to: 'Bengaluru', price: '₹4,200', icon: '🌿', img: 'https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=400&q=70&auto=format' },
  { from: 'Mumbai',    to: 'Goa',       price: '₹2,900', icon: '🏖️', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=70&auto=format' },
  { from: 'Chennai',   to: 'Delhi',     price: '₹5,100', icon: '🏛️', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=70&auto=format' },
  { from: 'Hyderabad', to: 'Kolkata',   price: '₹4,600', icon: '🎨', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70&auto=format' },
  { from: 'Delhi',     to: 'Goa',       price: '₹3,500', icon: '🌺', img: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=400&q=70&auto=format' },
];

const HomePage = () => {
  const { bookings, setSearchParams, setSearchResults } = useBooking();
  const navigate = useNavigate();

  const handleQuickRoute = (route) => {
    const today = new Date().toISOString().split('T')[0];
    const results = searchFlights(route.from, route.to, today);
    setSearchParams({ from: route.from, to: route.to, date: today, passengers: 1 });
    setSearchResults(results);
    navigate('/results');
  };

  return (
    <div>
      {/* ── Cinematic Hero ── */}
      <div className="search-hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">✦ Frost Airlines — Premium Class</div>
          <h1 className="hero-title">Where shall we<br />take you today?</h1>
          <p className="hero-subtitle">20+ routes across India's finest destinations</p>
        </div>
      </div>

      {/* ── Floating Search Card ── */}
      <div className="search-card-wrap">
        <FlightSearchCard />
      </div>

      {/* ── Stats ── */}
      <div className="page-content" style={{ paddingTop: 36 }}>
        <div className="stats-row">
          <div className="stat-card" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon">✈️</div>
            <div className="stat-info">
              <div className="stat-value">20+</div>
              <div className="stat-label">Routes</div>
            </div>
          </div>
          <div className="stat-card" style={{ animationDelay: '0.2s' }}>
            <div className="stat-icon">🛫</div>
            <div className="stat-info">
              <div className="stat-value">6</div>
              <div className="stat-label">Airlines</div>
            </div>
          </div>
          <div className="stat-card" style={{ animationDelay: '0.3s' }}>
            <div className="stat-icon">🎟️</div>
            <div className="stat-info">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">My Bookings</div>
            </div>
          </div>
          <div className="stat-card" style={{ animationDelay: '0.4s' }}>
            <div className="stat-icon">💺</div>
            <div className="stat-info">
              <div className="stat-value">3</div>
              <div className="stat-label">Cabin Classes</div>
            </div>
          </div>
        </div>

        {/* ── Popular Routes ── */}
        <div className="section-title">Popular Destinations</div>
        <div className="section-sub">Click any route to instantly discover available flights</div>
        <div className="routes-grid">
          {POPULAR_ROUTES.map((route, i) => (
            <div
              key={i}
              className="route-card"
              onClick={() => handleQuickRoute(route)}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="rc-icon">{route.icon}</div>
              <div className="rc-cities">{route.from} → {route.to}</div>
              <div className="rc-price">From {route.price}</div>
            </div>
          ))}
        </div>

        {/* ── Recent Bookings ── */}
        {bookings.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 12 }}>Recent Bookings</div>
            <div className="section-sub">Your latest journeys</div>
            {bookings.slice(0, 3).map(b => (
              <div key={b.id} className="history-card">
                <div className="history-route">
                  <h4>{b.flight.from} → {b.flight.to}</h4>
                  <p>{b.flight.airline} · {b.flight.flightNumber} · {b.date}</p>
                </div>
                <span className="history-badge badge-confirmed">✓ Confirmed</span>
                <div className="history-price">₹{b.totalPrice?.toLocaleString('en-IN')}</div>
                <button className="view-ticket-btn" onClick={() => navigate(`/ticket/${b.id}`)}>
                  View Ticket
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;