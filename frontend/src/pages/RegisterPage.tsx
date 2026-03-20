import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth, API_BASE_URL, Profil } from "../contexts/AuthContext";

const ADVANTAGES = [
  { icon: "💾", title: "Sauvegarde tes points", desc: "Retrouve ton score d'une session à l'autre." },
  { icon: "🏅", title: "Débloque des badges", desc: "3 paliers de progression avec récompenses." },
  { icon: "🏆", title: "Obtiens ta certification", desc: "Prouve ta désensibilisation à l'IA." },
  { icon: "🚀", title: "Suis ta progression", desc: "Visualise ton parcours sur ton profil." },
];

export default function RegisterPage() {
  const [form, setForm] = useState<Omit<Profil, "id">>({
    prenom: "",
    nom: "",
    mail: "",
    motDePasse: "",
    points: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Impossible de créer le compte");
      const created: Profil = await res.json();
      auth.login(created);
      navigate("/profile");
    } catch (err: any) {
      setError(err.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  if (auth.user) return <Navigate to="/profile" replace />;

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#2c0050", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", position: "relative", overflow: "hidden" }}>
      {/* Background glows */}
      <div style={{ position: "absolute", top: "10%", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,113,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "960px", borderRadius: "28px", overflow: "hidden", border: "1px solid rgba(200,113,255,0.15)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(200,113,255,0.06)", display: "flex" }}>

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between" style={{ flex: "0 0 380px", padding: "48px 40px", background: "linear-gradient(160deg, #3d0070 0%, #2c0050 40%, #1e0038 100%)", borderRight: "1px solid rgba(200,113,255,0.12)" }}>
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, #c871ff, #a855f7)", boxShadow: "0 0 18px rgba(200,113,255,0.5)" }} />
              <div>
                <div style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c871ff", fontWeight: 800 }}>Novaia</div>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#fff" }}>Special Week</div>
              </div>
            </div>

            <h2 style={{ fontSize: "34px", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: "16px", letterSpacing: "-0.02em" }}>
              Crée ton<br />
              <span style={{ background: "linear-gradient(135deg, #c871ff, #e0aaff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                espace joueur
              </span>
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: "32px" }}>
              Un compte gratuit pour suivre ta progression et décrocher ta certification IA.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {ADVANTAGES.map((adv) => (
                <div key={adv.title} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 16px", borderRadius: "14px", background: "rgba(200,113,255,0.06)", border: "1px solid rgba(200,113,255,0.1)" }}>
                  <span style={{ fontSize: "20px", lineHeight: 1 }}>{adv.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{adv.title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{adv.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", marginTop: "24px" }}>
            Projet pédagogique Novaia — Special Week
          </p>
        </div>

        {/* Right panel — form */}
        <div style={{ flex: 1, padding: "48px 40px", background: "#1e0038", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", marginBottom: "6px", letterSpacing: "-0.02em" }}>Inscription</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginBottom: "32px" }}>
            Crée ton profil joueur en quelques secondes.
          </p>

          {error && (
            <div style={{ marginBottom: "20px", borderRadius: "12px", border: "1px solid rgba(248,113,113,0.35)", background: "rgba(248,113,113,0.08)", padding: "12px 16px", fontSize: "13px", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <Field label="Prénom" type="text" value={form.prenom} onChange={(v) => handleChange("prenom", v)} placeholder="Léa" />
              <Field label="Nom" type="text" value={form.nom} onChange={(v) => handleChange("nom", v)} placeholder="Dupont" />
            </div>
            <Field label="Email" type="email" value={form.mail} onChange={(v) => handleChange("mail", v)} placeholder="ton@email.com" />
            <Field label="Mot de passe" type="password" value={form.motDePasse} onChange={(v) => handleChange("motDePasse", v)} placeholder="••••••••" />

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "15px",
                borderRadius: "14px",
                background: loading ? "rgba(200,113,255,0.4)" : "linear-gradient(135deg, #c871ff, #a855f7)",
                color: "#1a002e",
                fontWeight: 900,
                fontSize: "15px",
                letterSpacing: "0.04em",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 8px 28px rgba(200,113,255,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; }}
            >
              {loading ? "Création en cours..." : "Créer mon compte →"}
            </button>
          </form>

          <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(200,113,255,0.1)", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>Tu as déjà un compte ? </span>
            <Link to="/login" style={{ fontSize: "13px", color: "#c871ff", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e0aaff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c871ff")}
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: focused ? "#c871ff" : "rgba(255,255,255,0.4)", marginBottom: "8px", transition: "color 0.15s" }}>
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "13px 16px",
          borderRadius: "12px",
          border: `1px solid ${focused ? "rgba(200,113,255,0.5)" : "rgba(200,113,255,0.15)"}`,
          background: focused ? "rgba(200,113,255,0.06)" : "rgba(255,255,255,0.03)",
          color: "#fff",
          fontSize: "14px",
          outline: "none",
          transition: "all 0.15s",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 3px rgba(200,113,255,0.12)" : "none",
        }}
      />
    </div>
  );
}
