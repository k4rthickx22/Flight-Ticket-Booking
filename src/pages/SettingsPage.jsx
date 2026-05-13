import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdPerson, MdNotifications, MdSecurity, MdColorLens, MdSave } from 'react-icons/md';
import { userService } from '../services/userService';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', dob: '', gender: 'Male', address: '',
    passportNumber: '', nationality: 'Indian', preferredClass: 'Economy',
  });
  const [notifications, setNotifications] = useState({ email: true, sms: false, priceAlerts: true });
  const [theme, setTheme] = useState('dark');
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    userService.getProfile()
      .then(data => {
        setProfile(p => ({ ...p, ...data }));
        if (data.notifications !== undefined) setNotifications(n => ({ ...n, email: data.notifications }));
        if (data.newsletter !== undefined) setNotifications(n => ({ ...n, priceAlerts: data.newsletter }));
      })
      .catch(() => setLoadError(true));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await userService.updateProfile({
        ...profile,
        notifications: notifications.email,
        newsletter: notifications.priceAlerts,
      });
      toast.success('✅ Settings saved successfully!', { position: 'top-center' });
    } catch {
      toast.error('Could not save to server. Check API is running.', { position: 'top-center' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Luxury navy header */}
      <div style={{
        background: 'var(--navy-mid)',
        borderBottom: '1px solid var(--border)',
        padding: '28px 32px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
          ✦ Account
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--cream)', fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, marginBottom: 0 }}>
          Manage your account preferences
          {loadError && (
            <span style={{ background: 'rgba(255,100,100,0.18)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 6, padding: '2px 10px', fontSize: 11, marginLeft: 10, color: '#ff7070' }}>
              ⚠ API offline — changes won't save
            </span>
          )}
        </p>
      </div>

      <div className="page-content">
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Left Column */}
          <div style={{ flex: 1, minWidth: 280 }}>
            {/* Profile Settings */}
            <div className="book-card" style={{ marginBottom: 20 }}>
              <div className="book-card-title"><MdPerson /> Profile Information</div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input className="form-control" value={profile.firstName || ''} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} placeholder="First name" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input className="form-control" value={profile.lastName || ''} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} placeholder="Last name" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="email" value={profile.email || ''} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="you@email.com" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input className="form-control" type="tel" value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control" value={profile.gender || 'Male'} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input className="form-control" type="date" value={profile.dob || ''} onChange={e => setProfile(p => ({ ...p, dob: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Preferred Class</label>
                  <select className="form-control" value={profile.preferredClass || 'Economy'} onChange={e => setProfile(p => ({ ...p, preferredClass: e.target.value }))}>
                    <option>Economy</option><option>Business</option><option>First Class</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Passport Number</label>
                <input className="form-control" value={profile.passportNumber || ''} onChange={e => setProfile(p => ({ ...p, passportNumber: e.target.value }))} placeholder="Optional" />
              </div>
            </div>

            {/* Notifications */}
            <div className="book-card" style={{ marginBottom: 20 }}>
              <div className="book-card-title"><MdNotifications /> Notifications</div>
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Receive booking confirmations via email' },
                { key: 'sms', label: 'SMS Alerts', desc: 'Get flight updates via SMS' },
                { key: 'priceAlerts', label: 'Price Alerts', desc: 'Notify when prices drop on saved routes' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={notifications[item.key]} onChange={e => setNotifications(p => ({ ...p, [item.key]: e.target.checked }))} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ width: 300, flexShrink: 0 }}>
            {/* Appearance */}
            <div className="book-card" style={{ marginBottom: 20 }}>
              <div className="book-card-title"><MdColorLens /> Appearance</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>Choose your preferred theme</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['light', 'dark', 'auto'].map(t => (
                  <button key={t} onClick={() => setTheme(t)}
                    style={{ flex: 1, padding: '10px 0', border: `2px solid ${theme === t ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-sm)', background: theme === t ? 'var(--primary-light)' : 'white', color: theme === t ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize', transition: 'var(--transition)' }}>
                    {t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '🖥️'} {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="book-card" style={{ marginBottom: 20 }}>
              <div className="book-card-title"><MdSecurity /> Security</div>
              <div className="form-group"><label>Current Password</label><input className="form-control" type="password" placeholder="••••••••" /></div>
              <div className="form-group"><label>New Password</label><input className="form-control" type="password" placeholder="••••••••" /></div>
              <div className="form-group"><label>Confirm New Password</label><input className="form-control" type="password" placeholder="••••••••" /></div>
            </div>

            {/* App Info */}
            <div className="book-card">
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2.2 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>✈ Frost Airlines</div>
                <div>Version: 2.0.0</div>
                <div>Backend: JSON Server (REST)</div>
                <div>Build: React + Parcel</div>
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>© 2026 Frost Airlines. All rights reserved.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ marginTop: 8 }}>
          <button className="confirm-btn" style={{ maxWidth: 280 }} onClick={handleSave} disabled={saving}>
            <MdSave /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
