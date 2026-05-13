import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MdPerson, MdAirlineSeatReclineNormal, MdCheckCircle } from 'react-icons/md';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useBooking } from '../context/BookingContext';
import { getFlightById } from '../data/flightData';

const ROWS = 10;
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TAKEN_SEATS = [
  '1A', '1B', '2C', '2E', '3A', '3F', '4B', '4D',
  '5C', '5E', '6A', '6D', '7B', '7F', '8A', '8C', '9E', '10B', '10D'
];
const STEPS = ['Passenger Details', 'Seat Selection', 'Confirmation'];

function generateSeats() {
  const seats = [];
  for (let r = 1; r <= ROWS; r++) {
    COLS.forEach(c => {
      seats.push({ id: `${r}${c}`, row: r, col: c, taken: TAKEN_SEATS.includes(`${r}${c}`) });
    });
  }
  return seats;
}

const BookingPage = () => {
  const { flightId } = useParams();
  const [qparams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedFlight, searchParams, addBooking } = useBooking();

  const from = qparams.get('from') || searchParams.from;
  const to   = qparams.get('to')   || searchParams.to;

  const [flight, setFlight] = useState(selectedFlight);
  const [step, setStep] = useState(0);
  const [seats] = useState(generateSeats);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const passengerCount = Number(searchParams.passengers) || 1;

  const [passenger, setPassenger] = useState({
    firstName: '', lastName: '', email: '', phone: '', dob: '', gender: 'Male',
  });

  useEffect(() => {
    if (!flight && flightId) {
      const found = getFlightById(flightId, from, to);
      if (found) setFlight(found);
      else navigate('/');
    }
  }, [flightId, from, to]);

  if (!flight) {
    return (
      <div className="page-content">
        <div className="loading-wrap"><div className="spinner" /><div className="loading-text">Loading flight...</div></div>
      </div>
    );
  }

  const totalPrice = flight.price * passengerCount;

  const handlePassengerChange = (e) => {
    const { name, value } = e.target;
    setPassenger(prev => ({ ...prev, [name]: value }));
  };

  const handleSeatClick = (seat) => {
    if (seat.taken) return;
    setSelectedSeats(prev => {
      if (prev.includes(seat.id)) return prev.filter(s => s !== seat.id);
      if (prev.length >= passengerCount) {
        toast.info(`You can select up to ${passengerCount} seat${passengerCount > 1 ? 's' : ''}.`, { position: 'top-center' });
        return prev;
      }
      return [...prev, seat.id];
    });
  };

  const handleNextStep = () => {
    if (step === 0) {
      if (!passenger.firstName || !passenger.lastName || !passenger.email || !passenger.phone) {
        toast.error('Please fill in all required fields.', { position: 'top-center' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
        toast.error('Please enter a valid email.', { position: 'top-center' });
        return;
      }
    }
    if (step === 1 && selectedSeats.length === 0) {
      toast.error('Please select at least one seat.', { position: 'top-center' });
      return;
    }
    setStep(s => s + 1);
  };

  const handleConfirm = () => {
    const booking = {
      id: uuidv4().toUpperCase().replace(/-/g, '').slice(0, 8),
      flight, passenger,
      seat: selectedSeats.join(', '),
      seats: selectedSeats,
      passengers: passengerCount,
      date: searchParams.date,
      totalPrice,
      bookedAt: new Date().toISOString(),
    };
    addBooking(booking);
    toast.success('🎉 Booking confirmed!', { position: 'top-center' });
    navigate(`/ticket/${booking.id}`);
  };

  // Seat style with Google Blue palette
  const seatStyle = (seat) => {
    const isSelected = selectedSeats.includes(seat.id);
    return {
      width: 36, height: 36,
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 700,
      cursor: seat.taken ? 'not-allowed' : 'pointer',
      transition: 'all 0.16s cubic-bezier(0.4,0,0.2,1)',
      background: seat.taken
        ? 'rgba(255,255,255,0.04)'
        : isSelected
          ? '#1A73E8'
          : 'rgba(232,240,254,0.10)',
      color: seat.taken
        ? 'rgba(255,255,255,0.15)'
        : isSelected
          ? '#fff'
          : 'rgba(241,245,255,0.75)',
      border: seat.taken
        ? '1.5px solid rgba(255,255,255,0.06)'
        : isSelected
          ? '1.5px solid #4D94FF'
          : '1.5px solid rgba(255,255,255,0.12)',
      boxShadow: isSelected ? '0 4px 14px rgba(26,115,232,0.38)' : 'none',
      animation: isSelected ? 'seatPulse 1.6s ease infinite' : 'none',
    };
  };

  return (
    <div>
      {/* ── Sticky Step Indicators ── */}
      <div className="booking-steps">
        {STEPS.map((label, i) => (
          <React.Fragment key={i}>
            <div className={`step${step > i ? ' done' : step === i ? ' active' : ''}`}>
              <div className="step-num">{step > i ? '✓' : i + 1}</div>
              <div className="step-label">{label}</div>
            </div>
            {i < STEPS.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        ))}
      </div>

      <div className="booking-page">
        <div className="booking-main">

          {/* ── Step 0: Passenger Details ── */}
          {step === 0 && (
            <div className="book-card">
              <div className="book-card-title"><MdPerson /> Passenger Details</div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input className="form-control" name="firstName" value={passenger.firstName} onChange={handlePassengerChange} placeholder="First name" />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input className="form-control" name="lastName" value={passenger.lastName} onChange={handlePassengerChange} placeholder="Last name" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input className="form-control" type="email" name="email" value={passenger.email} onChange={handlePassengerChange} placeholder="you@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input className="form-control" type="tel" name="phone" value={passenger.phone} onChange={handlePassengerChange} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input className="form-control" type="date" name="dob" value={passenger.dob} onChange={handlePassengerChange} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control" name="gender" value={passenger.gender} onChange={handlePassengerChange}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <button className="confirm-btn" style={{ marginTop: 8 }} onClick={handleNextStep}>
                Continue to Seat Selection →
              </button>
            </div>
          )}

          {/* ── Step 1: Seat Selection ── */}
          {step === 1 && (
            <div className="book-card">
              <div className="book-card-title"><MdAirlineSeatReclineNormal /> Select Your Seat{passengerCount > 1 ? 's' : ''}</div>

              {/* Seat counter */}
              <div style={{
                marginBottom: 16, padding: '10px 16px',
                background: 'rgba(26,115,232,0.08)',
                border: '1px solid rgba(26,115,232,0.25)',
                borderRadius: 10, fontSize: 13,
                color: '#4D94FF', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>💺</span>
                Select {passengerCount} seat{passengerCount > 1 ? 's' : ''}&nbsp;—&nbsp;
                <span style={{ color: 'var(--text-primary)' }}>
                  {selectedSeats.length} / {passengerCount} selected
                </span>
                {selectedSeats.length === passengerCount && (
                  <span style={{ marginLeft: 'auto', color: '#0F9D58', fontWeight: 700 }}>✓ All seats selected</span>
                )}
              </div>

              {/* Legend */}
              <div className="seat-legend" style={{ marginBottom: 16 }}>
                <div className="legend-item">
                  <div style={{ width: 20, height: 20, background: 'rgba(232,240,254,0.10)', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 6 }} />
                  Available
                </div>
                <div className="legend-item">
                  <div style={{ width: 20, height: 20, background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 6 }} />
                  Taken
                </div>
                <div className="legend-item">
                  <div style={{ width: 20, height: 20, background: '#1A73E8', border: '1.5px solid #4D94FF', borderRadius: 6, boxShadow: '0 2px 8px rgba(26,115,232,0.4)' }} />
                  Selected
                </div>
              </div>

              {/* Cabin view */}
              <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                {/* Column headers */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 10, padding: '0 48px' }}>
                  {['A', 'B', 'C', '', 'D', 'E', 'F'].map((c, i) => (
                    <div key={i} style={{ width: 36, textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{c}</div>
                  ))}
                </div>

                {Array.from({ length: ROWS }, (_, ri) => ri + 1).map(row => (
                  <div key={row} style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                    <div style={{ width: 22, textAlign: 'right', fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{row}</div>
                    {['A', 'B', 'C'].map(col => {
                      const seat = seats.find(s => s.id === `${row}${col}`);
                      return <div key={col} style={seatStyle(seat)} onClick={() => handleSeatClick(seat)}>{col}</div>;
                    })}
                    <div style={{ width: 20, textAlign: 'center', color: 'rgba(255,255,255,0.12)', fontSize: 9 }}>│</div>
                    {['D', 'E', 'F'].map(col => {
                      const seat = seats.find(s => s.id === `${row}${col}`);
                      return <div key={col} style={seatStyle(seat)} onClick={() => handleSeatClick(seat)}>{col}</div>;
                    })}
                    <div style={{ width: 22, fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>{row}</div>
                  </div>
                ))}
              </div>

              {/* Selected seat chips */}
              {selectedSeats.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {selectedSeats.map(s => (
                    <span key={s} style={{
                      background: '#1A73E8', color: '#fff',
                      fontWeight: 700, fontSize: 11,
                      padding: '4px 12px', borderRadius: 50,
                      display: 'flex', alignItems: 'center', gap: 5,
                      boxShadow: '0 2px 8px rgba(26,115,232,0.35)',
                    }}>
                      💺 {s}
                      <span onClick={() => setSelectedSeats(prev => prev.filter(x => x !== s))}
                        style={{ cursor: 'pointer', fontWeight: 400, opacity: 0.75, fontSize: 14 }} title="Remove">×</span>
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="back-btn" onClick={() => setStep(0)}>← Back</button>
                <button className="confirm-btn" style={{ flex: 1 }} onClick={handleNextStep}>
                  Continue to Confirmation →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Confirm ── */}
          {step === 2 && (
            <div className="book-card">
              <div className="book-card-title"><MdCheckCircle color="var(--blue-light)" /> Review &amp; Confirm</div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>Flight</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{flight.from} → {flight.to}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{flight.airline} · {flight.flightNumber}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{flight.departureFormatted} → {flight.arrivalFormatted}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{flight.duration}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', marginBottom: 18 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase' }}>Passenger</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{passenger.firstName} {passenger.lastName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{passenger.email} · {passenger.phone}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
                  {passengerCount > 1 ? 'Seats' : 'Seat'}:{' '}
                  <strong style={{ color: '#4D94FF' }}>
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Not selected'}
                  </strong>{' '}
                  · Gender: {passenger.gender}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="confirm-btn" style={{ flex: 1 }} onClick={handleConfirm}>
                  🎉 Confirm & Book — ₹{totalPrice.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Booking Summary Sidebar ── */}
        <div className="booking-sidebar">
          <div className="summary-card">
            <div className="summary-header">
              <h3>Flight Summary</h3>
              <p>{flight.from} → {flight.to}</p>
            </div>
            <div className="summary-body">
              {[
                { label: 'Airline', value: flight.airline },
                { label: 'Flight No.', value: flight.flightNumber },
                { label: 'Departure', value: flight.departureFormatted },
                { label: 'Arrival', value: flight.arrivalFormatted },
                { label: 'Duration', value: flight.duration },
                { label: 'Class', value: flight.class },
                { label: 'Passengers', value: passengerCount },
              ].map(row => (
                <div className="summary-row" key={row.label}>
                  <span className="s-label">{row.label}</span>
                  <span className="s-value">{row.value}</span>
                </div>
              ))}
              <div className="summary-row">
                <span className="s-label">{passengerCount > 1 ? 'Seats' : 'Seat'}</span>
                <span className="s-value" style={{ color: selectedSeats.length > 0 ? '#4D94FF' : 'var(--text-muted)', fontSize: 11 }}>
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : '—'}
                </span>
              </div>
              <div className="summary-row">
                <span className="s-label">Base Fare</span>
                <span className="s-value">₹{flight.price.toLocaleString('en-IN')} × {passengerCount}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Taxes & Fees</span>
                <span className="s-value">₹{Math.round(totalPrice * 0.12).toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span className="s-label" style={{ fontWeight: 700 }}>Total</span>
                <span className="s-value summary-total">₹{Math.round(totalPrice * 1.12).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
