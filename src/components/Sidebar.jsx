import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  MdFlightTakeoff, MdSchedule,
  MdHistory, MdSupportAgent, MdHome, MdMenu, MdClose, MdSettings
} from 'react-icons/md';
import { useBooking } from '../context/BookingContext';

const navLinks = [
  { to: '/', icon: <MdHome />, label: 'Home', end: true },
  { to: '/results', icon: <MdFlightTakeoff />, label: 'Flights' },
  { to: '/history', icon: <MdHistory />, label: 'My Bookings' },
  { to: '/schedule', icon: <MdSchedule />, label: 'Schedule' },
  { to: '/support', icon: <MdSupportAgent />, label: 'Support' },
];

const Sidebar = () => {
  const { bookings } = useBooking();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setMobileOpen(true)} title="Open menu">
        <MdMenu />
      </button>

      <div
        className={`sidebar-overlay${mobileOpen ? ' open' : ''}`}
        onClick={closeMobile}
      />

      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <button
          onClick={closeMobile}
          style={{
            display: 'flex', alignSelf: 'flex-end', marginBottom: 8, marginRight: 16,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: 22,
          }}
          title="Close menu"
        >
          <MdClose />
        </button>

        <div
          className="sidebar-brand"
          style={{ cursor: 'pointer' }}
          onClick={() => { navigate('/'); closeMobile(); }}
        >
          <div className="brand-icon">✈</div>
          <div>
            <div className="brand-text">Frost Airlines</div>
            <div className="brand-sub">Fly · Book · Explore</div>
          </div>
        </div>

        <div className="sidebar-section-label">Navigation</div>
        <nav className="sidebar-nav">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={closeMobile}
            >
              <span className="link-icon">{link.icon}</span>
              {link.label}
              {link.label === 'My Bookings' && bookings.length > 0 && (
                <span className="badge-count">{bookings.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-section-label">Account</div>
          <nav className="sidebar-nav">
            <NavLink
              to="/settings"
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={closeMobile}
            >
              <span className="link-icon"><MdSettings /></span>
              Settings
            </NavLink>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;