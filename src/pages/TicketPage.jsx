import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdPrint, MdArrowBack } from 'react-icons/md';
import { useBooking } from '../context/BookingContext';
import { bookingService } from '../services/bookingService';

/* ── Pseudo QR Code ── */
function QRCode({ value }) {
  const seed = value.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => {
    const v = (seed * (i + 1) * 31337) % 100;
    const r = Math.floor(i / 7), c = i % 7;
    const corner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
    return corner ? true : v < 50;
  });
  return (
    <div style={{
      width: 70, height: 70,
      display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 1, padding: 5,
      background: 'white', borderRadius: 8,
    }}>
      {cells.map((filled, i) => (
        <div key={i} style={{ background: filled ? '#0A0F1E' : 'transparent', borderRadius: 1 }} />
      ))}
    </div>
  );
}

/* ── Confetti burst — Google Blue palette ── */
function Confetti() {
  const colors = ['#1A73E8', '#4D94FF', '#ffffff', '#0F9D58', '#FBBC04', '#1557B0'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${1.5 + Math.random() * 1.5}s`,
    size: `${6 + Math.random() * 8}px`,
  }));
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: '-20px', left: p.left,
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? '50%' : '3px',
          animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

const TicketPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { getBookingById } = useBooking();
  const [booking, setBooking] = useState(getBookingById(bookingId));
  const [fetching, setFetching] = useState(!booking);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!booking && bookingId) {
      setFetching(true);
      bookingService.getById(bookingId)
        .then(data => setBooking(data))
        .catch(() => setBooking(null))
        .finally(() => setFetching(false));
    }
    const t = setTimeout(() => setShowConfetti(false), 3200);
    return () => clearTimeout(t);
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
  const travelDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="ticket-wrapper">
      {showConfetti && <Confetti />}

      <div style={{ width: '100%', maxWidth: 660 }}>
        {/* ── Success Banner ── */}
        <div style={{
          background: 'rgba(15,157,88,0.08)',
          border: '1px solid rgba(15,157,88,0.25)',
          borderRadius: 16,
          padding: '16px 22px',
          marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 14,
          animation: 'fadeSlideIn 0.5s cubic-bezier(0.4,0,0.2,1) both',
        }}>
          <span style={{ fontSize: 30 }}>🎉</span>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#0F9D58', fontSize: 16 }}>
              Booking Confirmed!
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
              Your boarding pass is ready. We wish you a wonderful flight.
            </div>
          </div>
        </div>

        {/* ── Boarding Pass ── */}
        <div style={{
          background: 'var(--navy-card)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.2)',
          animation: 'fadeSlideIn 0.6s 0.1s cubic-bezier(0.4,0,0.2,1) both',
          position: 'relative',
        }}>
          {/* Blue left stripe */}
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 5, background: 'linear-gradient(180deg,#4D94FF,#1A73E8,#1557B0)' }} />

          {/* ── Blue Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, #1557B0 0%, #1A73E8 55%, #4D94FF 100%)',
            padding: '22px 28px 22px 34px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', marginBottom: 4 }}>
                ✈ Frost Airlines
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>
                {flight.airline} · {flight.flightNumber}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 20, padding: '5px 14px',
              fontSize: 11, fontWeight: 700,
              color: '#fff', letterSpacing: '0.05em',
            }}>
              {flight.stopLabel || 'Non-stop'}
            </div>
          </div>

          {/* ── Route Block ── */}
          <div style={{
            padding: '28px 32px 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18,
          }}>
            <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 46, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {flight.fromCode}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 5 }}>{flight.from}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#4D94FF', marginTop: 7 }}>{flight.departureFormatted}</div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{flight.duration}</div>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(26,115,232,0.35)' }} />
                <div style={{ color: '#4D94FF', fontSize: 18, animation: 'planeFly 2s ease-in-out infinite alternate' }}>✈</div>
                <div style={{ flex: 1, height: 1, background: 'rgba(26,115,232,0.35)' }} />
              </div>
              <div style={{ fontSize: 10, color: '#4D94FF', fontWeight: 600, letterSpacing: '0.05em' }}>{flight.stopLabel || 'Direct'}</div>
            </div>

            <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 46, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                {flight.toCode}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 5 }}>{flight.to}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#4D94FF', marginTop: 7 }}>{flight.arrivalFormatted}</div>
            </div>
          </div>

          {/* ── Details Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'Passenger', value: `${passenger.firstName} ${passenger.lastName}` },
              { label: 'Date', value: travelDate },
              { label: 'Seat', value: seat || 'ANY', highlight: true },
              { label: 'Class', value: flight.class },
              { label: 'Baggage', value: flight.baggage },
              { label: 'Total Paid', value: `₹${totalPrice?.toLocaleString('en-IN')}`, highlight: true },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px 18px', background: 'var(--navy-card)' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5 }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: item.highlight ? '#4D94FF' : 'var(--text-primary)',
                  fontFamily: item.label === 'Passenger' ? 'var(--font-heading)' : 'var(--font-body)',
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* ── Dashed Tear Line ── */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
            <div style={{ position: 'absolute', left: -16, width: 32, height: 32, background: 'var(--bg-page)', borderRadius: '50%', border: '1px solid var(--border)', borderLeft: 'none' }} />
            <div style={{ flex: 1, borderTop: '2px dashed rgba(255,255,255,0.08)', margin: '0 16px' }} />
            <div style={{ position: 'absolute', right: -16, width: 32, height: 32, background: 'var(--bg-page)', borderRadius: '50%', border: '1px solid var(--border)', borderRight: 'none' }} />
          </div>

          {/* ── QR Stub ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '22px 28px 22px 34px' }}>
            <QRCode value={id} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5 }}>
                Booking Reference
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: '#4D94FF', letterSpacing: '0.08em' }}>
                {id}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 7 }}>
                Show this code at airport check-in
              </div>
            </div>
          </div>

          {/* ── Footer Actions ── */}
          <div style={{ display: 'flex', gap: 10, padding: '14px 22px 22px', flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
            <button className="back-btn" onClick={() => navigate('/history')}><MdArrowBack /> My Bookings</button>
            <button className="back-btn" onClick={() => navigate('/')}>Book Another</button>
            <button className="print-btn" onClick={() => window.print()} style={{ marginLeft: 'auto' }}>
              <MdPrint /> Print Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
