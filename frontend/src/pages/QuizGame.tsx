import { useEffect, useState, useCallback, CSSProperties } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Star, RotateCcw } from "lucide-react";
import { useAuth, API_BASE_URL } from "../contexts/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────────
type TypeQuestionQuizzDto = { id: number; name: string };
type JeuQuizzDto = {
  id: number;
  typeQuestion: TypeQuestionQuizzDto;
  mediaUrl: string | null;
  optionA: string;
  optionB: string;
  optionC?: string | null;
  optionD?: string | null;
  reponseCorrecte: boolean;
  question: string;
  explication: string;
  pointsAccordes: number;
};
type PreparedQuestion = {
  original: JeuQuizzDto;
  options: string[];
  correctIndex: number;
};

// ── Config ─────────────────────────────────────────────────────────────────────
const TOTAL    = 20;
const TIMER_S  = 20;
const TILE_BG   = ["#e21b3c", "#1368ce", "#d89e00", "#26890c"];
const TILE_FG   = ["#fff",    "#fff",    "#1e293b", "#fff"   ];
const SHAPES    = ["▲",       "◆",       "●",       "■"      ];

const BADGE_META: Record<number, { label: string; bg: string }> = {
  1: { label: "QCM",        bg: "#7c3aed" },
  2: { label: "VRAI / FAUX",bg: "#d97706" },
  3: { label: "IMAGE",      bg: "#0891b2" },
};
const PROMPT: Record<number, string> = {
  1: "Laquelle de ces affirmations est correcte ?",
  2: "Vrai ou Faux ?",
  3: "Cette image est-elle réelle ou générée par une IA ?",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function prepare(q: JeuQuizzDto): PreparedQuestion {
  const raw = [q.optionA, q.optionB, q.optionC, q.optionD].filter(
    (o): o is string => !!o && o.length > 0
  );
  const correct = raw[q.reponseCorrecte ? 0 : 1];
  const shuffled = [...raw].sort(() => Math.random() - 0.5);
  return { original: q, options: shuffled, correctIndex: shuffled.indexOf(correct) };
}
/** Vrai shuffle aléatoire (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadQuestions(): Promise<PreparedQuestion[]> {
  const res = await fetch(`${API_BASE_URL}/api/games/quizz`);
  if (!res.ok) throw new Error("Impossible de charger les questions");
  const all: JeuQuizzDto[] = await res.json();
  if (!all.length) throw new Error("Aucune question disponible");

  // Grouper par type et mélanger chaque groupe
  const byType: Record<number, JeuQuizzDto[]> = {};
  for (const q of all) {
    const t = q.typeQuestion.id;
    if (!byType[t]) byType[t] = [];
    byType[t].push(q);
  }

  const types = Object.keys(byType).map(Number);
  const perType = Math.floor(TOTAL / types.length);
  const remainder = TOTAL - perType * types.length;

  // Piocher le quota depuis chaque type (Fisher-Yates)
  const pools: JeuQuizzDto[][] = types.map((t, i) => {
    const quota = perType + (i < remainder ? 1 : 0);
    return shuffle(byType[t]).slice(0, quota);
  });

  // Interleaving round-robin : 1 question de chaque type à tour de rôle
  // → garantit un vrai mélange visible (QCM, VF, Image, QCM, VF, Image…)
  const result: JeuQuizzDto[] = [];
  const maxLen = Math.max(...pools.map(p => p.length));
  for (let i = 0; i < maxLen; i++) {
    for (const pool of pools) {
      if (i < pool.length) result.push(pool[i]);
    }
  }

  return result.map(prepare);
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const page: CSSProperties = {
  height: "100dvh",
  overflow: "hidden",
  position: "relative",
  background: "linear-gradient(150deg, #1e0353 0%, #0b0b2e 55%, #05091f 100%)",
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function QuizGame() {
  const auth     = useAuth();
  const navigate = useNavigate();

  const [phase,        setPhase]        = useState<"loading"|"question"|"revealed"|"end">("loading");
  const [error,        setError]        = useState<string|null>(null);
  const [questions,    setQuestions]    = useState<PreparedQuestion[]>([]);
  const [lightbox,     setLightbox]     = useState<string|null>(null);
  const [idx,          setIdx]          = useState(0);
  const [selected,     setSelected]     = useState<number|null>(null);
  const [timedOut,     setTimedOut]     = useState(false);
  const [score,        setScore]        = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timer,        setTimer]        = useState(TIMER_S);

  useEffect(() => {
    loadQuestions().then(qs => { setQuestions(qs); setPhase("question"); }).catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    if (phase !== "question") return;
    setTimer(TIMER_S);
    const id = setInterval(() => setTimer(p => p <= 1 ? 0 : p - 1), 1000);
    return () => clearInterval(id);
  }, [idx, phase]);

  useEffect(() => {
    if (phase === "question" && timer === 0) { setTimedOut(true); setPhase("revealed"); }
  }, [timer, phase]);

  const answer = useCallback((i: number) => {
    if (phase !== "question") return;
    const q = questions[idx];
    setSelected(i); setTimedOut(false); setPhase("revealed");
    if (i === q.correctIndex) {
      const pts = q.original.pointsAccordes ?? 0;
      setScore(s => s + pts); setCorrectCount(c => c + 1);
      if (auth.user?.id && pts > 0)
        fetch(`${API_BASE_URL}/api/accounts/${auth.user.id}/add-points?delta=${pts}`, { method: "POST" })
          .then(() => auth.updateUserPoints(pts))
          .catch(() => {});
    }
  }, [phase, questions, idx, auth.user]);

  const next = useCallback(() => {
    if (idx >= questions.length - 1) { setPhase("end"); return; }
    setSelected(null); setTimedOut(false); setTimer(TIMER_S); setIdx(i => i + 1); setPhase("question");
  }, [idx, questions.length]);

  const replay = useCallback(() => {
    setPhase("loading"); setIdx(0); setSelected(null);
    setScore(0); setCorrectCount(0); setTimedOut(false); setError(null);
    loadQuestions().then(qs => { setQuestions(qs); setPhase("question"); }).catch(e => setError(e.message));
  }, []);

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{...page, alignItems:"center", justifyContent:"center", gap:"20px", padding:"24px"}}>
      <p style={{color:"#fca5a5", fontSize:"1.1rem", margin:0, textAlign:"center"}}>{error}</p>
      <button onClick={() => navigate("/")} style={{display:"flex", alignItems:"center", gap:"8px", padding:"12px 24px", borderRadius:"99px", border:"2px solid #06b6d4", background:"transparent", color:"#06b6d4", fontWeight:700, cursor:"pointer", fontSize:"1rem"}}>
        <ArrowLeft size={18}/> Retour
      </button>
    </div>
  );

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div style={{...page, alignItems:"center", justifyContent:"center", gap:"24px"}}>
      <p style={{color:"white", fontSize:"2rem", fontWeight:900, margin:0}}>
        Chargement du <span style={{color:"#06b6d4"}}>Quiz</span> 🚀
      </p>
      <div style={{width:"200px", height:"8px", background:"rgba(255,255,255,0.1)", borderRadius:"99px", overflow:"hidden"}}>
        <div style={{width:"50%", height:"100%", background:"linear-gradient(90deg,#06b6d4,#10b981)", borderRadius:"99px", animation:"pulse 1s infinite"}} />
      </div>
    </div>
  );

  // ── End ──────────────────────────────────────────────────────────────────────
  if (phase === "end") {
    const r = correctCount / questions.length;
    const stars = r >= 0.8 ? 3 : r >= 0.5 ? 2 : r >= 0.25 ? 1 : 0;
    const pct = Math.round(r * 100);
    const msg = r >= 0.8 ? "Excellent ! 🔥" : r >= 0.5 ? "Bien joué ! 👍" : r >= 0.25 ? "Continue d'apprendre ! 📚" : "Réessaie ! 💪";
    return (
      <div style={{...page, alignItems:"center", justifyContent:"center", padding:"32px 16px", gap:"32px"}}>
        {/* Trophy */}
        <div style={{width:"96px", height:"96px", borderRadius:"50%", background:"rgba(250,204,21,0.12)", border:"2px solid rgba(250,204,21,0.35)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px rgba(250,204,21,0.3)"}}>
          <Trophy size={44} color="#fbbf24" />
        </div>
        <div style={{textAlign:"center"}}>
          <p style={{color:"white", fontSize:"2.2rem", fontWeight:900, margin:"0 0 4px"}}>{msg}</p>
          <p style={{color:"rgba(255,255,255,0.4)", margin:0}}>Quiz terminé !</p>
        </div>
        {/* Stars */}
        <div style={{display:"flex", gap:"12px"}}>
          {[1,2,3].map(s => (
            <Star key={s} size={48} color="#fbbf24" fill={s<=stars ? "#fbbf24" : "transparent"}
              style={{filter: s<=stars ? "drop-shadow(0 0 12px rgba(251,191,36,0.8))" : "none"}} />
          ))}
        </div>
        {/* Score card */}
        <div style={{background:"rgba(255,255,255,0.05)", border:"2px solid rgba(255,255,255,0.1)", borderRadius:"24px", padding:"32px 48px", textAlign:"center", width:"100%", maxWidth:"380px"}}>
          <div style={{fontSize:"4rem", fontWeight:900, background:"linear-gradient(90deg,#06b6d4,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
            {score} pts
          </div>
          <p style={{color:"rgba(255,255,255,0.7)", fontSize:"1.1rem", margin:"8px 0 0"}}>
            <strong style={{color:"white"}}>{correctCount}</strong>/{questions.length} correctes &nbsp;·&nbsp; {pct}%
          </p>
        </div>
        {/* Buttons */}
        <div style={{display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center"}}>
          <button onClick={replay} style={{display:"flex", alignItems:"center", gap:"8px", padding:"14px 32px", borderRadius:"99px", background:"linear-gradient(90deg,#06b6d4,#10b981)", color:"#0f172a", fontWeight:900, fontSize:"1rem", border:"none", cursor:"pointer", boxShadow:"0 0 24px rgba(6,182,212,0.5)"}}>
            <RotateCcw size={18}/> Rejouer
          </button>
          <button onClick={() => navigate("/")} style={{display:"flex", alignItems:"center", gap:"8px", padding:"14px 32px", borderRadius:"99px", border:"2px solid rgba(255,255,255,0.2)", background:"transparent", color:"white", fontWeight:700, fontSize:"1rem", cursor:"pointer"}}>
            <ArrowLeft size={18}/> Accueil
          </button>
        </div>
      </div>
    );
  }

  // ── Question ─────────────────────────────────────────────────────────────────
  const q      = questions[idx];
  const badge  = BADGE_META[q.original.typeQuestion.id] ?? { label:"QUIZ", bg:"#475569" };
  const prompt = q.original.question || PROMPT[q.original.typeQuestion.id] || "Choisissez une réponse";
  const good   = selected !== null && selected === q.correctIndex;
  const two    = q.options.length === 2;

  // Timer SVG circle
  const R    = 22;
  const circ = 2 * Math.PI * R;
  const dash = circ * (timer / TIMER_S);
  const timerColor = timer > 10 ? "#10b981" : timer > 5 ? "#f59e0b" : "#ef4444";

  return (
    <div style={page}>

      {/* ── Header ── */}
      <div style={{flexShrink:0, background:"rgba(0,0,0,0.45)", borderBottom:"1px solid rgba(255,255,255,0.07)", backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:"860px", margin:"0 auto", padding:"10px 16px", display:"flex", alignItems:"center", gap:"14px"}}>
          <button onClick={() => navigate("/")} style={{background:"none", border:"none", cursor:"pointer", color:"#64748b", padding:"4px", display:"flex", flexShrink:0}}>
            <ArrowLeft size={20}/>
          </button>

          {/* Barre segmentée : une pastille par question */}
          <div style={{flex:1, display:"flex", gap:"4px", alignItems:"center"}}>
            {questions.map((_, i) => {
              const done    = i < idx;
              const current = i === idx;
              return (
                <div key={i} style={{
                  flex: 1,
                  height: current ? "10px" : "6px",
                  borderRadius: "99px",
                  transition: "all 0.3s ease",
                  background: done
                    ? "linear-gradient(90deg,#06b6d4,#10b981)"
                    : current
                    ? "#a78bfa"
                    : "rgba(255,255,255,0.1)",
                  boxShadow: current ? "0 0 8px rgba(167,139,250,0.7)" : done ? "0 0 4px rgba(6,182,212,0.4)" : "none",
                }}/>
              );
            })}
          </div>

          <span style={{color:"white", fontWeight:900, fontSize:"14px", whiteSpace:"nowrap", flexShrink:0}}>
            {idx+1}<span style={{color:"#475569", fontWeight:400}}>/{questions.length}</span>
          </span>
          <div style={{flexShrink:0, textAlign:"right", minWidth:"56px"}}>
            <div style={{fontSize:"9px", textTransform:"uppercase", letterSpacing:"2px", color:"#475569", lineHeight:1}}>Score</div>
            <div style={{fontSize:"18px", fontWeight:900, color:"#34d399", lineHeight:1.2}}>{score}</div>
          </div>
        </div>
      </div>

      {/* ── Content : question + tiles, remplit l'espace restant sans scroll ── */}
      <div style={{flex:1, maxWidth:"860px", margin:"0 auto", width:"100%", display:"flex", flexDirection:"column", padding:"16px 14px 14px", gap:"12px", overflow:"hidden"}}>

        {/* Question zone */}
        <div style={{flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:"10px"}}>
          {/* Badge + Timer SVG */}
          <div style={{display:"flex", alignItems:"center", gap:"14px"}}>
            <span style={{background:badge.bg, color:"white", padding:"5px 16px", borderRadius:"99px", fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"2px", boxShadow:"0 4px 12px rgba(0,0,0,0.35)"}}>
              {badge.label}
            </span>
            <div style={{position:"relative", width:"48px", height:"48px", flexShrink:0}}>
              <svg width="48" height="48" style={{transform:"rotate(-90deg)"}}>
                <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
                <circle cx="24" cy="24" r={R} fill="none" stroke={timerColor} strokeWidth="4"
                  strokeDasharray={circ} strokeDashoffset={circ - dash}
                  strokeLinecap="round"
                  style={{transition:"stroke-dashoffset 1s linear, stroke 0.3s"}}
                />
              </svg>
              <span style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:"14px"}}>
                {timer}
              </span>
            </div>
          </div>

          {/* Question card */}
          <div style={{width:"100%", background:"rgba(255,255,255,0.06)", border:"2px solid rgba(255,255,255,0.1)", borderRadius:"18px", padding:"18px 24px", textAlign:"center", boxShadow:"0 6px 24px rgba(0,0,0,0.4)"}}>
            <p style={{color:"white", fontWeight:700, fontSize:"clamp(1rem, 2vw, 1.4rem)", lineHeight:1.4, margin:0}}>
              {prompt}
            </p>
          </div>

          {/* Image (type 3) — cliquable pour agrandir */}
          {q.original.mediaUrl && (
            <div
              onClick={() => setLightbox(q.original.mediaUrl)}
              title="Cliquer pour agrandir"
              style={{borderRadius:"14px", overflow:"hidden", maxWidth:"320px", width:"100%", border:"2px solid rgba(255,255,255,0.1)", boxShadow:"0 6px 24px rgba(0,0,0,0.6)", flexShrink:0, cursor:"zoom-in", position:"relative"}}
            >
              <img src={q.original.mediaUrl} alt="Média" style={{width:"100%", display:"block", height:"160px", objectFit:"cover"}}/>
              <div style={{position:"absolute", bottom:"6px", right:"8px", background:"rgba(0,0,0,0.6)", borderRadius:"6px", padding:"2px 7px", fontSize:"11px", color:"rgba(255,255,255,0.7)", pointerEvents:"none"}}>
                🔍 agrandir
              </div>
            </div>
          )}
        </div>

        {/* Answer tiles — flex-1 : prend tout l'espace vertical restant */}
        <div style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: two ? "1fr" : "1fr 1fr",
          gap: "10px",
          minHeight: 0,  /* empêche le débordement flex */
        }}>
          {q.options.map((opt, i) => {
            const shape = SHAPES[i % SHAPES.length];
            let bg    = TILE_BG[i % TILE_BG.length];
            let fg    = TILE_FG[i % TILE_FG.length];
            let border = "3px solid transparent";
            let shadow = "0 4px 16px rgba(0,0,0,0.4)";
            let opacity = 1;
            let transform = "none";
            let icon = shape;

            if (phase === "revealed") {
              if (i === q.correctIndex) {
                bg = "#16a34a"; fg = "white"; border = "3px solid #4ade80";
                shadow = "0 0 28px rgba(22,163,74,0.7)"; transform = "scale(1.02)"; icon = "✓";
              } else if (i === selected) {
                bg = "#7f1d1d"; fg = "white"; border = "3px solid #ef4444"; opacity = 0.85; icon = "✗";
              } else {
                bg = "rgba(255,255,255,0.03)"; fg = "#334155"; opacity = 0.25; shadow = "none";
              }
            }

            return (
              <button
                key={i}
                disabled={phase === "revealed"}
                onClick={() => answer(i)}
                style={{
                  background: bg, color: fg, border, borderRadius:"16px",
                  display:"flex", alignItems:"center", gap:"12px",
                  padding:"0 20px", fontSize:"clamp(0.9rem, 1.5vw, 1.1rem)", fontWeight:800,
                  textAlign:"left", cursor: phase === "revealed" ? "default" : "pointer",
                  transition:"all 0.2s ease", boxShadow: shadow,
                  opacity, transform, lineHeight:1.3,
                  width:"100%", height:"100%",
                }}
              >
                <span style={{fontSize:"1.5rem", lineHeight:1, flexShrink:0}}>{icon}</span>
                <span style={{flex:1}}>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{position:"absolute", inset:0, zIndex:50, background:"rgba(0,0,0,0.88)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"zoom-out", padding:"20px"}}
        >
          <img
            src={lightbox}
            alt="Agrandissement"
            style={{maxWidth:"100%", maxHeight:"100%", borderRadius:"16px", boxShadow:"0 0 60px rgba(0,0,0,0.9)", objectFit:"contain"}}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{position:"absolute", top:"16px", right:"16px", background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:"50%", width:"40px", height:"40px", color:"white", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}
          >✕</button>
        </div>
      )}

      {/* ── Explication : overlay absolu qui remonte depuis le bas ── */}
      {phase === "revealed" && (
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          background:"rgba(5,5,25,0.96)",
          backdropFilter:"blur(16px)",
          borderTop: `3px solid ${timedOut ? "#ea580c" : good ? "#22c55e" : "#ef4444"}`,
          padding:"18px 20px 20px",
          display:"flex", flexDirection:"column", alignItems:"center", gap:"14px",
          boxShadow:"0 -8px 40px rgba(0,0,0,0.7)",
        }}>
          <div style={{width:"100%", maxWidth:"820px"}}>
            <p style={{color:"white", fontWeight:900, fontSize:"1rem", margin:"0 0 6px 0"}}>
              {timedOut ? "⏰ Temps écoulé !" : good ? `✅ Bonne réponse ! +${q.original.pointsAccordes} pts` : "❌ Mauvaise réponse"}
            </p>
            {q.original.typeQuestion.id !== 3 && (
              <p style={{color:"rgba(203,213,225,0.85)", fontSize:"0.88rem", margin:0, lineHeight:1.6}}>
                {q.original.explication}
              </p>
            )}
          </div>
          <button
            onClick={next}
            style={{
              padding:"13px 44px", borderRadius:"99px",
              background:"linear-gradient(90deg,#06b6d4,#10b981)",
              color:"#0f172a", fontWeight:900, fontSize:"1rem",
              border:"none", cursor:"pointer",
              boxShadow:"0 0 20px rgba(6,182,212,0.5)",
              width:"100%", maxWidth:"420px",
            }}
          >
            {idx >= questions.length - 1 ? "Voir les résultats →" : "Question suivante →"}
          </button>
        </div>
      )}

      {/* Login banner */}
      {!auth.user && (
        <div className="flex items-center justify-center gap-3 px-4 py-2.5 border-t border-white/5 bg-slate-900/80 backdrop-blur-sm text-xs text-slate-400">
          <span>🔓 Connecte-toi pour sauvegarder tes points</span>
          <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Connexion</Link>
          <span className="text-slate-600">·</span>
          <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Inscription</Link>
        </div>
      )}
    </div>
  );
}
