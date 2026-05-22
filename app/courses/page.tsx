"use client";
import Link from "next/link";
import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";

const courses = [
  {
    id: "tiktok",
    category: "social",
    coverClass: "course-cover-tiktok",
    title: "TikTok Viral Growth",
    desc: "Master the TikTok algorithm, create viral content and grow from 0 to 100K followers fast.",
    price: "1000",
    oldPrice: "3 000 FCFA",
    pages: "127 pages",
    badge: "🔥 Bestseller",
    badgeClass: "badge-blue",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 64, height: 64 }}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    category: "social",
    coverClass: "course-cover-youtube",
    title: "YouTube Growth Masterclass",
    desc: "Build a profitable YouTube channel with proven strategies for views, subscribers and monetization.",
    price: "1000",
    oldPrice: "2 500 FCFA",
    pages: "98 pages",
    badge: "⭐ Top Rated",
    badgeClass: "badge-gold",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 64, height: 64 }}>
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon fill="#ff0000" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    id: "trading",
    category: "finance",
    coverClass: "course-cover-trading",
    title: "Trading Masterclass",
    desc: "Learn professional trading strategies for Forex, Crypto and Stocks with real risk management.",
    price: "1000",
    oldPrice: "4 000 FCFA",
    pages: "215 pages",
    badge: "💰 High Value",
    badgeClass: "badge-green",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 64, height: 64 }}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

const filters = [
  { key: "all", label: "All Courses" },
  { key: "social", label: "Social Media" },
  { key: "finance", label: "Finance" },
];

export default function CoursesPage() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? courses : courses.filter((c) => c.category === active);

  return (
    <>
      <ScrollReveal />
      <section className="page-hero">
        <div className="container">
          <div className="hero-label" style={{ justifyContent: "center" }}>Digital Courses</div>
          <h1>Expert knowledge for digital success</h1>
          <p>Actionable PDF courses crafted by industry experts. Learn at your own pace, apply immediately.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="course-filters">
            {filters.map((f) => (
              <button
                key={f.key}
                className={`filter-btn${active === f.key ? " active" : ""}`}
                onClick={() => setActive(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="courses-grid">
            {filtered.map((c, i) => (
              <div key={c.id} className={`card course-card reveal reveal-delay-${i + 1}`}>
                <div className={`course-cover ${c.coverClass}`}>
                  <div className="course-cover-pattern" />
                  <div className="course-cover-icon">{c.icon}</div>
                </div>
                <div className="course-body">
                  <div className="course-meta">
                    <div className="course-type">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                      PDF Course
                    </div>
                    <div className="course-pages">{c.pages}</div>
                  </div>
                  <div className="badge" style={{ marginBottom: 10, fontSize: "0.72rem" }}>{c.badge}</div>
                  <div className="course-title">{c.title}</div>
                  <p className="course-desc">{c.desc}</p>
                  <div className="course-footer">
                    <div className="course-price">
                      {parseInt(c.price).toLocaleString("fr-FR")} FCFA<span>{c.oldPrice}</span>
                    </div>
                    <Link href={`/checkout?product=${encodeURIComponent(c.title)}&price=${c.price}&type=course`} className="btn btn-primary btn-sm">
                      Get Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--primary-ultra-light)" }}>
        <div className="container text-center reveal">
          <h2 style={{ marginBottom: 14 }}>Not sure which course?</h2>
          <p style={{ maxWidth: 480, margin: "0 auto 28px" }}>
            Chat with us on WhatsApp and we&apos;ll help you choose the perfect course for your goals.
          </p>
          <a href="https://wa.me/+228XXXXXXXX" target="_blank" className="whatsapp-btn" style={{ display: "inline-flex" }}>
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
