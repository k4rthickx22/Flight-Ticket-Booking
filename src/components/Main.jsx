import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import FlightDetailCard from './FlightDetailCard';
import { useBooking } from '../context/BookingContext';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'dep-asc', label: 'Departure: Earliest' },
  { value: 'dep-desc', label: 'Departure: Latest' },
  { value: 'duration-asc', label: 'Duration: Shortest' },
];

const STOP_FILTERS = ['All', 'Non-stop', '1 Stop', '2+ Stops'];
const TIME_FILTERS = ['All', 'Morning', 'Afternoon', 'Evening', 'Night'];
const AIRLINE_FILTERS = ['All', 'Air India', 'IndiGo', 'SpiceJet', 'Vistara', 'GoAir', 'AirAsia India'];

const Main = () => {
  const navigate = useNavigate();
  const { searchResults, searchParams } = useBooking();
  const [sort, setSort] = useState('price-asc');
  const [airline, setAirline] = useState('All');
  const [stopFilter, setStopFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(20000);

  const filtered = useMemo(() => {
    let list = [...searchResults];

    // Airline filter
    if (airline !== 'All') list = list.filter(f => f.airline === airline);

    // Stop filter
    if (stopFilter === 'Non-stop') list = list.filter(f => f.stops === 0);
    else if (stopFilter === '1 Stop') list = list.filter(f => f.stops === 1);
    else if (stopFilter === '2+ Stops') list = list.filter(f => f.stops >= 2);

    // Time of day filter
    if (timeFilter !== 'All') {
      list = list.filter(f => {
        const hour = parseInt(f.departure?.split(':')[0] || '0', 10);
        if (timeFilter === 'Morning')   return hour >= 5  && hour < 12;
        if (timeFilter === 'Afternoon') return hour >= 12 && hour < 17;
        if (timeFilter === 'Evening')   return hour >= 17 && hour < 21;
        if (timeFilter === 'Night')     return hour >= 21 || hour < 5;
        return true;
      });
    }

    // Price ceiling
    list = list.filter(f => f.price <= maxPrice);

    switch (sort) {
      case 'price-asc':    list.sort((a, b) => a.price - b.price); break;
      case 'price-desc':   list.sort((a, b) => b.price - a.price); break;
      case 'dep-asc':      list.sort((a, b) => a.departure?.localeCompare(b.departure)); break;
      case 'dep-desc':     list.sort((a, b) => b.departure?.localeCompare(a.departure)); break;
      case 'duration-asc': list.sort((a, b) => a.durationMinutes - b.durationMinutes); break;
    }
    return list;
  }, [searchResults, sort, airline, stopFilter, timeFilter, maxPrice]);

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
      {/* Route Summary Bar */}
      <div className="route-summary" style={{ marginBottom: 24 }}>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: 'var(--font-sans)' }}
          onClick={() => navigate('/')}
        >
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

      <div className="results-layout">
        {/* ── Filter Sidebar ── */}
        <aside className="filter-sidebar">
          <div className="filter-card">
            <div className="filter-title">Filters</div>

            {/* Stops */}
            <div className="filter-group">
              <div className="filter-label">Stops</div>
              <div className="filter-pills">
                {STOP_FILTERS.map(s => (
                  <button
                    key={s}
                    className={`pill${stopFilter === s ? ' active' : ''}`}
                    onClick={() => setStopFilter(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div className="filter-group">
              <div className="filter-label">Departure Time</div>
              <div className="filter-pills">
                {TIME_FILTERS.map(t => (
                  <button
                    key={t}
                    className={`pill${timeFilter === t ? ' active' : ''}`}
                    onClick={() => setTimeFilter(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Airlines */}
            <div className="filter-group">
              <div className="filter-label">Airline</div>
              <div className="filter-pills">
                {AIRLINE_FILTERS.map(a => (
                  <button
                    key={a}
                    className={`pill${airline === a ? ' active' : ''}`}
                    onClick={() => setAirline(a)}
                  >
                    {a === 'All' ? 'All' : a.split(' ').pop()}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <div className="filter-label">Max Price</div>
              <div className="filter-range">
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={500}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                />
                <div className="filter-range-vals">
                  <span>₹1K</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{(maxPrice/1000).toFixed(1)}K</span>
                  <span>₹20K</span>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="filter-group" style={{ marginBottom: 0 }}>
              <div className="filter-label">Sort By</div>
              <select
                className="search-input"
                style={{ width: '100%', padding: '8px 12px', fontSize: 12 }}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </aside>

        {/* ── Flight Results ── */}
        <div className="results-list">
          <div className="results-meta">
            {filtered.length === 0
              ? 'No flights match your filters.'
              : <><strong>{filtered.length}</strong> flight{filtered.length > 1 ? 's' : ''} found</>}
          </div>

          {filtered.map(flight => (
            <FlightDetailCard key={flight.id} flight={flight} />
          ))}

          {filtered.length === 0 && (
            <div className="empty-state" style={{ padding: 30 }}>
              <div className="empty-icon">🔍</div>
              <p>Try adjusting your filters or price range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;