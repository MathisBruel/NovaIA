import React, { createContext, useContext, useState, useEffect } from "react";

export type Profil = {
  id?: number;
  prenom: string;
  nom: string;
  mail: string;
  motDePasse: string;
  points: number;
  admin?: boolean;
  certified?: boolean;
};

export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL && (import.meta as any).env.VITE_API_BASE_URL.length > 0
    ? (import.meta as any).env.VITE_API_BASE_URL
    : "";

export type AuthContextValue = {
  user: Profil | null;
  login: (profil: Profil) => void;
  logout: () => void;
  updateUserPoints: (delta: number) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
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

  const updateUserPoints = (delta: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, points: (prev.points ?? 0) + delta };
      window.localStorage.setItem("specialweek_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserPoints }}>
      {children}
    </AuthContext.Provider>
  );
}
