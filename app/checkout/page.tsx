"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import ScrollReveal from "../components/ScrollReveal";

const products = [
  { id: "netflix", name: "Netflix Premium", price: "1000" },
  { id: "canal", name: "Canal+ Premium", price: "1000" },
  { id: "tiktok", name: "TikTok Viral Course", price: "1000" },
  { id: "youtube", name: "YouTube Growth Course", price: "1000" },
  { id: "trading", name: "Trading Masterclass", price: "1000" },
];

const methods = [
  { key: "mobile-money", label: "Mobile Money", desc: "Orange, MTN, Wave, Airtel", gradient: "linear-gradient(135deg,#f97316,#ea580c)" },
  { key: "paypal", label: "PayPal", desc: "Fast & secure payment", gradient: "linear-gradient(135deg,#003087,#009cde)" },
  { key: "credit-card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Amex", gradient: "linear-gradient(135deg,#1d4ed8,#2563eb)" },
  { key: "crypto", label: "Cryptocurrency", desc: "BTC, ETH, USDT, BNB", gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
];

function CheckoutForm() {
  const params = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState("mobile-money");
  const [submitted, setSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const name = params.get("product");
    const price = params.get("price");
    return name ? { name: decodeURIComponent(name), price: price || "1000" } : { name: "Netflix Premium", price: "1000" };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ width: 80, height: 80, background: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" style={{ width: 40, height: 40 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ marginBottom: 12 }}>Order Received! 🎉</h2>
        <p style={{ maxWidth: 400, margin: "0 auto 28px" }}>
          Your order for <strong>{selectedProduct.name}</strong> has been received. 
          We&apos;ll send your credentials via WhatsApp within 5 minutes.
        </p>
        <a href="/" className="btn btn-primary btn-lg">Back to Home</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="checkout-layout">
        {/* LEFT */}
        <div>
          {/* Product Select */}
          <div className="checkout-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Select Product</h3>
            <div className="form-group">
              <label className="form-label">Product</label>
              <select
                className="form-input"
                value={products.find((p) => p.name === selectedProduct.name)?.id || ""}
                onChange={(e) => {
                  const found = products.find((p) => p.id === e.target.value);
                  if (found) setSelectedProduct({ name: found.name, price: found.price });
                }}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — ${parseInt(p.price).toLocaleString("fr-FR")} FCFA</option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Info */}
          <div className="checkout-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 20 }}>Your Information</h3>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input type="tel" className="form-input" placeholder="+228 XX XX XX XX" required />
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <h3 style={{ marginBottom: 20 }}>Payment Method</h3>
            <div className="payment-methods">
              {methods.map((m) => (
                <div
                  key={m.key}
                  className={`payment-method${selectedMethod === m.key ? " selected" : ""}`}
                  onClick={() => setSelectedMethod(m.key)}
                >
                  <div className="payment-method-radio" />
                  <div className="payment-method-icon" style={{ background: m.gradient }}>{m.key === "mobile-money" ? "MM" : m.key === "paypal" ? "PP" : m.key === "credit-card" ? "CC" : "₿"}</div>
                  <div>
                    <div className="payment-method-name">{m.label}</div>
                    <div className="payment-method-desc">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic payment fields */}
            {selectedMethod === "mobile-money" && (
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" placeholder="+228 XX XX XX XX" required />
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Operator</label>
                  <select className="form-input">
                    <option>Orange Money</option>
                    <option>MTN Mobile Money</option>
                    <option>Wave</option>
                    <option>Airtel Money</option>
                  </select>
                </div>
              </div>
            )}
            {selectedMethod === "credit-card" && (
              <>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input type="text" className="form-input" placeholder="MM/YY" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input type="text" className="form-input" placeholder="123" maxLength={4} required />
                  </div>
                </div>
              </>
            )}
            {selectedMethod === "paypal" && (
              <div className="form-group">
                <label className="form-label">PayPal Email</label>
                <input type="email" className="form-input" placeholder="your@paypal.com" required />
              </div>
            )}
            {selectedMethod === "crypto" && (
              <div className="form-group">
                <label className="form-label">Cryptocurrency</label>
                <select className="form-input">
                  <option>Bitcoin (BTC)</option>
                  <option>Ethereum (ETH)</option>
                  <option>USDT (TRC20)</option>
                  <option>BNB</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div>
          <div className="checkout-card">
            <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
            <div className="order-summary">
              <div className="order-item">
                <span>{selectedProduct.name}</span>
                <span>${parseInt(selectedProduct.price).toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="order-item">
                <span style={{ color: "var(--text-muted)" }}>Processing fee</span>
                <span style={{ color: "var(--text-muted)" }}>0 FCFA</span>
              </div>
              <div className="order-total">
                <span>Total</span>
                <span style={{ color: "var(--primary)" }}>${parseInt(selectedProduct.price).toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>
            <div style={{ marginBottom: 20, padding: 16, background: "var(--primary-ultra-light)", borderRadius: "var(--radius-md)", fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--primary)" }}>🔒 Secure Checkout</div>
              <div style={{ color: "var(--text-secondary)" }}>Your payment is encrypted and your credentials will be delivered via WhatsApp within 5 minutes.</div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">
              Complete Order — ${parseInt(selectedProduct.price).toLocaleString("fr-FR")} FCFA
            </button>
            <div style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 14 }}>
              By ordering you agree to our Terms of Service & Refund Policy
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <ScrollReveal />
      <section style={{ paddingTop: "calc(var(--nav-height) + 40px)", paddingBottom: 80 }}>
        <div className="container">
          <div className="section-header reveal" style={{ textAlign: "left", marginBottom: 36 }}>
            <div className="label">Secure Checkout</div>
            <h2>Complete your order</h2>
            <p>Fast, secure and reliable. Get your credentials in under 5 minutes.</p>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <CheckoutForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
