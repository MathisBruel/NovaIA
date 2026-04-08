USE specialweek;

-- ============================================================
-- Seed : 50 utilisateurs variés (certifiés / non certifiés)
-- ============================================================

-- ============================================================
-- Seed : 50 utilisateurs variés (certifiés / non certifiés)
-- ============================================================
INSERT INTO `profil` (`prenom`, `nom`, `mail`, `mdp`, `points`, `is_admin`, `is_certified`) VALUES
-- Power users certifiés
('Lucas',    'Martin',     'lucas.martin@mail.com',       'pass123', 1250, 0, 1),
('Emma',     'Bernard',    'emma.bernard@mail.com',       'pass123', 1180, 0, 1),
('Hugo',     'Dubois',     'hugo.dubois@mail.com',        'pass123', 1050, 0, 1),
('Chloé',    'Thomas',     'chloe.thomas@mail.com',       'pass123', 980,  0, 1),
('Louis',    'Robert',     'louis.robert@mail.com',       'pass123', 920,  0, 1),
('Léa',      'Richard',    'lea.richard@mail.com',        'pass123', 870,  0, 1),
('Nathan',   'Petit',      'nathan.petit@mail.com',       'pass123', 810,  0, 1),
('Manon',    'Durand',     'manon.durand@mail.com',       'pass123', 760,  0, 1),
('Jules',    'Leroy',      'jules.leroy@mail.com',        'pass123', 720,  0, 1),
('Camille',  'Moreau',     'camille.moreau@mail.com',     'pass123', 690,  0, 1),
-- Utilisateurs certifiés intermédiaires
('Antoine',  'Simon',      'antoine.simon@mail.com',      'pass123', 550,  0, 1),
('Sarah',    'Laurent',    'sarah.laurent@mail.com',      'pass123', 480,  0, 1),
('Raphaël',  'Lefebvre',   'raphael.lefebvre@mail.com',   'pass123', 430,  0, 1),
('Jade',     'Michel',     'jade.michel@mail.com',        'pass123', 390,  0, 1),
('Théo',     'Garcia',     'theo.garcia@mail.com',        'pass123', 340,  0, 1),
-- Utilisateurs NON certifiés actifs
('Inès',     'David',      'ines.david@mail.com',         'pass123', 620,  0, 0),
('Maxime',   'Bertrand',   'maxime.bertrand@mail.com',    'pass123', 510,  0, 0),
('Clara',    'Roux',       'clara.roux@mail.com',         'pass123', 460,  0, 0),
('Arthur',   'Vincent',    'arthur.vincent@mail.com',     'pass123', 410,  0, 0),
('Zoé',      'Fournier',   'zoe.fournier@mail.com',       'pass123', 370,  0, 0),
('Ethan',    'Morel',      'ethan.morel@mail.com',        'pass123', 330,  0, 0),
('Lina',     'Girard',     'lina.girard@mail.com',        'pass123', 290,  0, 0),
('Tom',      'André',      'tom.andre@mail.com',          'pass123', 250,  0, 0),
('Eva',      'Lefevre',    'eva.lefevre@mail.com',        'pass123', 220,  0, 0),
('Adam',     'Mercier',    'adam.mercier@mail.com',        'pass123', 190,  0, 0),
-- Utilisateurs NON certifiés peu actifs / débutants
('Lola',     'Dupont',     'lola.dupont@mail.com',        'pass123', 150,  0, 0),
('Noah',     'Lambert',    'noah.lambert@mail.com',       'pass123', 120,  0, 0),
('Alice',    'Bonnet',     'alice.bonnet@mail.com',       'pass123', 100,  0, 0),
('Gabin',    'François',   'gabin.francois@mail.com',     'pass123', 80,   0, 0),
('Mila',     'Martinez',   'mila.martinez@mail.com',      'pass123', 60,   0, 0),
('Léon',     'Legrand',    'leon.legrand@mail.com',       'pass123', 50,   0, 0),
('Agathe',   'Garnier',    'agathe.garnier@mail.com',     'pass123', 40,   0, 0),
('Sacha',    'Faure',      'sacha.faure@mail.com',        'pass123', 30,   0, 0),
('Rose',     'Rousseau',   'rose.rousseau@mail.com',      'pass123', 20,   0, 0),
('Axel',     'Blanc',      'axel.blanc@mail.com',         'pass123', 15,   0, 0),
-- Utilisateurs juste inscrits (0 points, pas de jeu)
('Maël',     'Guérin',     'mael.guerin@mail.com',        'pass123', 0,    0, 0),
('Iris',     'Muller',     'iris.muller@mail.com',        'pass123', 0,    0, 0),
('Nolan',    'Henry',      'nolan.henry@mail.com',        'pass123', 0,    0, 0),
('Ambre',    'Roussel',    'ambre.roussel@mail.com',      'pass123', 0,    0, 0),
('Oscar',    'Nicolas',    'oscar.nicolas@mail.com',      'pass123', 0,    0, 0),
-- Admin de test
('Admin',    'Test',       'admin@novaia.fr',             'admin123', 500, 1, 1);

