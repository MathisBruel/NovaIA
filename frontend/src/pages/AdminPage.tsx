import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, API_BASE_URL, Profil } from "../contexts/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend, AreaChart, Area
} from "recharts";

type KPI = {
  totalUsers: number;
  totalAdmins: number;
  totalCertified: number;
  totalPoints: number;
  averagePoints: number;
  certificationRate: number;
  topUsers: Profil[];
};

type AdvancedKPI = {
  totalSessions: number;
  gamesDistribution: Record<string, number>;
  completionRates: Record<string, number>;
  avgStepReached: Record<string, number>;
  dropoffs: Record<string, Record<string, number>>;
};

const GAME_NAMES: Record<string, string> = {
  "1": "Info ou Intox",
  "2": "Chasseur d'Anomalies",
  "3": "Quizz IA",
  "4": "Mythos IA"
};
const COLORS = ["#fb7185", "#38bdf8", "#4ade80", "#facc15", "#c871ff", "#e8a87c"];

export default function AdminPage() {
  const auth = useAuth();
  const [kpis, setKpis] = useState<KPI | null>(null);
  const [advancedKpis, setAdvancedKpis] = useState<AdvancedKPI | null>(null);
  const [loading, setLoading] = useState(true);

  if (!auth.user || !auth.user.admin) return <Navigate to="/" replace />;

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/accounts/kpis`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/activity/advanced-kpis`).then(r => r.json())
    ])
      .then(([basic, advanced]) => {
        setKpis(basic);
        setAdvancedKpis(advanced);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement KPIs", err);
        setLoading(false);
      });
  }, []);

  const card: React.CSSProperties = {
    background: "rgba(200,113,255,0.05)",
    border: "1px solid rgba(200,113,255,0.14)",
    borderRadius: "20px",
    padding: "24px",
    flex: "1 1 200px"
  };

  const miniCard: React.CSSProperties = {
    ...card,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    position: "relative",
    overflow: "hidden"
  };

  const getPieData = () => {
    if (!advancedKpis) return [];
    return Object.entries(advancedKpis.gamesDistribution).map(([k, v]) => ({
      name: GAME_NAMES[k] || `Jeu ${k}`,
      value: v
    }));
  };

  const getBarData = () => {
    if (!advancedKpis) return [];
    return Object.entries(advancedKpis.completionRates).map(([k, v]) => ({
      name: GAME_NAMES[k] || `Jeu ${k}`,
      "Taux de complétion (%)": Math.round(v * 100)
    }));
  };

  const getDropoffData = (gameId: string) => {
    if (!advancedKpis || !advancedKpis.dropoffs[gameId]) return [];
    const steps = advancedKpis.dropoffs[gameId];
    return Object.entries(steps).map(([step, count]) => ({
      step: `Étape ${step}`,
      abandons: count
    })).sort((a,b) => a.step.localeCompare(b.step, undefined, { numeric: true }));
  };

  const getCertificationPieData = () => {
    if (!kpis) return [];
    return [
      { name: "Certifiés", value: kpis.totalCertified },
      { name: "Non certifiés", value: kpis.totalUsers - kpis.totalCertified }
    ];
  };

  const getAvgStepData = () => {
    if (!advancedKpis) return [];
    return Object.entries(advancedKpis.avgStepReached).map(([k, v]) => ({
      name: GAME_NAMES[k] || `Jeu ${k}`,
      "Étape moyenne atteinte": Math.round(v * 10) / 10
    }));
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", padding: "48px 24px", position: "relative" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "8px", background: "linear-gradient(135deg, #fff, #c871ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Tableau de Bord Administrateur
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "32px" }}>
          Suivez les indicateurs de performance (KPIs) en temps réel.
        </p>

        {loading ? (
          <div style={{ textAlign: "center", color: "#fff", padding: "40px" }}>
            <div style={{ width: "48px", height: "48px", border: "4px solid rgba(200,113,255,0.3)", borderTopColor: "#c871ff", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            Chargement des données...
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : kpis && advancedKpis ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* General Stats Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div style={miniCard}>
                <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1.5px" }}>Utilisateurs</div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#fff" }}>{kpis.totalUsers}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>dont {kpis.totalAdmins} admin{kpis.totalAdmins > 1 ? "s" : ""}</div>
              </div>
              <div style={miniCard}>
                <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(74,222,128,0.05)" }} />
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1.5px" }}>Certifiés</div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#4ade80" }}>{kpis.totalCertified}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{Math.round(kpis.certificationRate)}% du total</div>
              </div>
              <div style={miniCard}>
                <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(200,113,255,0.05)" }} />
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1.5px" }}>Sessions Jouées</div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#c871ff" }}>{advancedKpis.totalSessions}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>sur {Object.keys(advancedKpis.gamesDistribution).length} jeux</div>
              </div>
              <div style={miniCard}>
                <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(56,189,248,0.05)" }} />
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "1.5px" }}>Points Globaux</div>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#38bdf8" }}>{kpis.totalPoints.toLocaleString()}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>moy. {Math.round(kpis.averagePoints)} pts/user</div>
              </div>
            </div>

            {/* Certification Distribution + Session Distribution */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
              {/* Certification Donut */}
              <div style={{ ...card, flex: "1 1 340px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px", color: "#fff" }}>
                  Taux de Certification
                </h2>
                <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCertificationPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="rgba(255,255,255,0.08)" />
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e0b3c", border: "1px solid rgba(200,113,255,0.2)", borderRadius: "10px", color: "#fff" }} />
                      <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ textAlign: "center", marginTop: "-30px", position: "relative", zIndex: 2 }}>
                  <span style={{ fontSize: "42px", fontWeight: 900, background: "linear-gradient(135deg, #4ade80, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {Math.round(kpis.certificationRate)}%
                  </span>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>
                    {kpis.totalCertified} / {kpis.totalUsers} utilisateurs
                  </div>
                </div>
              </div>

              {/* Distribution des jeux (Pie Chart) */}
              <div style={{ ...card, flex: "1 1 400px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px", color: "#fff" }}>Répartition des Sessions Jouées</h2>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getPieData().map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#1e0b3c", border: "1px solid rgba(200,113,255,0.2)", borderRadius: "10px", color: "#fff" }} />
                      <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Completion + Avg Step Row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
              {/* Taux de complétion (Bar Chart) */}
              <div style={{ ...card, flex: "1 1 400px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px", color: "#fff" }}>Taux de Complétion des Jeux</h2>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                      <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} domain={[0, 100]} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: "#1e0b3c", border: "1px solid rgba(200,113,255,0.2)", borderRadius: "10px", color: "#fff" }} />
                      <Bar dataKey="Taux de complétion (%)" fill="#4ade80" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Étape moyenne atteinte (Area Chart) */}
              <div style={{ ...card, flex: "1 1 400px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px", color: "#fff" }}>Étape Moyenne Atteinte</h2>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getAvgStepData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="avgStepGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c871ff" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#c871ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                      <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e0b3c", border: "1px solid rgba(200,113,255,0.2)", borderRadius: "10px", color: "#fff" }} />
                      <Area type="monotone" dataKey="Étape moyenne atteinte" stroke="#c871ff" fillOpacity={1} fill="url(#avgStepGrad)" strokeWidth={3} dot={{ fill: "#c871ff", r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Dropoff Analysis */}
            <div style={{ ...card }}>
                <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "20px", color: "#fff" }}>Zones d'Abandon par Jeu</h2>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
                  Analyse de l'étape à laquelle les utilisateurs arrêtent chaque jeu, permettant d'identifier les points de friction.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                  {Object.keys(advancedKpis.dropoffs).map(gameId => (
                    <div key={gameId} style={{ background: "rgba(0,0,0,0.2)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <h3 style={{ fontSize: "14px", color: "#c871ff", marginBottom: "12px", fontWeight: 700 }}>{GAME_NAMES[gameId] || `Jeu ${gameId}`}</h3>
                      <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getDropoffData(gameId)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="step" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11}} />
                            <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 11}} allowDecimals={false} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: "#1e0b3c", border: "1px solid rgba(200,113,255,0.2)", borderRadius: "10px", color: "#fff" }} />
                            <Bar dataKey="abandons" fill="#fb7185" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                  {Object.keys(advancedKpis.dropoffs).length === 0 && (
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Pas assez de données d'abandons.</div>
                  )}
                </div>
            </div>

            {/* Top Users Display */}
            <div style={{ ...card, padding: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "20px", color: "#fff" }}>Classement Utilisateurs (Top 5)</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {kpis.topUsers.map((u, i) => (
                  <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderRadius: "12px", background: i === 0 ? "rgba(250,204,21,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(250,204,21,0.15)" : "rgba(255,255,255,0.05)"}`, transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg, #f0d060, #e8a030)" : i === 1 ? "linear-gradient(135deg, #c0cfe0, #a0b0c8)" : i === 2 ? "linear-gradient(135deg, #e8a87c, #d0805a)" : "rgba(200,113,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px", color: i < 3 ? "#000" : "#fff", boxShadow: i === 0 ? "0 0 16px rgba(240,208,96,0.4)" : "none" }}>
                        #{i + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                          {u.prenom} {u.nom}
                          {u.certified && (
                            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80", fontWeight: 700, letterSpacing: "0.5px" }}>CERTIFIÉ</span>
                          )}
                        </div>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{u.mail}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 900, color: "#c871ff", fontSize: "18px" }}>
                      {u.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div style={{ color: "red" }}>Impossible de charger les KPIs.</div>
        )}
      </div>
      
      {/* Background elements */}
      <div style={{ position: "absolute", top: "10%", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,113,255,0.08) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
    </div>
  );
}
