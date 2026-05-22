import Link from "next/link";
import ScrollReveal from "./components/ScrollReveal";
import CounterAnim from "./components/CounterAnim";

const CheckSvg = ({ color = "var(--primary)" }: { color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    title: "100% Secure",
    desc: "All transactions encrypted with bank-level security. Your data stays private."
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    title: "Instant Activation",
    desc: "Your subscription is activated within minutes of payment confirmation."
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    title: "24/7 Support",
    desc: "Dedicated support team ready to help you anytime via WhatsApp or email."
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    title: "Premium Quality",
    desc: "Only genuine premium accounts — no shared, no fake, pure quality."
  },
];

const netflixFeatures = [
  "Full HD & 4K Streaming",
  "4 simultaneous screens",
  "Download for offline",
  "All regions content",
];

const canalFeatures = [
  "Live TV + Replay",
  "Exclusive content & series",
  "Sports & cinema packages",
  "Multi-device support",
];

const courses = [
  {
    id: "tiktok",
    coverClass: "course-cover-tiktok",
    title: "TikTok Viral Growth",
    desc: "Master the TikTok algorithm, create viral content and grow from 0 to 100K followers.",
    price: "1 000 FCFA",
    oldPrice: "3 000 FCFA",
    pages: "127 pages",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 64, height: 64 }}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    coverClass: "course-cover-youtube",
    title: "YouTube Growth Masterclass",
    desc: "Build a profitable YouTube channel with proven strategies for views, subscribers and revenue.",
    price: "1 000 FCFA",
    oldPrice: "2 500 FCFA",
    pages: "98 pages",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" style={{ width: 64, height: 64 }}>
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon fill="#ff0000" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    id: "trading",
    coverClass: "course-cover-trading",
    title: "Trading Masterclass",
    desc: "Learn professional trading strategies for Forex, Crypto and Stocks with risk management.",
    price: "1 000 FCFA",
    oldPrice: "4 000 FCFA",
    pages: "215 pages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ width: 64, height: 64 }}>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
  },
];

const steps = [
  { n: "01", title: "Choose Product", desc: "Browse our premium apps and digital courses" },
  { n: "02", title: "Make Payment", desc: "Pay securely via Mobile Money, PayPal or card" },
  { n: "03", title: "Get Access", desc: "Receive your credentials instantly via WhatsApp" },
  { n: "04", title: "Start Using", desc: "Enjoy your premium subscription or course" },
];

