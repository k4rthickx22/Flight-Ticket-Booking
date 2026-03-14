import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { MdFlightTakeoff, MdPerson, MdAirlineSeatReclineNormal, MdCheckCircle } from 'react-icons/md';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useBooking } from '../context/BookingContext';
import { getFlightById } from '../data/flightData';

const ROWS = 6;
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const TAKEN_SEATS = ['1A', '1B', '2C', '2E', '3A', '3F', '4B', '4D', '5C', '5E', '6A'];

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
  const to = qparams.get('to') || searchParams.to;

  const [flight, setFlight] = useState(selectedFlight);
  const [step, setStep] = useState(0);
  const [seats] = useState(generateSeats);
  const [selectedSeat, setSelectedSeat] = useState('');

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
        <div className="loading-wrap"><div className="spinner"></div><div className="loading-text">Loading flight...</div></div>
      </div>
    );
  }

  const totalPrice = flight.price * (searchParams.passengers || 1);

  const handlePassengerChange = (e) => {
    const { name, value } = e.target;
    setPassenger(prev => ({ ...prev, [name]: value }));
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
    if (step === 1 && !selectedSeat) {
      toast.error('Please select a seat.', { position: 'top-center' });
      return;
    }
    setStep(s => s + 1);
  };

  const handleConfirm = () => {
    const booking = {
      id: uuidv4().toUpperCase().replace(/-/g, '').slice(0, 8),
      flight,
      passenger,
      seat: selectedSeat,
      passengers: searchParams.passengers || 1,
      date: searchParams.date,
      totalPrice,
      bookedAt: new Date().toISOString(),
    };
    addBooking(booking);
    toast.success('🎉 Booking confirmed!', { position: 'top-center' });
    navigate(`/ticket/${booking.id}`);
  };

  return (
    <div className="page-content">
      {/* Steps */}
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
          {/* Step 0: Passenger Details */}
          {step === 0 && (
            <div className="book-card">
              <div className="book-card-title"><MdPerson /> Passenger Details</div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input className="form-control" name="firstName" value={passenger.firstName} onChange={handlePassengerChange} placeholder="Karthick" />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input className="form-control" name="lastName" value={passenger.lastName} onChange={handlePassengerChange} placeholder="Kumar" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input className="form-control" type="email" name="email" value={passenger.email} onChange={handlePassengerChange} placeholder="you@email.com" />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input className="form-control" type="tel" name="phone" value={passenger.phone} onChange={handlePassengerChange} placeholder="+91 98765 43210" />
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
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <button className="confirm-btn" style={{ marginTop: 8 }} onClick={handleNextStep}>
                Continue to Seat Selection →
              </button>
            </div>
          )}

          {/* Step 1: Seat Selection */}
          {step === 1 && (
            <div className="book-card">
              <div className="book-card-title"><MdAirlineSeatReclineNormal /> Select Your Seat</div>
              <div className="seat-legend">
                <div className="legend-item"><div style={{ width: 18, height: 18, background: 'white', border: '2px solid var(--border-color)', borderRadius: 4 }}></div>Available</div>
                <div className="legend-item"><div style={{ width: 18, height: 18, background: '#f0f0f0', border: '2px solid #e0e0e0', borderRadius: 4 }}></div>Taken</div>
                <div className="legend-item"><div style={{ width: 18, height: 18, background: 'var(--primary)', borderRadius: 4 }}></div>Selected</div>
              </div>

              {/* Column headers */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8, padding: '0 40px' }}>
                {['A','B','C','','D','E','F'].map((c, i) => (
                  <div key={i} style={{ width: 40, textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{c}</div>
                ))}
              </div>

              {Array.from({ length: ROWS }, (_, ri) => ri + 1).map(row => (
                <div key={row} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <div className="seat-row-label">{row}</div>
                  {['A','B','C'].map(col => {
                    const seat = seats.find(s => s.id === `${row}${col}`);
                    return (
                      <div
                        key={col}
                        className={`seat${seat.taken ? ' seat-taken' : selectedSeat === seat.id ? ' seat-selected' : ''}`}
                        onClick={() => !seat.taken && setSelectedSeat(seat.id)}
                      >
                        {col}
                      </div>
                    );
                  })}
                  <div className="seat-aisle" />
                  {['D','E','F'].map(col => {
                    const seat = seats.find(s => s.id === `${row}${col}`);
                    return (
                      <div
                        key={col}
                        className={`seat${seat.taken ? ' seat-taken' : selectedSeat === seat.id ? ' seat-selected' : ''}`}
                        onClick={() => !seat.taken && setSelectedSeat(seat.id)}
                      >
                        {col}
                      </div>
                    );
                  })}
                  <div className="seat-row-label">{row}</div>
                </div>
              ))}

              {selectedSeat && (
                <div style={{ textAlign: 'center', marginTop: 16, padding: '10px 0', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>
                  ✓ Seat {selectedSeat} selected
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="back-btn" onClick={() => setStep(0)}>← Back</button>
                <button className="confirm-btn" style={{ flex: 1 }} onClick={handleNextStep}>Continue to Confirmation →</button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div className="book-card">
              <div className="book-card-title"><MdCheckCircle color="var(--success)" /> Review & Confirm</div>

              <div style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Flight</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{flight.from} → {flight.to}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{flight.airline} · {flight.flightNumber}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{flight.departureFormatted} → {flight.arrivalFormatted}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{flight.duration}</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Passenger</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{passenger.firstName} {passenger.lastName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{passenger.email} · {passenger.phone}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Seat: <strong>{ selectedSeat || 'Not selected' }</strong> · Gender: {passenger.gender}</div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="confirm-btn" style={{ flex: 1 }} onClick={handleConfirm}>
                  🎉 Confirm & Book — ₹{totalPrice.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="booking-sidebar">
          <div className="summary-card">
            <div className="summary-header">
              <h3>Flight Summary</h3>
              <p>{flight.from} → {flight.to}</p>
            </div>
            <div className="summary-body">
              <div className="summary-row">
                <span className="s-label">Airline</span>
                <span className="s-value">{flight.airline}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Flight No.</span>
                <span className="s-value">{flight.flightNumber}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Departure</span>
                <span className="s-value">{flight.departureFormatted}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Arrival</span>
                <span className="s-value">{flight.arrivalFormatted}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Duration</span>
                <span className="s-value">{flight.duration}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Class</span>
                <span className="s-value">{flight.class}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Passengers</span>
                <span className="s-value">{searchParams.passengers || 1}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Seat</span>
                <span className="s-value">{selectedSeat || '—'}</span>
              </div>
              <div className="summary-row">
                <span className="s-label">Base Fare</span>
                <span className="s-value">₹{flight.price.toLocaleString('en-IN')}</span>
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
