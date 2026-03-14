import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFlightTakeoff } from 'react-icons/md';
import { useBooking } from '../context/BookingContext';
import { toast } from 'react-toastify';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { bookings, removeBooking } = useBooking();
  const [confirmCancel, setConfirmCancel] = useState(null); // bookingId to cancel

  const handleCancel = (id) => {
    removeBooking(id);
    setConfirmCancel(null);
    toast.success('Booking cancelled successfully.', { position: 'top-center' });
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)', padding: '28px 32px' }}>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>My Bookings</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>Your flight booking history</p>
      </div>

      <div className="page-content">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎟️</div>
            <h3>No Bookings Yet</h3>
            <p>Your confirmed flight bookings will appear here.</p>
            <button
              className="book-btn"
              style={{ margin: '20px auto', display: 'flex' }}
              onClick={() => navigate('/')}
            >
              <MdFlightTakeoff /> Search Flights
            </button>
          </div>
        ) : (
          <>
            <div className="section-sub" style={{ marginBottom: 16 }}>
              {bookings.length} booking{bookings.length > 1 ? 's' : ''} found
            </div>
            {bookings.map(b => {
              const travelDate = b.date
                ? new Date(b.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '—';
              return (
                <div key={b.id} className="history-card">
                  <div style={{ background: 'linear-gradient(135deg, #4361ee, #7209b7)', borderRadius: 10, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22, flexShrink: 0 }}>
                    ✈
                  </div>
                  <div className="history-route" style={{ flex: 1 }}>
                    <h4>{b.flight.from} → {b.flight.to}</h4>
                    <p>{b.flight.airline} · {b.flight.flightNumber} · {travelDate}</p>
                    <p style={{ fontSize: 12, marginTop: 2 }}>
                      {b.flight.departureFormatted} – {b.flight.arrivalFormatted} · Seat {b.seat || '—'} · Ref: <strong>{b.id}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <span className="history-badge badge-confirmed">✓ Confirmed</span>
                    <div className="history-price" style={{ marginTop: 6 }}>₹{b.totalPrice?.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                    <button className="view-ticket-btn" onClick={() => navigate(`/ticket/${b.id}`)}>
                      View Ticket →
                    </button>
                    {confirmCancel === b.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleCancel(b.id)}
                          style={{ flex: 1, padding: '6px 10px', background: 'var(--danger)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmCancel(null)}
                          style={{ flex: 1, padding: '6px 10px', background: 'var(--border-color)', color: 'var(--text-secondary)', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                        >
                          Keep
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmCancel(b.id)}
                        style={{ padding: '6px 12px', background: 'rgba(239,35,60,0.08)', color: 'var(--danger)', border: '1.5px solid rgba(239,35,60,0.2)', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'var(--transition)' }}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
