import React, { Suspense, useState, useRef, useEffect, useContext, createContext } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link, Navigate } from "react-router-dom";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, useProgress, Sky, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import * as THREE from "three";
import { ArrowLeft, ArrowRight, UserPlus, LogIn, Gamepad2, Sparkles, Rocket } from "lucide-react";
import SwiperGame from "./SwiperGame";

// --- Loader ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 text-white p-8 bg-black/80 rounded-xl backdrop-blur-md">
        <div className="text-xl font-bold uppercase tracking-widest text-[#00ffcc]">
          Chargement SumSum
        </div>
        <div className="w-[300px] h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-[#00ffcc] transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm text-gray-400 font-mono">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}

// --- SumSum Model ---
const SHIP_BASE_ROTATION_Y = Math.PI / 2; // orientation de base du modèle
const FACE_CAMERA_ROT_Y = SHIP_BASE_ROTATION_Y + Math.PI; // orientation face à nous

type SumSumMode = "intro" | "hub";

function SumSumModel({
  warpTriggered,
  targetRotation,
  onWarpComplete,
  warpTarget,
  mode,
}: {
  warpTriggered: boolean;
  targetRotation: number;
  onWarpComplete: () => void;
  warpTarget?: { x: number; y: number; z: number };
  mode: SumSumMode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mtl = useLoader(MTLLoader, "/assets/models/sumsum/tripo_convert_64c5f99f-9a87-44fc-b817-a67112967994.mtl");
  
  useEffect(() => {
    if (mtl) {
      mtl.preload();
    }
  }, [mtl]);

  const obj = useLoader(OBJLoader, "/assets/models/sumsum/tripo_convert_64c5f99f-9a87-44fc-b817-a67112967994.obj", (loader) => {
    if (mtl) {
        mtl.preload();
        loader.setMaterials(mtl);
    }
  });

  const [introDone, setIntroDone] = useState(mode !== "intro");

  // Réinitialiser proprement la position/orientation quand on revient en mode "intro"
  useEffect(() => {
    if (mode === "intro" && groupRef.current) {
      setIntroDone(false);
      groupRef.current.position.set(0, 0, -60);
      groupRef.current.rotation.set(0, FACE_CAMERA_ROT_Y, 0);
    }
  }, [mode]);

  useEffect(() => {
    if (obj && groupRef.current) {
      obj.scale.set(1.5, 1.5, 1.5);
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.side = THREE.DoubleSide;
        }
      });
      // orientation de base : face à la caméra
      groupRef.current.rotation.y = FACE_CAMERA_ROT_Y;
      // position de départ : très loin au fond (axe Z négatif)
      groupRef.current.position.set(0, 0, -60);
    }
  }, [obj]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (mode === "intro" && !introDone) {
      // Intro cinématique : SumSum arrive du fond en restant face à nous,
      // avec une décélération douce
      const targetZ = 0;
      const currentZ = groupRef.current.position.z;
      const smoothZ = THREE.MathUtils.damp(currentZ, targetZ, 2.5, delta);
      groupRef.current.position.z = smoothZ;
      groupRef.current.position.x = 0; // éviter tout décalage horizontal parasite
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;

      // rester constamment orienté vers la caméra
      groupRef.current.rotation.y = FACE_CAMERA_ROT_Y;

      if (Math.abs(smoothZ - targetZ) < 0.03) {
        setIntroDone(true);
      }
    } else if (!warpTriggered) {
      if (mode === "intro") {
        // Après l'intro, tant que Start n'est pas cliqué, SumSum reste face à nous et flotte légèrement
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          FACE_CAMERA_ROT_Y,
          delta * 3
        );
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      } else {
        // Mode hub : tourner vers la zone sélectionnée
        const targetY = SHIP_BASE_ROTATION_Y - targetRotation;
        const optimalRot = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, delta * 3);
        groupRef.current.rotation.y = optimalRot;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    } else if (warpTriggered && warpTarget) {
      // Warp smooth vers le centre de la zone sélectionnée
      const shipPos = groupRef.current.position;
      const targetPos = new THREE.Vector3(warpTarget.x, warpTarget.y + 0.5, warpTarget.z);

      shipPos.x = THREE.MathUtils.damp(shipPos.x, targetPos.x, 3, delta);
      shipPos.y = THREE.MathUtils.damp(shipPos.y, targetPos.y, 3, delta);
      shipPos.z = THREE.MathUtils.damp(shipPos.z, targetPos.z, 3, delta);

      // garder le nez du vaisseau vers la zone pendant le warp
      const targetY = SHIP_BASE_ROTATION_Y - targetRotation;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetY,
        4,
        delta
      );

      if (shipPos.distanceTo(targetPos) < 0.3) {
        onWarpComplete();
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={obj} />

    </group>
  );
}

