"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product, Purchase } from "@/lib/supabase";

type Section = "overview" | "purchases" | "shop" | "payment" | "profile";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [section, setSection] = useState<Section>("overview");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [payProduct, setPayProduct] = useState<Product | null>(null);
  const [payForm, setPayForm] = useState({ name: "", email: "", phone: "" });
  const [payLoading, setPayLoading] = useState(false);
  const [payMsg, setPayMsg] = useState("");
  const [profileForm, setProfileForm] = useState({ username: "", phone: "" });
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
      setPayForm((f) => ({ ...f, email: session.user.email || "" }));
      const { data: prof } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
      setProfile(prof);
      setProfileForm({ username: prof?.username || "", phone: prof?.phone || "" });
      const { data: purch } = await supabase.from("purchases").select("*, product:products(*)").eq("user_id", session.user.id).eq("status", "active");
      setPurchases(purch || []);
      const { data: prods } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
      setProducts(prods || []);
      setLoading(false);
    };
    init();
  }, [router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setSection("purchases");
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  const logout = async () => { await supabase.auth.signOut(); router.push("/"); };

  const initiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payProduct) return;
    setPayLoading(true); setPayMsg("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ product_id: payProduct.id, customer_name: payForm.name, customer_email: payForm.email, customer_phone: payForm.phone }),
      });
      const json = await res.json();
      if (json.payment_url) { window.location.href = json.payment_url; }
      else { setPayMsg(json.error || "Erreur lors du paiement"); }
    } catch { setPayMsg("Erreur de connexion"); }
    finally { setPayLoading(false); }
  };

  const downloadProduct = async (productId: string, productName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const res = await fetch(`/api/download?product_id=${productId}`, { headers: { Authorization: `Bearer ${session.access_token}` } });
    const json = await res.json();
    if (json.download_url) {
      const a = document.createElement("a"); a.href = json.download_url; a.download = json.file_name || productName;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } else { alert(json.error || "Erreur de téléchargement"); }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("profiles").update({ username: profileForm.username, phone: profileForm.phone }).eq("id", user.id);
    setProfileMsg(error ? "❌ Erreur" : "✅ Profil mis à jour !");
    setTimeout(() => setProfileMsg(""), 3000);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, border: "3px solid var(--primary)", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  const avatar = (profile?.username || user?.email || "U")[0].toUpperCase();
  const navItems: { key: Section; label: string; icon: string }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: "🏠" },
    { key: "purchases", label: "Mes achats", icon: "📥" },
    { key: "shop", label: "Boutique", icon: "🛒" },
    { key: "payment", label: "Payer en ligne", icon: "💳" },
    { key: "profile", label: "Mon profil", icon: "⚙️" },
  ];

  return (
    <div className="container dashboard-layout" style={{ paddingTop: 24, paddingBottom: 60 }}>
      <aside className="sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{avatar}</div>
          <div>
            <div className="sidebar-user-name">{profile?.username || "Utilisateur"}</div>
            <div className="sidebar-user-email">{user?.email}</div>
          </div>
        </div>
        <div className="sidebar-menu">
          {navItems.map((item) => (
            <div key={item.key} className={`sidebar-item${section === item.key ? " active" : ""}`} onClick={() => setSection(item.key)}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </div>
          ))}
          <div className="divider" />
          <button className="sidebar-item" onClick={logout} style={{ color: "#dc2626", width: "100%", textAlign: "left" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        {section === "overview" && (
          <>
            <div className="dashboard-greeting">
              <h2>Bonjour, {profile?.username || "vous"} 👋</h2>
              <p>Votre tableau de bord Canflix.</p>
            </div>
            <div className="stats-row">
              {[
                { label: "Achats", value: purchases.length, icon: "📥", bg: "#eef2ff", color: "#4f46e5" },
                { label: "Produits dispo.", value: products.length, icon: "📦", bg: "#f0fdf4", color: "#16a34a" },
                { label: "Téléch. restants", value: purchases.reduce((a: number, p: any) => a + ((p.max_downloads || 5) - (p.download_count || 0)), 0), icon: "⬇️", bg: "#fff7ed", color: "#d97706" },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-card-icon" style={{ background: s.bg }}><span style={{ fontSize: 20 }}>{s.icon}</span></div>
                  <div className="stat-card-num" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              ))}
            </div>
            {purchases.length > 0 && (
              <div className="dashboard-section">
                <div className="dashboard-section-header">
                  <h3>Achats récents</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSection("purchases")}>Voir tout</button>
                </div>
                {purchases.slice(0, 3).map((p: any) => <PurchaseCard key={p.id} purchase={p} onDownload={downloadProduct} />)}
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button className="btn btn-primary" onClick={() => setSection("shop")}>🛒 Boutique</button>
              <button className="btn btn-outline" onClick={() => setSection("payment")}>💳 Payer</button>
            </div>
          </>
        )}

        {section === "purchases" && (
          <>
            <div className="dashboard-greeting"><h2>📥 Mes achats</h2><p>Téléchargez vos PDF et APK.</p></div>
            {purchases.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
                <p style={{ marginBottom: 20, color: "var(--text-muted)" }}>Aucun achat pour l'instant.</p>
                <button className="btn btn-primary" onClick={() => setSection("shop")}>Voir la boutique</button>
              </div>
            ) : purchases.map((p: any) => <PurchaseCard key={p.id} purchase={p} onDownload={downloadProduct} />)}
          </>
        )}

        {section === "shop" && (
          <>
            <div className="dashboard-greeting"><h2>🛒 Boutique</h2><p>Tous nos produits à 1 000 FCFA.</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {products.map((p) => {
                const owned = purchases.some((pu: any) => pu.product_id === p.id);
                return (
                  <div key={p.id} className="card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: p.type === "pdf" ? "#fee2e2" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                      {p.type === "pdf" ? "📄" : "📱"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{p.description?.slice(0, 80)}{(p.description?.length || 0) > 80 ? "…" : ""}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: 16 }}>{p.price.toLocaleString()} FCFA</span>
                      {owned ? (
                        <button className="btn btn-outline btn-sm" onClick={() => setSection("purchases")}>✅ Acheté</button>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => { setPayProduct(p); setSection("payment"); }}>Acheter</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {section === "payment" && (
          <>
            <div className="dashboard-greeting"><h2>💳 Paiement en ligne</h2><p>Payez en toute sécurité avec Mobile Money depuis le Togo.</p></div>
            <div style={{ maxWidth: 560 }}>
              {!payProduct ? (
                <div className="card" style={{ padding: 24 }}>
                  <h4 style={{ marginBottom: 16 }}>Choisissez un produit</h4>
                  {products.map((p) => (
                    <button key={p.id} onClick={() => setPayProduct(p)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderRadius: 12, border: "2px solid var(--border)", background: "transparent", cursor: "pointer", width: "100%", marginBottom: 8 }}>
                      <span style={{ fontWeight: 600 }}>{p.type === "pdf" ? "📄" : "📱"} {p.name}</span>
                      <span style={{ fontWeight: 800, color: "var(--primary)" }}>{p.price.toLocaleString()} FCFA</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "14px 18px", background: "var(--primary-ultra-light)", borderRadius: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{payProduct.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{payProduct.type.toUpperCase()}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 800, color: "var(--primary)", fontSize: 18 }}>{payProduct.price.toLocaleString()} FCFA</span>
                      <button onClick={() => setPayProduct(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18 }}>✕</button>
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Méthodes disponibles au Togo</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[{ label: "Togocom / Flooz", color: "#FF6B00" }, { label: "Moov Money", color: "#0052A5" }, { label: "Wave", color: "#1AC8ED" }].map((m) => (
                        <div key={m.label} style={{ padding: "6px 12px", borderRadius: 8, background: m.color + "20", color: m.color, fontWeight: 600, fontSize: 12 }}>📱 {m.label}</div>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={initiatePayment}>
                    <div className="form-group">
                      <label className="form-label">Nom complet *</label>
                      <input className="form-input" value={payForm.name} onChange={(e) => setPayForm((f) => ({ ...f, name: e.target.value }))} placeholder="Votre nom" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" value={payForm.email} onChange={(e) => setPayForm((f) => ({ ...f, email: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Numéro de téléphone (Togo) *</label>
                      <input className="form-input" type="tel" value={payForm.phone} onChange={(e) => setPayForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+228 XX XX XX XX" required />
                    </div>
                    {payMsg && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fee2e2", color: "#dc2626", marginBottom: 14, fontSize: 13, fontWeight: 600 }}>❌ {payMsg}</div>}
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={payLoading}>
                      {payLoading ? "⟳ Redirection..." : `💳 Payer ${payProduct.price.toLocaleString()} FCFA`}
                    </button>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>🔒 Sécurisé par FedaPay</p>
                  </form>
                </div>
              )}
            </div>
          </>
        )}

        {section === "profile" && (
          <>
            <div className="dashboard-greeting"><h2>⚙️ Mon profil</h2></div>
            <div className="card" style={{ padding: 32, maxWidth: 480 }}>
              <form onSubmit={saveProfile}>
                <div className="form-group">
                  <label className="form-label">Nom d'utilisateur</label>
                  <input className="form-input" value={profileForm.username} onChange={(e) => setProfileForm((f) => ({ ...f, username: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={user?.email || ""} disabled style={{ opacity: 0.6 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input className="form-input" value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+228 XX XX XX XX" />
                </div>
                {profileMsg && <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13, fontWeight: 600, background: profileMsg.startsWith("✅") ? "#dcfce7" : "#fee2e2", color: profileMsg.startsWith("✅") ? "#15803d" : "#dc2626" }}>{profileMsg}</div>}
                <button type="submit" className="btn btn-primary">Sauvegarder</button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PurchaseCard({ purchase, onDownload }: { purchase: any; onDownload: (id: string, name: string) => void }) {
  const p = purchase.product;
  if (!p) return null;
  const remaining = (purchase.max_downloads || 5) - (purchase.download_count || 0);
  return (
    <div className="subscription-card" style={{ marginBottom: 10 }}>
      <div className="subscription-icon" style={{ background: p.type === "pdf" ? "linear-gradient(135deg,#ef4444,#dc2626)" : "linear-gradient(135deg,#3b82f6,#2563eb)", fontSize: 18 }}>
        {p.type === "pdf" ? "📄" : "📱"}
      </div>
      <div className="subscription-info">
        <div className="subscription-name">{p.name}</div>
        <div className="subscription-meta">{p.type.toUpperCase()} · {new Date(purchase.created_at).toLocaleDateString("fr-FR")} · {remaining} téléch. restants</div>
      </div>
      {remaining > 0 ? (
        <button className="btn btn-primary btn-sm" onClick={() => onDownload(p.id, p.name)}>⬇️ Télécharger</button>
      ) : (
        <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>Limite atteinte</span>
      )}
    </div>
  );
}
