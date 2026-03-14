import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowForward } from 'react-icons/md';
import { useBooking } from '../context/BookingContext';

const airlines_colors = {
  'AI': '#e63946', 'IND': '#0066cc', 'SJ': '#e63946',
  'VIS': '#6a4c9c', 'GO': '#00b4d8', 'AK': '#e63946',
};

const FlightDetailCard = ({ flight }) => {
  const navigate = useNavigate();
  const { setSelectedFlight, searchParams } = useBooking();

  if (!flight) return null;

  const handleBook = () => {
    setSelectedFlight(flight);
    navigate(`/booking/${flight.id}?from=${encodeURIComponent(searchParams.from)}&to=${encodeURIComponent(searchParams.to)}`);
  };

  const bgColor = airlines_colors[flight.airlineId] || '#4361ee';

  return (
    <div className="flight-card">
      <div className="flight-card-top">
        <div className="airline-info">
          <div
            className="airline-logo-circle"
            style={{ background: `linear-gradient(135deg, ${bgColor}, ${bgColor}aa)` }}
          >
            {flight.airlineId}
          </div>
          <div>
            <div className="airline-name">{flight.airline}</div>
            <div className="airline-number">{flight.flightNumber} · {flight.class}</div>
          </div>
        </div>
        <div className="flight-price">
          <div className="price-amount">₹{flight.price.toLocaleString('en-IN')}</div>
          <div className="price-per-person">per person</div>
        </div>
      </div>

      <div className="flight-card-route">
        <div className="route-city">
          <div className="route-time">{flight.departureFormatted}</div>
          <div className="route-code">{flight.fromCode} · {flight.from}</div>
        </div>

        <div className="route-middle">
          <div className="route-duration">{flight.duration}</div>
          <div className="route-line">
            <div className="route-dot"></div>
            <div className="route-dash"></div>
            <span className="route-plane-icon">✈</span>
            <div className="route-dash"></div>
            <div className="route-dot"></div>
          </div>
          <div className="route-stop">{flight.stopLabel}</div>
        </div>

        <div className="route-city right">
          <div className="route-time">{flight.arrivalFormatted}</div>
          <div className="route-code">{flight.toCode} · {flight.to}</div>
        </div>
      </div>

      <div className="flight-card-bottom">
        <div className="flight-tags">
          <span className="tag tag-green">🧳 {flight.baggage}</span>
          {flight.meal && <span className="tag tag-blue">🍽️ Meal</span>}
          {flight.refundable
            ? <span className="tag tag-green">✓ Refundable</span>
            : <span className="tag tag-orange">Non-refundable</span>}
          <span className="tag tag-blue">💺 {flight.seatsAvailable} seats left</span>
        </div>
        <button className="book-btn" onClick={handleBook}>
          Book Now <MdArrowForward />
        </button>
      </div>
    </div>
  );
};

export default FlightDetailCard;