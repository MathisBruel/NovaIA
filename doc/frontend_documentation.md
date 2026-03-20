# Documentation Frontend - NovaIA Special Week

## 🛠 Stack Technique
- **Framework** : React 18 avec TypeScript
- **Bundler** : Vite (Rapide et optimisé)
- **Styles** : TailwindCSS (Utility-first CSS)
- **Routage** : React Router DOM
- **Rendu 3D** : `@react-three/fiber` et `@react-three/drei` (Basé sur Three.js)
- **Animations** : SDK Framer Motion (Utilisé intensivement pour l'UI des jeux)
- **Icônes** : Lucide React

## 📂 Architecture et Routage
Le front-end s'articule autour du fichier principal `App.tsx` qui gère le layout et la navigation.

### 1. La Navigation Immersive (Le Hub 3D)
La page d'accueil intègre une impressionnante application 3D baptisée **SumSum**. 
- L'utilisateur visualise un univers composé de plusieurs planètes (`PlanetModel`) chargeant dynamiquement des `.obj` et `.mtl`.
- La caméra et la navigation au clavier guident l'utilisateur spatialement vers le niveau souhaité. 

### 2. Le Système de Layout
Le portail sépare visuellement le menu principal et les jeux :
- **MainLayout** : Enveloppe classique avec `<Navbar />` et `<Footer />` pour les pages vitrines (`/`, `/login`, `/register`, `/profile`).
- **Mode Plein Écran** : Les routes `/game/:id` échappent délibérément au MainLayout pour offrir une immersion totale sans interférence de l'interface de navigation globale.

## 🎮 Les Mini-Jeux
Chaque module de jeu possède son composant propre et sa logique d'état. L'architecture supporte actuellement 4 environnements :
1. **Jeu 1 - Swiper (Info ou Intox)** : S'inspire de Tinder. Les cartes (`SwipeCard`) utilisent `useMotionValue` de Framer-Motion pour calculer les seuils de glissement. Le feedback coloré (Vert/Rouge) confirme la justesse du choix de l'utilisateur.
2. **Jeu 2 - Chasseur d'anomalies**
3. **Jeu 3 - Quizz**
4. **Jeu 4 - Mythos IA**

## 🌐 Communication avec le Backend
L'application communique avec l'API exposée par Spring Boot.
- L'URI de base de l'API est dynamiquement récupérée via les variables d'environnement (`VITE_API_BASE_URL`).
- Le contexte d'authentification (`AuthContext` / `useAuth`) enveloppe l'application entière pour protéger les routes et conditionner les informations d'utilisateur (Profil, JWT ou Session, etc.).
