# Documentation des migrations SQL

Ce document décrit l'ensemble des scripts SQL présents dans le dossier `migration/`, dans leur ordre d'exécution.

## Vue d'ensemble

Les migrations sont numérotées de `01` à `11` et suivent une logique simple :

- création du schéma initial ;
- insertion des données de base pour chaque mini-jeu ;
- correctifs ciblés sur l'encodage et la structure ;
- enrichissement fonctionnel du quiz et du mode MythosIA.

Le dossier concerné est `migration/`.

## Ordre d'exécution

L'ordre est important, car plusieurs scripts dépendent des tables ou des données créées par les précédents.

1. `01_schema.sql`
2. `02_data.sql`
3. `03_chasse_anomalies.sql`
4. `04_type_question_quizz.sql`
5. `05_data_quiz_type_1.sql`
6. `06_data_quiz_type_2.sql`
7. `07_data_quiz_type_3.sql`
8. `08_swiper_info_intox.sql`
9. `09_fix_mojibake_texts.sql`
10. `10_add_question_to_quizz.sql`
11. `11_mytho_scenarios.sql`

## Détail des migrations

### 01_schema.sql

Objectif : créer le schéma relationnel initial de la base `specialweek`.

Actions réalisées :

- sélection de la base avec `USE specialweek` ;
- création des tables principales :
  - `profil`
  - `jeu_quizz`
  - `jeu_chasse_anomalies`
  - `jeu_swiper`
  - `type_question_quizz`
  - `question_mytho`
  - `reponse_mytho`
- création des clés étrangères :
  - `jeu_quizz.type_question` vers `type_question_quizz.id`
  - `question_mytho.id_reponses` vers `reponse_mytho.id`
  - `reponse_mytho.question_answer_1` vers `question_mytho.id`
  - `reponse_mytho.question_answer_2` vers `question_mytho.id`

Remarques :

- cette migration pose toute la structure métier du projet ;
- le couple `question_mytho` / `reponse_mytho` est circulaire, ce qui explique l'usage ultérieur de `FOREIGN_KEY_CHECKS=0` dans les scripts de données.

### 02_data.sql

Objectif : initialiser le contenu du jeu `MythosIA` avec un grand arbre de dialogue.

Actions réalisées :

- désactivation temporaire des contraintes de clés étrangères ;
- purge des tables `question_mytho` et `reponse_mytho` ;
- insertion d'un premier scénario conversationnel arborescent couvrant plusieurs thèmes :
  - espace
  - animaux
  - Jupiter
  - Mars
  - Soleil
  - supernovas
  - pieuvres
  - oiseaux
- réactivation des contraintes de clés étrangères.

Effet fonctionnel :

- le mode `MythosIA` dispose d'un scénario principal navigable avec embranchements ;
- chaque réponse renvoie vers deux nœuds suivants, ce qui forme un parcours pédagogique.

Remarques :

- les colonnes `est_coherent` sont utilisées pour distinguer les affirmations fiables des éventuelles hallucinations ;
- dans cette migration, les nœuds intermédiaires de choix ont souvent `NULL`, tandis que les affirmations pédagogiques sont marquées `TRUE`.

### 03_chasse_anomalies.sql

Objectif : remplir le jeu `Chasse aux anomalies`.

Actions réalisées :

- activation explicite de l'encodage `utf8mb4` ;
- insertion de 10 entrées dans `jeu_chasse_anomalies`.

Contenu inséré :

- un chemin d'image dans `public/assets/img/anomalies/` ;
- un titre d'anomalie ;
- des coordonnées JSON décrivant la zone à détecter ;
- une explication pédagogique ;
- un score de `10` points par anomalie.

Exemples d'anomalies :

- source lumineuse incohérente ;
- éventail incohérent ;
- poignée détachée ;
- patte déformée ;
- doigt supplémentaire ;
- duplication d'objet.

Effet fonctionnel :

- le mini-jeu peut charger ses images et valider la détection d'une zone précise sur chaque image.

### 04_type_question_quizz.sql

Objectif : définir les catégories de questions du quiz.

Actions réalisées :

- insertion de 3 types dans `type_question_quizz` :
  - `1 = QCM`
  - `2 = Vrai/Faux`
  - `3 = Image (Réel vs IA)`

Effet fonctionnel :

- ces types servent de référence à la table `jeu_quizz` via la clé étrangère `type_question`.

### 05_data_quiz_type_1.sql

Objectif : alimenter le quiz avec les questions de type `QCM`.

Actions réalisées :

- insertion d'un large jeu de données dans `jeu_quizz` avec `type_question = 1`.

Structure des lignes :

