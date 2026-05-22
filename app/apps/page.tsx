import Link from "next/link";
import ScrollReveal from "../components/ScrollReveal";

const CheckSvg = ({ color = "var(--primary)" }: { color?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const netflixFeatures = [
  "Unlimited HD & 4K streaming",
  "4 simultaneous devices",
  "Download for offline viewing",
  "Access to all regions content",
  "Dolby Atmos sound",
  "Personalized recommendations",
];

const canalFeatures = [
  "Live TV & real-time replay",
  "Exclusive Canal+ original series",
  "Blockbuster movies & sports",
  "Multi-device (up to 3 screens)",
  "Kids safe mode",
  "Premium sports packages",
];

const steps = [
  { n: "01", title: "Choose Plan", desc: "Select Netflix or Canal+ subscription" },
  { n: "02", title: "Pay Securely", desc: "Mobile Money, PayPal, card or crypto" },
  { n: "03", title: "Receive Credentials", desc: "Email & password sent via WhatsApp instantly" },
  { n: "04", title: "Start Streaming", desc: "Enjoy premium content right away" },
];

export default function AppsPage() {
  return (
    <>
      <ScrollReveal />
      <section className="page-hero">
        <div className="container">
          <div className="hero-label" style={{ justifyContent: "center" }}>Premium Applications</div>
          <h1>World-class streaming at affordable prices</h1>
          <p>Get genuine Netflix and Canal+ Premium subscriptions with fast activation and full support.</p>
        </div>
      </section>

      {/* Apps */}
      <section className="section">
        <div className="container">
          <div className="apps-grid">
            {/* NETFLIX */}
            <div className="card app-card app-card-netflix reveal">
              <div className="app-card-bg" />
              <div className="app-logo">
                <div className="app-logo-icon netflix">N</div>
                <div className="app-logo-text">
                  Netflix Premium
                  <span>4K Streaming Platform</span>
                </div>
              </div>
              <div className="badge badge-red" style={{ marginBottom: 16 }}>Most Popular</div>
              <p className="app-description">
                The world&apos;s leading streaming service with thousands of movies, TV shows, anime and documentaries. 
                Experience content in stunning 4K HDR quality with spatial audio.
              </p>
              <div className="app-features">
                {netflixFeatures.map((f) => (
                  <div key={f} className="app-feature-item">
                    <div className="app-feature-check netflix-check"><CheckSvg color="#e50914" /></div>
                    {f}
                  </div>
                ))}
              </div>
              <div className="app-price-row">
                <div>
                  <div className="app-price-label">Monthly Price</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Cancel anytime</div>
                </div>
                <div>
                  <span className="app-price-amount">1 000 FCFA</span>
                  <span className="app-price-period"></span>
                </div>
              </div>
              <div className="app-actions">
                <Link href="/checkout?product=Netflix+Premium&price=1000&type=app" className="btn btn-primary">
                  Get Netflix Premium
                </Link>
                <a href="https://wa.me/+228XXXXXXXX" target="_blank" className="btn btn-outline">WhatsApp</a>
              </div>
            </div>

            {/* CANAL+ */}
            <div className="card app-card app-card-canal reveal reveal-delay-2">
              <div className="app-card-bg" />
              <div className="app-logo">
                <div className="app-logo-icon canal">C+</div>
                <div className="app-logo-text">
                  Canal+ Premium
                  <span>Live TV & VOD</span>
                </div>
              </div>
              <div className="badge badge-blue" style={{ marginBottom: 16 }}>Best for Sports</div>
              <p className="app-description">
                France&apos;s premium channel with exclusive content, live sports, movies and 
                original productions. Perfect for French speakers and sports lovers.
              </p>
              <div className="app-features">
                {canalFeatures.map((f) => (
                  <div key={f} className="app-feature-item">
                    <div className="app-feature-check canal-check"><CheckSvg color="#0070c9" /></div>
                    {f}
                  </div>
                ))}
              </div>
              <div className="app-price-row">
                <div>
                  <div className="app-price-label">Monthly Price</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Cancel anytime</div>
                </div>
                <div>
                  <span className="app-price-amount">1 000 FCFA</span>
                  <span className="app-price-period"></span>
                </div>
              </div>
              <div className="app-actions">
                <Link href="/checkout?product=Canal%2B+Premium&price=1000&type=app" className="btn btn-primary">
                  Get Canal+ Premium
                </Link>
                <a href="https://wa.me/+228XXXXXXXX" target="_blank" className="btn btn-outline">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ background: "var(--primary-ultra-light)" }}>
        <div className="container">
          <div className="section-header reveal">
            <div className="label">Quick & Easy</div>
            <h2>Up and running in minutes</h2>
            <p>Our activation process is simple and fully automated.</p>
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

      {/* FAQ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="section-header reveal">
            <div className="label">FAQ</div>
            <h2>Common questions</h2>
          </div>
          {[
            { q: "Is this a shared or private account?", a: "We offer private accounts. Your credentials are exclusively yours and not shared with anyone else." },
            { q: "How fast is activation after payment?", a: "Activation is instant — within 5 minutes of confirmed payment you receive your credentials via WhatsApp." },
            { q: "What payment methods are accepted?", a: "We accept Mobile Money (Orange, MTN, Wave, Airtel), PayPal, Credit/Debit cards and Cryptocurrency." },
            { q: "What if my subscription stops working?", a: "Contact our 24/7 support via WhatsApp and we'll resolve the issue within 2 hours, guaranteed." },
          ].map((faq) => (
            <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </section>
    </>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="faq-item reveal" style={{ cursor: "default" }}>
      <div className="faq-question">
        {question}
        <div className="faq-icon">+</div>
      </div>
      <div className="faq-answer" style={{ maxHeight: "none", paddingTop: 12 }}>{answer}</div>
    </div>
  );
}
