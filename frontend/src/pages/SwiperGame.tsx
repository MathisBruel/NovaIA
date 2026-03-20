import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, ChevronLeft, ChevronRight, Sparkles, Shield, ShieldAlert } from "lucide-react";
import { useAuth, API_BASE_URL } from "../contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────
type SwiperPost = {
  id: number;
  imagePostUrl: string;
  estFiable: boolean;
  explication: string;
  pointsAccordes: number;
};

// ─── Shuffle helper ───────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Constants ────────────────────────────────────────────
const SWIPE_THRESHOLD = 100;
const MAX_POSTS = 15; // nombre de posts par partie

// ─── Swipeable Card ──────────────────────────────────────
function SwipeCard({
  post,
  onSwipe,
  isTop,
}: {
  post: SwiperPost;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacityLeft = useTransform(x, [-150, -40, 0], [1, 0.5, 0]);
  const opacityRight = useTransform(x, [0, 40, 150], [0, 0.5, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: isTop ? 10 : 1 }}
    >
      <motion.div
        className={`relative w-[90vw] max-w-[340px] sm:max-w-[380px] md:max-w-[420px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/10 bg-slate-900/90 backdrop-blur-xl ${
          isTop ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        style={isTop ? { x, rotate } : {}}
        drag={isTop ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={isTop ? handleDragEnd : undefined}
        initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.6 }}
        animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.6 }}
        exit={{
          x: 0,
          opacity: 0,
          scale: 0.8,
          transition: { duration: 0.3 },
        }}
        whileDrag={isTop ? { scale: 1.02 } : undefined}
      >
        {/* INTOX Overlay (left swipe indicator) */}
        {isTop && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ opacity: opacityLeft }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/40 to-transparent" />
            <div className="relative flex items-center gap-3 px-8 py-4 border-4 border-red-400 rounded-2xl rotate-12 bg-red-500/20 backdrop-blur-sm">
              <ShieldAlert className="w-10 h-10 text-red-400" />
              <span className="text-4xl font-black text-red-400 uppercase tracking-widest">
                INTOX
              </span>
            </div>
          </motion.div>
        )}

        {/* INFO Overlay (right swipe indicator) */}
        {isTop && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
            style={{ opacity: opacityRight }}
          >
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-600/40 to-transparent" />
            <div className="relative flex items-center gap-3 px-8 py-4 border-4 border-emerald-400 rounded-2xl -rotate-12 bg-emerald-500/20 backdrop-blur-sm">
              <Shield className="w-10 h-10 text-emerald-400" />
              <span className="text-4xl font-black text-emerald-400 uppercase tracking-widest">
                INFO
              </span>
            </div>
          </motion.div>
        )}

        {/* Card content: social media post */}
        <div className="relative p-6 sm:p-8">
          {/* Post image */}
          <div className="relative w-full aspect-[4/5] flex items-center justify-center bg-slate-800/50 rounded-2xl shadow-inner border border-white/10 p-4 sm:p-6 overflow-hidden">
            <img
              src={post.imagePostUrl}
              alt="Post"
              className="w-full h-full object-contain drop-shadow-2xl"
              draggable={false}
              loading="eager"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Feedback Overlay ─────────────────────────────────────
function FeedbackOverlay({
  isCorrect,
  explication,
  onContinue,
}: {
  isCorrect: boolean;
  explication: string;
  onContinue: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      onClick={onContinue}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        className={`relative max-w-md w-full rounded-3xl p-8 border-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${
          isCorrect
            ? "bg-emerald-950/90 border-emerald-500/50"
            : "bg-red-950/90 border-red-500/50"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-5">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isCorrect
                ? "bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                : "bg-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
          </div>

          <div>
            <h3
              className={`text-2xl font-black uppercase tracking-wide ${
                isCorrect ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {isCorrect ? "Bonne réponse !" : "Mauvaise réponse"}
            </h3>
          </div>

          {isCorrect && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-emerald-300">+10 points</span>
            </div>
          )}

          <button
            onClick={onContinue}
            className={`mt-2 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all ${
              isCorrect
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                : "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]"
            }`}
          >
            Continuer
          </button>
          <span className="text-[11px] text-slate-500 uppercase tracking-wider">
            ou appuie sur Entrée
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── End Screen ───────────────────────────────────────────
function EndScreen({
  score,
  total,
  maxScore,
  onRestart,
  onQuit,
}: {
  score: number;
  total: number;
  maxScore: number;
  onRestart: () => void;
  onQuit: () => void;
}) {
  const pct = total > 0 ? Math.round((score / maxScore) * 100) : 0;

  let grade = "Débutant";
  let gradeColor = "text-slate-400";
  let gradeBg = "from-slate-500/20 to-slate-600/10";
  if (pct >= 90) {
    grade = "Expert Anti-Fake";
    gradeColor = "text-yellow-400";
    gradeBg = "from-yellow-500/20 to-amber-500/10";
  } else if (pct >= 70) {
    grade = "Vérificateur Confirmé";
    gradeColor = "text-emerald-400";
    gradeBg = "from-emerald-500/20 to-teal-500/10";
  } else if (pct >= 50) {
    grade = "Apprenti Fact-Checker";
    gradeColor = "text-sky-400";
    gradeBg = "from-sky-500/20 to-blue-500/10";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-8 max-w-md mx-auto"
    >
      <div
        className={`w-28 h-28 rounded-full bg-gradient-to-br ${gradeBg} border-2 border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.2)]`}
      >
        <Trophy className={`w-14 h-14 ${gradeColor}`} />
      </div>

      <div>
        <h2 className="text-4xl font-black text-white tracking-tight mb-2">
          Partie terminée !
        </h2>
        <p className={`text-xl font-bold ${gradeColor}`}>{grade}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
          {score}
        </span>
        <span className="text-2xl font-bold text-slate-500">/ {maxScore}</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-yellow-400 rounded-full"
        />
      </div>
      <p className="text-sm text-slate-400">
        {score / 10} bonne{score / 10 > 1 ? "s" : ""} réponse{score / 10 > 1 ? "s" : ""} sur{" "}
        {total} posts analysés
      </p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        >
          <RotateCcw className="w-4 h-4" />
          Rejouer
        </button>
        <button
          onClick={onQuit}
          className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Accueil
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main SwiperGame Component ────────────────────────────
export default function SwiperGame() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [posts, setPosts] = useState<SwiperPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    explication: string;
  } | null>(null);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [pointsSynced, setPointsSynced] = useState(false);

  // Fetch posts
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/games/swiper`);
      if (!res.ok) throw new Error("Impossible de charger les posts");
      const data: SwiperPost[] = await res.json();
      setPosts(shuffleArray(data).slice(0, MAX_POSTS));
      setCurrentIndex(0);
      setScore(0);
      setGameOver(false);
      setFeedback(null);
      setPointsSynced(false);
    } catch (e: any) {
      setError(e.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Sync points to backend when game ends
  useEffect(() => {
    if (!gameOver || pointsSynced || !auth.user?.id || score <= 0) return;
    setPointsSynced(true);
    fetch(`${API_BASE_URL}/api/accounts/${auth.user.id}/add-points?delta=${score}`, { method: "POST" })
      .then(() => auth.updateUserPoints(score))
      .catch(() => {});
  }, [gameOver, pointsSynced, auth, score]);

  // Handle swipe
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (feedback || gameOver || currentIndex >= posts.length) return;

      const post = posts[currentIndex];
      // right = user thinks it's fiable (info), left = user thinks it's intox
      const userSaysInfo = direction === "right";
      const isCorrect = userSaysInfo === post.estFiable;

      setExitDirection(direction);

      if (isCorrect) {
        setScore((s) => s + post.pointsAccordes);
      }

      // Small delay before showing feedback to let the exit animation play
      setTimeout(() => {
        setFeedback({ isCorrect, explication: post.explication });
      }, 200);
    },
    [feedback, gameOver, currentIndex, posts]
  );

  // Continue after feedback
  const handleContinue = useCallback(() => {
    setFeedback(null);
    setExitDirection(null);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= posts.length) {
      setGameOver(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, posts.length]);

  // Keyboard controls
  useEffect(() => {
    if (feedback || gameOver) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "q" || e.key === "Q") {
        e.preventDefault();
        handleSwipe("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleSwipe("right");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [feedback, gameOver, handleSwipe]);

  // ─── Render ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
            Chargement des posts…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg font-bold">{error}</p>
          <button
            onClick={loadPosts}
            className="px-6 py-3 rounded-full bg-cyan-500 text-slate-950 font-bold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] rounded-full" />
      </div>

      {/* Top bar */}
      <header className="relative z-30 flex items-center justify-between px-4 sm:px-8 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour</span>
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 uppercase tracking-[0.15em]">
            Info ou Intox
          </h1>
          {!gameOver && (
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              {currentIndex + 1} / {posts.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-black text-white">{score}</span>
        </div>
      </header>

      {/* Progress bar */}
      {!gameOver && (
        <div className="relative z-30 px-4 sm:px-8">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 rounded-full"
              initial={false}
              animate={{
                width: `${((currentIndex) / posts.length) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
        {gameOver ? (
          <EndScreen
            score={score}
            total={posts.length}
            maxScore={posts.length * 10}
            onRestart={loadPosts}
            onQuit={() => navigate("/")}
          />
        ) : (
          <div className="relative w-full max-w-[460px] aspect-[3/4.5] mx-auto">
            <AnimatePresence mode="popLayout">
              {/* Next card (behind) */}
              {currentIndex + 1 < posts.length && !exitDirection && (
                <SwipeCard
                  key={posts[currentIndex + 1].id}
                  post={posts[currentIndex + 1]}
                  onSwipe={() => {}}
                  isTop={false}
                />
              )}

              {/* Current card (on top) */}
              {!exitDirection && (
                <SwipeCard
                  key={posts[currentIndex].id}
                  post={posts[currentIndex]}
                  onSwipe={handleSwipe}
                  isTop={true}
                />
              )}
            </AnimatePresence>

            {/* Exit animation */}
            <AnimatePresence>
              {exitDirection && (
                <motion.div
                  key="exit-card"
                  className="absolute inset-0 flex items-center justify-center z-20"
                  initial={{ x: 0, rotate: 0, opacity: 1 }}
                  animate={{
                    x: exitDirection === "left" ? -600 : 600,
                    rotate: exitDirection === "left" ? -30 : 30,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.4, ease: "easeIn" }}
                >
                  <div className="relative w-[90vw] max-w-[340px] sm:max-w-[380px] md:max-w-[420px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/10 bg-slate-900/90">
                    <div className="relative p-6 sm:p-8">
                      <div className="relative w-full aspect-[4/5] flex items-center justify-center bg-slate-800/50 rounded-2xl shadow-inner border border-white/10 p-4 sm:p-6 overflow-hidden">
                        <img
                          src={posts[currentIndex].imagePostUrl}
                          alt="Post"
                          className="w-full h-full object-contain drop-shadow-2xl"
                          draggable={false}
                        />
                      </div>
                    </div>

                    {/* Direction stamp */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {exitDirection === "left" ? (
                        <div className="flex items-center gap-3 px-8 py-4 border-4 border-red-400 rounded-2xl rotate-12 bg-red-500/30 backdrop-blur-sm">
                          <ShieldAlert className="w-10 h-10 text-red-400" />
                          <span className="text-4xl font-black text-red-400 uppercase tracking-widest">
                            INTOX
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-8 py-4 border-4 border-emerald-400 rounded-2xl -rotate-12 bg-emerald-500/30 backdrop-blur-sm">
                          <Shield className="w-10 h-10 text-emerald-400" />
                          <span className="text-4xl font-black text-emerald-400 uppercase tracking-widest">
                            INFO
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {!gameOver && !feedback && (
        <div className="relative z-30 px-4 sm:px-8 pb-8 flex items-center justify-center gap-6">
          {/* Intox button */}
          <button
            onClick={() => handleSwipe("left")}
            className="group flex items-center gap-3 px-6 sm:px-8 py-4 rounded-full bg-red-500/10 border-2 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/60 transition-all active:scale-95 text-red-400 hover:text-red-300"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase tracking-widest text-sm sm:text-base">
              Intox
            </span>
          </button>

          {/* Info button */}
          <button
            onClick={() => handleSwipe("right")}
            className="group flex items-center gap-3 px-6 sm:px-8 py-4 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/60 transition-all active:scale-95 text-emerald-400 hover:text-emerald-300"
          >
            <span className="font-black uppercase tracking-widest text-sm sm:text-base">
              Info
            </span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* Keyboard hints (desktop only) */}
      {!gameOver && !feedback && (
        <div className="hidden md:flex relative z-30 justify-center pb-6 gap-8 opacity-50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <kbd className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-600 font-mono text-[11px] text-white">
              ←
            </kbd>
            <span>Intox</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <kbd className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-600 font-mono text-[11px] text-white">
              →
            </kbd>
            <span>Info</span>
          </div>
        </div>
      )}

      {/* Login banner */}
      {!gameOver && !auth.user && (
        <div className="relative z-30 flex items-center justify-center gap-3 px-4 py-2.5 border-t border-white/5 bg-slate-900/80 backdrop-blur-sm text-xs text-slate-400">
          <span>🔓 Connecte-toi pour sauvegarder tes points</span>
          <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Connexion</Link>
          <span className="text-slate-600">·</span>
          <Link to="/register" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Inscription</Link>
        </div>
      )}

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <FeedbackOverlay
            isCorrect={feedback.isCorrect}
            explication={feedback.explication}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
