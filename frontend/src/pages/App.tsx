import React from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SpaceHub from "./SpaceHub";
import LandingSection from "./LandingSection";
import SwiperGame from "./SwiperGame";
import QuizGame from "./QuizGame";
import ChasseAnomaliesGame from "./ChasseAnomaliesGame";
import MythosIaGame from "./MythosIaGame";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ProfilePage from "./ProfilePage";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// --- Home Page ---
function Home() {
  return (
    <div className="w-full min-h-screen font-sans text-white flex flex-col" style={{ background: "#2c0050" }}>
      <SpaceHub />
      <Navbar />
      <LandingSection />
      <Footer />
    </div>
  );
}

// --- Game Router ---
function Game() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id === "1") return <SwiperGame />;
  if (id === "2") return <ChasseAnomaliesGame />;
  if (id === "3") return <QuizGame />;
  if (id === "4") return <MythosIaGame />;

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans">
      <h1 className="text-6xl font-black uppercase tracking-widest text-[#c871ff] mb-8 drop-shadow-[0_0_20px_rgba(200,113,255,0.5)]">
        Jeu {id}
      </h1>
      <p className="text-xl text-gray-400 mb-12">Zone de jeu en cours de développement...</p>
      <button
        className="px-8 py-4 rounded-full border-2 border-[#c871ff] text-[#c871ff] font-bold uppercase tracking-widest hover:bg-[#c871ff] hover:text-black transition-all flex items-center gap-3"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={24} /> Retour à l'accueil
      </button>
    </div>
  );
}

// --- Layout for non-home pages ---
function MainLayout() {
  const location = useLocation();
  const showTopNav = location.pathname !== "/";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#2c0050" }}>
      {showTopNav && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      {showTopNav && <Footer />}
    </div>
  );
}

// --- App Router ---
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Games: fullscreen, no layout */}
          <Route path="/game/:id" element={<Game />} />
          {/* Rest of site */}
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