- `media_url` souvent `NULL` ;
- quatre options de réponse ;
- un booléen `reponse_correcte` ;
- une explication ;
- `10` points accordés.

Thèmes couverts :

- IA générative ;
- deepfakes ;
- désinformation ;
- esprit critique ;
- vérification des sources ;
- bulles informationnelles ;
- biais algorithmiques ;
- réseaux sociaux ;
- phishing ;
- détection d'images générées.

Remarque importante :

- cette migration constitue le stock initial des QCM, mais plusieurs libellés ou bonnes réponses ont ensuite été corrigés dans `10_add_question_to_quizz.sql`.

### 06_data_quiz_type_2.sql

Objectif : alimenter le quiz avec les questions `Vrai/Faux`.

Actions réalisées :

- insertion d'un volume important d'entrées dans `jeu_quizz` avec `type_question = 2` ;
- les options sont standardisées sur `Vrai` et `Faux`.

Caractéristiques :

- chaque ligne contient un énoncé à évaluer ;
- l'explication contient la justification pédagogique ;
- le champ `reponse_correcte` encode la bonne valeur ;
- le score est fixé à `10` points.

Thématiques dominantes :

- fiabilité de l'information ;
- usage de l'IA dans la désinformation ;
- influence des réseaux sociaux ;
- biais, manipulation et bulles informationnelles ;
- vérification des sources ;
- éducation aux médias et à la littératie numérique.

Remarque :

- avant la migration `10`, cette table ne possédait pas encore de colonne `question`, donc l'énoncé était implicitement porté par `explication` pour ce type de quiz.

### 07_data_quiz_type_3.sql

Objectif : ajouter les questions de quiz basées sur des images `Réel vs IA`.

Actions réalisées :

- insertion d'un grand nombre d'entrées dans `jeu_quizz` avec `type_question = 3`.

Structure des lignes :

- `media_url` pointe vers des images situées sous `public/assets/img/quizz/AI/` ;
- les choix sont standardisés sur `Réel` et `IA` ;
- `reponse_correcte` indique si l'image est authentique ou générée ;
- `explication` explique le raisonnement attendu ;
- `points_accordes` vaut `10`.

Effet fonctionnel :

- le joueur doit apprendre à repérer les indices typiques d'une image générée :
  - mains ou doigts incohérents ;
  - reflets impossibles ;
  - textes illisibles ;
  - géométries absurdes ;
  - proportions biologiques anormales.

Remarque :

- cette migration complète le quiz avec une modalité visuelle, distincte des QCM et du Vrai/Faux.

### 08_swiper_info_intox.sql

Objectif : initialiser le jeu `Swiper` avec des publications fiables et trompeuses.

Actions réalisées :

- insertion de plusieurs posts dans `jeu_swiper` ;
- séparation logique entre deux familles de contenu :
  - `info/` pour les contenus considérés fiables ;
  - `intox/` pour les contenus trompeurs ou faux.

Structure des données :

- `image_post_url` pointe vers une image de post ;
- `est_fiable` vaut `true` ou `false` ;
- `explication` justifie la classification ;
- `points_accordes` vaut `10`.

Exemples de sujets fiables :

- aide de l'IA au diagnostic médical ;
- découverte de médicaments ;
- impact du plastique ;
- accessibilité des deepfakes ;
- usage de l'IA pour générer musique et poèmes.

Exemples d'intox :

- puces dans les vaccins ;
- négation du réchauffement climatique ;
- vaccins ARN qui modifieraient l'ADN ;
- écrans causant le cancer du cerveau ;
- IA qui aurait prédit la COVID.

Effet fonctionnel :

- le mini-jeu `Swiper` peut proposer des cartes à classer en information fiable ou intox.

### 09_fix_mojibake_texts.sql

Objectif : corriger les problèmes d'encodage de type mojibake apparus dans certaines données textuelles.

Actions réalisées :

- correction du libellé du type de question `id = 3` dans `type_question_quizz` ;
- conversion des colonnes textuelles de `jeu_quizz` ;
- conversion de `explication` dans `jeu_swiper` ;
- conversion de `titre_image` et `explication` dans `jeu_chasse_anomalies`.

Technique utilisée :

- reconversion via `CONVERT(... USING latin1)` puis `... USING utf8mb4` ;
- encapsulation dans `COALESCE` pour éviter d'écraser une valeur `NULL` avec `NULL`.

Effet fonctionnel :

- correction des caractères accentués mal interprétés ;
- affichage propre des textes français dans le front.

### 10_add_question_to_quizz.sql

Objectif : faire évoluer la structure du quiz pour stocker explicitement l'énoncé de chaque question, puis corriger plusieurs incohérences de contenu.

Actions structurelles :

