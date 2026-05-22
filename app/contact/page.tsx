"use client";
import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";

const faqs = [
  { q: "How do I receive my credentials?", a: "After payment confirmation, we send your login credentials directly via WhatsApp within 5 minutes." },
  { q: "What payment methods do you accept?", a: "We accept Mobile Money (Orange, MTN, Wave, Airtel), PayPal, Credit/Debit cards and Cryptocurrency." },
  { q: "What if my subscription stops working?", a: "Contact us immediately on WhatsApp. We guarantee resolution within 2 hours or a full refund." },
  { q: "Can I get a refund?", a: "Yes, we offer a 24-hour money-back guarantee if you're not satisfied with your purchase." },
  { q: "Are the accounts shared?", a: "No. All accounts are private and exclusively yours. We never share credentials between customers." },
];

export default function ContactPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <ScrollReveal />
      <section className="page-hero">
        <div className="container">
          <div className="hero-label" style={{ justifyContent: "center" }}>Get in Touch</div>
          <h1>We&apos;re here to help</h1>
          <p>Have a question or need support? Reach us anytime — our team responds within minutes on WhatsApp.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-layout">
            {/* LEFT — Info */}
            <div>
              <h3 style={{ marginBottom: 32 }}>Contact Information</h3>

              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  label: "WhatsApp",
                  value: "+228 XX XX XX XX",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: "Email",
                  value: "support@canflix.com",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  label: "Response Time",
                  value: "Under 5 minutes",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  label: "Location",
                  value: "Lomé, Togo 🇹🇬",
                },
              ].map((item) => (
                <div key={item.label} className="contact-info-item">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <div className="contact-info-label">{item.label}</div>
                    <div className="contact-info-value">{item.value}</div>
                  </div>
                </div>
              ))}

              <a
                href="https://wa.me/+228XXXXXXXX?text=Hello%20Canflix%2C%20I%20need%20help"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>

              {/* Social */}
              <div style={{ marginTop: 36 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  Follow us
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {["TikTok", "Instagram", "Twitter", "YouTube"].map((s) => (
                    <a
                      key={s}
                      href="#"
                      style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: "var(--primary-ultra-light)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.7rem", fontWeight: 700, color: "var(--primary)",
                        fontFamily: "var(--font-title)", transition: "all var(--transition)",
                      }}
                      title={s}
                    >
                      {s[0]}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <div className="contact-form-card">
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <h3 style={{ marginBottom: 10 }}>Message Sent!</h3>
                  <p>We&apos;ll get back to you within 5 minutes via WhatsApp or email.</p>
                  <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => setSubmitted(false)}>
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <h3 style={{ marginBottom: 24 }}>Send us a message</h3>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" className="form-input" placeholder="Your name" value={form.name} onChange={set("name")} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={set("email")} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">WhatsApp Number</label>
                      <input type="tel" className="form-input" placeholder="+228 XX XX XX XX" value={form.phone} onChange={set("phone")} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select className="form-input" value={form.subject} onChange={set("subject")} required>
                        <option value="">Select a subject</option>
                        <option>Order / Payment Issue</option>
                        <option>Account Activation</option>
                        <option>Technical Support</option>
                        <option>Refund Request</option>
                        <option>General Question</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        className="form-input"
                        placeholder="Describe your issue or question in detail..."
                        value={form.message}
                        onChange={set("message")}
                        required
                        style={{ minHeight: 130 }}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">
                      Send Message
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "var(--primary-ultra-light)" }}>
        <div className="container" style={{ maxWidth: 740 }}>
          <div className="section-header reveal">
            <div className="label">FAQ</div>
            <h2>Frequently asked questions</h2>
            <p>Quick answers to the most common questions.</p>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${open === i ? " open" : ""} reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                  {faq.q}
                  <div className="faq-icon">+</div>
                </div>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
