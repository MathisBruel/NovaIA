import React from "react";
import { Link } from "react-router-dom";

// ── Game cards data ──
const GAME_CARDS = [
  {
    id: 1, number: "01", name: "Info ou Intox", type: "Swiper",
    description: "Swipe à gauche ou à droite pour démasquer les vraies et fausses informations. Entraîne ton esprit critique face aux contenus trompeurs du web.",
    icon: "🃏", accent: "#fb7185",
  },
  {
    id: 2, number: "02", name: "Chasseur d'Anomalies", type: "Spot the Difference",
    description: "Repère les erreurs glissées dans des visuels retouchés par l'IA. Aiguise ton œil pour détecter les manipulations numériques et les deepfakes.",
    icon: "🔍", accent: "#38bdf8",
  },
  {
    id: 3, number: "03", name: "Quizz IA", type: "Questions & Réponses",
    description: "Teste tes connaissances sur l'IA avec des QCM. Culture générale, éthique, techniques et enjeux sociétaux de l'intelligence artificielle.",
    icon: "❓", accent: "#4ade80",
  },
  {
    id: 4, number: "04", name: "Mythos IA", type: "Vrai ou Faux",
    description: "Mythe ou réalité ? Démêle le vrai du faux sur l'IA et combat les idées reçues avec des explications argumentées et sourcées.",
    icon: "🤖", accent: "#facc15",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Choisis une planète", description: "Navigue dans le hub 3D et sélectionne le jeu qui t'attire dans l'univers de l'IA." },
  { step: "02", title: "Joue et apprends", description: "Réponds aux défis, explore les contenus et développe tes réflexes face aux contenus trompeurs." },
  { step: "03", title: "Gagne des points", description: "Accumule de l'expérience, progresse dans ton profil et deviens un expert de la littératie numérique." },
];

const S = {
  base: { background: "#2c0050", color: "#fff", fontFamily: "inherit" } as React.CSSProperties,
  divider: { position: "absolute" as const, top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(200,113,255,0.3), transparent)" },
  label: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(200,113,255,0.6)", display: "block", marginBottom: "12px" },
  h2: { fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "24px" } as React.CSSProperties,
  h3: { fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.1 } as React.CSSProperties,
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 48px" } as React.CSSProperties,
  gradientText: { background: "linear-gradient(135deg, #c871ff 0%, #e0aaff 50%, #c871ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } as React.CSSProperties,
};

export default function LandingSection() {
  return (
    <div style={S.base}>

      {/* ── Mission ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "96px 0 80px", borderTop: "1px solid rgba(200,113,255,0.12)" }}>
        <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(200,113,255,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={S.container}>
          <div style={{ display: "flex", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>

            {/* Left: text */}
            <div style={{ flex: "1 1 420px", minWidth: 0 }}>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "999px", border: "1px solid rgba(200,113,255,0.35)", background: "rgba(200,113,255,0.08)", marginBottom: "28px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#c871ff", boxShadow: "0 0 8px #c871ff" }} />
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#c871ff" }}>
                  Special Week · Novaia
                </span>
              </div>

              <h2 style={S.h2}>
                Propulser l'apprentissage{" "}
                <span style={S.gradientText}>vers de nouveaux horizons.</span>
              </h2>

              <p style={{ fontSize: "18px", lineHeight: 1.7, color: "rgba(255,255,255,0.65)", maxWidth: "560px", marginBottom: "12px" }}>
                SumSum te guide dans un hub spatial interactif pour maîtriser les enjeux de l'IA et lutter contre la désinformation.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "rgba(255,255,255,0.4)", maxWidth: "520px" }}>
                Apprends par l'action, progresse avec des points et développe de vrais réflexes face aux contenus trompeurs.
              </p>

              {/* Stats */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginTop: "48px" }}>
                {[{ value: "4", label: "Jeux interactifs" }, { value: "100+", label: "Questions & défis" }, { value: "∞", label: "Points à gagner" }].map((stat) => (
                  <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "38px", fontWeight: 900, color: "#c871ff", lineHeight: 1, textShadow: "0 0 24px rgba(200,113,255,0.5)" }}>{stat.value}</span>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: decorative glow orb */}
            <div style={{ flex: "0 0 340px", height: "340px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, rgba(200,113,255,0.35) 0%, rgba(124,58,237,0.2) 45%, transparent 70%)", boxShadow: "0 0 80px rgba(200,113,255,0.25), inset 0 0 60px rgba(200,113,255,0.1)", border: "1px solid rgba(200,113,255,0.2)" }} />
              <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", border: "1px dashed rgba(200,113,255,0.15)", animation: "spin 18s linear infinite" }} />
              <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", border: "1px dashed rgba(200,113,255,0.08)", animation: "spin 28s linear infinite reverse" }} />
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          </div>
        </div>
      </section>

      {/* ── Les jeux ── */}
      <section style={{ padding: "80px 0 96px", position: "relative", overflow: "hidden" }}>
        <div style={S.divider} />
        <div style={S.container}>
          <div style={{ marginBottom: "56px" }}>
            <span style={S.label}>Les jeux</span>
            <h3 style={S.h3}>Quatre univers à explorer</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {GAME_CARDS.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section style={{ padding: "80px 0 96px", position: "relative", background: "linear-gradient(180deg, #2c0050 0%, #1e0038 50%, #2c0050 100%)" }}>
        <div style={S.divider} />
        <div style={S.container}>
          <div style={{ marginBottom: "56px" }}>
            <span style={S.label}>Comment jouer</span>
            <h3 style={S.h3}>Simple comme une orbite</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} style={{ padding: "36px 32px", borderRadius: "20px", border: "1px solid rgba(200,113,255,0.15)", background: "rgba(200,113,255,0.04)" }}>
                <div style={{ fontSize: "48px", fontWeight: 900, color: "rgba(200,113,255,0.12)", lineHeight: 1, marginBottom: "20px", letterSpacing: "-0.03em" }}>{item.step}</div>
                <div style={{ width: "40px", height: "3px", borderRadius: "2px", background: "linear-gradient(90deg, #c871ff, rgba(200,113,255,0.3))", marginBottom: "20px" }} />
                <h4 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "12px", letterSpacing: "-0.01em" }}>{item.title}</h4>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 0 100px", position: "relative", overflow: "hidden" }}>
        <div style={S.divider} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(200,113,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ ...S.container, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative" }}>
          <span style={{ ...S.label, marginBottom: "20px" }}>Prêt ?</span>
          <h3 style={{ ...S.h3, fontSize: "clamp(32px, 5vw, 60px)", marginBottom: "20px" }}>
            Rejoins l'aventure{" "}
            <span style={S.gradientText}>Special Week</span>
          </h3>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.5)", maxWidth: "480px", lineHeight: 1.65, marginBottom: "44px" }}>
            Crée ton compte, entre dans le hub 3D et commence à explorer les planètes de la connaissance.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/register" style={{ padding: "16px 40px", borderRadius: "999px", background: "linear-gradient(135deg, #c871ff, #a855f7)", color: "#1a002e", fontWeight: 800, fontSize: "15px", letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", boxShadow: "0 8px 32px rgba(200,113,255,0.4)" }}>
              Créer un compte
            </Link>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ padding: "16px 40px", borderRadius: "999px", background: "rgba(200,113,255,0.08)", color: "#e0aaff", fontWeight: 700, fontSize: "15px", letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(200,113,255,0.35)", cursor: "pointer" }}>
              Accéder au Hub 3D ↑
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function GameCard({ game }: { game: (typeof GAME_CARDS)[number] }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px 28px 28px", borderRadius: "20px",
        border: `1px solid ${hovered ? game.accent + "55" : "rgba(200,113,255,0.15)"}`,
        background: hovered ? "rgba(200,113,255,0.07)" : "rgba(200,113,255,0.04)",
        position: "relative", overflow: "hidden", transition: "all 0.3s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 48px rgba(200,113,255,0.12)" : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(200,113,255,0.45)" }}>{game.number}</span>
        <span style={{ fontSize: "28px", lineHeight: 1 }}>{game.icon}</span>
      </div>
      <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "4px 10px", borderRadius: "6px", background: `${game.accent}18`, border: `1px solid ${game.accent}35`, marginBottom: "14px" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: game.accent }}>{game.type}</span>
      </div>
      <h4 style={{ fontSize: "22px", fontWeight: 900, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.15, marginBottom: "12px" }}>{game.name}</h4>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, flex: 1, marginBottom: "24px" }}>{game.description}</p>
      <Link
        to={`/game/${game.id}`}
        style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: game.accent, textDecoration: "none", padding: "10px 20px", borderRadius: "10px", border: `1px solid ${game.accent}35`, background: `${game.accent}10`, alignSelf: "flex-start" }}
      >
        Jouer →
      </Link>
    </div>
  );
}
