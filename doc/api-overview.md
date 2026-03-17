# Special Week – Documentation API

## Accès Swagger / OpenAPI

- UI Swagger : `http://localhost:8080/swagger-ui/index.html`
- Spécification OpenAPI : `http://localhost:8080/v3/api-docs`

## Espaces fonctionnels

- Comptes / Gamification : `/api/accounts`
- Jeux : `/api/games`
- Santé de l'API : `/api/health`

## Comptes / Gamification (`/api/accounts`)

- `GET /api/accounts`  
  Liste tous les profils.

- `GET /api/accounts/{id}`  
  Récupère un profil par identifiant.

- `POST /api/accounts`  
  Crée un profil.  
  Corps JSON :
  - `prenom` (string)
  - `nom` (string)
  - `mail` (string)
  - `motDePasse` (string)
  - `points` (integer)

- `PUT /api/accounts/{id}`  
  Met à jour un profil.

- `DELETE /api/accounts/{id}`  
  Supprime un profil.

- `POST /api/accounts/{id}/add-points?delta={points}`  
  Ajoute des points au profil (gamification).

## Jeux – Quizz (`/api/games/quizz`)

- `GET /api/games/quizz/types`  
  Liste les types de questions.

- `GET /api/games/quizz`  
  Liste les entrées de quizz.

- `GET /api/games/quizz/{id}`  
  Récupère une entrée de quizz.

- `POST /api/games/quizz`  
  Crée ou met à jour une entrée de quizz.

- `DELETE /api/games/quizz/{id}`  
  Supprime une entrée de quizz.

## Jeux – Chasse aux anomalies (`/api/games/anomalies`)

- `GET /api/games/anomalies`  
  Liste les jeux de chasse aux anomalies.

- `GET /api/games/anomalies/{id}`  
  Récupère un jeu de chasse aux anomalies.

- `POST /api/games/anomalies`  
  Crée ou met à jour un jeu.

- `DELETE /api/games/anomalies/{id}`  
  Supprime un jeu.

## Jeux – Swiper (`/api/games/swiper`)

- `GET /api/games/swiper`  
  Liste les jeux swiper.

- `GET /api/games/swiper/{id}`  
  Récupère un jeu swiper.

- `POST /api/games/swiper`  
  Crée ou met à jour un jeu swiper.

- `DELETE /api/games/swiper/{id}`  
  Supprime un jeu swiper.

## Jeux – Mytho (`/api/games/mytho`)

- `GET /api/games/mytho/questions`  
  Liste les questions.

- `GET /api/games/mytho/questions/{id}`  
  Récupère une question.

- `POST /api/games/mytho/questions`  
  Crée ou met à jour une question.

- `DELETE /api/games/mytho/questions/{id}`  
  Supprime une question.

- `GET /api/games/mytho/reponses`  
  Liste les réponses.

- `GET /api/games/mytho/reponses/{id}`  
  Récupère une réponse.

- `POST /api/games/mytho/reponses`  
  Crée ou met à jour une réponse.

- `DELETE /api/games/mytho/reponses/{id}`  
  Supprime une réponse.

