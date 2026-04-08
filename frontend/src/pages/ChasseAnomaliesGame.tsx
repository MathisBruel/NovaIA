import { useEffect, useState, useCallback, useRef, CSSProperties } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Star, RotateCcw } from "lucide-react";
import { useAuth, API_BASE_URL } from "../contexts/AuthContext";

// ── Types ──────────────────────────────────────────────────────────────────────
type AnomalieDto = {
  id: number;
  imageUrl: string;
  titreImage: string;
  coordonnesAnomalieJson: string;
  explication: string;
  pointsAccordes: number;
};
type Coords = { x: number; y: number; radius: number };

// ── Config ─────────────────────────────────────────────────────────────────────
const TOTAL   = 10;
const TIMER_S = 30;


// ── Helpers ────────────────────────────────────────────────────────────────────
function parseCoords(json: string): Coords {
  try { const p = JSON.parse(json); return { x: p.x, y: p.y, radius: p.radius }; }
  catch { return { x: 0, y: 0, radius: 100 }; }
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** Calcule la zone réellement rendue par objectFit:contain dans le conteneur */
function getContainBounds(cW: number, cH: number, nW: number, nH: number) {
  const scale = Math.min(cW / nW, cH / nH);
  const rW = nW * scale, rH = nH * scale;
  return { scale, rW, rH, offX: (cW - rW) / 2, offY: (cH - rH) / 2 };
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const page: CSSProperties = {
  height: "100dvh", overflow: "hidden", position: "relative",
  background: "linear-gradient(150deg, #1e0353 0%, #0b0b2e 55%, #05091f 100%)",
  display: "flex", flexDirection: "column",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function ChasseAnomaliesGame() {
  const auth     = useAuth();
  const navigate = useNavigate();

  const [phase,        setPhase]        = useState<"loading"|"playing"|"revealed"|"end">("loading");
  const [error,        setError]        = useState<string|null>(null);
  const [anomalies,    setAnomalies]    = useState<AnomalieDto[]>([]);
  const [idx,          setIdx]          = useState(0);
  const [score,        setScore]        = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timer,        setTimer]        = useState(TIMER_S);
  const [timedOut,     setTimedOut]     = useState(false);
  const [hit,          setHit]          = useState<boolean|null>(null);
  // click position stored in container-space pixels
  const [clickPx,      setClickPx]      = useState<{x:number;y:number}|null>(null);
  const [naturalSize,  setNaturalSize]  = useState({ w: 1200, h: 1440 });
  const [activityId,   setActivityId]   = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef       = useRef<HTMLImageElement>(null);

  // ── Load ─────────────────────────────────────────────────────────────────────
  const load = useCallback(() => {
    setPhase("loading"); setError(null);
    fetch(`${API_BASE_URL}/api/games/anomalies`)
      .then(r => { if (!r.ok) throw new Error("Impossible de charger les images"); return r.json(); })
      .then((all: AnomalieDto[]) => {
        if (!all.length) throw new Error("Aucune image disponible");
        setAnomalies(shuffle(all).slice(0, TOTAL));
        setIdx(0); setScore(0); setCorrectCount(0);
        setClickPx(null); setHit(null); setTimedOut(false); setTimer(TIMER_S); setActivityId(null);
        setPhase("playing");
      })
      .catch(e => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (phase === "playing" && auth.user?.id && !activityId && anomalies.length > 0) {
      fetch(`${API_BASE_URL}/api/activity/start?userId=${auth.user.id}&gameId=2`, { method: "POST" })
        .then(res => res.json())
        .then(data => { if (data.id) setActivityId(data.id); })
        .catch(console.error);
    }
  }, [phase, auth.user, activityId, anomalies.length]);

  // ── Timer ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    setTimer(TIMER_S);
    const id = setInterval(() => setTimer(p => p <= 1 ? 0 : p - 1), 1000);
    return () => clearInterval(id);
  }, [idx, phase]);

  useEffect(() => {
    if (phase === "playing" && timer === 0) {
      setTimedOut(true); setHit(false); setClickPx(null); setPhase("revealed");
    }
  }, [timer, phase]);

  // ── Click on image ────────────────────────────────────────────────────────────
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (phase !== "playing" || !containerRef.current) return;

    const cRect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - cRect.left;
    const clickY = e.clientY - cRect.top;

    const { scale, rW, rH, offX, offY } = getContainBounds(
      cRect.width, cRect.height, naturalSize.w, naturalSize.h
    );

    // Ignore click outside the image area
    if (clickX < offX || clickX > offX + rW || clickY < offY || clickY > offY + rH) return;

    // Convert to image-space coordinates
    const imgX = (clickX - offX) / scale;
    const imgY = (clickY - offY) / scale;

    const coords = parseCoords(anomalies[idx].coordonnesAnomalieJson);
    const dist = Math.sqrt((imgX - coords.x) ** 2 + (imgY - coords.y) ** 2);
    const isHit = dist <= coords.radius;

    setClickPx({ x: clickX, y: clickY });
    setHit(isHit);
    setTimedOut(false);

    if (isHit) {
      const pts = anomalies[idx].pointsAccordes ?? 0;
      setScore(s => s + pts);
      setCorrectCount(c => c + 1);
      if (auth.user?.id && pts > 0)
        fetch(`${API_BASE_URL}/api/accounts/${auth.user.id}/add-points?delta=${pts}`, { method: "POST" })
          .then(() => auth.updateUserPoints(pts))
          .catch(() => {});
    }
    setPhase("revealed");
  }, [phase, anomalies, idx, naturalSize, auth.user]);

  const next = useCallback(() => {
    const isEnd = idx >= anomalies.length - 1;
    if (activityId) {
      fetch(`${API_BASE_URL}/api/activity/${activityId}/progress?stepReached=${idx + 1}&completed=${isEnd}&pointsEarned=${score}`, { method: "POST" }).catch(console.error);
    }
    
    if (isEnd) { setPhase("end"); return; }
    setClickPx(null); setHit(null); setTimedOut(false); setTimer(TIMER_S);
    setIdx(i => i + 1); setPhase("playing");
  }, [idx, anomalies.length, activityId, score]);

  // ── Timer circle ──────────────────────────────────────────────────────────────
  const R    = 22;
  const circ = 2 * Math.PI * R;
  const dash = circ * (timer / TIMER_S);
  const timerColor = timer > 15 ? "#10b981" : timer > 8 ? "#f59e0b" : "#ef4444";

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{...page, alignItems:"center", justifyContent:"center", gap:"20px", padding:"24px"}}>
      <p style={{color:"#fca5a5", fontSize:"1.1rem", margin:0, textAlign:"center"}}>{error}</p>
      <button onClick={() => navigate("/")} style={{display:"flex", alignItems:"center", gap:"8px", padding:"12px 24px", borderRadius:"99px", border:"2px solid #06b6d4", background:"transparent", color:"#06b6d4", fontWeight:700, cursor:"pointer", fontSize:"1rem"}}>
        <ArrowLeft size={18}/> Retour
      </button>
    </div>
  );

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (phase === "loading") return (
    <div style={{...page, alignItems:"center", justifyContent:"center", gap:"24px"}}>
      <p style={{color:"white", fontSize:"2rem", fontWeight:900, margin:0}}>
        Chargement de la <span style={{color:"#06b6d4"}}>Chasse</span> 🔍
      </p>
      <div style={{width:"200px", height:"8px", background:"rgba(255,255,255,0.1)", borderRadius:"99px", overflow:"hidden"}}>
        <div style={{width:"50%", height:"100%", background:"linear-gradient(90deg,#06b6d4,#10b981)", borderRadius:"99px"}} />
      </div>
    </div>
  );

  // ── End ───────────────────────────────────────────────────────────────────────
  if (phase === "end") {
    const r = correctCount / anomalies.length;
    const stars = r >= 0.8 ? 3 : r >= 0.5 ? 2 : r >= 0.25 ? 1 : 0;
    const msg = r >= 0.8 ? "Excellent détective ! 🔥" : r >= 0.5 ? "Bien joué ! 👍" : r >= 0.25 ? "Continue à entraîner ton œil ! 📚" : "Réessaie ! 💪";
    return (
      <div style={{...page, alignItems:"center", justifyContent:"center", padding:"32px 16px", gap:"32px"}}>
        <div style={{width:"96px", height:"96px", borderRadius:"50%", background:"rgba(250,204,21,0.12)", border:"2px solid rgba(250,204,21,0.35)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 40px rgba(250,204,21,0.3)"}}>
          <Trophy size={44} color="#fbbf24" />
        </div>
        <div style={{textAlign:"center"}}>
          <p style={{color:"white", fontSize:"2.2rem", fontWeight:900, margin:"0 0 4px"}}>{msg}</p>
          <p style={{color:"rgba(255,255,255,0.4)", margin:0}}>Chasse terminée !</p>
        </div>
        <div style={{display:"flex", gap:"12px"}}>
          {[1,2,3].map(s => (
            <Star key={s} size={48} color="#fbbf24" fill={s<=stars ? "#fbbf24" : "transparent"}
              style={{filter: s<=stars ? "drop-shadow(0 0 12px rgba(251,191,36,0.8))" : "none"}} />
          ))}
        </div>
        <div style={{background:"rgba(255,255,255,0.05)", border:"2px solid rgba(255,255,255,0.1)", borderRadius:"24px", padding:"32px 48px", textAlign:"center", width:"100%", maxWidth:"380px"}}>
          <div style={{fontSize:"4rem", fontWeight:900, background:"linear-gradient(90deg,#06b6d4,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
            {score} pts
          </div>
          <p style={{color:"rgba(255,255,255,0.7)", fontSize:"1.1rem", margin:"8px 0 0"}}>
            <strong style={{color:"white"}}>{correctCount}</strong>/{anomalies.length} trouvées &nbsp;·&nbsp; {Math.round(r*100)}%
          </p>
        </div>
        <div style={{display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center"}}>
          <button onClick={load} style={{display:"flex", alignItems:"center", gap:"8px", padding:"14px 32px", borderRadius:"99px", background:"linear-gradient(90deg,#06b6d4,#10b981)", color:"#0f172a", fontWeight:900, fontSize:"1rem", border:"none", cursor:"pointer", boxShadow:"0 0 24px rgba(6,182,212,0.5)"}}>
            <RotateCcw size={18}/> Rejouer
          </button>
          <button onClick={() => navigate("/")} style={{display:"flex", alignItems:"center", gap:"8px", padding:"14px 32px", borderRadius:"99px", border:"2px solid rgba(255,255,255,0.2)", background:"transparent", color:"white", fontWeight:700, fontSize:"1rem", cursor:"pointer"}}>
            <ArrowLeft size={18}/> Accueil
          </button>
        </div>
      </div>
    );
  }

  // ── Playing / Revealed ────────────────────────────────────────────────────────
  const anomalie = anomalies[idx];
  const coords   = parseCoords(anomalie.coordonnesAnomalieJson);

  // Compute anomaly circle position in container-space (for the revealed overlay)
  const getCirclePos = () => {
    if (!containerRef.current) return null;
    const cW = containerRef.current.clientWidth;
    const cH = containerRef.current.clientHeight;
    const { scale, offX, offY } = getContainBounds(cW, cH, naturalSize.w, naturalSize.h);
    return {
      cx: offX + coords.x * scale,
      cy: offY + coords.y * scale,
      r:  coords.radius * scale,
    };
  };

  return (
    <div style={page}>

      {/* ── Header ── */}
      <div style={{flexShrink:0, background:"rgba(0,0,0,0.45)", borderBottom:"1px solid rgba(255,255,255,0.07)", backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:"900px", margin:"0 auto", padding:"10px 16px", display:"flex", alignItems:"center", gap:"14px"}}>
          <button onClick={() => navigate("/")} style={{background:"none", border:"none", cursor:"pointer", color:"#64748b", padding:"4px", display:"flex", flexShrink:0}}>
            <ArrowLeft size={20}/>
          </button>
          <div style={{flex:1, display:"flex", gap:"4px", alignItems:"center"}}>
            {anomalies.map((_, i) => (
              <div key={i} style={{
                flex:1, height: i===idx ? "10px" : "6px", borderRadius:"99px", transition:"all 0.3s ease",
                background: i<idx ? "linear-gradient(90deg,#06b6d4,#10b981)" : i===idx ? "#a78bfa" : "rgba(255,255,255,0.1)",
                boxShadow: i===idx ? "0 0 8px rgba(167,139,250,0.7)" : i<idx ? "0 0 4px rgba(6,182,212,0.4)" : "none",
              }}/>
            ))}
          </div>
          <span style={{color:"white", fontWeight:900, fontSize:"14px", whiteSpace:"nowrap", flexShrink:0}}>
            {idx+1}<span style={{color:"#475569", fontWeight:400}}>/{anomalies.length}</span>
          </span>
          <div style={{flexShrink:0, textAlign:"right", minWidth:"56px"}}>
            <div style={{fontSize:"9px", textTransform:"uppercase", letterSpacing:"2px", color:"#475569", lineHeight:1}}>Score</div>
            <div style={{fontSize:"18px", fontWeight:900, color:"#34d399", lineHeight:1.2}}>{score}</div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{flex:1, maxWidth:"900px", margin:"0 auto", width:"100%", display:"flex", flexDirection:"column", padding:"12px 14px 14px", gap:"10px", overflow:"hidden"}}>

        {/* Title + timer */}
        <div style={{flexShrink:0, display:"flex", alignItems:"center", gap:"12px"}}>
          <span style={{background:"#0891b2", color:"white", padding:"5px 16px", borderRadius:"99px", fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"2px", boxShadow:"0 4px 12px rgba(0,0,0,0.35)", flexShrink:0}}>
            ANOMALIE
          </span>
          <div style={{flex:1, background:"rgba(255,255,255,0.06)", border:"2px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"10px 16px"}}>
            <p style={{color:"white", fontWeight:700, fontSize:"clamp(0.85rem, 1.8vw, 1.05rem)", margin:0}}>
              {phase === "playing" ? "🔍 Cliquez sur l'anomalie cachée dans cette image !" : `🎯 ${anomalie.titreImage}`}
            </p>
          </div>
          <div style={{position:"relative", width:"48px", height:"48px", flexShrink:0}}>
            <svg width="48" height="48" style={{transform:"rotate(-90deg)"}}>
              <circle cx="24" cy="24" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
              <circle cx="24" cy="24" r={R} fill="none" stroke={timerColor} strokeWidth="4"
                strokeDasharray={circ} strokeDashoffset={circ - dash} strokeLinecap="round"
                style={{transition:"stroke-dashoffset 1s linear, stroke 0.3s"}}
              />
            </svg>
            <span style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:"14px"}}>
              {timer}
            </span>
          </div>
        </div>

        {/* Image zone */}
        <div
          ref={containerRef}
          onClick={handleClick}
          style={{
            flex:1, position:"relative", borderRadius:"16px", overflow:"hidden",
            border:"2px solid rgba(255,255,255,0.1)", boxShadow:"0 6px 24px rgba(0,0,0,0.6)",
            cursor: phase === "playing" ? "crosshair" : "default",
            minHeight:0, background:"#000",
          }}
        >
          <img
            ref={imgRef}
            src={anomalie.imageUrl}
            alt={anomalie.titreImage}
            onLoad={() => {
              if (imgRef.current)
                setNaturalSize({ w: imgRef.current.naturalWidth || 1200, h: imgRef.current.naturalHeight || 1440 });
            }}
            style={{width:"100%", height:"100%", objectFit:"contain", display:"block", userSelect:"none"}}
            draggable={false}
          />

          {/* Revealed overlays — circles drawn in container-space */}
          {phase === "revealed" && (() => {
            const pos = getCirclePos();
            if (!pos) return null;
            return (
              <>
                {/* Correct answer circle */}
                <div style={{
                  position:"absolute",
                  left: pos.cx - pos.r, top: pos.cy - pos.r,
                  width: pos.r * 2, height: pos.r * 2,
                  borderRadius:"50%",
                  border:"3px solid #22c55e",
                  boxShadow:"0 0 24px rgba(34,197,94,0.7), inset 0 0 16px rgba(34,197,94,0.15)",
                  pointerEvents:"none",
                }}/>
                {/* Click position dot */}
                {clickPx && (
                  <div style={{
                    position:"absolute",
                    left: clickPx.x - 10, top: clickPx.y - 10,
                    width:20, height:20, borderRadius:"50%",
                    background: hit ? "#22c55e" : "#ef4444",
                    border:"2px solid white",
                    boxShadow: hit ? "0 0 14px rgba(34,197,94,0.9)" : "0 0 14px rgba(239,68,68,0.9)",
                    pointerEvents:"none",
                  }}/>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* ── Explanation overlay ── */}
      {phase === "revealed" && (
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          background:"rgba(5,5,25,0.96)", backdropFilter:"blur(16px)",
          borderTop:`3px solid ${timedOut ? "#ea580c" : hit ? "#22c55e" : "#ef4444"}`,
          padding:"18px 20px 20px",
          display:"flex", flexDirection:"column", alignItems:"center", gap:"14px",
          boxShadow:"0 -8px 40px rgba(0,0,0,0.7)",
        }}>
          <div style={{width:"100%", maxWidth:"860px"}}>
            <p style={{color:"white", fontWeight:900, fontSize:"1rem", margin:"0 0 6px 0"}}>
              {timedOut ? "⏰ Temps écoulé !" : hit ? `✅ Anomalie trouvée ! +${anomalie.pointsAccordes} pts` : "❌ Raté ! Regardez le cercle vert."}
            </p>
            <p style={{color:"rgba(203,213,225,0.85)", fontSize:"0.88rem", margin:0, lineHeight:1.6}}>
              {anomalie.explication}
            </p>
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
            {idx >= anomalies.length - 1 ? "Voir les résultats →" : "Image suivante →"}
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
