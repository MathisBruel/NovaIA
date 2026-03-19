import React, { useState } from "react";
import { Link } from "react-router-dom";

type Question = {
  id: number;
  id_reponses: number | null;
  text: string;
};

type ResponseSet = {
  id: number;
  reponse_1: string;
  reponse_2: string;
  next_1: number | null;
  next_2: number | null;
};

// Data derived from migration/02_data.sql (subset used for the mock flow)
const RESPONSES: Record<number, ResponseSet> = {
  1: { id: 1, reponse_1: "Je veux parler de l’espace.", reponse_2: "Je préfère parler des animaux.", next_1: 2, next_2: 30 },
  2: { id: 2, reponse_1: "Je veux découvrir les planètes.", reponse_2: "Je veux en apprendre plus sur les étoiles.", next_1: 3, next_2: 20 },
  3: { id: 3, reponse_1: "Je veux explorer Jupiter.", reponse_2: "Je veux explorer Mars.", next_1: 4, next_2: 10 },
  4: { id: 4, reponse_1: "Je veux découvrir les lunes de Jupiter.", reponse_2: "Je veux découvrir l’atmosphère de Jupiter.", next_1: 5, next_2: 7 },
  5: { id: 5, reponse_1: "Je veux en savoir plus sur Europe.", reponse_2: "Je veux en savoir plus sur Io.", next_1: 6, next_2: 8 },
  6: { id: 6, reponse_1: "Sous la glace d’Europe, on trouve probablement un océan caché.", reponse_2: "Sous la glace d’Europe, on trouve un noyau de feu.", next_1: 9, next_2: 9 },
  7: { id: 7, reponse_1: "Les tempêtes de Jupiter sont très puissantes.", reponse_2: "Les tempêtes de Jupiter sont plutôt calmes.", next_1: 9, next_2: 9 },
  8: { id: 8, reponse_1: "Io est surtout connue pour ses volcans.", reponse_2: "Io est surtout connue pour ses forêts glacées.", next_1: 9, next_2: 9 },
  9: { id: 9, reponse_1: "(fin)", reponse_2: "(fin)", next_1: null, next_2: null },
  10: { id: 10, reponse_1: "Aux pôles de Mars, on trouve des calottes de glace.", reponse_2: "Aux pôles de Mars, on trouve des mers tropicales.", next_1: 11, next_2: 12 },
  11: { id: 11, reponse_1: "Mars possédait autrefois des rivières.", reponse_2: "Mars possédait autrefois des jungles.", next_1: 13, next_2: 13 },
  12: { id: 12, reponse_1: "Je veux parler du robot Curiosity.", reponse_2: "Je veux parler du robot Perseverance.", next_1: 15, next_2: 16 },
  13: { id: 13, reponse_1: "(fin)", reponse_2: "(fin)", next_1: null, next_2: null },
  14: { id: 14, reponse_1: "Perseverance cherche des traces de vie ancienne.", reponse_2: "Perseverance cherche des animaux vivants sur Mars.", next_1: 17, next_2: 17 },
  15: { id: 15, reponse_1: "Je veux en apprendre plus sur le Soleil.", reponse_2: "Je veux en apprendre plus sur les supernovas.", next_1: 21, next_2: 24 },
  16: { id: 16, reponse_1: "Le Soleil est principalement composé d’hydrogène.", reponse_2: "Le Soleil est principalement composé de bois en feu.", next_1: 22, next_2: 22 },
  17: { id: 17, reponse_1: "(fin)", reponse_2: "(fin)", next_1: null, next_2: null },
  18: { id: 18, reponse_1: "Une supernova est une explosion d’étoile.", reponse_2: "Une supernova est une planète.", next_1: 25, next_2: 25 },
  20: { id: 20, reponse_1: "Passons maintenant aux étoiles. Que veux-tu savoir : quelque chose sur le Soleil ou sur les supernovas ?", reponse_2: "(alt)", next_1: 21, next_2: 24 },
  21: { id: 21, reponse_1: "À ton avis, de quoi le Soleil est-il principalement composé ?", reponse_2: "(alt)", next_1: 16, next_2: 16 },
  22: { id: 22, reponse_1: "Et quel autre élément trouve-t-on aussi en grande quantité dans le Soleil ?", reponse_2: "(alt)", next_1: 23, next_2: 23 },
  23: { id: 23, reponse_1: "(fin)", reponse_2: "(fin)", next_1: null, next_2: null },
  24: { id: 24, reponse_1: "Pour toi, qu’est-ce qu’une supernova ?", reponse_2: "(alt)", next_1: 25, next_2: 25 },
  25: { id: 25, reponse_1: "(fin)", reponse_2: "(fin)", next_1: null, next_2: null },
  30: { id: 30, reponse_1: "J’adore les animaux, parlons des tours que les IA font sur les espèces.", reponse_2: "Je préfère rester sur l’espace.", next_1: 31, next_2: 25 },
  31: { id: 31, reponse_1: "Les IA hallucineront parfois sur des lions invisibles mais ici on aide à corriger.", reponse_2: "Les IA ne peuvent pas inventer des chiens volants.", next_1: 25, next_2: 25 },
};

