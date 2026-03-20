import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/profile", label: "Profil" },
];

export default function Navbar() {
  const auth = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(200,113,255,0.12)",
        background: "rgba(22,0,40,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c871ff 0%, #a855f7 50%, #7c3aed 100%)",
              boxShadow: "0 0 18px rgba(200,113,255,0.5)",
              flexShrink: 0,
            }}
          />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c871ff", fontWeight: 800 }}>
              Novaia
            </div>
            <div style={{ fontSize: "14px", fontWeight: 900, color: "#fff", whiteSpace: "nowrap" }}>
              Special Week
            </div>
          </div>
        </Link>

        {/* ── Nav links (desktop) ── */}
        <nav style={{ alignItems: "center", gap: "4px", flex: 1, justifyContent: "center" }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: "7px 14px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
                color: isActive(link.to) ? "#fff" : "rgba(255,255,255,0.55)",
                background: isActive(link.to) ? "rgba(200,113,255,0.12)" : "transparent",
                border: isActive(link.to) ? "1px solid rgba(200,113,255,0.2)" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.to)) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,113,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.to)) {
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Auth section (desktop) ── */}
        <div style={{ alignItems: "center", gap: "10px", flexShrink: 0 }}
          className="hidden md:flex"
        >
          {auth.user ? (
            <>
              {/* User pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px 6px 6px",
                  borderRadius: "999px",
                  background: "rgba(200,113,255,0.08)",
                  border: "1px solid rgba(200,113,255,0.18)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #c871ff, #7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 900,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {auth.user.prenom[0].toUpperCase()}
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff", maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {auth.user.prenom}
                </span>
              </div>
              {/* Logout */}
              <button
                type="button"
                onClick={auth.logout}
                style={{
                  padding: "7px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: "7px 16px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(200,113,255,0.25)",
                  background: "transparent",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,113,255,0.55)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,113,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,113,255,0.25)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "7px 16px",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                  color: "#1a002e",
                  background: "linear-gradient(135deg, #c871ff, #a855f7)",
                  boxShadow: "0 4px 16px rgba(200,113,255,0.35)",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.1)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1)"; }}
              >
                Inscription
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile: burger ── */}
        <div className="md:hidden" style={{ flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "rgba(200,113,255,0.08)",
            border: "1px solid rgba(200,113,255,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "5px",
            padding: "8px",
          }}
          aria-label="Menu"
        >
          <span style={{ display: "block", width: "16px", height: "2px", background: menuOpen ? "#c871ff" : "rgba(255,255,255,0.7)", borderRadius: "2px", transform: menuOpen ? "rotate(45deg) translate(0, 7px)" : "none", transition: "all 0.2s" }} />
          <span style={{ display: "block", width: "16px", height: "2px", background: menuOpen ? "#c871ff" : "rgba(255,255,255,0.7)", borderRadius: "2px", opacity: menuOpen ? 0 : 1, transition: "all 0.2s" }} />
          <span style={{ display: "block", width: "16px", height: "2px", background: menuOpen ? "#c871ff" : "rgba(255,255,255,0.7)", borderRadius: "2px", transform: menuOpen ? "rotate(-45deg) translate(0, -7px)" : "none", transition: "all 0.2s" }} />
        </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid rgba(200,113,255,0.1)",
            background: "rgba(18,0,34,0.98)",
            padding: "16px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "11px 14px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                color: isActive(link.to) ? "#c871ff" : "rgba(255,255,255,0.7)",
                background: isActive(link.to) ? "rgba(200,113,255,0.1)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ borderTop: "1px solid rgba(200,113,255,0.1)", marginTop: "8px", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {auth.user ? (
              <>
                <div style={{ padding: "11px 14px", borderRadius: "12px", background: "rgba(200,113,255,0.06)", border: "1px solid rgba(200,113,255,0.15)", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #c871ff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                    {auth.user.prenom[0].toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{auth.user.prenom} {auth.user.nom}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{auth.user.points} pts</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { auth.logout(); setMenuOpen(false); }}
                  style={{ padding: "11px 14px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", cursor: "pointer", textAlign: "left" }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: "11px 14px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, textDecoration: "none", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(200,113,255,0.2)", background: "transparent", textAlign: "center" }}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  style={{ padding: "11px 14px", borderRadius: "12px", fontSize: "14px", fontWeight: 700, textDecoration: "none", color: "#1a002e", background: "linear-gradient(135deg, #c871ff, #a855f7)", textAlign: "center" }}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