-- ============================================================
-- Récupérer les IDs insérés.
-- Le premier INSERT ci-dessus génère des IDs auto-incrémentés.
-- On va supposer qu'ils commencent à @first_id.
-- On utilise des variables pour être robuste.
-- ============================================================

SET @first_id = (SELECT MIN(id) FROM profil WHERE mail = 'lucas.martin@mail.com');

-- ============================================================
-- Seed : 220+ sessions d'activité sur les 4 jeux
-- game_id : 1 = Info ou Intox (Swiper), 2 = Chasse Anomalies,
--            3 = Quiz, 4 = MythosIA
-- ============================================================

INSERT INTO `user_activity` (`user_id`, `game_id`, `started_at`, `completed`, `step_reached`, `points_earned`) VALUES

-- ─── GAME 1 : Info ou Intox (Swiper) ─── 15 posts max ──────────────
-- Power users qui finissent le jeu
(@first_id + 0,  1, '2026-04-01 09:15:00', 1, 15, 120),
(@first_id + 0,  1, '2026-04-03 14:20:00', 1, 15, 140),
(@first_id + 0,  1, '2026-04-06 18:30:00', 1, 15, 130),
(@first_id + 1,  1, '2026-04-01 10:00:00', 1, 15, 110),
(@first_id + 1,  1, '2026-04-04 16:45:00', 1, 15, 150),
(@first_id + 2,  1, '2026-04-02 08:30:00', 1, 15, 100),
(@first_id + 2,  1, '2026-04-05 20:10:00', 1, 15, 130),
(@first_id + 3,  1, '2026-04-01 11:20:00', 1, 15, 120),
(@first_id + 4,  1, '2026-04-02 15:00:00', 1, 15, 90),
(@first_id + 5,  1, '2026-04-03 09:45:00', 1, 15, 110),
(@first_id + 6,  1, '2026-04-04 12:30:00', 1, 15, 100),
(@first_id + 7,  1, '2026-04-05 17:20:00', 1, 15, 80),
(@first_id + 8,  1, '2026-04-06 10:15:00', 1, 15, 90),
(@first_id + 9,  1, '2026-04-07 14:00:00', 1, 15, 110),
-- Utilisateurs qui abandonnent en cours de route
(@first_id + 10, 1, '2026-04-02 09:30:00', 0, 12, 80),
(@first_id + 11, 1, '2026-04-03 11:00:00', 0, 10, 60),
(@first_id + 12, 1, '2026-04-04 13:15:00', 0, 8,  50),
(@first_id + 13, 1, '2026-04-05 16:00:00', 0, 6,  30),
(@first_id + 14, 1, '2026-04-06 19:30:00', 0, 5,  20),
(@first_id + 15, 1, '2026-04-01 10:45:00', 1, 15, 100),
(@first_id + 16, 1, '2026-04-02 14:20:00', 0, 11, 70),
(@first_id + 17, 1, '2026-04-03 08:30:00', 0, 9,  50),
(@first_id + 18, 1, '2026-04-04 17:10:00', 0, 7,  40),
(@first_id + 19, 1, '2026-04-05 12:00:00', 0, 4,  20),
(@first_id + 20, 1, '2026-04-06 15:45:00', 0, 3,  10),
-- Abandons très tôt (drop-off précoce)
(@first_id + 21, 1, '2026-04-01 08:00:00', 0, 2,  10),
(@first_id + 22, 1, '2026-04-02 09:00:00', 0, 1,  0),
(@first_id + 23, 1, '2026-04-03 10:00:00', 0, 2,  10),
(@first_id + 24, 1, '2026-04-04 11:00:00', 0, 1,  0),
(@first_id + 25, 1, '2026-04-05 12:00:00', 0, 3,  10),
(@first_id + 26, 1, '2026-04-06 13:00:00', 0, 1,  0),
(@first_id + 27, 1, '2026-04-07 14:00:00', 0, 2,  0),
-- Quelques joueurs modérés
(@first_id + 28, 1, '2026-04-01 15:30:00', 1, 15, 70),
(@first_id + 29, 1, '2026-04-02 16:00:00', 0, 13, 90),
(@first_id + 30, 1, '2026-04-03 17:00:00', 0, 10, 60),

