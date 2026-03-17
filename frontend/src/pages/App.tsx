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
function SumSumModel({ warpTriggered, targetRotation, onWarpComplete }: { warpTriggered: boolean, targetRotation: number, onWarpComplete: () => void }) {
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

  const [introDone, setIntroDone] = useState(false);
  const [currentRotY, setCurrentRotY] = useState(0); // Start facing us (0)

  useEffect(() => {
    if (obj) {
      // Scale and center if needed
      obj.scale.set(1.5, 1.5, 1.5);
      
      // Some OBJ materials might be double-sided, let's fix basic stuff if needed
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.side = THREE.DoubleSide;
        }
      });
    }
  }, [obj]);

  const warpSpeed = useRef(0);
  const zPos = useRef(0);

  // Offset rotation so that the ship actually faces the zone (often Obj are imported facing Z+ or Z-)
  // Assuming the object faces Z+ naturally, to face the camera it needs 0. To face away (Z-), it needs PI.
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (!introDone) {
      // Cinematic Intro: rotate from facing us to facing away
      const targetIntroRot = Math.PI; // Face away
      const newRot = THREE.MathUtils.lerp(currentRotY, targetIntroRot, delta * 2);
      setCurrentRotY(newRot);
      groupRef.current.rotation.y = newRot;

      if (Math.abs(newRot - targetIntroRot) < 0.05) {
        setIntroDone(true);
      }
    } else if (!warpTriggered) {
      // Normal interactive mode: tourner directement vers l'angle de la zone
      const optimalRot = THREE.MathUtils.lerp(groupRef.current.rotation.y, -targetRotation, delta * 3);
      groupRef.current.rotation.y = optimalRot;

      // Small hover effect
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    } else {
      // Warp animation
      warpSpeed.current += delta * 50;
      zPos.current -= warpSpeed.current * delta; // move forward (Z- is forward usually)
      groupRef.current.position.z = zPos.current;

      // Garder le nez du vaisseau vers la zone ciblée pendant le warp
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -targetRotation, delta * 5);
      
      // small shake
      groupRef.current.position.x += (Math.random() - 0.5) * 0.1;
      groupRef.current.position.y += (Math.random() - 0.5) * 0.1 - (Math.sin(state.clock.elapsedTime * 2) * 0.2); // cancel hover temporarily

      if (zPos.current < -50) {
        onWarpComplete();
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
      {warpTriggered && (
        <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.1, 3, 16]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

// --- Zones ---
const ZONES = [
  { id: 1, name: "Jeu 1", angle: -Math.PI / 4, color: "#ff3366", colorTheme: "from-[#ff3366]/40 to-transparent", labelColor: "text-[#ff3366]" },
  { id: 2, name: "Jeu 2", angle: -Math.PI / 12, color: "#33ccff", colorTheme: "from-[#33ccff]/40 to-transparent", labelColor: "text-[#33ccff]" },
  { id: 3, name: "Jeu 3", angle: Math.PI / 12, color: "#66ff33", colorTheme: "from-[#66ff33]/40 to-transparent", labelColor: "text-[#66ff33]" },
  { id: 4, name: "Jeu 4", angle: Math.PI / 4, color: "#ffcc33", colorTheme: "from-[#ffcc33]/40 to-transparent", labelColor: "text-[#ffcc33]" },
];

function ZoneMarkers({ selectedZoneId }: { selectedZoneId: number }) {
  const radius = 10;
  return (
    <group>
      {ZONES.map((zone) => {
        const x = Math.sin(zone.angle) * radius;
        const z = -Math.cos(zone.angle) * radius;
        const isSelected = selectedZoneId === zone.id;

        return (
          <group key={zone.id} position={[x, -1, z]}>
            <mesh>
              <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
              <meshStandardMaterial 
                color={zone.color} 
                emissive={zone.color} 
                emissiveIntensity={isSelected ? 1 : 0.2}
                transparent
                opacity={0.8}
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
              <div className={`transition-all duration-300 font-bold uppercase tracking-widest ${isSelected ? 'scale-150 opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'scale-100 opacity-50'} ${zone.labelColor} whitespace-nowrap`}>
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

  useEffect(() => {
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
  }, [warpTriggered]);

  const triggerWarp = () => {
    if(warpTriggered) return;
    setWarpTriggered(true);
  };

  const handleWarpComplete = () => {
    navigate(`/game/${ZONES[selectedZoneIndex].id}`);
  };

  const currentZone = ZONES[selectedZoneIndex];

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans text-white">
      <div className={`absolute inset-0 bg-gradient-to-t ${currentZone.colorTheme} transition-colors duration-1000 z-0 opacity-20`} />
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 4, 12], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <Sky distance={450000} sunPosition={[0, -1, 0]} inclination={0} azimuth={0.25} turbidity={10} rayleigh={0.1} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

          <Suspense fallback={<Loader />}>
            <SumSumModel 
              warpTriggered={warpTriggered} 
              targetRotation={currentZone.angle}
              onWarpComplete={handleWarpComplete}
            />
            <ZoneMarkers selectedZoneId={currentZone.id} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* UI Top Info */}
      <div className={`absolute top-10 left-0 right-0 z-20 flex justify-center pointer-events-none transition-opacity duration-500 ${warpTriggered ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-black/40 backdrop-blur-md px-12 py-4 rounded-3xl border border-white/10 flex flex-col items-center">
          <h2 className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-1">Destination</h2>
          <h1 className={`text-4xl font-black uppercase tracking-wider ${currentZone.labelColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}>
            {currentZone.name}
          </h1>
        </div>
      </div>

      {/* UI Bottom Controls */}
      <div className={`fixed bottom-0 pb-8 left-0 right-0 z-30 flex justify-between items-end px-12 transition-opacity duration-500 ${warpTriggered ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Touch / Click Controls */}
        <div className="flex gap-4 items-end">
          <button 
            className={`p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all text-white ${selectedZoneIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 hover:border-white/50 active:scale-95'}`}
            onClick={() => setSelectedZoneIndex(p => Math.max(0, p - 1))}
            disabled={selectedZoneIndex === 0 || warpTriggered}
          >
            <ArrowLeft size={32} />
          </button>
          
          <button 
            className={`p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all text-white ${selectedZoneIndex === ZONES.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/20 hover:border-white/50 active:scale-95'}`}
            onClick={() => setSelectedZoneIndex(p => Math.min(ZONES.length - 1, p + 1))}
            disabled={selectedZoneIndex === ZONES.length - 1 || warpTriggered}
          >
            <ArrowRight size={32} />
          </button>
          
          <button 
            className="ml-4 px-8 py-5 h-[74px] rounded-full bg-gradient-to-r from-blue-600 to-[#00ffcc] text-black font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,204,0.4)] flex items-center gap-2"
            onClick={triggerWarp}
            disabled={warpTriggered}
          >
             Go <ArrowRight size={20} className="text-black" />
          </button>
        </div>

        {/* Keyboard Hints */}
        <div className="hidden md:flex flex-col items-end gap-3 opacity-60 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium uppercase tracking-wider text-white">Naviguer</span>
            <div className="flex gap-1">
              <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg font-mono text-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">Q</kbd>
              <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg font-mono text-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">D</kbd>
            </div>
            <span className="text-gray-400 mx-1">ou</span>
            <div className="flex gap-1">
              <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white"><ArrowLeft size={20} /></kbd>
              <kbd className="w-10 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white"><ArrowRight size={20} /></kbd>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium uppercase tracking-wider text-white">Valider</span>
            <kbd className="px-4 h-10 flex items-center justify-center bg-black/60 border border-white/30 rounded-lg font-mono text-sm uppercase shadow-[0_2px_0_rgba(255,255,255,0.2)] text-white">Entrée</kbd>
          </div>
        </div>

      </div>
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