- ajout de la colonne `question` à `jeu_quizz` avec une valeur par défaut temporaire ;
- peuplement de cette colonne selon le type de question ;
- suppression de la valeur par défaut une fois les données remplies.

Règles de remplissage :

- type `2` (`Vrai/Faux`) : la colonne `question` reçoit l'ancienne `explication`, utilisée comme énoncé ;
- type `3` (`Réel vs IA`) : chaque ligne reçoit la question générique `Cette image est-elle Réelle ou générée par une IA ?` ;
- type `1` (`QCM`) : chaque entrée reçoit un libellé explicite via une série de `UPDATE` ciblés.

Corrections métier apportées :

- correction de plusieurs `reponse_correcte` erronés dans les QCM ;
- clarification de certaines formulations de questions ;
- correction d'un cas où les options ont été permutées pour remettre la bonne réponse en cohérence ;
- ajustement plus précis de certaines définitions, par exemple autour des fake news visuelles ou du phishing.

Effet fonctionnel :

- le front n'a plus besoin d'inférer l'énoncé depuis d'autres colonnes ;
- les questions affichées deviennent plus lisibles et les réponses plus cohérentes.

Point d'attention :

- pour les questions `Vrai/Faux`, cette migration réemploie le contenu de `explication` comme base d'énoncé, ce qui traduit une évolution du modèle de données en cours de projet.

### 11_mytho_scenarios.sql

Objectif : enrichir `MythosIA` avec quatre scénarios supplémentaires jouables.

Actions réalisées :

- désactivation temporaire des contraintes de clés étrangères ;
- insertion de nouveaux nœuds dans `reponse_mytho` et `question_mytho` ;
- réactivation des contraintes.

Scénarios ajoutés :

- `100-103` : astronomie, avec hallucination finale ;
- `110-113` : biologie marine, sans hallucination ;
- `120-123` : histoire et inventions, avec hallucination finale ;
- `130-133` : corps humain, sans hallucination.

Principe pédagogique :

- 2 scénarios contiennent volontairement une affirmation fausse ;
- 2 scénarios sont entièrement cohérents ;
- la colonne `est_coherent` permet au jeu d'indiquer si le joueur a correctement repéré une hallucination.

Exemples d'hallucinations volontairement insérées :

- Mars présentée comme troisième planète du Système solaire ;
- Alexander Graham Bell crédité pour l'invention de l'ampoule.

Effet fonctionnel :

- le mode `MythosIA` gagne plusieurs parties courtes, ciblées, adaptées à la détection d'erreurs factuelles.

## Résumé par table impactée

### profil

- créée dans `01_schema.sql` ;
- aucune donnée insérée par les migrations fournies.

### type_question_quizz

- créée dans `01_schema.sql` ;
- alimentée dans `04_type_question_quizz.sql` ;
- corrigée sur l'encodage dans `09_fix_mojibake_texts.sql`.

### jeu_quizz

- créée dans `01_schema.sql` ;
- alimentée par `05_data_quiz_type_1.sql`, `06_data_quiz_type_2.sql` et `07_data_quiz_type_3.sql` ;
- corrigée sur l'encodage dans `09_fix_mojibake_texts.sql` ;
- enrichie avec la colonne `question` et corrigée métier dans `10_add_question_to_quizz.sql`.

### jeu_chasse_anomalies

- créée dans `01_schema.sql` ;
- alimentée par `03_chasse_anomalies.sql` ;
- corrigée sur l'encodage dans `09_fix_mojibake_texts.sql`.

### jeu_swiper

- créée dans `01_schema.sql` ;
- alimentée par `08_swiper_info_intox.sql` ;
- corrigée sur l'encodage dans `09_fix_mojibake_texts.sql`.

### question_mytho / reponse_mytho

- créées dans `01_schema.sql` ;
- alimentées une première fois par `02_data.sql` ;
- enrichies avec de nouveaux scénarios dans `11_mytho_scenarios.sql`.

## Points techniques à retenir

- les migrations mélangent création de schéma, seed de données et correctifs ;
- l'application dépend fortement de données initiales pour rendre les mini-jeux jouables ;
- les scripts `02` et `11` désactivent temporairement les contraintes de clés étrangères à cause de la relation circulaire entre questions et réponses de `MythosIA` ;
- `09` est un script de réparation après import ;
- `10` est la migration la plus structurante après le schéma initial, car elle modifie le modèle de `jeu_quizz` et corrige une partie du contenu existant.

## Suggestion d'usage

Si vous ajoutez une nouvelle migration, gardez la même convention :

- préfixe numérique croissant ;
- objectif unique ou clairement identifiable ;
- compatibilité avec les données déjà présentes ;
- script idempotent si possible pour les modifications de structure.