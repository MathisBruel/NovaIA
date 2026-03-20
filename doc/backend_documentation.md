# Documentation Backend - NovaIA Special Week

## 🛠 Stack Technique
- **Langage** : Java (17+)
- **Framework** : Spring Boot 3
- **Conteneur** : Docker & Docker Compose
- **Gestionnaire de dépendances** : Gradle
- **Base de données** : MySQL 8.4
- **ORM** : Hibernate / Spring Data JPA

## 📂 Architecture Logicielle (MVC RESTful)
Le backend est architecturé selon des composants en couches classiques, localisés dans le package `fr.novaia.specialweek` :

### 1. Controllers (`/controller`)
Exposent les endpoints (API REST) que le frontend Vite appelle.
- Gèrent la réception des requêtes (ex: `GET /api/games/swiper`).
- Valident les données d'entrée et délèguent le traitement aux Services.

### 2. Services (`/service`)
Contiennent l'ensemble de la logique métier.
- C'est ici que l'on vérifie si une réponse est correcte, que l'on calcule les scores et qu'on manipule la logique structurelle des différents mini-jeux avant persistance.

### 3. Repositories (`/repository`)
Fournissent les interfaces communiquant avec MySQL.
- S'étendent généralement de `JpaRepository` pour offrir d'emblée l'accès CRUD et gérer la pagination sans code manuel redondant.

### 4. Entités / Domains (`/domain`)
Classes annotées avec `@Entity` représentant formellement les tables de la base de données.
- Exemple : `JeuSwiper` qui se mappe sur la table MySQL `jeu_swiper` en respectant strictement l'encodage et les modèles de données.

## 🗄️ Base de données & Docker
L'application est orchestrée avec `docker-compose.yml` couplant un service `backend`, un service `frontend`, et un service de base de données `db`.

- **Modélisation** : Plutôt que de confier la création de la base de données au module Auto-DDL d'Hibernate, le projet s'appuie sur des scripts explicites (`migration/*.sql`).
- **Initialisation sécurisée** : Au démarrage conteneurisé du serveur MySQL, les données sont insérées et vérifiées. **`SET NAMES utf8mb4;`** y est strictement défini pour empêcher tout problème d'encodage (accents) entre la base de données, la connexion JDBC et le serveur Tomcat/Spring Boot.
- **Connexion** : Fixée et optimisée dans l' `application.yml` pour que l'encodage URL, *HikariCP* et les règles de nommage (`PhysicalNamingStrategyStandardImpl`) cohabitent parfaitement.
