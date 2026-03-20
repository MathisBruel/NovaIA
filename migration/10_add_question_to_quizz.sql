USE specialweek;
SET NAMES utf8mb4;

-- Ajout de la colonne question à jeu_quizz
ALTER TABLE jeu_quizz ADD COLUMN question VARCHAR(500) NOT NULL DEFAULT '';

-- Type 2 (Vrai/Faux) : l'explication IS l'énoncé à évaluer
UPDATE jeu_quizz SET question = explication WHERE type_question = 2;

-- Type 3 (Image IA/Réel) : question générique
UPDATE jeu_quizz SET question = 'Cette image est-elle Réelle ou générée par une IA ?' WHERE type_question = 3;

-- Type 1 (QCM) : une question par ligne, identifiée par option_a
UPDATE jeu_quizz SET question = 'Quel est le principal usage des IA génératives comme ChatGPT et Dall-E ?' WHERE type_question = 1 AND option_a = 'Créer du contenu réaliste';
UPDATE jeu_quizz SET question = 'Quel danger représente principalement l''IA pour la désinformation ?' WHERE type_question = 1 AND option_a = 'Elle enrichit toujours l''information';
UPDATE jeu_quizz SET question = 'Qu''est-ce qu''un deepfake ?' WHERE type_question = 1 AND option_a = 'Une vidéo montrant la réalité altérée par IA';
UPDATE jeu_quizz SET question = 'Comment peut-on détecter qu''une image a été générée par IA ?' WHERE type_question = 1 AND option_a = 'En observant une photo 48h après sa prise';
UPDATE jeu_quizz SET question = 'Qui peut être victime de deepfakes ?' WHERE type_question = 1 AND option_a = 'Les deepfakes ne concernent que les célébrités';
UPDATE jeu_quizz SET question = 'Que signifie avoir un esprit critique face à une information ?' WHERE type_question = 1 AND option_a = 'Vérifier les sources officielles';
UPDATE jeu_quizz SET question = 'Quelle est la limite de l''IA pour détecter les deepfakes ?' WHERE type_question = 1 AND option_a = 'Elle aide à vérifier les fausses images rapidement';
UPDATE jeu_quizz SET question = 'Que faut-il faire avant de partager une information ?' WHERE type_question = 1 AND option_a = 'Tweeter sans réfléchir';
UPDATE jeu_quizz SET question = 'Comment fonctionnent les algorithmes des réseaux sociaux ?' WHERE type_question = 1 AND option_a = 'Les algorithmes affichent ce que l''utilisateur aime';
UPDATE jeu_quizz SET question = 'Qu''est-ce qu''une bulle de filtre ?' WHERE type_question = 1 AND option_a = 'Des bulles de filtre créées par les algorithmes';
UPDATE jeu_quizz SET question = 'Comment peut-on briser sa bulle informationnelle ?' WHERE type_question = 1 AND option_a = 'Favoriser la diversité des sources';
UPDATE jeu_quizz SET question = 'Comment les biais peuvent-ils apparaître dans les systèmes d''IA ?' WHERE type_question = 1 AND option_a = 'Les biais humains ne s''appliquent pas à l''IA';
UPDATE jeu_quizz SET question = 'Quel problème existe avec les partenariats entre influenceurs et marques ?' WHERE type_question = 1 AND option_a = 'Tous les contenus d''influence sur les réseaux sont payants';
UPDATE jeu_quizz SET question = 'Qui peut publier des informations sur Internet ?' WHERE type_question = 1 AND option_a = 'Tous les articles en ligne viennent de journalistes professionnels';
UPDATE jeu_quizz SET question = 'Qu''est-ce qu''une fake news ?' WHERE type_question = 1 AND option_a = 'Une image générée par IA qui montre un événement réel';
UPDATE jeu_quizz SET question = 'Comment fonctionne réellement ChatGPT ?' WHERE type_question = 1 AND option_a = 'ChatGPT est une conscience artificielle';
UPDATE jeu_quizz SET question = 'Quels sont les principaux risques de l''intelligence artificielle ?' WHERE type_question = 1 AND option_a = 'C''est toujours positif pour la société';
UPDATE jeu_quizz SET question = 'Quelle est la meilleure façon de vérifier une information ?' WHERE type_question = 1 AND option_a = 'Partager un mème sans contexte';
UPDATE jeu_quizz SET question = 'Comment les fausses informations se propagent-elles sur les réseaux sociaux ?' WHERE type_question = 1 AND option_a = 'Les réseaux sociaux emploient des fact-checkers';
UPDATE jeu_quizz SET question = 'Peut-on faire confiance aux images trouvées sur Google ?' WHERE type_question = 1 AND option_a = 'Les images trouvées sur Google sont toutes vraies';
UPDATE jeu_quizz SET question = 'Que faire avant de partager une vidéo virale ?' WHERE type_question = 1 AND option_a = 'Partager une vidéo virale sans vérifier';
UPDATE jeu_quizz SET question = 'Pourquoi la désinformation s''est-elle amplifiée ces dernières années ?' WHERE type_question = 1 AND option_a = 'À cause de la facilité d''accès à Internet';
UPDATE jeu_quizz SET question = 'Quelle est la différence entre IA générative et IA discriminante ?' WHERE type_question = 1 AND option_a = 'L''IA générative et l''IA discriminante';
UPDATE jeu_quizz SET question = 'Dans quel but les algorithmes des réseaux sociaux recommandent-ils du contenu ?' WHERE type_question = 1 AND option_a = 'Pour garder les utilisateurs engagés plus longtemps';
UPDATE jeu_quizz SET question = 'Quelle méthode permet de vérifier une information de manière fiable ?' WHERE type_question = 1 AND option_a = 'En lisant une seule source très détaillée';
UPDATE jeu_quizz SET question = 'Qu''est-ce que le phishing ?' WHERE type_question = 1 AND option_a = 'Une arnaque où on demande des données personnelles par email';
UPDATE jeu_quizz SET question = 'Comment fonctionne une technologie de détection de deepfakes ?' WHERE type_question = 1 AND option_a = 'Elle analyse l''expression faciale et la comparaît avec une vidéo authentique';
UPDATE jeu_quizz SET question = 'L''IA peut-elle créer de faux documents officiels ?' WHERE type_question = 1 AND option_a = 'C''est impossible, l''IA ne peut pas imiter les documents';
UPDATE jeu_quizz SET question = 'Comment être un utilisateur responsable d''Internet ?' WHERE type_question = 1 AND option_a = 'Ignorer complètement Internet et les réseaux';
UPDATE jeu_quizz SET question = 'Qui peut être ciblé par les deepfakes ?' WHERE type_question = 1 AND option_a = 'Seulement les politiques';
UPDATE jeu_quizz SET question = 'Les fausses infos se propagent-elles plus vite que les vraies ?' WHERE type_question = 1 AND option_a = 'Les fausses infos se répandent plus vite que les vraies';
UPDATE jeu_quizz SET question = 'Que faut-il faire avant de partager un article sur les réseaux sociaux ?' WHERE type_question = 1 AND option_a = 'Partager sans vérifier le contexte';
UPDATE jeu_quizz SET question = 'Qu''est-ce qu''un deepfake vidéo ?' WHERE type_question = 1 AND option_a = 'Une vidéo où quelqu''un parle différemment';
UPDATE jeu_quizz SET question = 'Quel est le rôle de l''IA dans les médias ?' WHERE type_question = 1 AND option_a = 'L''IA remplace les humains dans les médias';
UPDATE jeu_quizz SET question = 'Comment développer son esprit critique face à l''information ?' WHERE type_question = 1 AND option_a = 'En posant les bonnes questions et en pensant par soi-même';
UPDATE jeu_quizz SET question = 'Peut-on faire confiance à tout ce qui est écrit en ligne ?' WHERE type_question = 1 AND option_a = 'Oui, tout ce qui est écrit en ligne est vrai';
UPDATE jeu_quizz SET question = 'Comment identifier une image générée par IA ?' WHERE type_question = 1 AND option_a = 'En comparant les pixels et les couleurs';
UPDATE jeu_quizz SET question = 'Quelle est la capacité réelle de ChatGPT ?' WHERE type_question = 1 AND option_a = 'Elle crée du texte très réaliste et cohérent';
UPDATE jeu_quizz SET question = 'Comment l''IA peut-elle aider à lutter contre la désinformation ?' WHERE type_question = 1 AND option_a = 'Elle aide à combattre la désinformation';
UPDATE jeu_quizz SET question = 'La technologie de détection de deepfakes est-elle totalement fiable ?' WHERE type_question = 1 AND option_a = 'Oui, complètement fiable';
UPDATE jeu_quizz SET question = 'Comment l''IA générative impacte-t-elle la désinformation ?' WHERE type_question = 1 AND option_a = 'Elle rend la désinformation impossible';
UPDATE jeu_quizz SET question = 'Que faut-il faire avant de partager un mème ?' WHERE type_question = 1 AND option_a = 'Partager tous les mèmes qu''on trouve drôles';
UPDATE jeu_quizz SET question = 'À quelle vitesse l''IA générative peut-elle créer du contenu ?' WHERE type_question = 1 AND option_a = 'À la vitesse d''Internet';
UPDATE jeu_quizz SET question = 'L''IA peut-elle générer des informations fausses ?' WHERE type_question = 1 AND option_a = 'Jamais, l''IA est parfaite';
UPDATE jeu_quizz SET question = 'Comment vérifier une information partagée sur les réseaux sociaux ?' WHERE type_question = 1 AND option_a = 'Chercher le bouton "vérifier la source"';

