import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdPrint, MdArrowBack } from 'react-icons/md';
import { useBooking } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';

// Generate a pseudo-QR code visually using a grid
function QRCode({ value }) {
  const seed = value.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => {
    const v = (seed * (i + 1) * 31337) % 100;
    const r = Math.floor(i / 7), c = i % 7;
    const corner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
    return corner ? true : v < 50;
  });
  return (
    <div className="qr-box">
      <div className="qr-inner">
        {cells.map((filled, i) => (
          <div key={i} className="qr-cell" style={{ background: filled ? 'white' : 'transparent' }} />
        ))}
      </div>
    </div>
  );
}

const TicketPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { getBookingById } = useBooking();
  const [booking, setBooking] = useState(getBookingById(bookingId));
  const [fetching, setFetching] = useState(!booking);

  // If not in context (e.g. direct URL), fetch from API
  useEffect(() => {
    if (!booking && bookingId) {
      setFetching(true);
      bookingService.getById(bookingId)
        .then(data => setBooking(data))
        .catch(() => setBooking(null))
        .finally(() => setFetching(false));
    }
  }, [bookingId]);

  if (fetching) {
    return (
      <div className="page-content">
        <div className="loading-wrap"><div className="spinner"></div><div className="loading-text">Loading ticket...</div></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-icon">🎟️</div>
          <h3>Ticket Not Found</h3>
          <p>We couldn't find this booking. Please check your booking history.</p>
          <button className="back-btn" style={{ margin: '20px auto', display: 'flex' }} onClick={() => navigate('/history')}>
            ← View My Bookings
          </button>
        </div>
      </div>
    );
  }

  const { flight, passenger, seat, date, totalPrice, id } = booking;
  const travelDate = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  return (
    <div className="ticket-wrapper">
      <div style={{ width: '100%', maxWidth: 640 }}>
        {/* Success Banner */}
        <div style={{ background: 'rgba(6,214,160,0.1)', border: '1.5px solid rgba(6,214,160,0.3)', borderRadius: 'var(--radius-md)', padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, color: '#05a57a', fontSize: 15 }}>Booking Confirmed!</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your boarding pass is ready. Have a great flight!</div>
          </div>
        </div>

        {/* Boarding Pass */}
        <div className="boarding-pass">
          <div className="bp-header">
            <div className="bp-airline">{flight.airline} · {flight.flightNumber}</div>
            <div className="bp-route">
              <div>
                <div className="bp-city">{flight.fromCode}</div>
                <div className="bp-code">{flight.from}</div>
              </div>
              <div className="bp-arrow">→</div>
              <div>
                <div className="bp-city">{flight.toCode}</div>
                <div className="bp-code">{flight.to}</div>
              </div>
            </div>
            <span className="bp-badge">✈ {flight.stopLabel}</span>
          </div>

          <div className="bp-body">
            <div className="bp-grid">
              <div className="bp-field"><label>Passenger</label><div className="bp-value">{passenger.firstName} {passenger.lastName}</div></div>
              <div className="bp-field"><label>Date</label><div className="bp-value">{travelDate}</div></div>
              <div className="bp-field"><label>Seat</label><div className="bp-value">{seat || 'ANY'}</div></div>
              <div className="bp-field"><label>Departure</label><div className="bp-value">{flight.departureFormatted}</div></div>
              <div className="bp-field"><label>Arrival</label><div className="bp-value">{flight.arrivalFormatted}</div></div>
              <div className="bp-field"><label>Duration</label><div className="bp-value">{flight.duration}</div></div>
              <div className="bp-field"><label>Class</label><div className="bp-value">{flight.class}</div></div>
              <div className="bp-field"><label>Baggage</label><div className="bp-value">{flight.baggage}</div></div>
              <div className="bp-field"><label>Total Paid</label><div className="bp-value" style={{ color: 'var(--primary)' }}>₹{totalPrice?.toLocaleString('en-IN')}</div></div>
            </div>

            <div className="bp-divider">
              <div className="bp-circle-left"></div>
              <div style={{ flex: 1, borderTop: '2px dashed var(--border-color)' }}></div>
              <div className="bp-circle-right"></div>
            </div>

            <div className="bp-qr">
              <QRCode value={id} />
              <div>
                <div className="booking-ref-label">Booking Reference</div>
                <div className="booking-ref">{id}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Show this code at the airport check-in counter</div>
              </div>
            </div>
          </div>

          <div className="bp-footer">
            <button className="back-btn" onClick={() => navigate('/history')}><MdArrowBack /> My Bookings</button>
            <button className="back-btn" onClick={() => navigate('/')}>Book Another</button>
            <button className="print-btn" onClick={() => window.print()}><MdPrint /> Print Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
