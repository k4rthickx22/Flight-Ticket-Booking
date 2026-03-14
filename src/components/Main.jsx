import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdTune, MdArrowBack } from 'react-icons/md';
import FlightDetailCard from './FlightDetailCard';
import { useBooking } from '../context/BookingContext';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'dep-asc', label: 'Departure: Earliest' },
  { value: 'dep-desc', label: 'Departure: Latest' },
  { value: 'duration-asc', label: 'Duration: Shortest' },
];

const AIRLINE_FILTERS = ['All', 'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India'];

const Main = () => {
  const navigate = useNavigate();
  const { searchResults, searchParams } = useBooking();
  const [sort, setSort] = useState('price-asc');
  const [airline, setAirline] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    let list = [...searchResults];
    if (airline !== 'All') list = list.filter(f => f.airline === airline);
    if (maxPrice) list = list.filter(f => f.price <= Number(maxPrice));

    switch (sort) {
      case 'price-asc':   list.sort((a, b) => a.price - b.price); break;
      case 'price-desc':  list.sort((a, b) => b.price - a.price); break;
      case 'dep-asc':     list.sort((a, b) => a.departure.localeCompare(b.departure)); break;
      case 'dep-desc':    list.sort((a, b) => b.departure.localeCompare(a.departure)); break;
      case 'duration-asc':list.sort((a, b) => a.durationMinutes - b.durationMinutes); break;
    }
    return list;
  }, [searchResults, sort, airline, maxPrice]);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner"></div>
        <div className="loading-text">Searching for best flights...</div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">✈️</div>
        <h3>No Flights Yet</h3>
        <p>Use the search above to find available flights for your route.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Route Summary */}
      <div className="route-summary">
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }} onClick={() => navigate('/')}>
          <MdArrowBack /> Back
        </button>
        <div className="route-summary-main">
          <span className="rs-city">{searchParams.from}</span>
          <span className="rs-arrow">✈</span>
          <span className="rs-city">{searchParams.to}</span>
        </div>
        {searchParams.date && (
          <span className="rs-date">📅 {new Date(searchParams.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        )}
        <span className="rs-pax">👤 {searchParams.passengers} {searchParams.passengers === 1 ? 'Passenger' : 'Passengers'}</span>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <span className="filter-label"><MdTune style={{ verticalAlign: 'middle' }} /> Airline:</span>
        {AIRLINE_FILTERS.map(a => (
          <button
            key={a}
            className={`filter-chip${airline === a ? ' active' : ''}`}
            onClick={() => setAirline(a)}
          >
            {a}
          </button>
        ))}
        <input
          type="number"
          placeholder="Max price ₹"
          className="filter-chip"
          style={{ border: '1.5px solid var(--border-color)', outline: 'none', width: 120, cursor: 'text', fontFamily: 'Poppins, sans-serif' }}
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Result count */}
      <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
        {filtered.length === 0
          ? 'No flights match your filters.'
          : `Showing ${filtered.length} flight${filtered.length > 1 ? 's' : ''}`}
      </div>

      {/* Flight Cards */}
      {filtered.map(flight => (
        <FlightDetailCard key={flight.id} flight={flight} />
      ))}

      {filtered.length === 0 && (
        <div className="empty-state" style={{ padding: 30 }}>
          <p>Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Main;