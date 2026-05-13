import React from 'react';

const SCHEDULE = [
  { route: 'Chennai → Mumbai', time: '06:30 AM – 09:00 AM', days: 'Daily', airline: 'IndiGo', status: 'On Time' },
  { route: 'Delhi → Bengaluru', time: '08:00 AM – 10:30 AM', days: 'Daily', airline: 'Air India', status: 'On Time' },
  { route: 'Mumbai → Goa', time: '10:00 AM – 11:10 AM', days: 'Mon, Wed, Fri, Sun', airline: 'SpiceJet', status: 'On Time' },
  { route: 'Hyderabad → Delhi', time: '12:00 PM – 02:10 PM', days: 'Daily', airline: 'Vistara', status: 'Delayed 15 min' },
  { route: 'Bengaluru → Chennai', time: '03:30 PM – 04:30 PM', days: 'Daily', airline: 'IndiGo', status: 'On Time' },
  { route: 'Mumbai → Delhi', time: '05:00 PM – 07:00 PM', days: 'Daily', airline: 'Air India', status: 'On Time' },
  { route: 'Delhi → Kolkata', time: '07:30 PM – 09:20 PM', days: 'Daily', airline: 'GoAir', status: 'On Time' },
  { route: 'Chennai → Hyderabad', time: '09:00 PM – 10:10 PM', days: 'Daily', airline: 'AirAsia India', status: 'On Time' },
];

const SchedulePage = () => (
  <div>
    {/* Luxury navy header */}
    <div className="page-hero">
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
        ✦ Departures
      </div>
      <h1>Flight Schedule</h1>
      <p>Today's departure schedule across all routes</p>
    </div>

    <div className="page-content">
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.08)', borderBottom: '1px solid var(--border)' }}>
              {['Route', 'Time', 'Days', 'Airline', 'Status'].map(h => (
                <th key={h} style={{
                  padding: '14px 20px',
                  textAlign: 'left',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontFamily: 'var(--font-sans)',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: 14, color: 'var(--cream)', fontFamily: 'var(--font-sans)' }}>{row.route}</td>
                <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>{row.time}</td>
                <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>{row.days}</td>
                <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 500, color: 'var(--cream)', fontFamily: 'var(--font-sans)' }}>{row.airline}</td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 20,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-sans)',
                    background: row.status === 'On Time' ? 'rgba(6,214,160,0.12)' : 'rgba(255,160,80,0.12)',
                    color: row.status === 'On Time' ? '#06d6a0' : '#ffb060',
                    border: `1px solid ${row.status === 'On Time' ? 'rgba(6,214,160,0.3)' : 'rgba(255,160,80,0.3)'}`,
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default SchedulePage;
