USE specialweek;
SET NAMES utf8mb4;

INSERT INTO jeu_chasse_anomalies (image_url, titre_image, coordonnes_anomalie_json, explication, points_accordes) VALUES
('/assets/img/anomalies/anomalie_lumiere.png', 'Source lumineuse incohérente', '{"type":"source lumineuse incohérente","x":520,"y":920,"radius":130}', 'Source lumineuse incohérente détectée pour remettre en question la cohérence lumineuse.', 10),
('/assets/img/anomalies/anomalie_eventail.png', 'Objet incohérent (éventail)', '{"type":"objet incohérent (éventail)","x":760,"y":260,"radius":130}', 'Éventail incohérent détecté : forme et position anormales.', 10),
('/assets/img/anomalies/anomalie_panier.png', 'Objet impossible (poignée détachée)', '{"type":"objet impossible (poignée détachée)","x":740,"y":1080,"radius":120}', 'Objet impossible repéré : poignée séparée du reste de l''objet.', 10),
('/assets/img/anomalies/anomalie_patte_chien.png', 'Anatomie impossible (patte déformée)', '{"type":"anatomie impossible (patte déformée)","x":1020,"y":900,"radius":160}', 'Anatomie impossible détectée avec une patte clairement déformée.', 10),
('/assets/img/anomalies/anomalie_pattes.png', 'Anatomie incohérente (doigts fusionnés)', '{"type":"anatomie incohérente (doigts fusionnés)","x":760,"y":520,"radius":130}', 'Anatomie incohérente : doigt fusionné sur la main.', 10),
('/assets/img/anomalies/anomalie_oreille.png', 'Anomalie anatomique (oreille disproportionnée)', '{"type":"anomalie anatomique (oreille disproportionnée)","x":970,"y":500,"radius":130}', 'L''oreille est disproportionnée par rapport à l''anatomie normale.', 10),
('/assets/img/anomalies/anomalie_patte_chat.png', 'Anomalie anatomique (nombre de doigts)', '{"type":"anomalie anatomique (nombre de doigts)","x":520,"y":640,"radius":110}', 'Nombre de doigts erroné : le décompte ne correspond pas au réel.', 10),
('/assets/img/anomalies/anomalie_main.png', 'Anomalie anatomique (doigt supplémentaire)', '{"type":"anomalie anatomique (doigt supplémentaire)","x":450,"y":1000,"radius":120}', 'Doigt supplémentaire détecté, violation de l''anatomie humaine normale.', 10),
('/assets/img/anomalies/anomalie_oeil.png', 'Motif incohérent (œil de plume anormal)', '{"type":"motif incohérent (œil de plume anormal)","x":1180,"y":520,"radius":110}', 'Motif anormal détecté au niveau de l''œil de plume.', 10),
('/assets/img/anomalies/anomalie_boule.png', 'Objet dupliqué (boule en double subtile)', '{"type":"objet dupliqué (boule en double subtile)","x":900,"y":1260,"radius":130}', 'Duplication subtile d''objet identifiée, signature IA typique.', 10);
