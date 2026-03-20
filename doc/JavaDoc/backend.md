# Documentation Java - Backend Special Week

## Vue d'ensemble
- Application Spring Boot exposee sous `/api`.
- Modules: controllers (API REST), services (logique), repositories (JPA), domain (entites JPA), config (OpenAPI + CORS).

## Entree principale
- `SpecialWeekApplication` demarre l'application Spring Boot.

## Configuration
### OpenAPI
- Titre: Special Week API
- Description: API pour la gamification, les comptes et les jeux Special Week
- Version: 1.0.0

### CORS
- Origines autorisees:
  - http://localhost:5173
  - http://novaia.mathisbruel.fr
  - https://novaia.mathisbruel.fr
- Methodes: GET, POST, PUT, DELETE, OPTIONS
- Headers: *

## API REST
Base path: `/api`

### Health
**Controleur:** `HealthController`
- `GET /health`
  - Reponse: `{ "status": "OK" }`

### Comptes
**Controleur:** `ProfilController`
**Base path:** `/accounts`

| Methode | Endpoint | Description | Reponse |
| --- | --- | --- | --- |
| GET | `/accounts` | Lister tous les comptes | `List<Profil>` |
| GET | `/accounts/{id}` | Recuperer un compte par id | `Profil` ou 404 |
| POST | `/accounts` | Creer un compte | `Profil` (201) |
| PUT | `/accounts/{id}` | Mettre a jour un compte | `Profil` ou 404 |
| DELETE | `/accounts/{id}` | Supprimer un compte | 204 |
| POST | `/accounts/{id}/add-points?delta=INT` | Ajouter des points | `Profil` ou 404 |

### Jeux
**Controleur:** `JeuController`
**Base path:** `/games`

#### Quizz
| Methode | Endpoint | Description | Reponse |
| --- | --- | --- | --- |
| GET | `/games/quizz/types` | Lister les types de questions | `List<TypeQuestionQuizz>` |
| GET | `/games/quizz` | Lister les jeux quizz | `List<JeuQuizz>` |
| GET | `/games/quizz/{id}` | Recuperer un quizz | `JeuQuizz` ou 404 |
| POST | `/games/quizz` | Creer / mettre a jour un quizz | `JeuQuizz` (201) |
| DELETE | `/games/quizz/{id}` | Supprimer un quizz | 204 |

#### Chasse aux anomalies
| Methode | Endpoint | Description | Reponse |
| --- | --- | --- | --- |
| GET | `/games/anomalies` | Lister les jeux anomalies | `List<JeuChasseAnomalies>` |
| GET | `/games/anomalies/{id}` | Recuperer un jeu anomalies | `JeuChasseAnomalies` ou 404 |
| POST | `/games/anomalies` | Creer / mettre a jour un jeu anomalies | `JeuChasseAnomalies` (201) |
| DELETE | `/games/anomalies/{id}` | Supprimer un jeu anomalies | 204 |

#### Swiper
| Methode | Endpoint | Description | Reponse |
| --- | --- | --- | --- |
| GET | `/games/swiper` | Lister les jeux swiper | `List<JeuSwiper>` |
| GET | `/games/swiper/{id}` | Recuperer un jeu swiper | `JeuSwiper` ou 404 |
| POST | `/games/swiper` | Creer / mettre a jour un jeu swiper | `JeuSwiper` (201) |
| DELETE | `/games/swiper/{id}` | Supprimer un jeu swiper | 204 |

#### Mytho
| Methode | Endpoint | Description | Reponse |
| --- | --- | --- | --- |
| GET | `/games/mytho/questions` | Lister les questions mytho | `List<QuestionMytho>` |
| GET | `/games/mytho/questions/{id}` | Recuperer une question mytho | `QuestionMytho` ou 404 |
| POST | `/games/mytho/questions` | Creer / mettre a jour une question mytho | `QuestionMytho` (201) |
| DELETE | `/games/mytho/questions/{id}` | Supprimer une question mytho | 204 |
| GET | `/games/mytho/reponses` | Lister les reponses mytho | `List<ReponseMytho>` |
| GET | `/games/mytho/reponses/{id}` | Recuperer une reponse mytho | `ReponseMytho` ou 404 |
| POST | `/games/mytho/reponses` | Creer / mettre a jour une reponse mytho | `ReponseMytho` (201) |
| DELETE | `/games/mytho/reponses/{id}` | Supprimer une reponse mytho | 204 |

