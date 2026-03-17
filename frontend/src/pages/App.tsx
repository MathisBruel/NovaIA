import React, { Suspense, useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, useProgress, Sky, Stars } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import * as THREE from "three";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    name: "Jeu 1",
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
    <div className="w-full min-h-screen bg-black font-sans text-white flex flex-col">
      {/* Section hero 3D pleine hauteur */}
      <section className="relative w-full h-screen overflow-hidden">
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
              className={`absolute bottom-0 pb-8 left-0 right-0 z-30 flex justify-between items-end px-12 transition-opacity duration-500 ${
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

      {/* Section site classique en dessous (uniquement en mode intro) */}
      {mode === "intro" && (
        <section className="w-full flex-1 bg-slate-950 text-slate-100">
          <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
            <header>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Bienvenue dans l’univers SumSum
              </h2>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl">
                Retrouvez ici la partie “site classique” : présentation du projet,
                explications des jeux, liens utiles et informations pratiques.
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">Jeux disponibles</h3>
                <p className="text-sm text-slate-300">
                  Une sélection de jeux pour sensibiliser, apprendre et s’amuser autour
                  des thématiques de la Special Week.
                </p>
              </div>
              <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">Comment jouer ?</h3>
                <p className="text-sm text-slate-300">
                  Depuis le hub 3D, choisissez une destination, puis laissez SumSum vous
                  téléporter vers le jeu correspondant.
                </p>
              </div>
              <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-2">Points & gamification</h3>
                <p className="text-sm text-slate-300">
                  Chaque activité complétée vous fait gagner des points. Consultez le
                  back-office pour suivre la progression des participants.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// --- Game Page Placeholder ---
function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
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

// --- App Router ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

