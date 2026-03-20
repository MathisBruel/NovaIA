import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL, Profil } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/accounts`);
      if (!res.ok) throw new Error("Impossible de charger les comptes");
      const profils: Profil[] = await res.json();
      const found = profils.find((p) => p.mail === email && p.motDePasse === password);
      if (!found) {
        setError("Identifiants invalides. Vérifie ton email et ton mot de passe.");
        return;
      }
      auth.login(found);
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
      <div style={{ position: "absolute", top: "20%", left: "15%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,113,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "15%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "920px", borderRadius: "28px", overflow: "hidden", border: "1px solid rgba(200,113,255,0.15)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(200,113,255,0.06)", display: "flex" }}>

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
              Bon retour,<br />
              <span style={{ background: "linear-gradient(135deg, #c871ff, #e0aaff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                explorateur !
              </span>
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
              Connecte-toi pour retrouver tes points, tes badges et reprendre ton aventure dans le hub spatial.
            </p>
          </div>

          {/* Info blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "🌌", title: "Hub 3D interactif", desc: "4 planètes, 4 jeux immersifs." },
              { icon: "🏅", title: "Badges & progression", desc: "Initié → Vigilant → Expert IA." },
              { icon: "🧠", title: "Littératie numérique", desc: "Comprendre l'IA, démasquer les fakes." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px 16px", borderRadius: "14px", background: "rgba(200,113,255,0.06)", border: "1px solid rgba(200,113,255,0.1)" }}>
                <span style={{ fontSize: "20px", lineHeight: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{ flex: 1, padding: "48px 40px", background: "#1e0038", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", marginBottom: "6px", letterSpacing: "-0.02em" }}>Connexion</h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginBottom: "32px" }}>
            Accède à ton profil joueur et tes points.
          </p>

          {error && (
            <div style={{ marginBottom: "20px", borderRadius: "12px", border: "1px solid rgba(248,113,113,0.35)", background: "rgba(248,113,113,0.08)", padding: "12px 16px", fontSize: "13px", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="ton@email.com" />
            <Field label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="••••••••" />

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
              {loading ? "Connexion en cours..." : "Se connecter →"}
            </button>
          </form>

          <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(200,113,255,0.1)", textAlign: "center" }}>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>Pas encore de compte ? </span>
            <Link to="/register" style={{ fontSize: "13px", color: "#c871ff", fontWeight: 700, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e0aaff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c871ff")}
            >
              Créer un compte
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
