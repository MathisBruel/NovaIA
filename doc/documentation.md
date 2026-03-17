## Déploiement automatique sur VPS Azure (GitHub Actions)

### Objectif

Automatiser le déploiement de l’application (backend + frontend + base MySQL via `docker-compose.yml`) sur un VPS Azure, dans le dossier `/opt/novaia`, à chaque `push` sur la branche `main`.

### Pré-requis côté VPS

- Docker et Docker Compose installés.
- Accès SSH depuis GitHub Actions (clé privée stockée en secret).
- Dossier cible créé et accessible :

```bash
sudo mkdir -p /opt/novaia
sudo chown -R $USER:$USER /opt/novaia
```

### Clé SSH de déploiement

Sur le VPS (ou sur une machine sécurisée) :

```bash
ssh-keygen -t ed25519 -C "deploy-specialweek" -f ~/.ssh/id_specialweek
```

- Ajouter la **clé publique** (par ex. `~/.ssh/id_specialweek.pub`) dans `~/.ssh/authorized_keys` de l’utilisateur qui sera utilisé par GitHub Actions (ex. `azureuser`).
- Conserver la **clé privée** pour la copier ensuite dans les *secrets* GitHub.

### Secrets GitHub à configurer

Dans le dépôt GitHub : `Settings` → `Secrets and variables` → `Actions` → `New repository secret` :

- `VPS_HOST` : IP ou nom de domaine du VPS (ex. `xx.xx.xx.xx`).
- `VPS_USERNAME` : utilisateur SSH (ex. `azureuser`).
- `VPS_PORT` : port SSH (ex. `22`).
- `VPS_SSH_KEY` : contenu complet de la **clé privée** (`id_specialweek` ou autre nom choisi).

> La clé privée ne doit jamais être commitée dans le dépôt : uniquement en secret GitHub.

### Workflow GitHub Actions

Le fichier `.github/workflows/deploy.yml` est déclenché sur chaque `push` sur `main` et :

- se connecte au VPS en SSH via l’action `appleboy/ssh-action`,
- se place dans `/opt/novaia`,
- clone le dépôt si nécessaire ou met à jour la branche `main`,
- exécute :

```bash
docker compose pull
docker compose up -d --build --remove-orphans
```

Les conteneurs définis dans `docker-compose.yml` sont ainsi reconstruits et relancés automatiquement après chaque modification poussée sur `main`.