## Services
### ProfilService
- `findAll()` : liste tous les profils
- `findById(Integer id)` : retourne un profil optionnel
- `create(Profil profil)` : cree un profil (force l'id a null)
- `update(Integer id, Profil updated)` : met a jour prenom, nom, mail, motDePasse, points
- `delete(Integer id)` : supprime par id
- `addPoints(Integer id, int delta)` : ajoute delta aux points

### JeuService
- Types quizz: `findAllTypesQuizz()`
- Quizz: `findAllJeuxQuizz()`, `findJeuQuizzById()`, `saveJeuQuizz()`, `deleteJeuQuizz()`
- Anomalies: `findAllJeuxAnomalies()`, `findJeuAnomaliesById()`, `saveJeuAnomalies()`, `deleteJeuAnomalies()`
- Swiper: `findAllJeuxSwiper()`, `findJeuSwiperById()`, `saveJeuSwiper()`, `deleteJeuSwiper()`
- Mytho questions: `findAllQuestionsMytho()`, `findQuestionMythoById()`, `saveQuestionMytho()`, `deleteQuestionMytho()`
- Mytho reponses: `findAllReponsesMytho()`, `findReponseMythoById()`, `saveReponseMytho()`, `deleteReponseMytho()`

> Tous les services sont `@Transactional`.

## Domain (entites JPA)
### Profil (table `profil`)
- `id` (PK, auto)
- `prenom` (String, 50, not null)
- `nom` (String, 50, not null)
- `mail` (String, 100, unique, not null)
- `motDePasse` (String, 50, not null)
- `points` (Integer, not null)

### TypeQuestionQuizz (table `type_question_quizz`)
- `id` (PK, auto)
- `name` (String, 255, not null)

### JeuQuizz (table `jeu_quizz`)
- `id` (PK, auto)
- `typeQuestion` (ManyToOne -> `TypeQuestionQuizz`, not null)
- `mediaUrl` (String, 255)
- `optionA` (String, 255, not null)
- `optionB` (String, 255, not null)
- `optionC` (String, 255)
- `optionD` (String, 255)
- `reponseCorrecte` (Boolean, not null)
- `question` (String, 500, not null)
- `explication` (String, 255, not null)
- `pointsAccordes` (Integer, not null)

### JeuChasseAnomalies (table `jeu_chasse_anomalies`)
- `id` (PK, auto)
- `imageUrl` (LOB, not null)
- `titreImage` (String, 255, not null)
- `coordonnesAnomalieJson` (String, not null)
- `explication` (String, 255, not null)
- `pointsAccordes` (Integer, not null)

### JeuSwiper (table `jeu_swiper`)
- `id` (PK, auto)
- `imagePostUrl` (LOB, not null)
- `estFiable` (Boolean, not null)
- `explication` (String, 255, not null)
- `pointsAccordes` (Integer, not null)

### QuestionMytho (table `question_mytho`)
- `id` (PK, auto)
- `reponses` (ManyToOne -> `ReponseMytho`, join `id_reponses`)
- `question` (String, 255, not null)
- `estCoherent` (Boolean)

### ReponseMytho (table `reponse_mytho`)
- `id` (PK, auto)
- `reponse1` (String, 255, not null)
- `reponse2` (String, 255, not null)
- `questionAnswer1` (OneToOne -> `QuestionMytho`, join `question_answer_1`)
- `questionAnswer2` (OneToOne -> `QuestionMytho`, join `question_answer_2`)

> `QuestionMytho` et `ReponseMytho` utilisent `@JsonIgnoreProperties` pour eviter les boucles JSON.

## Repositories
Tous les repositories etendent `JpaRepository<Entite, Integer>`.

- `ProfilRepository` + `findByMail(String mail)`
- `JeuQuizzRepository`
- `JeuChasseAnomaliesRepository`
- `JeuSwiperRepository`
- `QuestionMythoRepository`
- `ReponseMythoRepository`
- `TypeQuestionQuizzRepository`
