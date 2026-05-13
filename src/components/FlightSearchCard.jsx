import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFlightTakeoff, MdFlightLand, MdCalendarToday, MdSwapHoriz, MdSearch, MdPerson, MdAirlineSeatLegroomExtra } from 'react-icons/md';
import { useBooking } from '../context/BookingContext';
import { searchFlights, CITIES } from '../data/flightData';

const FlightSearchCard = ({ compact = false, onSearch }) => {
  const navigate = useNavigate();
  const { setSearchParams, setSearchResults, searchParams } = useBooking();

  const [form, setForm] = useState({
    from: searchParams.from || '',
    to: searchParams.to || '',
    date: searchParams.date || '',
    passengers: searchParams.passengers || 1,
    cabinClass: searchParams.cabinClass || 'Economy',
    tripType: 'one-way',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSwap = () => {
    setForm(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.from.trim() || !form.to.trim()) {
      setError('Please enter both departure and destination cities.');
      return;
    }
    if (!form.date) {
      setError('Please select a travel date.');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const results = searchFlights(form.from, form.to, form.date);
      setLoading(false);
      if (results.length === 0) {
        setError('No flights found. Try: Chennai, Mumbai, Delhi, Bengaluru, Hyderabad, Kolkata, Goa.');
        return;
      }
      setSearchParams({
        from: form.from,
        to: form.to,
        date: form.date,
        passengers: Number(form.passengers),
        cabinClass: form.cabinClass,
      });
      setSearchResults(results);
      if (onSearch) onSearch(results);
      else navigate('/results');
    }, 600);
  };

  const today = new Date().toISOString().split('T')[0];
  const cityList = CITIES.map(c => c.name);

  return (
    <div className="search-card">
      {!compact && (
        <div className="trip-toggle">
          {['one-way', 'round-trip'].map(type => (
            <button
              key={type}
              className={`trip-btn${form.tripType === type ? ' active' : ''}`}
              onClick={() => setForm(prev => ({ ...prev, tripType: type }))}
              type="button"
            >
              {type === 'one-way' ? 'One Way' : 'Round Trip'}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="search-fields">
          {/* FROM */}
          <div className="search-field">
            <label>From</label>
            <div className="search-input-wrap">
              <MdFlightTakeoff className="search-input-icon" />
              <input
                className="search-input"
                list="from-cities"
                name="from"
                value={form.from}
                onChange={handleChange}
                placeholder="Departure city"
                autoComplete="off"
              />
              <datalist id="from-cities">
                {cityList.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* SWAP */}
          <button type="button" className="swap-btn" onClick={handleSwap} title="Swap cities">
            <MdSwapHoriz />
          </button>

          {/* TO */}
          <div className="search-field">
            <label>To</label>
            <div className="search-input-wrap">
              <MdFlightLand className="search-input-icon" />
              <input
                className="search-input"
                list="to-cities"
                name="to"
                value={form.to}
                onChange={handleChange}
                placeholder="Destination city"
                autoComplete="off"
              />
              <datalist id="to-cities">
                {cityList.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          {/* DATE */}
          <div className="search-field">
            <label>Departure Date</label>
            <div className="search-input-wrap">
              <MdCalendarToday className="search-input-icon" />
              <input
                className="search-input"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                min={today}
              />
            </div>
          </div>

          {/* CABIN CLASS */}
          <div className="search-field" style={{ maxWidth: 140 }}>
            <label>Cabin Class</label>
            <div className="search-input-wrap">
              <MdAirlineSeatLegroomExtra className="search-input-icon" />
              <select
                className="search-input"
                name="cabinClass"
                value={form.cabinClass}
                onChange={handleChange}
                style={{ paddingLeft: 38 }}
              >
                <option>Economy</option>
                <option>Business</option>
                <option>First Class</option>
              </select>
            </div>
          </div>

          {/* PASSENGERS */}
          <div className="search-field" style={{ maxWidth: 110 }}>
            <label>Passengers</label>
            <div className="search-input-wrap">
              <MdPerson className="search-input-icon" />
              <select
                className="search-input"
                name="passengers"
                value={form.passengers}
                onChange={handleChange}
                style={{ paddingLeft: 38 }}
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n===1?'Adult':'Adults'}</option>)}
              </select>
            </div>
          </div>

          {/* SEARCH */}
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? (
              <><span className="search-spinner" /> Searching...</>
            ) : (
              <><MdSearch size={18} /> Search Flights</>
            )}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, fontSize: 13, color: '#e8a04c', display: 'flex', alignItems: 'center', gap: 6 }}>
            ⚠️ {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default FlightSearchCard;