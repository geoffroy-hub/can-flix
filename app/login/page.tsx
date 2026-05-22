"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs"); return; }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); return; }
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,var(--primary),var(--primary-dark))", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22 }}>🎬</div>
            <h2 style={{ margin: 0, marginBottom: 6 }}>Connexion</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>Accédez à votre compte Canflix</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fee2e2", color: "#dc2626", marginBottom: 16, fontSize: 13, fontWeight: 600 }}>❌ {error}</div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: 16 }} disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)" }}>
            Pas encore de compte ?{" "}
            <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>S inscire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
