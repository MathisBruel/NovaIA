import { useEffect, useRef, useState, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/App";

// ── Config ─────────────────────────────────────────────────────────────────────

const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL?.length > 0
    ? (import.meta as any).env.VITE_API_BASE_URL
    : "";

const POINTS_PER_CORRECT = 15;

const SCENARIOS: ScenarioMeta[] = [
  {
    startId: 100,
    title: "Astronomie",
    hallucinated: true,
    explanation:
      "Mars est en réalité la 4ème planète du système solaire, pas la 3ème. La 3ème est la Terre. L'IA a commis une erreur de rang — hallucination typique !",
  },
  {
    startId: 110,
    title: "Biologie Marine",
    hallucinated: false,
    explanation:
      "Tous les faits présentés par l'IA étaient corrects. Baleines bleues, dauphins et pieuvres : aucune hallucination dans cette conversation !",
  },
  {
    startId: 120,
    title: "Histoire & Inventions",
    hallucinated: true,
    explanation:
      "C'est Thomas Edison qui a inventé l'ampoule électrique (1879), pas Alexander Graham Bell. Bell a inventé le téléphone (1876). L'IA a confondu les deux inventeurs !",
  },
  {
    startId: 130,
    title: "Corps Humain",
    hallucinated: false,
    explanation:
      "Tous les faits présentés par l'IA étaient corrects. Le corps humain, le cœur, le cerveau : aucune hallucination ici !",
  },
];

// ── Types ──────────────────────────────────────────────────────────────────────

type ScenarioMeta = {
  startId: number;
  title: string;
  hallucinated: boolean;
  explanation: string;
};

type QuestionDto = {
  id: number;
  question: string;
  estCoherent: boolean | null;
  reponses: { id: number; reponse1: string; reponse2: string } | null;
};

type ReponseDto = {
  id: number;
  reponse1: string;
  reponse2: string;
  questionAnswer1: { id: number };
  questionAnswer2: { id: number };
};

type ChatMessage = { sender: "ai" | "user"; text: string };
type Phase = "loading" | "error" | "chatting" | "verdict" | "result";

// ── Styles ─────────────────────────────────────────────────────────────────────

const page: CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(150deg, #170a35 0%, #0d0d2b 55%, #050a1f 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px 16px 60px",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
  position: "relative",
  overflow: "hidden",
};

const glowOrb = (top: string, left: string, color: string): CSSProperties => ({
  position: "absolute",
  top,
  left,
  width: "320px",
  height: "320px",
  borderRadius: "50%",
  background: color,
  filter: "blur(100px)",
  opacity: 0.18,
  pointerEvents: "none",
  zIndex: 0,
});

// ── Component ──────────────────────────────────────────────────────────────────

export default function AiMockGame() {
  const auth = useAuth();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [qMap, setQMap] = useState<Map<number, QuestionDto>>(new Map());
  const [rMap, setRMap] = useState<Map<number, ReponseDto>>(new Map());

  const [phase, setPhase] = useState<Phase>("loading");
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [currentId, setCurrentId] = useState(0);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [seenHallucination, setSeenHallucination] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/games/mytho/questions`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<QuestionDto[]>;
      }),
      fetch(`${API_BASE_URL}/api/games/mytho/reponses`).then((r) => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<ReponseDto[]>;
      }),
    ])
      .then(([questions, reponses]) => {
        const newQMap = new Map<number, QuestionDto>();
        questions.forEach((q) => newQMap.set(q.id, q));
        const newRMap = new Map<number, ReponseDto>();
        reponses.forEach((r) => newRMap.set(r.id, r));
        setQMap(newQMap);
        setRMap(newRMap);
        const idx = Math.floor(Math.random() * SCENARIOS.length);
        setScenarioIdx(idx);
        initScenario(idx, newQMap);
      })
      .catch(() => setPhase("error"));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const initScenario = (idx: number, qm: Map<number, QuestionDto>) => {
    const startId = SCENARIOS[idx].startId;
    const q = qm.get(startId);
    if (!q) { setPhase("error"); return; }
    setCurrentId(startId);
    setChat([{ sender: "ai", text: q.question }]);
    setSeenHallucination(q.estCoherent === false);
    setIsCorrect(null);
    setPhase(q.reponses === null ? "verdict" : "chatting");
  };

  const handleChoice = (choice: 1 | 2) => {
    const q = qMap.get(currentId);
    if (!q?.reponses) return;
    const rs = rMap.get(q.reponses.id);
    if (!rs) return;
    const userText = choice === 1 ? q.reponses.reponse1 : q.reponses.reponse2;
    const nextId = choice === 1 ? rs.questionAnswer1.id : rs.questionAnswer2.id;
    const nextQ = qMap.get(nextId);
    if (!nextQ) return;
    setChat((c) => [...c, { sender: "user", text: userText }, { sender: "ai", text: nextQ.question }]);
    setCurrentId(nextId);
    if (nextQ.estCoherent === false) setSeenHallucination(true);
    setPhase(nextQ.reponses === null ? "verdict" : "chatting");
  };

  const handleVerdict = (userSaysYes: boolean) => {
    const correct = userSaysYes === SCENARIOS[scenarioIdx].hallucinated;
    setIsCorrect(correct);
    setPhase("result");
    if (correct && auth.user?.id) {
      fetch(`${API_BASE_URL}/api/accounts/${auth.user.id}/add-points?delta=${POINTS_PER_CORRECT}`, { method: "POST" }).catch(() => {});
    }
  };

  const nextScenario = () => {
    const nextIdx = (scenarioIdx + 1) % SCENARIOS.length;
    setScenarioIdx(nextIdx);
    initScenario(nextIdx, qMap);
  };

  const currentQ = qMap.get(currentId);
  const scenario = SCENARIOS[scenarioIdx];

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div style={{ ...page, alignItems: "center", justifyContent: "center", gap: "24px" }}>
        <div style={glowOrb("10%", "30%", "#7c3aed")} />
        <div style={{ fontSize: "3rem" }}>🤖</div>
        <p style={{ color: "white", fontSize: "1.4rem", fontWeight: 800, margin: 0, letterSpacing: "0.05em" }}>
          Initialisation de <span style={{ color: "#a78bfa" }}>MythosIA</span>…
        </p>
        <div style={{ width: "200px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{ width: "60%", height: "100%", background: "linear-gradient(90deg,#7c3aed,#06b6d4)", borderRadius: "99px", animation: "pulse 1.2s infinite" }} />
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (phase === "error") {
    return (
      <div style={{ ...page, alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <p style={{ color: "#fca5a5", fontSize: "1.1rem", margin: 0 }}>Impossible de contacter le serveur.</p>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "12px 28px", borderRadius: "99px", border: "2px solid rgba(255,255,255,0.2)", background: "transparent", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}
        >
          ← Retour
        </button>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────

  return (
    <div style={page}>
      {/* Ambient glows */}
      <div style={glowOrb("-5%", "-5%", "#6d28d9")} />
      <div style={glowOrb("60%", "75%", "#0e7490")} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "680px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── Back button ── */}
        <button
          onClick={() => navigate("/")}
          style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}
        >
          ← Retour au hub
        </button>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(124,58,237,0.25)", border: "1px solid rgba(167,139,250,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", flexShrink: 0, boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
            🤖
          </div>
          <div>
            <h1 style={{ color: "white", margin: 0, fontSize: "1.4rem", fontWeight: 900, letterSpacing: "0.04em" }}>
              Mythos<span style={{ color: "#a78bfa" }}>IA</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", margin: 0, fontSize: "0.8rem" }}>
              Scénario · <span style={{ color: "#c4b5fd" }}>{scenario.title}</span>
              <span style={{ margin: "0 8px", opacity: 0.4 }}>|</span>
              Détecte si l'IA a halluciné
            </p>
          </div>
        </div>

        {/* ── Chat window ── */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: "20px", overflow: "hidden", backdropFilter: "blur(12px)" }}>

          {/* Messages */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", maxHeight: "380px", overflowY: "auto" }}>
            {chat.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.sender === "ai" ? "flex-start" : "flex-end", alignItems: "flex-end", gap: "8px" }}>
                {msg.sender === "ai" && (
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(124,58,237,0.4)", border: "1px solid rgba(167,139,250,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", flexShrink: 0 }}>
                    🤖
                  </div>
                )}
                <div style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: msg.sender === "ai" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                  fontSize: "0.88rem",
                  lineHeight: 1.55,
                  ...(msg.sender === "ai"
                    ? { background: "rgba(109,40,217,0.25)", border: "1px solid rgba(139,92,246,0.35)", color: "#e2e8f0", boxShadow: "0 2px 12px rgba(109,40,217,0.2)" }
                    : { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" })
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* ── Divider + interaction zone ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px" }}>

            {/* Choices */}
            {phase === "chatting" && currentQ?.reponses && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", margin: 0, textAlign: "center" }}>Choisis ta réponse</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[currentQ.reponses.reponse1, currentQ.reponses.reponse2].map((txt, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice((i + 1) as 1 | 2)}
                      style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(99,60,200,0.2)", border: "1px solid rgba(139,92,246,0.35)", color: "rgba(255,255,255,0.9)", fontSize: "0.83rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s", textAlign: "center" }}
                      onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(124,58,237,0.4)"; (e.target as HTMLButtonElement).style.borderColor = "rgba(167,139,250,0.6)"; }}
                      onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(99,60,200,0.2)"; (e.target as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.35)"; }}
                    >
                      {txt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Verdict */}
            {phase === "verdict" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "1.1rem" }}>🔍</span>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 600, margin: "6px 0 0" }}>
                    Conversation terminée — L'IA a-t-elle halluciné ?
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    onClick={() => handleVerdict(true)}
                    style={{ padding: "14px", borderRadius: "12px", background: "rgba(220,38,38,0.2)", border: "1px solid rgba(248,113,113,0.4)", color: "#fca5a5", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(220,38,38,0.35)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(220,38,38,0.2)"; }}
                  >
                    ⚠️ Oui, elle a halluciné
                  </button>
                  <button
                    onClick={() => handleVerdict(false)}
                    style={{ padding: "14px", borderRadius: "12px", background: "rgba(5,150,105,0.2)", border: "1px solid rgba(52,211,153,0.4)", color: "#6ee7b7", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(5,150,105,0.35)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "rgba(5,150,105,0.2)"; }}
                  >
                    ✓ Non, tout est correct
                  </button>
                </div>
              </div>
            )}

            {/* Result */}
            {phase === "result" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Score banner */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "14px", background: isCorrect ? "rgba(5,150,105,0.15)" : "rgba(220,38,38,0.15)", border: `1px solid ${isCorrect ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}` }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: isCorrect ? "rgba(5,150,105,0.3)" : "rgba(220,38,38,0.3)", border: `2px solid ${isCorrect ? "rgba(52,211,153,0.6)" : "rgba(248,113,113,0.6)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0, boxShadow: `0 0 16px ${isCorrect ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"}` }}>
                    {isCorrect ? "✓" : "✗"}
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 800, fontSize: "1rem" }}>
                      {isCorrect ? "Bonne détection !" : "Mauvaise détection !"}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: "2px" }}>
                      {isCorrect ? `+${POINTS_PER_CORRECT} points ajoutés à ton profil` : "Aucun point cette fois — réessaie !"}
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div style={{ padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "0.83rem", lineHeight: 1.6, color: "rgba(255,255,255,0.7)" }}>
                  <span style={{ color: "#fbbf24", fontWeight: 700 }}>💡 Explication : </span>
                  {scenario.explanation}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={nextScenario}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg,rgba(124,58,237,0.5),rgba(6,182,212,0.3))", border: "1px solid rgba(167,139,250,0.4)", color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", boxShadow: "0 0 20px rgba(124,58,237,0.2)" }}
                  >
                    Scénario suivant →
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    style={{ padding: "12px 18px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", cursor: "pointer" }}
                  >
                    Quitter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Hint ── */}
        {(phase === "chatting" || phase === "verdict") && (
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", textAlign: "center", margin: 0 }}>
            Lis attentivement les affirmations de l'IA — certaines peuvent être fausses.
          </p>
        )}
      </div>
    </div>
  );
}
