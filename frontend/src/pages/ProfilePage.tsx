import React, { useState, useRef, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth, API_BASE_URL } from "../contexts/AuthContext";

const TIERS = [
  { id: 1, name: "Initié",   required: 100, medal: "🥉", color: "#e8a87c", glow: "rgba(232,168,124,0.3)", desc: "Tu as commencé à explorer le monde de l'IA." },
  { id: 2, name: "Vigilant", required: 300, medal: "🥈", color: "#c0cfe0", glow: "rgba(192,207,224,0.3)", desc: "Tu sais identifier les pièges les plus courants." },
  { id: 3, name: "Expert IA",required: 600, medal: "🥇", color: "#f0d060", glow: "rgba(240,208,96,0.3)",  desc: "Tu maîtrises les mécanismes de désinformation par l'IA." },
];

const GAMES = [
  { id: 1, name: "Info ou Intox",        desc: "Swipe gauche / droite",     icon: "🃏", color: "#fb7185" },
  { id: 2, name: "Chasseur d'Anomalies", desc: "Trouve les différences",    icon: "🔍", color: "#38bdf8" },
  { id: 3, name: "Quizz IA",             desc: "Questions à choix multiple",icon: "❓", color: "#4ade80" },
  { id: 4, name: "Mythos IA",            desc: "Détecte les hallucinations", icon: "🤖", color: "#facc15" },
];

// ─── Confetti star particles (CSS only) ─────────────────────────────────────
function Stars({ count = 18 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    key: i,
    top:  `${Math.random() * 90}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 10 + 6,
    delay: `${(Math.random() * 3).toFixed(2)}s`,
    dur:   `${(2 + Math.random() * 2).toFixed(2)}s`,
    opacity: (0.3 + Math.random() * 0.55).toFixed(2),
  }));
  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: 0.1; transform: scale(0.8); }
          50%      { opacity: 1;   transform: scale(1.2); }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0.8; }
          100% { transform: translateY(-60px) rotate(20deg); opacity: 0; }
        }
      `}</style>
      {stars.map((s) => (
        <div key={s.key} style={{
          position: "absolute", top: s.top, left: s.left,
          fontSize: `${s.size}px`, lineHeight: 1, opacity: Number(s.opacity),
          animation: `twinkle ${s.dur} ${s.delay} infinite`,
          pointerEvents: "none", userSelect: "none",
        }}>★</div>
      ))}
    </>
  );
}

