import React from 'react';
import { MdSchedule } from 'react-icons/md';

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
    <div style={{ background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)', padding: '28px 32px' }}>
      <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>Flight Schedule</h1>
      <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>Today's departure schedule across all routes</p>
    </div>
    <div className="page-content">
      <div style={{ background: 'white', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1.5px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--primary-light)', borderBottom: '2px solid var(--border-color)' }}>
              {['Route', 'Time', 'Days', 'Airline', 'Status'].map(h => (
                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-main)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{row.route}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>{row.time}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--text-secondary)' }}>{row.days}</td>
                <td style={{ padding: '14px 18px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{row.airline}</td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`tag ${row.status === 'On Time' ? 'tag-green' : 'tag-orange'}`}>{row.status}</span>
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
