import React, { Suspense, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Html, useProgress, Stars } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import * as THREE from "three";
import { ArrowLeft, ArrowRight } from "lucide-react";

// --- Full-page Loading Overlay ---
function LoadingOverlay() {
  const { active, progress } = useProgress();
  const [hidden, setHidden] = useState(false);
  const leaving = !active && progress >= 100;

  useEffect(() => {
    if (!active && progress >= 100) {
      const t = setTimeout(() => setHidden(true), 800);
      return () => clearTimeout(t);
    }
  }, [active, progress]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-fuchsia-400 via-violet-400 to-sky-400 shadow-[0_0_40px_rgba(168,85,247,0.5)] animate-pulse" />

        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-fuchsia-300 font-bold mb-1">Novaia</div>
          <div className="text-3xl font-black text-white tracking-tight">Special Week</div>
        </div>

        <div className="flex flex-col items-center gap-3 w-72">
          <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-widest font-mono">
            {progress < 100 ? "Chargement du hub spatial..." : "Prêt au décollage"}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SumSum Model ---
const SHIP_BASE_ROTATION_Y = Math.PI / 2;
const FACE_CAMERA_ROT_Y = SHIP_BASE_ROTATION_Y + Math.PI;
const MOBILE_PLANET_Z = -7;

type SumSumMode = "intro" | "hub";

type PlanetModelProps = {
  objPath: string;
  mtlPath: string;
  texturePath?: string;
  scale?: number;
  selected?: boolean;
  selectedScale?: number;
  rotation?: [number, number, number];
};

function PlanetModel({
  objPath,
  mtlPath,
  texturePath,
  scale = 2.2,
  selected = false,
  selectedScale = 1.2,
  rotation = [0, 0, 0],
}: PlanetModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const baseScaleRef = useRef<number | null>(null);
  const resourcePath = mtlPath.split("/").slice(0, -1).join("/") + "/";

  const mtl = useLoader(MTLLoader, mtlPath, (loader) => {
    loader.setResourcePath(resourcePath);
  });

  useEffect(() => {
    if (mtl) mtl.preload();
  }, [mtl]);

  const obj = useLoader(OBJLoader, objPath, (loader) => {
    if (mtl) loader.setMaterials(mtl);
  });

  const texture = useLoader(THREE.TextureLoader, texturePath ?? "", (loader) => {
    if (!texturePath) return;
    loader.setPath("");
  });

  useEffect(() => {
    if (!obj || !groupRef.current) return;
    if (baseScaleRef.current === null) {
      obj.scale.set(1, 1, 1);
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      baseScaleRef.current = scale / maxDim;
      obj.scale.set(baseScaleRef.current, baseScaleRef.current, baseScaleRef.current);
    }

    groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);

    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.side = THREE.DoubleSide;
        if (texturePath && texture) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.map = texture;
              mat.color.set(0xffffff);
              mat.needsUpdate = true;
            });
          } else {
            child.material.map = texture;
            child.material.color.set(0xffffff);
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [obj, rotation, scale, selected, selectedScale, texture, texturePath]);

  useFrame((_, delta) => {
    if (!obj || !baseScaleRef.current) return;
    const targetScale = baseScaleRef.current * (selected ? selectedScale : 1);
    const current = obj.scale.x;
    const smooth = THREE.MathUtils.damp(current, targetScale, 6, delta);
    obj.scale.set(smooth, smooth, smooth);
  });

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  );
}

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
  const sumSumMtlPath = "/assets/models/sumsum/tripo_convert_64c5f99f-9a87-44fc-b817-a67112967994.mtl";
  const sumSumResourcePath = "/assets/models/sumsum/";
  const mtl = useLoader(MTLLoader, sumSumMtlPath, (loader) => {
    loader.setResourcePath(sumSumResourcePath);
  });

  useEffect(() => {
    if (mtl) mtl.preload();
  }, [mtl]);

  const obj = useLoader(
    OBJLoader,
    "/assets/models/sumsum/tripo_convert_64c5f99f-9a87-44fc-b817-a67112967994.obj",
    (loader) => {
      if (mtl) {
        mtl.preload();
        loader.setMaterials(mtl);
      }
    }
  );

  const [introDone, setIntroDone] = useState(mode !== "intro");

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
        if (child instanceof THREE.Mesh) child.material.side = THREE.DoubleSide;
      });
      groupRef.current.rotation.y = FACE_CAMERA_ROT_Y;
      groupRef.current.position.set(0, 0, -60);
    }
  }, [obj]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (mode === "intro" && !introDone) {
      const targetZ = 0;
      const currentZ = groupRef.current.position.z;
      const smoothZ = THREE.MathUtils.damp(currentZ, targetZ, 2.5, delta);
      groupRef.current.position.z = smoothZ;
      groupRef.current.position.x = 0;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15;
      groupRef.current.rotation.y = FACE_CAMERA_ROT_Y;
      if (Math.abs(smoothZ - targetZ) < 0.03) setIntroDone(true);
    } else if (!warpTriggered) {
      if (mode === "intro") {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          FACE_CAMERA_ROT_Y,
          delta * 3
        );
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      } else {
        const targetY = SHIP_BASE_ROTATION_Y - targetRotation;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, delta * 3);
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
      }
    } else if (warpTriggered && warpTarget) {
      const shipPos = groupRef.current.position;
      const targetPos = new THREE.Vector3(warpTarget.x, warpTarget.y + 0.5, warpTarget.z);
      shipPos.x = THREE.MathUtils.damp(shipPos.x, targetPos.x, 3, delta);
      shipPos.y = THREE.MathUtils.damp(shipPos.y, targetPos.y, 3, delta);
      shipPos.z = THREE.MathUtils.damp(shipPos.z, targetPos.z, 3, delta);
      const targetY = SHIP_BASE_ROTATION_Y - targetRotation;
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 4, delta);
      if (shipPos.distanceTo(targetPos) < 0.3) onWarpComplete();
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

