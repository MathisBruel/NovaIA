USE specialweek;

-- Ajout de 4 scénarios jouables pour MythosIA
-- 2 scénarios avec hallucination (est_coherent = FALSE sur le dernier nœud)
-- 2 scénarios sans hallucination (tous les nœuds = TRUE)
-- IDs 100-133 — pas de conflit avec les données existantes (1-79)

SET FOREIGN_KEY_CHECKS=0;

-- ─────────────────────────────────────────────────────────────────────────────
-- SCÉNARIO 1 — Astronomie  (IDs 100-103) — HALLUCINATION : OUI
-- Hallucination : Mars présentée comme 3ème planète alors qu''elle est la 4ème
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO reponse_mytho (id, reponse_1, reponse_2, question_answer_1, question_answer_2) VALUES
(100, 'Ok, continue !',        'C''est parti !',           101, 101),
(101, 'Interessant !',         'Je le savais deja !',      102, 102),
(102, 'Fascinant !',           'Continue !',               103, 103);

INSERT INTO question_mytho (id, id_reponses, question, est_coherent) VALUES
(100, 100, 'Bonjour ! Je suis une IA specialisee en sciences. Je vais te partager quelques faits sur l''astronomie !', NULL),
(101, 101, 'La Lune est l''unique satellite naturel de la Terre. Elle orbite a environ 384 000 km de notre planete.', TRUE),
(102, 102, 'Le Soleil represente environ 99,86 % de la masse totale du systeme solaire.', TRUE),
(103, NULL, 'Mars est la troisieme planete a partir du Soleil, juste apres la Terre.', FALSE);

-- ─────────────────────────────────────────────────────────────────────────────
-- SCÉNARIO 2 — Biologie marine  (IDs 110-113) — HALLUCINATION : NON
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO reponse_mytho (id, reponse_1, reponse_2, question_answer_1, question_answer_2) VALUES
(110, 'Allons-y !',            'Super !',                  111, 111),
(111, 'Incroyable !',          'Vraiment ?',               112, 112),
(112, 'Continue !',            'Fascinant !',              113, 113);

INSERT INTO question_mytho (id, id_reponses, question, est_coherent) VALUES
(110, 110, 'Bonjour ! Passons a la biologie marine. Je vais te parler de quelques creatures des oceans.', NULL),
(111, 111, 'Les baleines bleues sont les plus grands animaux ayant jamais vecu sur Terre. Elles peuvent mesurer jusqu''a 30 metres de long.', TRUE),
(112, 112, 'Les dauphins sont des mammiferes. Ils respirent de l''air a la surface et allaitent leurs petits.', TRUE),
(113, NULL, 'Les pieuvres possedent trois coeurs et leur sang contient de l''hemocyanine, une molecule qui lui donne une teinte bleutee.', TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- SCÉNARIO 3 — Histoire & Inventions  (IDs 120-123) — HALLUCINATION : OUI
-- Hallucination : Bell credite pour l''ampoule (c''est Edison)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO reponse_mytho (id, reponse_1, reponse_2, question_answer_1, question_answer_2) VALUES
(120, 'Parfait !',             'C''est parti !',           121, 121),
(121, 'Impressionnant !',      'Je le savais !',           122, 122),
(122, 'Magnifique !',          'Continue !',               123, 123);

INSERT INTO question_mytho (id, id_reponses, question, est_coherent) VALUES
(120, 120, 'Bonjour ! Je vais te parler de quelques grandes inventions humaines. Es-tu pret ?', NULL),
(121, 121, 'L''imprimerie a caracteres mobiles a ete mise au point par Johannes Gutenberg au XVe siecle.', TRUE),
(122, 122, 'Le premier vol habite motorise a ete realise par les freres Wright en 1903 aux Etats-Unis.', TRUE),
(123, NULL, 'Alexander Graham Bell a invente l''ampoule electrique en 1876, transformant l''eclairage domestique.', FALSE);

-- ─────────────────────────────────────────────────────────────────────────────
-- SCÉNARIO 4 — Corps humain  (IDs 130-133) — HALLUCINATION : NON
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO reponse_mytho (id, reponse_1, reponse_2, question_answer_1, question_answer_2) VALUES
(130, 'Allons-y !',            'Super !',                  131, 131),
(131, 'Interessant !',         'Continue !',               132, 132),
(132, 'Fascinant !',           'Et encore ?',              133, 133);

INSERT INTO question_mytho (id, id_reponses, question, est_coherent) VALUES
(130, 130, 'Bonjour ! Je vais maintenant te parler du corps humain. C''est fascinant !', NULL),
(131, 131, 'Le corps humain adulte est compose d''environ 60 % d''eau. Cette proportion varie selon l''age.', TRUE),
(132, 132, 'Le coeur humain bat en moyenne entre 60 et 100 fois par minute au repos. Il pompe environ 5 litres de sang par minute.', TRUE),
(133, NULL, 'Le cerveau humain contient environ 86 milliards de neurones et consomme pres de 20 % de l''energie du corps.', TRUE);

SET FOREIGN_KEY_CHECKS=1;
