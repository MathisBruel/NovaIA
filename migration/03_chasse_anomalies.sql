USE specialweek;
SET NAMES utf8mb4;

INSERT INTO jeu_chasse_anomalies (image_url, titre_image, coordonnes_anomalie_json, explication, points_accordes) VALUES
('/assets/img/anomalies/anomalie_lumiere.png', 'Source lumineuse incohérente', '{"type": "source lumineuse incoh\u00e9rente", "x": 213, "y": 981, "radius": 130}', 'Source lumineuse incohérente détectée pour remettre en question la cohérence lumineuse.', 10),
('/assets/img/anomalies/anomalie_eventail.png', 'Objet incohérent (éventail)', '{"type": "objet incoh\u00e9rent (\u00e9ventail)", "x": 492, "y": 345, "radius": 130}', 'Éventail incohérent détecté : forme et position anormales.', 10),
('/assets/img/anomalies/anomalie_panier.png', 'Objet impossible (poignée détachée)', '{"type": "objet impossible (poign\u00e9e d\u00e9tach\u00e9e)", "x": 407, "y": 1201, "radius": 120}', 'Objet impossible repéré : poignée séparée du reste de l''objet.', 10),
('/assets/img/anomalies/anomalie_patte_chien.png', 'Anatomie impossible (patte déformée)', '{"type": "anatomie impossible (patte d\u00e9form\u00e9e)", "x": 781, "y": 781, "radius": 160}', 'Anatomie impossible détectée avec une patte clairement déformée.', 10),
('/assets/img/anomalies/anomalie_pattes.png', 'Anatomie incohérente (doigts fusionnés)', '{"type": "anatomie incoh\u00e9rente (doigts fusionn\u00e9s)", "x": 789, "y": 594, "radius": 130}', 'Anatomie incohérente : doigt fusionné sur la main.', 10),
('/assets/img/anomalies/anomalie_oreille.png', 'Anomalie anatomique (oreille disproportionnée)', '{"type": "anomalie anatomique (oreille disproportionn\u00e9e)", "x": 838, "y": 435, "radius": 58}', 'L''oreille est disproportionnée par rapport à l''anatomie normale.', 10),
('/assets/img/anomalies/anomalie_patte_chat.png', 'Anomalie anatomique (nombre de doigts)', '{"type": "anomalie anatomique (nombre de doigts)", "x": 513, "y": 648, "radius": 196}', 'Nombre de doigts erroné : le décompte ne correspond pas au réel.', 10),
('/assets/img/anomalies/anomalie_main.png', 'Anomalie anatomique (doigt supplémentaire)', '{"type": "anomalie anatomique (doigt suppl\u00e9mentaire)", "x": 342, "y": 1052, "radius": 161}', 'Doigt supplémentaire détecté, violation de l''anatomie humaine normale.', 10),
('/assets/img/anomalies/anomalie_oeil.png', 'Motif incohérent (œil de plume anormal)', '{"type": "motif incoh\u00e9rent (\u0153il de plume anormal)", "x": 1094, "y": 435, "radius": 63}', 'Motif anormal détecté au niveau de l''œil de plume.', 10),
('/assets/img/anomalies/anomalie_boule.png', 'Objet dupliqué (boule en double subtile)', '{"type": "objet dupliqu\u00e9 (boule en double subtile)", "x": 685, "y": 1078, "radius": 101}', 'Duplication subtile d''objet identifiée, signature IA typique.', 10);
