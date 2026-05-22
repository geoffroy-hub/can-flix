"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Stats {
  total_users: number;
  active_products: number;
  completed_payments: number;
  total_revenue_fcfa: number;
  active_purchases: number;
  downloads_today: number;
}

interface Payment {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_name: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  paid_at?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  is_active: boolean;
  download_count: number;
  file_name?: string;
  file_path?: string;
  created_at: string;
}

type AdminTab = "stats" | "products" | "payments" | "users" | "upload";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<AdminTab>("stats");
  const [stats, setStats] = useState<Stats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Product form
  const [productForm, setProductForm] = useState({
    name: "", description: "", type: "pdf", price: "1000", file_name: ""
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formMsg, setFormMsg] = useState("");

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      setIsAuthorized(true);
      setLoading(false);
    };
    checkAdmin();
  }, [router]);

  const fetchData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    setDataLoading(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const json = await res.json();
      setStats(json.stats);
      setPayments(json.recent_payments || []);
      setUsers(json.recent_users || []);

      const pRes = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const pJson = await pRes.json();
      setProducts(pJson.products || []);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) fetchData();
  }, [isAuthorized, fetchData]);

  // Upload fichier produit
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg("");
    if (!uploadFile && !productForm.file_name) {
      setFormMsg("❌ Choisissez un fichier à uploader");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    try {
      let filePath = productForm.file_name;

      if (uploadFile) {
        setUploadProgress(10);
        const ext = uploadFile.name.split(".").pop();
        const fileName = `${Date.now()}-${uploadFile.name.replace(/\s+/g, "-")}`;
        filePath = fileName;

        const { error: storageError } = await supabase.storage
          .from("products")
          .upload(fileName, uploadFile, { upsert: false });

        if (storageError) {
          setFormMsg(`❌ Erreur upload: ${storageError.message}`);
          return;
        }
        setUploadProgress(70);
      }

      // Créer le produit en base
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...productForm,
          price: parseInt(productForm.price),
          file_path: filePath,
          file_name: uploadFile?.name || productForm.file_name,
        })
      });
      const json = await res.json();
      setUploadProgress(100);

      if (json.product) {
        setFormMsg("✅ Produit ajouté avec succès !");
        setProductForm({ name: "", description: "", type: "pdf", price: "1000", file_name: "" });
        setUploadFile(null);
        setUploadProgress(0);
        fetchData();
      } else {
        setFormMsg(`❌ ${json.error}`);
      }
    } catch {
      setFormMsg("❌ Erreur serveur");
    }
  };

  // Toggle produit actif/inactif
  const toggleProduct = async (id: string, current: boolean) => {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    fetchData();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid var(--primary)", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p>Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const tabs: { key: AdminTab; label: string; icon: string }[] = [
    { key: "stats", label: "Tableau de bord", icon: "📊" },
    { key: "products", label: "Produits", icon: "📦" },
    { key: "upload", label: "Ajouter Produit", icon: "➕" },
    { key: "payments", label: "Paiements", icon: "💳" },
    { key: "users", label: "Utilisateurs", icon: "👥" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", paddingTop: 24 }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🛡️</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Panneau Admin</h2>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>Canflix — Accès restreint</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={fetchData} className="btn btn-outline btn-sm" disabled={dataLoading}>
              {dataLoading ? "⟳ Actualisation..." : "⟳ Actualiser"}
            </button>
            <button onClick={() => router.push("/dashboard")} className="btn btn-ghost btn-sm">← Tableau de bord</button>
          </div>
        </div>

        {/* Navigation tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                background: tab === t.key ? "var(--primary)" : "var(--card-bg)",
                color: tab === t.key ? "white" : "var(--text)",
                boxShadow: tab === t.key ? "0 2px 12px var(--primary-light)" : "var(--shadow-sm)",
                transition: "all 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── STATS ── */}
        {tab === "stats" && stats && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Utilisateurs", value: stats.total_users, icon: "👥", color: "#4f46e5" },
                { label: "Produits actifs", value: stats.active_products, icon: "📦", color: "#0ea5e9" },
                { label: "Paiements OK", value: stats.completed_payments, icon: "✅", color: "#16a34a" },
                { label: "Revenu total", value: `${stats.total_revenue_fcfa?.toLocaleString()} FCFA`, icon: "💰", color: "#d97706", small: true },
                { label: "Achats actifs", value: stats.active_purchases, icon: "🛒", color: "#7c3aed" },
                { label: "Téléch. aujourd'hui", value: stats.downloads_today, icon: "⬇️", color: "#e50914" },
              ].map((s) => (
                <div key={s.label} className="card" style={{ padding: "20px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: s.small ? 16 : 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16 }}>⚡ Actions rapides</h3>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-sm" onClick={() => setTab("upload")}>+ Ajouter un produit</button>
                <button className="btn btn-outline btn-sm" onClick={() => setTab("payments")}>Voir les paiements</button>
                <button className="btn btn-outline btn-sm" onClick={() => setTab("users")}>Gérer les utilisateurs</button>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUITS ── */}
        {tab === "products" && (
          <div>
            <h3 style={{ marginBottom: 20 }}>📦 Produits ({products.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {products.map((p) => (
                <div key={p.id} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: p.type === "pdf" ? "#fee2e2" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {p.type === "pdf" ? "📄" : p.type === "apk" ? "📱" : "🖥️"}
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {p.type.toUpperCase()} · {p.price.toLocaleString()} FCFA · {p.download_count} téléch.
                    </div>
                    {p.file_name && <div style={{ fontSize: 11, color: "#6366f1", marginTop: 2 }}>📎 {p.file_name}</div>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: p.is_active ? "#dcfce7" : "#fee2e2",
                      color: p.is_active ? "#16a34a" : "#dc2626"
                    }}>
                      {p.is_active ? "Actif" : "Inactif"}
                    </span>
                    <button
                      onClick={() => toggleProduct(p.id, p.is_active)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: 11 }}
                    >
                      {p.is_active ? "Désactiver" : "Activer"}
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
                  Aucun produit. <button className="btn btn-primary btn-sm" onClick={() => setTab("upload")}>Ajouter</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── UPLOAD ── */}
        {tab === "upload" && (
          <div style={{ maxWidth: 580 }}>
            <h3 style={{ marginBottom: 24 }}>➕ Ajouter un produit</h3>
            <div className="card" style={{ padding: 32 }}>
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label className="form-label">Nom du produit *</label>
                  <input className="form-input" value={productForm.name}
                    onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="ex: Formation TikTok Viral" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={productForm.description}
                    onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Description du produit..." style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select className="form-input" value={productForm.type}
                      onChange={(e) => setProductForm((f) => ({ ...f, type: e.target.value }))}>
                      <option value="pdf">📄 PDF (cours, guide)</option>
                      <option value="apk">📱 APK (application Android)</option>
                      <option value="app">🖥️ Application</option>
                      <option value="course">🎓 Formation</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Prix (FCFA) *</label>
                    <input className="form-input" type="number" value={productForm.price}
                      onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                      min="100" step="100" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Fichier (PDF ou APK) *</label>
                  <div style={{
                    border: "2px dashed var(--border)",
                    borderRadius: 12,
                    padding: 28,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    background: uploadFile ? "var(--primary-ultra-light)" : "transparent"
                  }}
                    onClick={() => document.getElementById("file-upload")?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); setUploadFile(e.dataTransfer.files[0] || null); }}
                  >
                    <input id="file-upload" type="file" accept=".pdf,.apk,.zip"
                      style={{ display: "none" }}
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                    {uploadFile ? (
                      <>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>{uploadFile.name.endsWith(".apk") ? "📱" : "📄"}</div>
                        <div style={{ fontWeight: 700, color: "var(--primary)" }}>{uploadFile.name}</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>☁️</div>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>Glisser-déposer ou cliquer</div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>PDF, APK — max 100MB</div>
                      </>
                    )}
                  </div>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ margin: "12px 0" }}>
                    <div style={{ height: 6, background: "var(--border)", borderRadius: 3 }}>
                      <div style={{ height: "100%", width: `${uploadProgress}%`, background: "var(--primary)", borderRadius: 3, transition: "width 0.3s" }} />
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>Upload en cours... {uploadProgress}%</div>
                  </div>
                )}
                {formMsg && (
                  <div style={{
                    padding: "12px 16px", borderRadius: 10, marginBottom: 16,
                    background: formMsg.startsWith("✅") ? "#dcfce7" : "#fee2e2",
                    color: formMsg.startsWith("✅") ? "#15803d" : "#dc2626",
                    fontWeight: 600, fontSize: 14
                  }}>{formMsg}</div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  ➕ Ajouter le produit
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── PAIEMENTS ── */}
        {tab === "payments" && (
          <div>
            <h3 style={{ marginBottom: 20 }}>💳 Derniers paiements</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--card-bg)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
                <thead>
                  <tr style={{ background: "var(--surface)" }}>
                    {["Client", "Produit", "Montant", "Statut", "Méthode", "Date"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.customer_name || "—"}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.customer_email}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.customer_phone}</div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.product_name}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700 }}>{p.amount?.toLocaleString()} FCFA</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: p.status === "completed" ? "#dcfce7" : p.status === "pending" ? "#fef9c3" : "#fee2e2",
                          color: p.status === "completed" ? "#15803d" : p.status === "pending" ? "#854d0e" : "#dc2626"
                        }}>
                          {p.status === "completed" ? "✅ Payé" : p.status === "pending" ? "⏳ En attente" : "❌ Échoué"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12 }}>{p.payment_method}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)" }}>
                        {new Date(p.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {payments.length === 0 && (
                <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>Aucun paiement encore.</div>
              )}
            </div>
          </div>
        )}

        {/* ── UTILISATEURS ── */}
        {tab === "users" && (
          <div>
            <h3 style={{ marginBottom: 20 }}>👥 Utilisateurs ({users.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {users.map((u) => (
                <div key={u.id} className="card" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: u.role === "admin" ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", flexShrink: 0 }}>
                    {(u.username || u.email || "U")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontWeight: 700 }}>{u.username || "—"}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{u.email}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: u.role === "admin" ? "#ede9fe" : "#f0f9ff",
                      color: u.role === "admin" ? "#7c3aed" : "#0369a1"
                    }}>
                      {u.role === "admin" ? "🛡️ Admin" : "👤 User"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(u.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