const trustItems = [
  "SSL Encrypted Payments",
  "Instant Delivery",
  "24/7 Support",
  "Money Back Guarantee",
  "5000+ Happy Customers",
];

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <CounterAnim />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Premium Digital Marketplace
            </div>
            <h1 className="hero-title">
              Premium Applications &<br /><span className="highlight">Digital Courses</span>
            </h1>
            <p className="hero-subtitle">
              Netflix Premium, Canal+ Premium, TikTok Viral Courses, YouTube Growth and Trading Education — all in one powerful platform.
            </p>
            <div className="hero-actions">
              <Link href="/checkout" className="btn btn-primary btn-lg">
                Get Started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/apps" className="btn btn-outline btn-lg">View Apps</Link>
            </div>
            <div className="hero-stats">
              {[
                { count: "5000", suffix: "+", label: "Happy Customers" },
                { count: "2", suffix: "", label: "Premium Apps" },
                { count: "3", suffix: "", label: "Expert Courses" },
                { count: "24", suffix: "", label: "Hour Support" },
              ].map((s) => (
                <div key={s.label} className="stat-item">
                  <div className="stat-number" data-count={s.count} data-suffix={s.suffix}>{s.count}{s.suffix}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="phone-screen-header">
                  <span style={{ color: "white", fontWeight: 900, fontFamily: "var(--font-title)" }}>N</span>
                  <div className="phone-screen-header-text">NETFLIX</div>
                </div>
                <div className="phone-screen-content">
                  <div className="phone-thumb-featured">
                    <div className="phone-thumb-featured-label">PREMIUM</div>
                  </div>
                  <div className="phone-thumb-row">
                    <div className="phone-thumb-item" />
                    <div className="phone-thumb-item" />
                    <div className="phone-thumb-item" />
                  </div>
                  <div className="phone-thumb-row">
                    <div className="phone-thumb-item" />
                    <div className="phone-thumb-item" />
                    <div className="phone-thumb-item" />
                  </div>
                </div>
              </div>
            </div>
            <div className="float-card float-card-netflix">
              <div className="float-logo">
                <div className="float-logo-icon netflix">N</div>
                <div className="float-title">Netflix Premium</div>
              </div>
              <div className="float-price">1 000 FCFA</div>
            </div>
            <div className="float-card float-card-canal">
              <div className="float-logo">
                <div className="float-logo-icon canal">C+</div>
                <div className="float-title">Canal+ Premium</div>
              </div>
              <div className="float-price">1 000 FCFA</div>
            </div>
            <div className="float-card float-card-stat">
              <div className="float-stat-num">2,847</div>
              <div className="float-stat-label">Online now</div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <div className="trust-section">
        <div className="container">
          <div className="trust-items">
            {trustItems.map((item) => (
              <div key={item} className="trust-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-header reveal">
            <div className="label">Why Choose Us</div>
            <h2>Everything you need, nothing you don&apos;t</h2>
            <p>We&apos;ve built Canflix to be the simplest, most reliable way to access premium digital services.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={f.title} className={`card feature-card reveal reveal-delay-${i + 1}`}>
                <div className="feature-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPS PREVIEW */}
      <section className="section" style={{ background: "var(--primary-ultra-light)" }}>
        <div className="container">
          <div className="section-header reveal">
            <div className="label">Premium Applications</div>
            <h2>Streaming at its finest</h2>
            <p>Get Netflix Premium and Canal+ Premium with full features, fast activation and dedicated support.</p>
          </div>
          <div className="apps-grid">
            {/* Netflix */}
            <div className="card app-card app-card-netflix reveal">
              <div className="app-card-bg" />
              <div className="app-logo">
                <div className="app-logo-icon netflix">N</div>
                <div className="app-logo-text">Netflix Premium<span>Streaming Platform</span></div>
              </div>
              <p className="app-description">Access the world&apos;s largest streaming library with 4K quality, Dolby Atmos sound and downloads for offline viewing.</p>
              <div className="app-features">
                {netflixFeatures.map((f) => (
                  <div key={f} className="app-feature-item">
                    <div className="app-feature-check netflix-check"><CheckSvg color="#e50914" /></div>
                    {f}
                  </div>
                ))}
              </div>
              <div className="app-price-row">
                <span className="app-price-label">Monthly Price</span>
                <span><span className="app-price-amount">1 000 FCFA</span></span>
              </div>
              <div className="app-actions">
                <Link href="/checkout?product=Netflix+Premium&price=1000&type=app" className="btn btn-primary">Get Netflix</Link>
                <Link href="/apps" className="btn btn-outline">Learn More</Link>
              </div>
            </div>

            {/* Canal+ */}
            <div className="card app-card app-card-canal reveal reveal-delay-2">
              <div className="app-card-bg" />
              <div className="app-logo">
                <div className="app-logo-icon canal">C+</div>
                <div className="app-logo-text">Canal+ Premium<span>Live TV & VOD</span></div>
              </div>
              <p className="app-description">The premium French channel with live TV, exclusive series, blockbuster movies and live sports coverage.</p>
              <div className="app-features">
                {canalFeatures.map((f) => (
                  <div key={f} className="app-feature-item">
                    <div className="app-feature-check canal-check"><CheckSvg color="#0070c9" /></div>
                    {f}
                  </div>
                ))}
              </div>
              <div className="app-price-row">
                <span className="app-price-label">Monthly Price</span>
                <span><span className="app-price-amount">1 000 FCFA</span></span>
              </div>
              <div className="app-actions">
                <Link href="/checkout?product=Canal%2B+Premium&price=1000&type=app" className="btn btn-primary">Get Canal+</Link>
                <Link href="/apps" className="btn btn-outline">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <div className="label">Digital Courses</div>
            <h2>Expert knowledge, real results</h2>
            <p>Our courses are designed by industry experts and deliver actionable knowledge you can apply immediately.</p>
          </div>
          <div className="courses-grid">
            {courses.map((c, i) => (
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
                  <div className="course-title">{c.title}</div>
                  <p className="course-desc">{c.desc}</p>
                  <div className="course-footer">
                    <div className="course-price">{c.price}<span>{c.oldPrice}</span></div>
                    <Link href={`/checkout?product=${encodeURIComponent(c.title)}&price=${c.price.slice(1)}&type=course`} className="btn btn-primary btn-sm">
                      Get Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-40">
            <Link href="/courses" className="btn btn-outline btn-lg">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: "var(--primary-ultra-light)" }}>
        <div className="container">
          <div className="section-header reveal">
            <div className="label">How It Works</div>
            <h2>Get started in 4 simple steps</h2>
            <p>From order to activation in under 5 minutes.</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.n} className={`card step-card reveal reveal-delay-${i + 1}`}>
                <div className="step-number">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container text-center">
          <div className="reveal">
            <div className="hero-label" style={{ justifyContent: "center" }}>Ready to start?</div>
            <h2 style={{ marginBottom: 16 }}>Join 5,000+ satisfied customers</h2>
            <p style={{ maxWidth: 500, margin: "0 auto 40px" }}>Get instant access to premium streaming and expert digital courses today.</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/checkout" className="btn btn-primary btn-lg">Get Started Now</Link>
              <Link href="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