-- ─── GAME 2 : Chasse aux Anomalies ─── 10 images max ──────────────
-- Joueurs qui complètent
(@first_id + 0,  2, '2026-04-01 10:30:00', 1, 10, 150),
(@first_id + 0,  2, '2026-04-04 15:00:00', 1, 10, 120),
(@first_id + 1,  2, '2026-04-02 09:45:00', 1, 10, 130),
(@first_id + 1,  2, '2026-04-06 11:30:00', 1, 10, 140),
(@first_id + 2,  2, '2026-04-01 14:00:00', 1, 10, 110),
(@first_id + 3,  2, '2026-04-03 08:15:00', 1, 10, 100),
(@first_id + 4,  2, '2026-04-02 17:30:00', 1, 10, 90),
(@first_id + 5,  2, '2026-04-04 19:00:00', 1, 10, 80),
(@first_id + 6,  2, '2026-04-05 10:00:00', 1, 10, 100),
(@first_id + 7,  2, '2026-04-06 13:20:00', 1, 10, 70),
-- Drop-offs variés
(@first_id + 8,  2, '2026-04-01 11:00:00', 0, 8,  60),
(@first_id + 9,  2, '2026-04-02 12:00:00', 0, 7,  50),
(@first_id + 10, 2, '2026-04-03 14:30:00', 0, 6,  40),
(@first_id + 11, 2, '2026-04-04 16:00:00', 0, 5,  30),
(@first_id + 12, 2, '2026-04-05 09:00:00', 0, 4,  20),
(@first_id + 13, 2, '2026-04-06 10:30:00', 0, 3,  15),
(@first_id + 14, 2, '2026-04-07 08:00:00', 0, 2,  10),
(@first_id + 15, 2, '2026-04-01 14:30:00', 0, 7,  50),
(@first_id + 16, 2, '2026-04-02 15:20:00', 0, 5,  30),
(@first_id + 17, 2, '2026-04-03 16:10:00', 0, 3,  15),
(@first_id + 18, 2, '2026-04-04 17:00:00', 0, 2,  10),
(@first_id + 19, 2, '2026-04-05 18:00:00', 0, 1,  0),
(@first_id + 20, 2, '2026-04-06 19:30:00', 0, 1,  0),
-- Joueurs qui rejouent après échec
(@first_id + 8,  2, '2026-04-03 15:00:00', 1, 10, 80),
(@first_id + 9,  2, '2026-04-04 16:30:00', 1, 10, 90),
(@first_id + 21, 2, '2026-04-01 09:00:00', 0, 1,  0),
(@first_id + 22, 2, '2026-04-02 10:00:00', 0, 2,  10),

