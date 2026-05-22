"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password) { setError("Veuillez remplir tous les champs"); return; }
    if (form.password !== form.confirm) { setError("Les mots de passe ne correspondent pas"); return; }
    if (form.password.length < 6) { setError("Mot de passe trop court (min 6 caractères)"); return; }
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { username: form.username } }
      });
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
            <h2 style={{ margin: 0, marginBottom: 6 }}>Créer un compte</h2>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>Rejoignez Canflix aujourd'hui</p>
          </div>
          <form onSubmit={handleSubmit}>
            {["username", "email", "password", "confirm"].map((field) => (
              <div key={field} className="form-group">
                <label className="form-label">
                  {field === "username" ? "Nom d'utilisateur" : field === "email" ? "Email" : field === "password" ? "Mot de passe" : "Confirmer le mot de passe"}
                </label>
                <input
                  className="form-input"
                  type={field.includes("password") || field === "confirm" ? "password" : field === "email" ? "email" : "text"}
                  value={(form as any)[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  placeholder={field === "username" ? "Votre pseudo" : field === "email" ? "votre@email.com" : "••••••••"}
                  required
                />
              </div>
            ))}
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fee2e2", color: "#dc2626", marginBottom: 16, fontSize: 13, fontWeight: 600 }}>❌ {error}</div>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginBottom: 16 }} disabled={loading}>
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)" }}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