export const ZONES = [
  {
    id: 1,
    name: "Info ou Intox",
    angle: -Math.PI / 3.5,
    color: "#fb7185",
    colorTheme: "from-[#fb7185]/60 via-[#fb7185]/10 to-transparent",
    labelColor: "text-[#fb7185]",
    gameName: "Swiper",
    model: {
      obj: "/assets/models/sumsum/Planet1/tripo_convert_7f47b88d-99c0-47e0-a024-6af3cfc5d753.obj",
      mtl: "/assets/models/sumsum/Planet1/tripo_convert_7f47b88d-99c0-47e0-a024-6af3cfc5d753.mtl",
      texture: "/assets/models/sumsum/Planet1/fantasyplanet1_basecolor.JPEG",
      scale: 3.6,
      rotation: [0.05, -0.37, 0],
    },
  },
  {
    id: 2,
    name: "Jeu 2",
    angle: -Math.PI / 10,
    color: "#38bdf8",
    colorTheme: "from-[#38bdf8]/60 via-[#38bdf8]/10 to-transparent",
    labelColor: "text-[#38bdf8]",
    gameName: "Chasseur d'anomalie",
    model: {
      obj: "/assets/models/sumsum/Planet2/tripo_convert_aab8dc31-0285-4916-b25e-a66f1081688a.obj",
      mtl: "/assets/models/sumsum/Planet2/tripo_convert_aab8dc31-0285-4916-b25e-a66f1081688a.mtl",
      texture: "/assets/models/sumsum/Planet2/candyplanet2_basecolor.JPEG",
      scale: 4.2,
      rotation: [0.05, -0.9, 0],
    },
  },
  {
    id: 3,
    name: "Jeu 3",
    angle: Math.PI / 10,
    color: "#4ade80",
    colorTheme: "from-[#4ade80]/60 via-[#4ade80]/10 to-transparent",
    labelColor: "text-[#4ade80]",
    gameName: "Quizz",
    model: {
      obj: "/assets/models/sumsum/Planet3/tripo_convert_6895aebe-7d4e-4964-9606-743e0ac53367.obj",
      mtl: "/assets/models/sumsum/Planet3/tripo_convert_6895aebe-7d4e-4964-9606-743e0ac53367.mtl",
      texture: "/assets/models/sumsum/Planet3/iceplanet3_basecolor.JPEG",
      scale: 3.6,
      rotation: [0.08, -2.29, 0],
    },
  },
  {
    id: 4,
    name: "Jeu 4",
    angle: Math.PI / 3.5,
    color: "#facc15",
    colorTheme: "from-[#facc15]/60 via-[#facc15]/10 to-transparent",
    labelColor: "text-[#facc15]",
    gameName: "Mythos IA",
    model: {
      obj: "/assets/models/sumsum/Planet4/tripo_convert_6dc46ed0-97ba-4bd8-bac2-733bad6f63c7.obj",
      mtl: "/assets/models/sumsum/Planet4/tripo_convert_6dc46ed0-97ba-4bd8-bac2-733bad6f63c7.mtl",
      texture: "/assets/models/sumsum/Planet4/stylizedplanet4_basecolor.JPEG",
      scale: 2.85,
      rotation: [0.18, -2.47, 0],
    },
  },
];