-- ─── GAME 3 : Quiz ─── 20 questions max ────────────────────────────
-- Finisseurs
(@first_id + 0,  3, '2026-04-01 14:00:00', 1, 20, 180),
(@first_id + 0,  3, '2026-04-04 18:00:00', 1, 20, 200),
(@first_id + 0,  3, '2026-04-07 09:00:00', 1, 20, 190),
(@first_id + 1,  3, '2026-04-02 10:30:00', 1, 20, 160),
(@first_id + 1,  3, '2026-04-05 14:15:00', 1, 20, 170),
(@first_id + 2,  3, '2026-04-01 16:00:00', 1, 20, 150),
(@first_id + 3,  3, '2026-04-03 11:00:00', 1, 20, 140),
(@first_id + 4,  3, '2026-04-02 13:30:00', 1, 20, 130),
(@first_id + 5,  3, '2026-04-04 09:00:00', 1, 20, 120),
(@first_id + 6,  3, '2026-04-05 15:30:00', 1, 20, 110),
(@first_id + 7,  3, '2026-04-06 11:00:00', 1, 20, 100),
(@first_id + 8,  3, '2026-04-07 08:30:00', 1, 20, 90),
(@first_id + 9,  3, '2026-04-01 17:45:00', 1, 20, 80),
-- Drop-offs progressifs
(@first_id + 10, 3, '2026-04-02 09:00:00', 0, 18, 140),
(@first_id + 11, 3, '2026-04-03 10:15:00', 0, 16, 120),
(@first_id + 12, 3, '2026-04-04 11:30:00', 0, 14, 100),
(@first_id + 13, 3, '2026-04-05 12:45:00', 0, 12, 80),
(@first_id + 14, 3, '2026-04-06 14:00:00', 0, 10, 60),
(@first_id + 15, 3, '2026-04-01 08:00:00', 1, 20, 130),
(@first_id + 16, 3, '2026-04-02 09:30:00', 0, 15, 100),
(@first_id + 17, 3, '2026-04-03 10:45:00', 0, 12, 70),
(@first_id + 18, 3, '2026-04-04 12:00:00', 0, 8,  40),
(@first_id + 19, 3, '2026-04-05 13:15:00', 0, 6,  25),
(@first_id + 20, 3, '2026-04-06 14:30:00', 0, 4,  15),
(@first_id + 21, 3, '2026-04-07 16:00:00', 0, 3,  10),
(@first_id + 22, 3, '2026-04-01 17:30:00', 0, 2,  5),
(@first_id + 23, 3, '2026-04-02 19:00:00', 0, 1,  0),
-- Abandons tôt
(@first_id + 24, 3, '2026-04-03 08:30:00', 0, 2,  10),
(@first_id + 25, 3, '2026-04-04 09:15:00', 0, 1,  0),
(@first_id + 26, 3, '2026-04-05 10:00:00', 0, 3,  15),
(@first_id + 27, 3, '2026-04-06 11:30:00', 0, 1,  0),
(@first_id + 28, 3, '2026-04-07 12:00:00', 0, 5,  20),
(@first_id + 29, 3, '2026-04-01 13:45:00', 0, 7,  30),
(@first_id + 30, 3, '2026-04-02 14:30:00', 0, 4,  10),
-- Rejoueurs
(@first_id + 10, 3, '2026-04-05 15:30:00', 1, 20, 160),
(@first_id + 11, 3, '2026-04-06 16:00:00', 1, 20, 150),