-- Suppression de la valeur par défaut
ALTER TABLE jeu_quizz MODIFY COLUMN question VARCHAR(500) NOT NULL;

-- ── Corrections reponse_correcte pour les QCM incohérents ────────────────────

-- "Tweeter sans réfléchir" ne peut pas être la bonne réponse → B='Vérifier la source avant de partager'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'Tweeter sans réfléchir';

-- "L'absence d'Internet" n'est pas une bulle de filtre → A='Des bulles de filtre créées par les algorithmes'
UPDATE jeu_quizz SET reponse_correcte = TRUE WHERE type_question = 1 AND option_a = 'Des bulles de filtre créées par les algorithmes';

-- Question fake news : B='Une image créée par IA d''un événement fictif' → question plus précise
UPDATE jeu_quizz SET question = 'Qu''est-ce qu''une fake news visuelle créée par IA ?' WHERE type_question = 1 AND option_a = 'Une image générée par IA qui montre un événement réel';

-- "Partager un mème sans contexte" n'est pas la bonne pratique → B='Consulter plusieurs sources vérifiées'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'Partager un mème sans contexte';

-- "Partager une vidéo virale sans vérifier" n'est pas la bonne pratique → B='Chercher qui a créé la vidéo'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'Partager une vidéo virale sans vérifier';

