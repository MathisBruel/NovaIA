# Special Week – Architecture Front / Back

## Structure du projet

- `backend/` : API REST Spring Boot (Java 17, Gradle)
- `frontend/` : application React (TypeScript, Vite)

## Prérequis

- Java 17+
- Gradle (ou wrapper `gradlew`)
- Node.js (version LTS recommandée)
- Docker (si utilisation des conteneurs)

## Démarrer le backend

```bash
cd backend
./gradlew bootRun
```

L’API est alors disponible sur `http://localhost:8080` (exemple d’endpoint : `GET /api/health`).

## Démarrer le frontend

```bash
cd frontend
npm install
npm run dev
```

Le front est alors disponible sur `http://localhost:5173`.

Les appels à `/api/...` sont automatiquement proxifiés vers le backend (`http://localhost:8080`) via la configuration Vite.

## Lancer l'application avec Docker

À la racine du projet :

```bash
docker compose up --build
```

- Backend : `http://localhost:8080` (`GET /api/health`)
- Frontend : `http://localhost:5173`