const QUESTIONS: Record<number, Question> = {
  1: { id: 1, id_reponses: 1, text: "Bonjour ! Aujourd’hui, de quoi veux-tu parler : de l’espace ou des animaux ?" },
  2: { id: 2, id_reponses: 2, text: "Dans le thème de l’espace, qu’est-ce qui t’intéresse le plus : les planètes ou les étoiles ?" },
  3: { id: 3, id_reponses: 3, text: "Quelle planète veux-tu explorer maintenant : Jupiter ou Mars ?" },
  4: { id: 4, id_reponses: 4, text: "Jupiter est fascinante. Que veux-tu découvrir sur cette planète : ses lunes ou son atmosphère ?" },
  5: { id: 5, id_reponses: 5, text: "Parmi les lunes de Jupiter, laquelle veux-tu mieux connaître : Europe ou Io ?" },
  6: { id: 6, id_reponses: 6, text: "Selon toi, qu’est-ce qu’on trouve sous la glace d’Europe ?" },
  7: { id: 7, id_reponses: 7, text: "À ton avis, comment sont les tempêtes sur Jupiter ?" },
  8: { id: 8, id_reponses: 8, text: "D’après toi, pour quoi Io est-elle surtout connue ?" },
  9: { id: 9, id_reponses: null, text: "Exact ! La Grande Tache Rouge de Jupiter est une immense tempête géante observée depuis très longtemps." },
  10: { id: 10, id_reponses: 9, text: "Sur Mars, qu’est-ce que tu veux explorer en premier : l’eau ou les robots envoyés sur la planète ?" },
  11: { id: 11, id_reponses: 10, text: "À ton avis, que trouve-t-on aux pôles de Mars ?" },
  12: { id: 12, id_reponses: 11, text: "Selon toi, qu’est-ce que Mars possédait autrefois ?" },
  13: { id: 13, id_reponses: null, text: "Oui, c’est bien cela : Mars a eu de l’eau dans le passé, comme le montrent certaines traces observées à sa surface." },
  14: { id: 14, id_reponses: 12, text: "Quel robot martien veux-tu découvrir : Curiosity ou Perseverance ?" },
  15: { id: 15, id_reponses: 13, text: "D’après toi, à quoi sert principalement le robot Curiosity ?" },
  16: { id: 16, id_reponses: 14, text: "Selon toi, que cherche principalement le robot Perseverance ?" },
  17: { id: 17, id_reponses: null, text: "Bravo ! Les robots martiens servent notamment à étudier le sol et à collecter des échantillons pour mieux comprendre Mars." },
  20: { id: 20, id_reponses: 15, text: "Passons maintenant aux étoiles. Que veux-tu savoir : quelque chose sur le Soleil ou sur les supernovas ?" },
  21: { id: 21, id_reponses: 16, text: "À ton avis, de quoi le Soleil est-il principalement composé ?" },
  22: { id: 22, id_reponses: 17, text: "Et quel autre élément trouve-t-on aussi en grande quantité dans le Soleil ?" },
  23: { id: 23, id_reponses: null, text: "Exactement ! Plus tard dans son évolution, le Soleil deviendra une géante rouge." },
  24: { id: 24, id_reponses: 18, text: "Pour toi, qu’est-ce qu’une supernova ?" },
  25: { id: 25, id_reponses: null, text: "Oui, tout à fait ! Une supernova est une explosion d’étoile qui permet aussi de créer des éléments lourds." },
  30: { id: 30, id_reponses: 30, text: "Super, allons dans le domaine des animaux ! Quelle anomalie IA veux-tu détecter : lion invisible ou perroquets qui parlent coréen ?" },
  31: { id: 31, id_reponses: null, text: "Les IA reconnaissent mieux les espèces réelles; tout ce qui parle coréen dans la forêt est une hallucination." },
};

// Phrases qui trahissent une hallucination évidente dans les données
const HALLUCINATION_INDICATORS = [
  "mers tropicales",
  "bois en feu",
  "jungles",
  "construire une ville",
  "animaux vivants sur Mars",
  "forêts glacées",
];

