# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Special Week** is a French educational gamification platform with an immersive 3D spaceship hub and four mini-games focused on AI literacy and misinformation awareness. The stack is: React + TypeScript frontend, Spring Boot backend, MySQL database, all orchestrated via Docker Compose.

## Commands

### Local Development

**Backend** (Java 17 / Spring Boot / Gradle):
```bash
cd backend
./gradlew bootRun          # Dev server on port 8080
./gradlew clean bootJar    # Build JAR
./gradlew test             # Run tests
```

**Frontend** (React + Vite):
```bash
cd frontend
npm install --legacy-peer-deps   # Required flag for peer dep conflicts
npm run dev                       # Dev server on port 5173
npm run build
```

**Full stack via Docker:**
```bash
docker compose up --build         # Start all services
docker compose up -d --build      # Detached
```

### Environment

- Frontend proxy: `/api/*` → `http://backend:8080` (configured in `vite.config.ts`)
- Local dev URL: `http://localhost:5173`
- Production: `novaia.mathisbruel.fr` (Azure VPS, deployed via GitHub Actions on push to `main`)
- DB credentials (local): root/root, user: specialweek/specialweek

## Architecture

### Backend (`backend/src/main/java/fr/novaia/specialweek/`)

Standard Spring Boot layering: `controller/` → `service/` → `repository/` → `domain/`

**Domain entities:**
- `Profil` — user accounts (firstName, lastName, email, password, points)
- `JeuQuizz` — multiple-choice quiz questions
- `JeuChasseAnomalies` — spot-the-difference game
- `JeuSwiper` — swipe left/right credibility game
- `QuestionMytho` / `ReponseMytho` — myth vs truth game
- `TypeQuestionQuizz` — quiz question type classifier

**Key API routes** (all under `/api/`):
- `GET /health` — health check
- `/accounts` — user CRUD + `POST /{id}/add-points`
- `/games/quizz`, `/games/anomalies`, `/games/swiper`, `/games/mytho/*` — game data CRUD

CORS is configured in `OpenApiConfig.java` to allow `localhost:5173` and `novaia.mathisbruel.fr`.

### Frontend (`frontend/src/`)

- **Auth**: `AuthContext` stores the logged-in user in localStorage; wraps the whole app
- **Routing**: React Router DOM v7; main routes are `/`, `/login`, `/register`, `/profile`, `/game/:zoneId`
- **Home (`App.tsx`)**: 3D spaceship hub built with React Three Fiber + Three.js; zones selectable via keyboard (Q/D, arrows) or click; cinematic warp animation on zone selection
- **Games**: `Game.tsx` dynamically loads the correct game component based on `zoneId` from the URL
- **Styling**: Tailwind CSS v4 + Framer Motion for animations

### Database (`migration/`)

SQL files run in order at container startup:
- `01_schema.sql` — table definitions (utf8mb4_unicode_ci throughout)
- `02` to `08` — seed data for each game type (~89KB total)
- `09_fix_mojibake_texts.sql` — encoding corrections

## Workflow

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules that prevent the same mistake from recurring
- Review lessons at session start for the relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- Skip this for simple, obvious fixes — don't over-engineer

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Point at logs, errors, failing tests — then resolve them.

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
