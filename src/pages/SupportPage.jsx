import React, { useState } from 'react';
import { toast } from 'react-toastify';

const FAQS = [
  { q: 'Can I cancel or modify my booking?', a: 'Yes, tickets marked as Refundable can be cancelled up to 24 hours before departure. Non-refundable tickets cannot be cancelled.' },
  { q: 'What is the baggage allowance?', a: 'Standard economy tickets include 15 kg of check-in baggage. Business class includes 25 kg. You can add extra baggage during booking.' },
  { q: 'How do I get my boarding pass?', a: 'Once you complete your booking, a boarding pass is generated instantly in the Ticket page. You can print it or show it on your mobile device.' },
  { q: 'What documents do I need at the airport?', a: 'You need a valid government-issued photo ID (Aadhaar, Passport, PAN) along with your booking reference number or printed boarding pass.' },
  { q: 'Can I select my preferred seat?', a: 'Yes! During booking, you can select multiple seats based on the number of passengers from the interactive seat map.' },
];

const SupportPage = () => {
  const [open, setOpen] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all fields.', { position: 'top-center' });
      return;
    }
    toast.success("Message sent! We'll respond within 24 hours.", { position: 'top-center' });
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div>
      {/* Luxury navy header */}
      <div className="page-hero">
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
          ✦ Help & Support
        </div>
        <h1>Support Center</h1>
        <p>We're here to help you 24/7</p>
      </div>

      <div className="page-content">
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* FAQs */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="section-title">Frequently Asked Questions</div>
            <div className="section-sub">Quick answers to common queries</div>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: `1px solid ${open === i ? 'var(--border-mid)' : 'var(--border)'}`,
                borderRadius: 'var(--r-md)',
                marginBottom: 10,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                <button
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--cream)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {faq.q}
                  <span style={{
                    fontSize: 20,
                    color: 'var(--gold)',
                    transition: 'transform 0.2s',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                    flexShrink: 0,
                  }}>+</span>
                </button>
                {open === i && (
                  <div style={{
                    padding: '0 20px 16px',
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.75,
                    fontFamily: 'var(--font-sans)',
                    borderTop: '1px solid var(--border)',
                    paddingTop: 12,
                    marginTop: 0,
                  }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div style={{ width: 300, flexShrink: 0 }}>
            <div className="section-title">Contact Us</div>
            <div className="section-sub">Send us a message</div>

            <div className="book-card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input className="form-control" type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} placeholder="you@email.com" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea className="form-control" rows={4} value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder="Describe your issue..." style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="confirm-btn">Send Message ✉️</button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="book-card" style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '📧', text: 'support@frostairlines.in' },
                  { icon: '📞', text: '1800-XXX-XXXX (Toll-Free)' },
                  { icon: '🕐', text: '24/7 Support Available' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