export default function AiMockGame() {
  const FINAL_ID = 25;
  const [currentId, setCurrentId] = useState<number>(1);
  const [visited, setVisited] = useState<Set<number>>(new Set([1]));
  const [history, setHistory] = useState<string[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
  const [hallucinated, setHallucinated] = useState<boolean | null>(null);

  const curQ = QUESTIONS[currentId];

  const getNextUnvisited = (afterId: number): number | null => {
    const keys = Object.keys(QUESTIONS).map((k) => Number(k)).sort((a, b) => a - b);
    for (const k of keys) {
      if (k > afterId && !visited.has(k)) return k;
    }
    return null;
  };

  const markVisited = (id: number) => {
    setVisited((v) => new Set(v).add(id));
  };

  const handleTerminalQuestion = (id: number, text: string) => {
    // append IA statement
    setHistory((h) => [...h, `IA: ${text}`]);
    markVisited(id);
    // if it's the final target, finish the game
    if (id === FINAL_ID) {
      const found = HALLUCINATION_INDICATORS.some((frag) => text.toLowerCase().includes(frag));
      setFinalAnswer(text);
      setHallucinated(found);
      return;
    }

    // otherwise, continue to next unvisited question if available
    const next = getNextUnvisited(id);
    if (next) {
      setCurrentId(next);
      markVisited(next);
    } else {
      // fallback: finish with this answer
      const found = HALLUCINATION_INDICATORS.some((frag) => text.toLowerCase().includes(frag));
      setFinalAnswer(text);
      setHallucinated(found);
    }
  };

  const onChoose = (choice: 1 | 2) => {
    if (!curQ) return;
    const respSet = curQ.id_reponses ? RESPONSES[curQ.id_reponses] : null;

    // If there is no response set, treat current question as terminal
    if (!respSet) {
      handleTerminalQuestion(curQ.id, curQ.text);
      return;
    }

    const chosenText = choice === 1 ? respSet.reponse_1 : respSet.reponse_2;
    setHistory((h) => [...h, `Tu: ${chosenText}`]);
    markVisited(curQ.id);

    const nextId = choice === 1 ? respSet.next_1 : respSet.next_2;
    if (!nextId) {
      // no explicit next: treat chosen text as IA statement then continue
      handleTerminalQuestion(curQ.id, chosenText);
      return;
    }

    const nextQ = QUESTIONS[nextId];
    if (!nextQ) {
      handleTerminalQuestion(curQ.id, "(fin de la discussion)");
      return;
    }

    if (nextQ.id_reponses === null) {
      // next is a terminal AI statement; handle accordingly
      handleTerminalQuestion(nextQ.id, nextQ.text);
      return;
    }

    // continue the conversation normally
    setCurrentId(nextId);
    markVisited(nextId);
  };

  const finish = (answer: string) => {
    setFinalAnswer(answer);
    setHistory((h) => [...h, `IA: ${answer}`]);

    const found = HALLUCINATION_INDICATORS.some((frag) => answer.toLowerCase().includes(frag));
    setHallucinated(found);
  };

  const restart = () => {
    setCurrentId(1);
    setVisited(new Set([1]));
    setHistory([]);
    setFinalAnswer(null);
    setHallucinated(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-start justify-center py-12 px-6">
      <div className="max-w-3xl w-full bg-black/50 border border-white/10 rounded-3xl p-8 space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Jeu 4 — Simulation IA</h1>
        <p className="text-sm text-slate-300">Dialogue mock basé sur les données pédagogiques. À la fin, l'outil signale si l'IA a probablement halluciné.</p>

        <div className="bg-white/5 border border-white/5 rounded-xl p-6">
          <div className="space-y-4">
            {finalAnswer ? (
              <>
                <div className="text-slate-300">Conversation terminée — Réponse finale de l'IA :</div>
                <div className="text-lg font-bold">{finalAnswer}</div>
                <div className={`mt-4 inline-block px-4 py-2 rounded-full font-bold ${hallucinated ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>
                  {hallucinated ? "L'IA a halluciné" : "L'IA n'a pas halluciné"}
                </div>
              </>
            ) : (
              <>
                <div className="text-slate-200 font-semibold">{curQ?.text}</div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {curQ && curQ.id_reponses ? (
                    (() => {
                      const rs = RESPONSES[curQ.id_reponses];
                      return (
                        <>
                          <button onClick={() => onChoose(1)} className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold">
                            {rs.reponse_1}
                          </button>
                          <button onClick={() => onChoose(2)} className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold">
                            {rs.reponse_2}
                          </button>
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-slate-400">(Aucune option disponible)</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-400">Historique:</div>
          <div className="flex gap-2">
            <button onClick={restart} className="px-4 py-2 rounded-md bg-white/5 border border-white/10">Redémarrer</button>
            <Link to="/" className="px-4 py-2 rounded-md bg-white/5 border border-white/10">Retour</Link>
          </div>
        </div>

        <div className="bg-black/30 rounded-md p-4 max-h-40 overflow-auto text-sm text-slate-300">
          {history.length === 0 ? <div className="text-slate-500">Aucune interaction pour le moment.</div> : history.map((h, i) => <div key={i} className="py-1">{h}</div>)}
        </div>
      </div>
    </div>
  );
}
