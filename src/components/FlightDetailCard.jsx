import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const FlightDetailCard = ({ flight }) => {
  const navigate = useNavigate();
  const { setSelectedFlight, searchParams } = useBooking();

  if (!flight) return null;

  const handleBook = () => {
    setSelectedFlight(flight);
    navigate(`/booking/${flight.id}?from=${encodeURIComponent(searchParams.from)}&to=${encodeURIComponent(searchParams.to)}`);
  };

  return (
    <div className="flight-card">
      {/* Top Row: Airline + Price */}
      <div className="fc-top">
        <span className="fc-airline-badge">{flight.airlineId}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{flight.airline}</div>
          <div className="fc-flight-no">{flight.flightNumber}</div>
        </div>
        <span className="fc-class-badge">{flight.class}</span>
      </div>

      {/* Route: Time — Animated Plane Line — Time */}
      <div className="fc-route">
        <div className="fc-time">
          <div className="fc-time-val">{flight.departureFormatted}</div>
          <div className="fc-time-code">{flight.fromCode} · {flight.from}</div>
        </div>

        <div className="fc-middle">
          <div className="fc-duration">{flight.duration}</div>
          <div className="fc-line">
            <div className="fc-line-bar" />
            <span className="fc-plane-icon">✈</span>
            <div className="fc-line-bar" />
          </div>
          <div className="fc-stops">{flight.stopLabel}</div>
        </div>

        <div className="fc-time right" style={{ textAlign: 'right' }}>
          <div className="fc-time-val">{flight.arrivalFormatted}</div>
          <div className="fc-time-code">{flight.toCode} · {flight.to}</div>
        </div>
      </div>

      {/* Bottom: Tags + Price + Book Button */}
      <div className="fc-bottom">
        <div className="fc-tags">
          <span className="fc-tag">🧳 {flight.baggage}</span>
          {flight.meal && <span className="fc-tag">🍽️ Meal</span>}
          {flight.refundable
            ? <span className="fc-tag" style={{ color: '#06d6a0', borderColor: 'rgba(6,214,160,0.3)' }}>✓ Refundable</span>
            : <span className="fc-tag" style={{ color: 'var(--text-muted)' }}>Non-refundable</span>}
          <span className="fc-tag">💺 {flight.seatsAvailable} left</span>
        </div>

        <div className="fc-price-wrap">
          <div>
            <div className="fc-price">₹{flight.price.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'right', letterSpacing: '0.04em' }}>per person</div>
          </div>
          <button className="book-now-btn" onClick={handleBook}>
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailCard;