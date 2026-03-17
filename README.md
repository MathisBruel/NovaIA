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

## Déploiement automatique sur un VPS Azure (GitHub Actions)

Le projet peut être déployé automatiquement sur un VPS via GitHub Actions et Docker Compose.

### Préparation du VPS

- Installer Docker et Docker Compose (plugin Docker récent).
- Créer le dossier `/opt/novaia` et lui donner les droits à l’utilisateur qui fera tourner Docker :

```bash
sudo mkdir -p /opt/novaia
sudo chown -R $USER:$USER /opt/novaia
```

- Depuis le VPS, générer une paire de clés SSH dédiée au déploiement (si besoin) :

```bash
ssh-keygen -t ed25519 -C "deploy-specialweek" -f ~/.ssh/id_specialweek
```

- Autoriser cette clé sur le VPS (si elle n’est pas déjà dans `~/.ssh/authorized_keys`).

### Configuration côté GitHub

Dans les **Secrets & variables** du dépôt GitHub (`Settings` → `Secrets and variables` → `Actions` → `New repository secret`), ajouter :

- `VPS_HOST` : adresse ou IP du VPS (ex. `xx.xx.xx.xx`).
- `VPS_USERNAME` : utilisateur SSH (ex. `azureuser`).
- `VPS_PORT` : port SSH (ex. `22`).
- `VPS_SSH_KEY` : **clé privée** SSH (contenu du fichier `~/.ssh/id_specialweek` ou équivalent) du compte utilisé pour se connecter au VPS.

> Attention : ne jamais committer la clé privée dans le dépôt. Elle doit uniquement être stockée dans les *secrets* GitHub.

### Premier déploiement manuel sur le VPS

Sur le VPS, cloner le dépôt une première fois dans `/opt/novaia` (le workflow se basera ensuite dessus) :

```bash
cd /opt/novaia
git clone https://github.com/<votre-organisation>/<votre-repo>.git .
git checkout main
docker compose up -d --build
```

### Déploiement automatique

Un workflow GitHub Actions est défini dans `.github/workflows/deploy.yml`.  
À chaque `push` sur la branche `main` :

- GitHub Actions se connecte au VPS via SSH.
- Met à jour le code dans `/opt/novaia` (pull sur `main`).
- Relance les conteneurs avec `docker compose up -d --build --remove-orphans`.

Le backend et le frontend sont alors servis par les conteneurs Docker définis dans `docker-compose.yml` sur le VPS.

