import { Link } from "react-router-dom";

const GAME_LINKS = [
  { to: "/game/1", label: "Info ou Intox" },
  { to: "/game/2", label: "Chasseur d'Anomalies" },
  { to: "/game/3", label: "Quizz IA" },
  { to: "/game/4", label: "Mythos IA" },
];

const ACCOUNT_LINKS = [
  { to: "/login", label: "Connexion" },
  { to: "/register", label: "Inscription" },
  { to: "/profile", label: "Mon profil" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#120022",
        borderTop: "1px solid rgba(200,113,255,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 24px 32px",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <img
                src="/assets/img/logo_novaIA.png"
                alt="Novaia"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  objectFit: "contain",
                  flexShrink: 0,
                  boxShadow: "0 0 12px rgba(200,113,255,0.4)",
                }}
              />
              <div>
                <div style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c871ff", fontWeight: 800 }}>Novaia</div>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#fff" }}>Special Week</div>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", lineHeight: 1.65 }}>
              Plateforme pédagogique interactive pour développer la littératie numérique et la pensée critique face à l'IA.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,113,255,0.5)" }}>
                Jeux
              </span>
              {GAME_LINKS.map((l) => (
                <FooterLink key={l.to} to={l.to} label={l.label} />
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,113,255,0.5)" }}>
                Compte
              </span>
              {ACCOUNT_LINKS.map((l) => (
                <FooterLink key={l.to} to={l.to} label={l.label} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid rgba(200,113,255,0.08)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.22)" }}>
            © {new Date().getFullYear()} Novaia · Special Week
          </span>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.18)" }}>
            Littératie numérique &amp; IA
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.15s" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#c871ff")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
    >
      {label}
    </Link>
  );
}