// --- Zones ---
const ZONE_RADIUS = 10;

const ZONES = [
  {
    id: 1,
    name: "Info ou Intox",
    angle: -Math.PI / 3.5,
    color: "#fb7185",
    colorTheme: "from-[#fb7185]/40 via-transparent to-transparent",
    labelColor: "text-[#fb7185]",
  },
  {
    id: 2,
    name: "Jeu 2",
    angle: -Math.PI / 10,
    color: "#38bdf8",
    colorTheme: "from-[#38bdf8]/40 via-transparent to-transparent",
    labelColor: "text-[#38bdf8]",
  },
  {
    id: 3,
    name: "Jeu 3",
    angle: Math.PI / 10,
    color: "#4ade80",
    colorTheme: "from-[#4ade80]/40 via-transparent to-transparent",
    labelColor: "text-[#4ade80]",
  },
  {
    id: 4,
    name: "Jeu 4",
    angle: Math.PI / 3.5,
    color: "#facc15",
    colorTheme: "from-[#facc15]/40 via-transparent to-transparent",
    labelColor: "text-[#facc15]",
  },
];

function ZoneMarkers({ selectedZoneId }: { selectedZoneId: number }) {
  return (
    <group>
      {ZONES.map((zone) => {
        const x = Math.sin(zone.angle) * ZONE_RADIUS;
        const z = -Math.cos(zone.angle) * ZONE_RADIUS;
        const isSelected = selectedZoneId === zone.id;

        return (
          <group key={zone.id} position={[x, -1, z]}>
            <mesh>
              <cylinderGeometry args={[1.4, 1.4, 0.18, 32]} />
              <meshStandardMaterial 
                color={zone.color} 
                emissive={zone.color} 
                emissiveIntensity={isSelected ? 1.2 : 0.25}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[0, 10, 0]}>
              <cylinderGeometry args={[1.4, 1.4, 20, 32]} />
              <meshBasicMaterial 
                color={zone.color} 
                transparent 
                opacity={isSelected ? 0.3 : 0.05} 
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <Html position={[0, 2.5, 0]} center>
              <div
                className={`transition-all duration-300 font-extrabold uppercase tracking-[0.18em] text-sm ${
                  isSelected
                    ? "scale-125 opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "scale-95 opacity-60"
                } ${zone.labelColor} whitespace-nowrap`}
              >
                {zone.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

type Profil = {
  id?: number;
  prenom: string;
  nom: string;
  mail: string;
  motDePasse: string;
  points: number;
};

const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL && (import.meta as any).env.VITE_API_BASE_URL.length > 0
    ? (import.meta as any).env.VITE_API_BASE_URL
    : "";

type AuthContextValue = {
  user: Profil | null;
  login: (profil: Profil) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profil | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("specialweek_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        window.localStorage.removeItem("specialweek_user");
      }
    }
  }, []);

  const login = (profil: Profil) => {
    setUser(profil);
    window.localStorage.setItem("specialweek_user", JSON.stringify(profil));
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("specialweek_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function AccountsSection() {
  const [profils, setProfils] = useState<Profil[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Profil | null>(null);
  const [form, setForm] = useState<Profil>({
    prenom: "",
    nom: "",
    mail: "",
    motDePasse: "",
    points: 0,
  });
  const [pointsDelta, setPointsDelta] = useState(0);

  const loadProfils = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/accounts`);
      if (!res.ok) throw new Error("Erreur lors du chargement des comptes");
      const data = await res.json();
      setProfils(data);
    } catch (e: any) {
      setError(e.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfils();
  }, []);

  const handleChange = (field: keyof Profil, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "points" ? Number(value) || 0 : value,
    }));
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      prenom: "",
      nom: "",
      mail: "",
      motDePasse: "",
      points: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const method = editing?.id ? "PUT" : "POST";
      const url = editing?.id
        ? `${API_BASE_URL}/api/accounts/${editing.id}`
        : `${API_BASE_URL}/api/accounts`;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement du compte");
      resetForm();
      await loadProfils();
    } catch (e: any) {
      setError(e.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profil: Profil) => {
    setEditing(profil);
    setForm({
      prenom: profil.prenom,
      nom: profil.nom,
      mail: profil.mail,
      motDePasse: profil.motDePasse || "",
      points: profil.points ?? 0,
    });
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression du compte");
      if (editing?.id === id) resetForm();
      await loadProfils();
    } catch (e: any) {
      setError(e.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async (profil: Profil) => {
    if (!profil.id || !pointsDelta) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${API_BASE_URL}/api/accounts/${profil.id}/add-points?delta=${pointsDelta}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error("Erreur lors de l'ajout de points");
      setPointsDelta(0);
      await loadProfils();
    } catch (e: any) {
      setError(e.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full flex-1 relative mt-12">
      <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl rounded-3xl border border-white/10" />
      <div className="relative max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Gestion des comptes
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              Crée, modifie et gère les comptes joueurs directement depuis ton espace.
            </p>
          </div>
          <button
            type="button"
            onClick={loadProfils}
            className="self-start px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-all shadow-lg backdrop-blur-md"
          >
            ↻ Rafraîchir
          </button>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <form onSubmit={handleSubmit} className="md:col-span-1 bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold text-white mb-2">
              {editing ? "Modifier un compte" : "Nouveau compte"}
            </h3>
            <div className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Prénom</label>
                <input
                  required
                  value={form.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Nom</label>
                <input
                  required
                  value={form.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={form.mail}
                  onChange={(e) => handleChange("mail", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={form.motDePasse}
                  onChange={(e) => handleChange("motDePasse", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-slate-300 font-medium">Points</label>
                <input
                  type="number"
                  value={form.points}
                  onChange={(e) => handleChange("points", e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-cyan-400 focus:bg-white/10 transition-all text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                {editing ? "Enregistrer" : "Créer"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-100 text-xs border border-slate-600"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div className="md:col-span-2 bg-black/40 border border-white/10 rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Liste des comptes</h3>
              {loading && <span className="text-xs text-cyan-400 animate-pulse font-bold tracking-widest uppercase">Chargement...</span>}
            </div>
            {profils.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p className="text-sm text-slate-400 text-center">
                  Aucun compte pour le moment. Crée ton premier profil avec le formulaire.
                </p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="overflow-x-auto overflow-y-auto flex-1 max-h-[400px] pr-2 custom-scrollbar">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-slate-400 font-bold border-b border-white/10">
                        <th className="py-3 px-2">Prénom</th>
                        <th className="py-3 px-2">Nom</th>
                        <th className="py-3 px-2">Email</th>
                        <th className="py-3 px-2 text-right">Points</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profils.map((p) => (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                          <td className="py-3 px-2 font-medium text-white">{p.prenom}</td>
                          <td className="py-3 px-2 text-slate-300">{p.nom}</td>
                          <td className="py-3 px-2 text-slate-400">{p.mail}</td>
                          <td className="py-3 px-2 text-right font-bold text-emerald-400">{p.points}</td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleEdit(p)}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-white"
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(p.id)}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 transition-colors text-red-200"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-slate-300 font-medium">Ajouter des points</span>
                    <input
                      type="number"
                      value={pointsDelta || ""}
                      onChange={(e) => setPointsDelta(Number(e.target.value) || 0)}
                      className="w-24 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs outline-none focus:border-cyan-400 focus:bg-white/10 text-white font-bold"
                      placeholder="+10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profils.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleAddPoints(p)}
                        className="px-3 py-1 text-xs rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600"
                      >
                        Appliquer à {p.prenom}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Home Page ---
function Home() {
  const navigate = useNavigate();
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [warpTriggered, setWarpTriggered] = useState(false);
  const [mode, setMode] = useState<SumSumMode>("intro");
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    if (mode !== "hub") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (warpTriggered) return;
      
      if (e.key === "ArrowLeft" || e.key === "q" || e.key === "Q" || e.key === "a" || e.key === "A") {
        setSelectedZoneIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setSelectedZoneIndex((prev) => Math.min(ZONES.length - 1, prev + 1));
      } else if (e.key === "Enter" || e.key === " ") {
        triggerWarp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [warpTriggered, mode]);

  useEffect(() => {
    if (mode !== "intro") return;
    const t = setTimeout(() => setIntroReady(true), 2500);
    return () => clearTimeout(t);
  }, [mode]);

  const triggerWarp = () => {
    if (warpTriggered) return;
    setWarpTriggered(true);
  };

  const handleWarpComplete = () => {
    navigate(`/game/${ZONES[selectedZoneIndex].id}`);
  };

  const currentZone = ZONES[selectedZoneIndex];
  const currentZonePosition = {
    x: Math.sin(currentZone.angle) * ZONE_RADIUS,
    y: -1,
    z: -Math.cos(currentZone.angle) * ZONE_RADIUS,
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans text-white flex flex-col">
      {/* Hero 3D pleine hauteur */}
      <section className="relative w-full h-[80vh] md:h-screen overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            mode === "hub" ? currentZone.colorTheme : "from-sky-500/20 to-transparent"
          } transition-colors duration-1000 z-0 opacity-40`}
        />
        <div
          className={`absolute inset-0 z-10 ${
            mode === "intro" ? "pointer-events-none" : ""
          }`}
        >
          <Canvas
            camera={mode === "intro" ? { position: [0, 2, 10], fov: 55 } : { position: [0, 4, 12], fov: 50 }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            <Sky
              distance={450000}
              sunPosition={[0, -1, 0]}
              inclination={0}
              azimuth={0.25}
              turbidity={10}
              rayleigh={0.1}
            />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Suspense fallback={<Loader />}>
              <SumSumModel
                warpTriggered={mode === "hub" ? warpTriggered : false}
                targetRotation={mode === "hub" ? currentZone.angle : 0}
                onWarpComplete={handleWarpComplete}
                warpTarget={mode === "hub" ? currentZonePosition : undefined}
                mode={mode}
              />
              {mode === "hub" && <ZoneMarkers selectedZoneId={currentZone.id} />}
            </Suspense>
          </Canvas>
        </div>

        {mode === "intro" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-16 pointer-events-none">
            <button
              className={`pointer-events-auto px-12 py-4 rounded-full bg-gradient-to-r from-blue-500 to-[#00ffcc] text-black text-2xl font-black uppercase tracking-[0.25em] shadow-[0_0_30px_rgba(0,255,204,0.6)] border-4 border-white/60 transition-all ${
                introReady ? "opacity-100 translate-y-0 hover:scale-105 active:scale-95" : "opacity-0 translate-y-6"
              }`}
              disabled={!introReady}
              onClick={() => setMode("hub")}
            >
              Start
            </button>
          </div>
        )}

        {mode === "hub" && (
          <>
            {/* UI Top Info */}
            <div
              className={`absolute top-8 left-0 right-0 z-20 flex justify-center pointer-events-none transition-opacity duration-500 ${
                warpTriggered ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="bg-black/30 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 flex flex-col items-center shadow-[0_0_25px_rgba(15,23,42,0.9)]">
                <h2 className="text-[11px] uppercase tracking-[0.35em] text-slate-300 mb-1">Destination</h2>
                <h1
                  className={`text-3xl font-extrabold uppercase tracking-[0.18em] ${currentZone.labelColor} drop-shadow-[0_0_18px_rgba(255,255,255,0.4)]`}
                >
                  {currentZone.name}
                </h1>
              </div>
            </div>

            {/* UI Bottom Controls */}
            <div
              className={`absolute bottom-0 pb-28 md:pb-32 left-0 right-0 z-30 flex justify-between items-end px-6 md:px-12 transition-opacity duration-500 ${
                warpTriggered ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Touch / Click Controls */}
              <div className="flex gap-4 items-end">
                <button
                  className={`p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all text-white ${
                    selectedZoneIndex === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-white/20 hover:border-white/50 active:scale-95"
                  }`}
                  onClick={() => setSelectedZoneIndex((p) => Math.max(0, p - 1))}
                  disabled={selectedZoneIndex === 0 || warpTriggered}
                >
                  <ArrowLeft size={32} />
                </button>

                <button
                  className={`p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all text-white ${
                    selectedZoneIndex === ZONES.length - 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-white/20 hover:border-white/50 active:scale-95"
                  }`}
                  onClick={() => setSelectedZoneIndex((p) => Math.min(ZONES.length - 1, p + 1))}
                  disabled={selectedZoneIndex === ZONES.length - 1 || warpTriggered}
                >
                  <ArrowRight size={32} />
                </button>

                <button
                  className="ml-6 px-10 py-5 h-[76px] rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 text-slate-950 font-extrabold uppercase tracking-[0.25em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_35px_rgba(56,189,248,0.8)] flex items-center gap-3 border border-white/40"
                  onClick={triggerWarp}
                  disabled={warpTriggered}
                >
                  Go <ArrowRight size={20} className="text-slate-950" />
                </button>
              </div>

              {/* Keyboard Hints */}
              <div className="hidden md:flex flex-col items-end gap-3 opacity-60 pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium uppercase tracking-wider text-white">Naviguer</span>
                  <div className="flex gap-1">
                    <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg font-mono text-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">
                      Q
                    </kbd>
                    <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg font-mono text-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">
                      D
                    </kbd>
                  </div>
                  <span className="text-gray-400 mx-1">ou</span>
                  <div className="flex gap-1">
                    <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">
                      <ArrowLeft size={20} />
                    </kbd>
                    <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">
                      <ArrowRight size={20} />
                    </kbd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium uppercase tracking-wider text-white">Valider</span>
                  <kbd className="px-4 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg font-mono text-sm uppercase shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">
                    Entrée
                  </kbd>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Section contenu classique sous le hero */}
      <section className="relative w-full bg-slate-950 pt-32 pb-48 overflow-hidden border-t border-white/5">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-500/5 blur-[150px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 space-y-32">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-cyan-400/90">Système Operational</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-8 font-black text-white tracking-tight leading-[1.1]">
              Propulser l'apprentissage <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-sky-400">
                vers de nouveaux horizons.
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl font-medium">
              SumSum est votre guide dans cette exploration interactive. Découvrez un hub de jeux conçu pour 
              maîtriser les enjeux de l'IA et lutter contre la désinformation.
            </p>
          </motion.div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Register */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative flex flex-col h-full rounded-[2.5rem] bg-white/[0.03] border border-white/10 p-8 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.05] hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.1)]"
            >
              <div className="flex-1 space-y-8 relative z-10 flex flex-col">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-sky-500/5 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <UserPlus className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-wide">Identity Check</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Initialisez votre profil voyageur. Enregistrez votre progression et accumulez des points d'expertise IA.
                  </p>
                </div>
              </div>
              <Link to="/register" className="inline-flex items-center w-fit text-sm font-black text-cyan-400 group-hover:text-cyan-300 transition-colors uppercase tracking-[0.2em] gap-4 mt-auto mb-0 bg-white/5 py-4 px-8 rounded-2xl border border-white/5 group-hover:border-cyan-500/20">
                Register <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Card 2: Login */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative flex flex-col h-full rounded-[2.5rem] bg-white/[0.03] border border-white/10 p-8 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.05] hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            >
              <div className="flex-1 space-y-8 relative z-10 flex flex-col">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <LogIn className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-wide">Auth Portal</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Accédez à votre tableau de bord. Retrouvez vos succès et préparez-vous pour votre prochaine session.
                  </p>
                </div>
              </div>
              <Link to="/login" className="inline-flex items-center w-fit text-sm font-black text-emerald-400 group-hover:text-emerald-300 transition-colors uppercase tracking-[0.2em] gap-4 mt-auto mb-0 bg-white/5 py-4 px-8 rounded-2xl border border-white/5 group-hover:border-emerald-500/20">
                Login <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Card 3: Hub */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative flex flex-col h-full rounded-[2.5rem] bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-white/10 p-8 backdrop-blur-3xl transition-all duration-500 hover:bg-white/[0.05] hover:border-yellow-500/30 hover:shadow-[0_0_50px_rgba(250,204,21,0.1)] md:col-span-2 lg:col-span-1"
            >
              <div className="flex-1 space-y-8 relative z-10 flex flex-col">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-500/20 to-orange-500/5 border border-yellow-500/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Gamepad2 className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-white tracking-wide">Mission Control</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Le hub 3D est votre centre de commande. Choisissez une zone et warp vers votre prochain défi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center w-fit text-sm font-black text-yellow-500 group-hover:text-yellow-400 transition-colors uppercase tracking-[0.2em] gap-4 mt-auto mb-0 bg-white/5 py-4 px-8 rounded-2xl border border-white/5 group-hover:border-yellow-500/20"
              >
                Go Hub <Rocket className="w-5 h-5 group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </motion.div>
          </div>

          {/* Stats / Numbers Section for weight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-12 pb-24 border-t border-white/5">
            {[
              { label: "Utilisateurs", val: "2.4k+" },
              { label: "Points Distribués", val: "850k" },
              { label: "Zones de Jeux", val: "4" },
              { label: "IA Analysées", val: "100%" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <div className="text-3xl md:text-5xl font-black text-white">{stat.val}</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Game Page Placeholder ---
function Game() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Jeu 1 = Info ou Intox (Swiper)
  if (id === "1") {
    return <SwiperGame />;
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white font-sans">
      <h1 className="text-6xl font-black uppercase tracking-widest text-[#00ffcc] mb-8 drop-shadow-[0_0_20px_rgba(0,255,204,0.5)]">
        Jeu {id}
      </h1>
      <p className="text-xl text-gray-400 mb-12">Zone de jeu en cours de développement...</p>
      <button 
        className="px-8 py-4 rounded-full border-2 border-[#00ffcc] text-[#00ffcc] font-bold uppercase tracking-widest hover:bg-[#00ffcc] hover:text-black transition-all flex items-center gap-3"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={24} /> Retour à l'accueil
      </button>
    </div>
  );
}

// --- Pages Auth & Profil ---
function LoginPage() {
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
        setError("Identifiants invalides");
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

  if (auth.user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Connexion</h1>
        <p className="text-sm text-slate-300 mb-6">
          Connecte-toi pour accéder à ton profil joueur et à tes points.
        </p>
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-1">
            <label className="block text-slate-300 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-slate-700/50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-black/80 transition-all text-white"
            />
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="block text-slate-300 font-medium">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-slate-700/50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-black/80 transition-all text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:brightness-110 text-slate-950 font-bold py-3 text-base shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-60"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-400">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [form, setForm] = useState<Profil>({
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

  const handleChange = (field: keyof Profil, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "points" ? Number(value) || 0 : value,
    }));
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

  if (auth.user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Inscription</h1>
        <p className="text-sm text-slate-300 mb-6">
          Enregistre un profil joueur pour suivre tes points et tes progrès.
        </p>
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm mt-8">
          <div className="space-y-1.5">
            <label className="block text-slate-300 font-medium">Prénom</label>
            <input
              required
              value={form.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-slate-700/50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-black/80 transition-all text-white"
            />
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="block text-slate-300 font-medium">Nom</label>
            <input
              required
              value={form.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-slate-700/50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-black/80 transition-all text-white"
            />
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="block text-slate-300 font-medium">Email</label>
            <input
              type="email"
              required
              value={form.mail}
              onChange={(e) => handleChange("mail", e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-slate-700/50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-black/80 transition-all text-white"
            />
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="block text-slate-300 font-medium">Mot de passe</label>
            <input
              type="password"
              required
              value={form.motDePasse}
              onChange={(e) => handleChange("motDePasse", e.target.value)}
              className="w-full rounded-xl bg-black/50 border border-slate-700/50 px-4 py-3 outline-none focus:border-cyan-400 focus:bg-black/80 transition-all text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold py-3 text-base shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-60"
          >
            {loading ? "Création en cours..." : "Créer le compte"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-slate-400">
          Tu as déjà un compte ?{" "}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-bold tracking-wide">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

function ProfilePage() {
  const auth = useAuth();

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  const user = auth.user;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-32">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Mon profil</h1>
            <p className="text-base text-slate-400 max-w-xl leading-relaxed">
              Récapitulatif de ton compte joueur et accès à la gestion globale des comptes.
            </p>
          </div>
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl px-8 py-6 flex flex-col gap-2 min-w-[280px] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-bold">Points</p>
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                {user.points}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300 mt-2">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-slate-500">
              {user.mail}
            </p>
          </div>
        </div>

        {/* Back-office comptes réutilisant AccountsSection */}
        <AccountsSection />
      </div>
    </div>
  );
}

// --- Layout classique (navbar + footer) ---
function Navbar() {
  const auth = useAuth();

  return (
    <header className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-4xl rounded-full border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
      <div className="px-6 sm:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 shadow-[0_0_15px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-transform" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-bold">Novaia</span>
            <span className="text-sm font-bold text-white tracking-wide">Special Week</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8 text-xs font-bold uppercase tracking-[0.15em] text-slate-300">
          <Link to="/" className="hover:text-cyan-300">
            Accueil
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hover:text-cyan-300"
          >
            Hub 3D
          </button>
          <Link to="/profile" className="hover:text-cyan-300">
            Profil
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-xs">
          {auth.user ? (
            <>
              <span className="hidden md:inline text-slate-300 font-medium">
                Salut, <span className="font-bold text-white">{auth.user.prenom}</span>
              </span>
              <button
                type="button"
                onClick={auth.logout}
                className="px-4 py-2 rounded-full bg-slate-800/80 text-white font-semibold hover:bg-slate-700 transition-colors border border-slate-600"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-slate-600 text-slate-200 hover:bg-slate-800 font-semibold transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold hover:brightness-110 shadow-[0_0_15px_rgba(45,212,191,0.4)] transition-all"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/50 bg-slate-950 pb-24 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <span className="font-medium">© {new Date().getFullYear()} Novaia · Special Week</span>
        <span className="text-slate-400">Projet pédagogique interactif.</span>
      </div>
    </footer>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </main>
      <Footer />
      <Navbar />
    </div>
  );
}

// --- App Router ---
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

