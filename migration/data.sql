USE specialweek;

INSERT INTO question_mytho (id, id_reponses, question, est_coherent) VALUES

(1, 1, 'Tu veux parler de quoi ?', TRUE),

(2, 2, 'Dans l’espace, qu’est-ce qui t’intéresse ?', TRUE),

(3, 3, 'Quelle planète veux-tu explorer ?', TRUE),

(4, 4, 'Que veux-tu découvrir sur Jupiter ?', TRUE),

(5, 5, 'Quelle lune de Jupiter ?', TRUE),

(6, 6, 'Sous la glace d’Europe, on trouve ?', TRUE),

(7, 7, 'Comment sont les tempêtes sur Jupiter ?', TRUE),

(8, 8, 'Io est connue pour ?', TRUE),

(9, NULL, 'La Grande Tache Rouge est une tempête géante.', TRUE),

(10, 9, 'Que veux-tu explorer sur Mars ?', TRUE),

(11, 10, 'Que trouve-t-on aux pôles de Mars ?', TRUE),

(12, 11, 'Mars possédait autrefois ?', TRUE),

(13, NULL, 'Mars a bien eu de l’eau dans le passé.', TRUE),

(14, 12, 'Quel robot martien ?', TRUE),

(15, 13, 'Curiosity sert à ?', TRUE),

(16, 14, 'Perseverance cherche ?', TRUE),

(17, NULL, 'Les robots collectent des échantillons.', TRUE),

(20, 15, 'Que veux-tu savoir ?', TRUE),

(21, 16, 'Le Soleil est composé de ?', TRUE),

(22, 17, 'Et aussi de ?', TRUE),

(23, NULL, 'Le Soleil deviendra une géante rouge.', TRUE),

(24, 18, 'Une supernova est ?', TRUE),

(25, NULL, 'Elle crée des éléments lourds.', TRUE);

INSERT INTO reponse_mytho (id, reponse_1, reponse_2, question_answer_1, question_answer_2) VALUES

(1, 'Espace', 'Animaux', 2, NULL),

(2, 'Planètes', 'Étoiles', 3, 20),

(3, 'Jupiter', 'Mars', 4, 10),

(4, 'Ses lunes', 'Son atmosphère', 5, 7),

(5, 'Europe', 'Io', 6, 8),

(6, 'Un océan caché', 'Un noyau de feu', 9, 9),

(7, 'Très puissantes', 'Calmes', 9, 9),

(8, 'Ses volcans', 'Ses forêts glacées', 9, 9),

(9, 'L’eau', 'Les robots', 11, 14),

(10, 'Des calottes de glace', 'Des mers tropicales', 12, 12),

(11, 'Des rivières', 'Des jungles', 13, 13),

(12, 'Curiosity', 'Perseverance', 15, 16),

(13, 'Analyser les roches', 'Construire une ville', 17, 17),

(14, 'Des traces de vie', 'Des animaux vivants', 17, 17),

(15, 'Le Soleil', 'Les supernovas', 21, 24),

(16, 'Hydrogène', 'Bois en feu', 22, 22),

(17, 'Hélium', 'Pierre', 23, 23),

(18, 'Une explosion d’étoile', 'Une planète', 25, 25);

