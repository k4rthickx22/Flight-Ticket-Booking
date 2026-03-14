import React from 'react';
import { useNavigate } from 'react-router-dom';
import FlightSearchCard from '../components/FlightSearchCard';
import { useBooking } from '../context/BookingContext';
import { searchFlights } from '../data/flightData';

const POPULAR_ROUTES = [
  { from: 'Chennai', to: 'Mumbai', price: '₹3,800', icon: '🌊' },
  { from: 'Delhi', to: 'Bengaluru', price: '₹4,200', icon: '🌿' },
  { from: 'Mumbai', to: 'Goa', price: '₹2,900', icon: '🏖️' },
  { from: 'Chennai', to: 'Delhi', price: '₹5,100', icon: '🏛️' },
  { from: 'Hyderabad', to: 'Kolkata', price: '₹4,600', icon: '🎨' },
  { from: 'Delhi', to: 'Goa', price: '₹3,500', icon: '🌺' },
];

const HomePage = () => {
  const { bookings, setSearchParams, setSearchResults } = useBooking();
  const navigate = useNavigate();

  // Clicking a popular route pre-fills the form AND immediately runs the search
  const handleQuickRoute = (route) => {
    const today = new Date().toISOString().split('T')[0];
    const results = searchFlights(route.from, route.to, today);
    setSearchParams({ from: route.from, to: route.to, date: today, passengers: 1 });
    setSearchResults(results);
    navigate('/results');
  };

  return (
    <div>
      {/* Hero + Search */}
      <div className="search-hero">
        <h1 className="search-hero-title">Where do you want to fly? ✈️</h1>
        <p className="search-hero-sub">Search from 20+ routes across India's top airlines</p>
      </div>

      <div style={{ padding: '0 28px', marginTop: -56 }}>
        <FlightSearchCard />
      </div>

      {/* Stats */}
      <div className="page-content" style={{ paddingTop: 28 }}>
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(67,97,238,0.1)', color: 'var(--primary)' }}>✈️</div>
            <div className="stat-info">
              <div className="stat-value">20+</div>
              <div className="stat-label">Routes Available</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(6,214,160,0.1)', color: '#06d6a0' }}>🛫</div>
            <div className="stat-info">
              <div className="stat-value">6</div>
              <div className="stat-label">Airlines</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(247,37,133,0.1)', color: 'var(--accent)' }}>🎟️</div>
            <div className="stat-info">
              <div className="stat-value">{bookings.length}</div>
              <div className="stat-label">My Bookings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(114,9,183,0.1)', color: 'var(--secondary)' }}>💺</div>
            <div className="stat-info">
              <div className="stat-value">3</div>
              <div className="stat-label">Cabin Classes</div>
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="section-title">Popular Routes</div>
        <div className="section-sub">Click a route to instantly search flights</div>
        <div className="routes-grid">
          {POPULAR_ROUTES.map((route, i) => (
            <div key={i} className="route-card" onClick={() => handleQuickRoute(route)}>
              <div className="rc-icon">{route.icon}</div>
              <div className="rc-cities">{route.from} → {route.to}</div>
              <div className="rc-price">From {route.price}</div>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        {bookings.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 8 }}>Recent Bookings</div>
            <div className="section-sub">Your latest trips</div>
            {bookings.slice(0, 3).map(b => (
              <div key={b.id} className="history-card">
                <div className="history-route">
                  <h4>{b.flight.from} → {b.flight.to}</h4>
                  <p>{b.flight.airline} · {b.flight.flightNumber} · {b.date}</p>
                </div>
                <span className="history-badge badge-confirmed">✓ Confirmed</span>
                <div className="history-price">₹{b.totalPrice?.toLocaleString('en-IN')}</div>
                <button className="view-ticket-btn" onClick={() => navigate(`/ticket/${b.id}`)}>View Ticket</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;