function ZoneMarkers({ selectedZoneId, isMobile }: { selectedZoneId: number; isMobile: boolean }) {
  if (isMobile) {
    // On mobile: render all planets but only show the selected one (others hidden far away)
    // This ensures all assets are loaded upfront for instant switching
    return (
      <group>
        {ZONES.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          return (
            <group key={zone.id} position={isSelected ? [0, -1, MOBILE_PLANET_Z] : [0, -9000, 0]}>
              {isSelected && <pointLight color={zone.color} intensity={3} distance={14} />}
              <PlanetModel
                objPath={zone.model.obj}
                mtlPath={zone.model.mtl}
                texturePath={zone.model.texture}
                scale={zone.model.scale * 1.3}
                rotation={zone.model.rotation as [number, number, number]}
                selected={isSelected}
                selectedScale={1.3}
              />
              {isSelected && (
                <Html position={[0, 3.8, 0]} center>
                  <div
                    className="pointer-events-none"
                    style={{
                      color: zone.color,
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      textShadow: `0 0 16px ${zone.color}, 0 0 32px ${zone.color}60`,
                    }}
                  >
                    {zone.gameName}
                  </div>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    );
  }

  return (
    <group>
      {ZONES.map((zone) => {
        const x = Math.sin(zone.angle) * ZONE_RADIUS;
        const z = -Math.cos(zone.angle) * ZONE_RADIUS;
        const isSelected = selectedZoneId === zone.id;

        return (
          <group key={zone.id} position={[x, -1, z]}>
            <pointLight color={zone.color} intensity={isSelected ? 3 : 1} distance={14} />
            <PlanetModel
              objPath={zone.model.obj}
              mtlPath={zone.model.mtl}
              texturePath={zone.model.texture}
              scale={zone.model.scale}
              rotation={zone.model.rotation as [number, number, number]}
              selected={isSelected}
              selectedScale={1.25}
            />
            <Html position={[0, 3.2, 0]} center>
              <div
                className="transition-all duration-500 pointer-events-none"
                style={{
                  color: isSelected ? zone.color : "rgba(255,255,255,0.55)",
                  fontSize: isSelected ? "13px" : "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  textShadow: isSelected
                    ? `0 0 16px ${zone.color}, 0 0 32px ${zone.color}60`
                    : "0 0 8px rgba(255,255,255,0.2)",
                  transform: isSelected ? "scale(1.08)" : "scale(1)",
                }}
              >
                {zone.gameName}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// --- SpaceHub Component ---
export default function SpaceHub() {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);
  const [warpTriggered, setWarpTriggered] = useState(false);
  // On mobile: skip intro, go straight to hub
  const [mode, setMode] = useState<SumSumMode>(() =>
    window.innerWidth < 768 ? "hub" : "intro"
  );
  const [introReady, setIntroReady] = useState(() => window.innerWidth < 768);
  const { active, progress } = useProgress();
  const sceneLoaded = !active && progress >= 100;

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);

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
    if (!sceneLoaded || mode !== "intro") return;
    const t = setTimeout(() => setIntroReady(true), 2500);
    return () => clearTimeout(t);
  }, [sceneLoaded, mode]);

  const triggerWarp = () => {
    if (warpTriggered) return;
    setWarpTriggered(true);
  };

  const handleWarpComplete = () => {
    navigate(`/game/${ZONES[selectedZoneIndex].id}`);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || warpTriggered || mode !== "hub") return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) {
      setSelectedZoneIndex((p) => Math.min(ZONES.length - 1, p + 1));
    } else {
      setSelectedZoneIndex((p) => Math.max(0, p - 1));
    }
  };

  const currentZone = ZONES[selectedZoneIndex];

  const currentZonePosition = isMobile
    ? { x: 0, y: -1, z: MOBILE_PLANET_Z }
    : {
        x: Math.sin(currentZone.angle) * ZONE_RADIUS,
        y: -1,
        z: -Math.cos(currentZone.angle) * ZONE_RADIUS,
      };

  return (
    <>
      <LoadingOverlay />
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100dvh" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            mode === "hub" ? currentZone.colorTheme : "from-violet-500/20 to-transparent"
          } transition-colors duration-1000 z-0`}
        />
        <div className={`absolute inset-0 z-10 ${mode === "intro" ? "pointer-events-none" : ""}`}>
          <Canvas camera={{ position: [0, 2, 10], fov: 55 }}>
            <color attach="background" args={["#05050f"]} />
            <ambientLight intensity={0.35} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <Stars radius={120} depth={60} count={7000} factor={5} saturation={0.3} fade speed={0.5} />
            <Suspense fallback={null}>
              {!isMobile && (
                <SumSumModel
                  warpTriggered={mode === "hub" ? warpTriggered : false}
                  targetRotation={mode === "hub" ? currentZone.angle : 0}
                  onWarpComplete={handleWarpComplete}
                  warpTarget={mode === "hub" ? currentZonePosition : undefined}
                  mode={mode}
                />
              )}
              {mode === "hub" && (
                <ZoneMarkers selectedZoneId={currentZone.id} isMobile={isMobile} />
              )}
            </Suspense>
          </Canvas>
        </div>

        {mode === "intro" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-16 pointer-events-none">
            <button
              className={`pointer-events-auto px-12 py-4 rounded-full bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 text-slate-950 text-2xl font-black uppercase tracking-[0.25em] shadow-[0_12px_44px_rgba(168,85,247,0.4)] border border-white/30 transition-all ${
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
            {/* Badge destination */}
            <div
              className={`absolute top-0 left-0 right-0 z-20 flex justify-center pt-6 pointer-events-none transition-opacity duration-500 ${
                warpTriggered ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                className="flex flex-col items-center gap-1 px-10 py-4 rounded-full backdrop-blur-xl"
                style={{
                  background: "rgba(5,5,15,0.7)",
                  border: `1.5px solid ${currentZone.color}55`,
                  boxShadow: `0 0 40px ${currentZone.color}25, inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/30">Destination</span>
                <span
                  className="text-2xl font-black uppercase tracking-[0.15em] whitespace-nowrap leading-none"
                  style={{
                    color: currentZone.color,
                    textShadow: `0 0 30px ${currentZone.color}90, 0 0 60px ${currentZone.color}40`,
                  }}
                >
                  {currentZone.gameName}
                </span>
              </div>
            </div>

            {/* Mobile swipe hint */}
            {isMobile && (
              <div
                className={`absolute top-[40%] left-0 right-0 z-20 flex justify-center pointer-events-none transition-opacity duration-500 ${
                  warpTriggered ? "opacity-0" : "opacity-30"
                }`}
              >
                <div className="flex items-center gap-3 text-[11px] text-white/70 uppercase tracking-widest">
                  <ArrowLeft size={14} />
                  <span>Swiper pour naviguer</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            )}

            {/* Zone dots indicator (mobile) */}
            {isMobile && (
              <div
                className={`absolute bottom-28 left-0 right-0 z-30 flex justify-center gap-2 pointer-events-none transition-opacity duration-500 ${
                  warpTriggered ? "opacity-0" : "opacity-100"
                }`}
              >
                {ZONES.map((zone, i) => (
                  <div
                    key={zone.id}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === selectedZoneIndex ? "20px" : "6px",
                      height: "6px",
                      background: i === selectedZoneIndex ? currentZone.color : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Contrôles navigation */}
            <div
              className={`absolute bottom-0 left-0 right-0 z-30 flex items-end justify-center pb-10 gap-4 transition-opacity duration-500 ${
                warpTriggered ? "opacity-0" : "opacity-100"
              }`}
            >
              <button
                onClick={() => setSelectedZoneIndex((p) => Math.max(0, p - 1))}
                disabled={selectedZoneIndex === 0 || warpTriggered}
                className="w-14 h-14 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 active:scale-90"
                style={{ background: "rgba(5,5,15,0.65)", border: `1px solid ${currentZone.color}45` }}
              >
                <ArrowLeft size={20} />
              </button>

              <button
                onClick={triggerWarp}
                disabled={warpTriggered}
                className="h-14 px-10 rounded-full font-black uppercase tracking-[0.2em] text-base flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${currentZone.color}, ${currentZone.color}99)`,
                  color: "#06030d",
                  boxShadow: `0 6px 28px ${currentZone.color}70, 0 2px 0 rgba(255,255,255,0.15) inset`,
                  border: `1px solid ${currentZone.color}`,
                }}
              >
                GO <ArrowRight size={18} strokeWidth={3} />
              </button>

              <button
                onClick={() => setSelectedZoneIndex((p) => Math.min(ZONES.length - 1, p + 1))}
                disabled={selectedZoneIndex === ZONES.length - 1 || warpTriggered}
                className="w-14 h-14 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:scale-110 active:scale-90"
                style={{ background: "rgba(5,5,15,0.65)", border: `1px solid ${currentZone.color}45` }}
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Keyboard hints */}
            <div
              className={`absolute bottom-10 right-8 z-30 hidden md:flex flex-col items-end gap-1.5 pointer-events-none transition-opacity duration-500 ${
                warpTriggered ? "opacity-0" : "opacity-40"
              }`}
            >
              <div className="flex items-center gap-2 text-[11px] text-white/80">
                <span className="uppercase tracking-widest font-medium">Naviguer</span>
                <kbd className="px-2 py-0.5 bg-white/5 border border-white/15 rounded font-mono text-[10px]">Q</kbd>
                <kbd className="px-2 py-0.5 bg-white/5 border border-white/15 rounded font-mono text-[10px]">D</kbd>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/80">
                <span className="uppercase tracking-widest font-medium">Valider</span>
                <kbd className="px-2 py-0.5 bg-white/5 border border-white/15 rounded font-mono text-[10px]">Entrée</kbd>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