// ─── Certificate Component ────────────────────────────────────────────────────
function Certificate({ user }: { user: { prenom: string; nom: string; points: number } }) {
  const dateStr = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=1200,height=800");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>Certification IA — ${user.prenom} ${user.nom}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 297mm; height: 210mm;
    background: #1a002e;
    color: #fff;
    font-family: 'Segoe UI', system-ui, sans-serif;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .page {
    width: 100%; height: 100%;
    background: linear-gradient(135deg, #2c0050 0%, #1a002e 40%, #0d0020 100%);
    position: relative;
    display: flex; align-items: center; justify-content: center;
    padding: 32px 56px;
  }
  /* Decorative border */
  .page::before {
    content: '';
    position: absolute; inset: 14px;
    border: 2px solid rgba(200,113,255,0.35);
    border-radius: 16px;
  }
  .page::after {
    content: '';
    position: absolute; inset: 18px;
    border: 1px solid rgba(240,208,96,0.2);
    border-radius: 14px;
  }
  /* Corner ornaments */
  .corner { position: absolute; font-size: 22px; opacity: 0.6; }
  .corner.tl { top: 28px; left: 28px; }
  .corner.tr { top: 28px; right: 28px; }
  .corner.bl { bottom: 28px; left: 28px; }
  .corner.br { bottom: 28px; right: 28px; }
  /* Star field */
  .star { position: absolute; color: #c871ff; font-size: 14px; opacity: 0.25; }
  /* Content layout */
  .inner { display: flex; align-items: center; gap: 56px; width: 100%; position: relative; z-index: 1; }
  .left-seal {
    flex: 0 0 180px; display: flex; flex-direction: column; align-items: center; gap: 12px;
    border-right: 1px solid rgba(200,113,255,0.2); padding-right: 48px;
  }
  .trophy { font-size: 88px; line-height: 1; filter: drop-shadow(0 0 24px rgba(240,208,96,0.6)); }
  .logo-label {
    font-size: 10px; font-weight: 800; letter-spacing: 0.3em;
    text-transform: uppercase; color: #c871ff;
  }
  .novaia { font-size: 18px; font-weight: 900; color: #fff; }
  .right { flex: 1; }
  .cert-label {
    font-size: 11px; font-weight: 800; letter-spacing: 0.35em;
    text-transform: uppercase; color: rgba(240,208,96,0.7);
    margin-bottom: 16px;
  }
  .name {
    font-size: 52px; font-weight: 900; color: #fff;
    letter-spacing: -0.02em; line-height: 1.05;
    background: linear-gradient(135deg, #fff 0%, #e0aaff 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 10px;
  }
  .subtitle { font-size: 17px; color: rgba(255,255,255,0.55); margin-bottom: 28px; }
  .badges { display: flex; gap: 16px; margin-bottom: 28px; }
  .badge {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 999px;
    background: rgba(200,113,255,0.1); border: 1px solid rgba(200,113,255,0.25);
    font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.8);
  }
  .divider { height: 1px; background: linear-gradient(90deg, rgba(200,113,255,0.4), rgba(240,208,96,0.3), transparent); margin-bottom: 20px; }
  .meta { display: flex; gap: 32px; }
  .meta-item { }
  .meta-label { font-size: 9px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
  .meta-value { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.7); }
  .meta-value.pts { color: #c871ff; font-size: 18px; }
</style>
</head><body>
<div class="page">
  <!-- Corner ornaments -->
  <div class="corner tl">❋</div>
  <div class="corner tr">❋</div>
  <div class="corner bl">❋</div>
  <div class="corner br">❋</div>
  <!-- Stars -->
  <div class="star" style="top:8%;left:20%">★</div>
  <div class="star" style="top:15%;left:45%">✦</div>
  <div class="star" style="top:75%;left:30%">★</div>
  <div class="star" style="top:85%;left:65%">✦</div>
  <div class="star" style="top:20%;right:15%">★</div>
  <div class="star" style="top:60%;right:8%">✦</div>
  <!-- Content -->
  <div class="inner">
    <div class="left-seal">
      <div class="trophy">🏆</div>
      <div class="logo-label">Novaia</div>
      <div class="novaia">Special Week</div>
    </div>
    <div class="right">
      <div class="cert-label">Certification de désensibilisation à l'IA</div>
      <div class="name">${user.prenom} ${user.nom}</div>
      <div class="subtitle">a maîtrisé les enjeux de l'intelligence artificielle<br>et la détection de la désinformation en ligne.</div>
      <div class="badges">
        <div class="badge">🥉 Initié</div>
        <div class="badge">🥈 Vigilant</div>
        <div class="badge">🥇 Expert IA</div>
      </div>
      <div class="divider"></div>
      <div class="meta">
        <div class="meta-item">
          <div class="meta-label">Score obtenu</div>
          <div class="meta-value pts">${user.points} points</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Délivré le</div>
          <div class="meta-value">${dateStr}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Plateforme</div>
          <div class="meta-value">novaia.mathisbruel.fr</div>
        </div>
      </div>
    </div>
  </div>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  return (
    <div style={{
      position: "relative", overflow: "hidden",
      borderRadius: "24px",
      border: "2px solid rgba(240,208,96,0.45)",
      background: "linear-gradient(135deg, rgba(240,208,96,0.07) 0%, rgba(200,113,255,0.06) 50%, rgba(44,0,80,0.3) 100%)",
      boxShadow: "0 0 80px rgba(240,208,96,0.12), 0 0 40px rgba(200,113,255,0.1)",
      padding: "52px 48px 44px",
    }}>
      {/* Shimmer top border */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(240,208,96,0.8) 40%, rgba(200,113,255,0.8) 60%, transparent 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent 0%, rgba(200,113,255,0.5) 40%, rgba(240,208,96,0.5) 60%, transparent 100%)" }} />

      {/* Corner sparkles */}
      {["8px 8px", "8px auto 8px 8px", "auto 8px 8px 8px", "auto 8px 8px auto"].map((m, i) => (
        <div key={i} style={{ position: "absolute", margin: m, top: i < 2 ? 0 : "auto", bottom: i >= 2 ? 0 : "auto", left: i % 2 === 0 ? 0 : "auto", right: i % 2 !== 0 ? 0 : "auto", fontSize: "20px", opacity: 0.5, pointerEvents: "none" }}>❋</div>
      ))}

      {/* Animated stars */}
      <Stars count={22} />

      {/* Inner double border */}
      <div style={{ position: "absolute", inset: "12px", border: "1px solid rgba(240,208,96,0.15)", borderRadius: "16px", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", display: "flex", gap: "48px", alignItems: "center", flexWrap: "wrap" }}>

        {/* Trophy column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ fontSize: "72px", lineHeight: 1, filter: "drop-shadow(0 0 28px rgba(240,208,96,0.7)) drop-shadow(0 0 60px rgba(240,208,96,0.3))" }}>🏆</div>
          <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(240,208,96,0.5), transparent)" }} />
          <div style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c871ff", textAlign: "center" }}>Novaia<br/>Special Week</div>
        </div>

        {/* Main text */}
        <div style={{ flex: 1, minWidth: "260px" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(240,208,96,0.75)", marginBottom: "14px" }}>
            Certification de désensibilisation à l'IA
          </div>
          <div style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "10px",
            background: "linear-gradient(135deg, #fff 30%, #e0aaff 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {user.prenom} {user.nom}
          </div>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", marginBottom: "24px", lineHeight: 1.6 }}>
            a maîtrisé les enjeux de l'intelligence artificielle<br />et la détection de la désinformation en ligne.
          </p>

          {/* Badges row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
            {TIERS.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 14px", borderRadius: "999px",
                background: `${t.color}16`, border: `1px solid ${t.color}40`,
              }}>
                <span style={{ fontSize: "15px" }}>{t.medal}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: t.color }}>{t.name}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(200,113,255,0.3), rgba(240,208,96,0.3), transparent)", marginBottom: "18px" }} />

          {/* Meta + print button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", gap: "28px" }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "3px" }}>Score</div>
                <div style={{ fontSize: "20px", fontWeight: 900, color: "#c871ff" }}>{user.points} pts</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "3px" }}>Délivré le</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{dateStr}</div>
              </div>
            </div>
            <button onClick={handlePrint} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "12px 24px", borderRadius: "999px",
              background: "linear-gradient(135deg, #f0d060, #e8b840)",
              color: "#1a0a00", fontWeight: 800, fontSize: "13px", border: "none", cursor: "pointer",
              boxShadow: "0 4px 24px rgba(240,208,96,0.35)",
              transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
            >
              🖨️ Télécharger / Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ProfilePage ──────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const auth = useAuth();
  const [debugLoading, setDebugLoading] = useState(false);

  if (!auth.user) return <Navigate to="/login" replace />;

  const user = auth.user;
  // Ensure pts is always a valid number
  const pts = Math.max(0, Number(user.points) || 0);

  const unlockedTiers = TIERS.filter((t) => pts >= t.required);
  const allUnlocked = unlockedTiers.length === TIERS.length;
  const nextTier = TIERS.find((t) => pts < t.required);

  // Bracket-based progress: from previous tier threshold to next tier threshold
  const nextIdx = nextTier ? TIERS.indexOf(nextTier) : TIERS.length;
  const bracketStart = nextIdx > 0 ? TIERS[nextIdx - 1].required : 0;
  const bracketEnd   = nextTier ? nextTier.required : TIERS[TIERS.length - 1].required;
  const bracketRange = bracketEnd - bracketStart;
  const progressPct = allUnlocked
    ? 100
    : bracketRange > 0
    ? Math.min(100, Math.max(0, Math.round(((pts - bracketStart) / bracketRange) * 100)))
    : 0;

  const initials = `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase();

  const handleDebug = async () => {
    if (!nextTier || !user.id || debugLoading) return;
    const delta = nextTier.required - pts;
    if (delta <= 0) return;
    setDebugLoading(true);
    try {
      await fetch(`${API_BASE_URL}/api/accounts/${user.id}/add-points?delta=${delta}`, { method: "POST" });
      auth.updateUserPoints(delta);
    } catch (e) {
      console.error("Debug error", e);
    } finally {
      setDebugLoading(false);
    }
  };

  const card: React.CSSProperties = {
    background: "rgba(200,113,255,0.05)",
    border: "1px solid rgba(200,113,255,0.14)",
    borderRadius: "20px",
    padding: "28px",
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", position: "relative", overflow: "hidden", paddingBottom: "80px" }}>
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: 0, right: "10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,113,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto", padding: "48px 24px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* ── Hero card ── */}
        <div style={{ ...card, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px", boxShadow: "0 12px 48px rgba(0,0,0,0.35)" }}>
          {/* Avatar */}
          <div style={{ width: "76px", height: "76px", borderRadius: "20px", background: "linear-gradient(135deg, #c871ff, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: 900, color: "#fff", boxShadow: "0 0 32px rgba(200,113,255,0.4)", flexShrink: 0 }}>
            {initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: "4px" }}>
              {user.prenom} {user.nom}
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>{user.mail}</p>

            {!allUnlocked && nextTier ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginBottom: "8px" }}>
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>
                    Vers <strong style={{ color: "#fff" }}>{nextTier.name}</strong>
                    <span style={{ color: "rgba(255,255,255,0.3)", marginLeft: "6px" }}>({bracketStart} → {bracketEnd} pts)</span>
                  </span>
                  <span style={{ color: "#c871ff", fontWeight: 700 }}>{progressPct}%</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1, maxWidth: "320px", height: "8px", background: "rgba(200,113,255,0.12)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #8b3aed, #c871ff, #e0aaff)", borderRadius: "999px", transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 8px rgba(200,113,255,0.5)" }} />
                  </div>
                  <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>
                    {pts} / {nextTier.required} pts
                  </span>
                  {/* Debug button */}
                  <button onClick={handleDebug} disabled={debugLoading}
                    title={`Ajouter ${nextTier.required - pts} pts → "${nextTier.name}"`}
                    style={{ padding: "3px 10px", borderRadius: "999px", background: "rgba(255,200,0,0.1)", border: "1px solid rgba(255,200,0,0.3)", color: "#ffd700", fontSize: "11px", fontWeight: 700, cursor: debugLoading ? "not-allowed" : "pointer", opacity: debugLoading ? 0.5 : 1, whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    🐛 {debugLoading ? "…" : `+${nextTier.required - pts} pts`}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(240,208,96,0.1)", border: "1px solid rgba(240,208,96,0.3)", fontSize: "12px", fontWeight: 700, color: "#f0d060" }}>
                🏆 Tous les paliers débloqués !
              </div>
            )}
            
            {user.admin && (
              <div style={{ marginTop: "16px" }}>
                <Link to="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "999px", background: "rgba(255,100,100,0.15)", border: "1px solid rgba(255,100,100,0.4)", fontSize: "13px", fontWeight: 800, color: "#ff8888", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,100,100,0.25)"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,100,100,0.15)"; (e.currentTarget as HTMLAnchorElement).style.transform = "none"; }}
                >
                  ⚙️ Tableau de Bord Admin
                </Link>
              </div>
            )}
          </div>

          {/* Score badge */}
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(200,113,255,0.5)", marginBottom: "4px" }}>Score total</div>
            <div style={{ fontSize: "52px", fontWeight: 900, lineHeight: 1, color: "#c871ff", textShadow: "0 0 30px rgba(200,113,255,0.5)" }}>{pts}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>points</div>
          </div>
        </div>

        {/* ── Paliers ── */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: "16px" }}>Paliers de progression</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {TIERS.map((tier) => {
              const unlocked = pts >= tier.required;
              return (
                <div key={tier.id} style={{
                  padding: "24px", borderRadius: "18px", position: "relative",
                  border: `1px solid ${unlocked ? tier.color + "45" : "rgba(200,113,255,0.08)"}`,
                  background: unlocked
                    ? `radial-gradient(circle at 20% 20%, ${tier.color}18, transparent 60%), rgba(200,113,255,0.04)`
                    : "rgba(255,255,255,0.02)",
                  opacity: unlocked ? 1 : 0.45,
                  boxShadow: unlocked ? `0 0 32px ${tier.glow}` : "none",
                  transition: "all 0.3s",
                }}>
                  {!unlocked && <div style={{ position: "absolute", top: "14px", right: "14px", fontSize: "14px" }}>🔒</div>}
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>{tier.medal}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>{tier.name}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: "14px" }}>{tier.desc}</div>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "5px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: 700,
                    background: unlocked ? `${tier.color}18` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${unlocked ? tier.color + "44" : "transparent"}`,
                    color: unlocked ? tier.color : "rgba(255,255,255,0.3)",
                  }}>
                    {unlocked ? `✓ Débloqué` : `${tier.required} pts requis`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Certification ── */}
        {allUnlocked ? (
          <Certificate user={user} />
        ) : (
          <div style={{ borderRadius: "18px", border: "1px dashed rgba(240,208,96,0.25)", background: "rgba(240,208,96,0.02)", padding: "36px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "14px", opacity: 0.5 }}>🏆</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(240,208,96,0.55)", marginBottom: "8px" }}>Certification de désensibilisation à l'IA</div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>
              Débloque les 3 paliers (600 pts) pour obtenir ta certification officielle.
            </p>
            {nextTier && (
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.22)" }}>
                Il te manque encore <strong style={{ color: "#c871ff" }}>{nextTier.required - pts} points</strong>.
              </p>
            )}
          </div>
        )}

        {/* ── Jeux rapides ── */}
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", marginBottom: "16px" }}>Accès rapide aux jeux</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
            {GAMES.map((game) => (
              <Link key={game.id} to={`/game/${game.id}`}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 18px", borderRadius: "16px", border: `1px solid ${game.color}25`, background: `${game.color}08`, textDecoration: "none", transition: "all 0.2s" }}
                onMouseEnter={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.border = `1px solid ${game.color}55`; a.style.background = `${game.color}14`; a.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const a = e.currentTarget as HTMLAnchorElement; a.style.border = `1px solid ${game.color}25`; a.style.background = `${game.color}08`; a.style.transform = "translateY(0)"; }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `${game.color}18`, border: `1px solid ${game.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                  {game.icon}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{game.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{game.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", color: game.color, opacity: 0.6, flexShrink: 0 }}>→</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