-- ─── GAME 4 : MythosIA ─── scénarios en 4-6 étapes ─────────────
-- Complétés
(@first_id + 0,  4, '2026-04-01 20:00:00', 1, 5, 15),
(@first_id + 0,  4, '2026-04-03 21:00:00', 1, 6, 15),
(@first_id + 0,  4, '2026-04-06 22:00:00', 1, 5, 15),
(@first_id + 1,  4, '2026-04-01 19:30:00', 1, 5, 15),
(@first_id + 1,  4, '2026-04-04 20:15:00', 1, 6, 15),
(@first_id + 2,  4, '2026-04-02 18:00:00', 1, 5, 15),
(@first_id + 2,  4, '2026-04-05 19:00:00', 1, 4, 15),
(@first_id + 3,  4, '2026-04-03 17:30:00', 1, 6, 15),
(@first_id + 4,  4, '2026-04-04 16:00:00', 1, 5, 15),
(@first_id + 5,  4, '2026-04-05 15:00:00', 1, 4, 15),
(@first_id + 6,  4, '2026-04-06 14:00:00', 1, 5, 0),
(@first_id + 7,  4, '2026-04-07 13:00:00', 1, 6, 0),
(@first_id + 8,  4, '2026-04-01 12:00:00', 1, 5, 15),
(@first_id + 9,  4, '2026-04-02 11:00:00', 1, 4, 0),
-- Drop-offs
(@first_id + 10, 4, '2026-04-03 10:00:00', 0, 3, 0),
(@first_id + 11, 4, '2026-04-04 09:00:00', 0, 2, 0),
(@first_id + 12, 4, '2026-04-05 08:00:00', 0, 4, 0),
(@first_id + 13, 4, '2026-04-06 07:30:00', 0, 1, 0),
(@first_id + 14, 4, '2026-04-07 20:00:00', 0, 2, 0),
(@first_id + 15, 4, '2026-04-01 21:00:00', 1, 5, 15),
(@first_id + 16, 4, '2026-04-02 22:00:00', 0, 3, 0),
(@first_id + 17, 4, '2026-04-03 23:00:00', 0, 2, 0),
(@first_id + 18, 4, '2026-04-04 18:30:00', 0, 1, 0),
(@first_id + 19, 4, '2026-04-05 19:15:00', 0, 2, 0),
(@first_id + 20, 4, '2026-04-06 20:00:00', 0, 1, 0),
(@first_id + 21, 4, '2026-04-07 21:30:00', 0, 1, 0),
-- Sessions bonus récentes
(@first_id + 3,  4, '2026-04-07 10:00:00', 1, 5, 15),
(@first_id + 4,  4, '2026-04-07 11:00:00', 1, 6, 0),
(@first_id + 5,  4, '2026-04-07 12:00:00', 1, 4, 15),

-- ─── Données supplémentaires pour augmenter le volume ───────────
-- Swiper sessions supplémentaires
(@first_id + 3,  1, '2026-04-05 08:00:00', 1, 15, 140),
(@first_id + 4,  1, '2026-04-06 09:00:00', 1, 15, 100),
(@first_id + 5,  1, '2026-04-07 10:00:00', 1, 15, 120),
(@first_id + 6,  1, '2026-04-07 11:30:00', 0, 13, 90),
(@first_id + 7,  1, '2026-04-07 12:00:00', 0, 11, 70),
(@first_id + 31, 1, '2026-04-05 14:00:00', 0, 4,  20),
(@first_id + 32, 1, '2026-04-06 15:30:00', 0, 2,  10),
(@first_id + 33, 1, '2026-04-07 16:00:00', 0, 1,  0),

-- Chasse sessions supplémentaires
(@first_id + 3,  2, '2026-04-06 09:00:00', 1, 10, 110),
(@first_id + 4,  2, '2026-04-07 10:30:00', 1, 10, 80),
(@first_id + 10, 2, '2026-04-05 11:00:00', 0, 6,  40),
(@first_id + 23, 2, '2026-04-06 12:00:00', 0, 1,  0),
(@first_id + 24, 2, '2026-04-07 13:30:00', 0, 3,  10),

-- Quiz sessions supplémentaires 
(@first_id + 3,  3, '2026-04-05 08:30:00', 1, 20, 170),
(@first_id + 4,  3, '2026-04-06 09:45:00', 1, 20, 150),
(@first_id + 5,  3, '2026-04-07 11:00:00', 1, 20, 140),
(@first_id + 31, 3, '2026-04-05 12:30:00', 0, 6,  25),
(@first_id + 32, 3, '2026-04-06 13:15:00', 0, 3,  10),
(@first_id + 33, 3, '2026-04-07 14:00:00', 0, 1,  0),

-- MythosIA sessions supplémentaires
(@first_id + 6,  4, '2026-04-07 15:00:00', 1, 5,  15),
(@first_id + 10, 4, '2026-04-07 16:00:00', 1, 4,  15),
(@first_id + 31, 4, '2026-04-06 17:00:00', 0, 1,  0),
(@first_id + 32, 4, '2026-04-07 18:00:00', 0, 2,  0);