-- A='L''IA générative et l''IA discriminante' ne décrit pas la différence → B='L''IA générative crée du contenu...'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'L''IA générative et l''IA discriminante';

-- "En lisant une seule source" n'est pas fiable → B='En croisant plusieurs sources différentes et vérifiées'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'En lisant une seule source très détaillée';

-- A='Une arnaque où on demande des données personnelles par email' EST la définition du phishing
UPDATE jeu_quizz SET reponse_correcte = TRUE WHERE type_question = 1 AND option_a = 'Une arnaque où on demande des données personnelles par email';

-- A='Elle analyse l''expression faciale' décrit le vrai fonctionnement de la détection de deepfakes
UPDATE jeu_quizz SET reponse_correcte = TRUE WHERE type_question = 1 AND option_a = 'Elle analyse l''expression faciale et la comparaît avec une vidéo authentique';

-- "Ignorer complètement Internet" n'est pas être numérique responsable → B='Utiliser Internet de manière critique'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'Ignorer complètement Internet et les réseaux';

-- La bonne réponse est C='N''importe qui peut être victime' → swap avec option_a et mettre TRUE
UPDATE jeu_quizz SET option_a = 'N''importe qui peut être victime', option_c = 'Seulement les politiques', reponse_correcte = TRUE, question = 'Qui peut être ciblé par les deepfakes ?' WHERE type_question = 1 AND option_a = 'Seulement les politiques' AND option_c = 'N''importe qui peut être victime';

-- "Partager sans vérifier le contexte" n'est pas la bonne pratique → B='Lire l''article complet'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'Partager sans vérifier le contexte';

-- A='Elle crée du texte très réaliste et cohérent' EST vrai pour ChatGPT + question adaptée
UPDATE jeu_quizz SET reponse_correcte = TRUE, question = 'Quelle affirmation sur ChatGPT est vraie ?' WHERE type_question = 1 AND option_a = 'Elle crée du texte très réaliste et cohérent';

-- "Partager tous les mèmes qu'on trouve drôles" n'est pas la bonne pratique → B='Vérifier le message'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'Partager tous les mèmes qu''on trouve drôles';

-- "Chercher le bouton vérifier la source" n'existe pas → B='Regarder le profil, vérifier la date, chercher la source'
UPDATE jeu_quizz SET reponse_correcte = FALSE WHERE type_question = 1 AND option_a = 'Chercher le bouton "vérifier la source"';
