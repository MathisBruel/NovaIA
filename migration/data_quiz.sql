USE specialweek;

-- Types de questions
INSERT INTO type_question_quizz (id, name) VALUES
(1, 'QCM'),
(2, 'Vrai/Faux'),
(3, 'Image - Réel vs IA');

-- ============================================
-- QCM sur l'IA, désinformation et médias
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

-- QCM 1-20
(1, NULL, 'Créer du contenu réaliste', 'Analyser des données scientifiques', 'Résoudre des équations complexes', 'Construire des robots physiques', TRUE, 'Les IA génératives comme ChatGPT et Dall-E sont conçues pour générer du contenu nouveau.', 10),

(1, NULL, 'Elle enrichit toujours l''information', 'Elle peut créer des deepfakes convaincants', 'Elle supprime automatiquement les mensonges', 'Elle est toujours 100% fiable', FALSE, 'L''IA peut créer des vidéos et images très réalistes mais fausses, c''est un vrai danger pour la désinformation.', 10),

(1, NULL, 'Une vidéo montrant la réalité altérée par IA', 'Un document papier falsifié', 'Une photographie ancienne', 'Un texte écrit à la main', TRUE, 'Un deepfake est une vidéo ou audio créé par IA qui imite quelqu''un de manière très réaliste.', 10),

(1, NULL, 'En observant une photo 48h après sa prise', 'En cherchant des indices comme des mains bizarres, des reflets étranges ou des incohérences', 'En utilisant un détecteur IA gratuit sur Internet', 'C''est impossible, les IA sont parfaites', FALSE, 'Les images IA ont souvent des défauts : mains mal formées, texte illisible, incohérences dans l''éclairage.', 10),

(1, NULL, 'Les deepfakes ne concernent que les célébrités', 'On peut tous être victime de deepfakes', 'Les deepfakes sont faciles à créer et demandent peu de données', 'Il faut des milliers d''heures de vidéo pour un deepfake', FALSE, 'Malheureusement, n''importe qui peut être victime de deepfakes, même avec peu de données actuellement.', 10),

(1, NULL, 'Vérifier les sources officielles', 'Partager immédiatement sur les réseaux sociaux', 'Croire un post si beaucoup de gens l''aiment', 'Accepter sans questionner', TRUE, 'L''esprit critique veut dire vérifier les sources avant de croire une information.', 10),

(1, NULL, 'Elle aide à vérifier les fausses images rapidement', 'Elle ne peut pas détecter les deepfakes avancés', 'Elle est gratuite et 100% fiable', 'Elle accélère la propagation des deepfakes', FALSE, 'Même l''IA détectrice de deepfakes a des limites face aux technologies avancées.', 10),

(1, NULL, 'Tweeter sans réfléchir', 'Vérifier la source avant de partager', 'Faire confiance au titre sans lire l''article', 'Croire les images sans les analyser', TRUE, 'Pour combattre la désinformation, il faut vérifier avant de partager.', 10),

(1, NULL, 'Les algorithmes affichent ce que l''utilisateur aime', 'Les algorithmes basent toujours sur la vérité', 'Les algorithmes interdisent les fausses informations', 'Les algorithmes sont tous pareils', TRUE, 'Les algorithmes montrent ce qui engage les utilisateurs, pas nécessairement ce qui est vrai.', 10),

(1, NULL, 'Des bulles de filtre créées par les algorithmes', 'L''absence d''Internet', 'L''éducation gratuite pour tous', 'L''augmentation des journalistes', FALSE, 'Les algorithmes nous montrent des contenus similaires à nos préférences, créant une bulle d''information.', 10),

(1, NULL, 'Favoriser la diversité des sources', 'Suivre uniquement les sources qu''on aime bien', 'Ignorer toute information qui contredit nos idées', 'Partager sans lire l''article', TRUE, 'Briser sa bulle informationnelle veut dire exposer à des idées différentes de manière critique.', 10),

(1, NULL, 'Les biais humains ne s''appliquent pas à l''IA', 'Les IA peuvent reproduire ou amplifier les biais des données d''entraînement', 'L''IA est naturellement équitable', 'Les biais de l''IA n''existent que en théorie', FALSE, 'Les IA apprennent des données historiques qui contiennent souvent des biais, qu''elles reproduisent.', 10),

(1, NULL, 'Tous les contenus d''influence sur les réseaux sont payants', 'Les influenceurs peuvent promouvoir des produits sans discloser cela', 'La publicité dissimulée est interdite partout', 'Les marques ne partenent jamais avec des influenceurs', FALSE, 'La publicité cachée (sans mention "sponsorisé") est un vrai problème sur les réseaux sociaux.', 10),

(1, NULL, 'Tous les articles en ligne viennent de journalistes professionnels', 'N''importe qui peut publier en ligne', 'Seuls les gouvernements peuvent publier en ligne', 'Les réseaux sociaux vérifient chaque post', FALSE, 'Sur Internet, n''importe qui peut publier, ce qui rend la vérification des sources cruciale.', 10),

(1, NULL, 'Une image générée par IA qui montre un événement réel', 'Une image créée par IA d''un événement fictif', 'Une fausse information basée sur des images générées', 'Une photo retouchée légèrement', FALSE, 'Une fake news est une fausse information volontairement créée pour tromper.', 10),

(1, NULL, 'ChatGPT est une conscience artificielle', 'ChatGPT prédit et génère du texte selon ses données d''entraînement', 'ChatGPT comprend vraiment ce qu''il dit', 'ChatGPT ne peut jamais se tromper', FALSE, 'ChatGPT est un modèle qui prédit les séquences probables de mots, ce n''est pas une vraie compréhension.', 10),

(1, NULL, 'C''est toujours positif pour la société', 'Elle a des risques : deepfakes, automatisation, biais algorithmiques', 'C''est une technologie neutre sans risques', 'Elle ne peut être utilisée pour la désinformation', FALSE, 'L''IA a énormément de potentiel positif mais aussi des risques à encadrer.', 10),

(1, NULL, 'Partager un mème sans contexte', 'Consulter plusieurs sources vérifiées', 'Croire un amis qui vous l''a envoyé', 'Regarder une vidéo TikTok rapide', TRUE, 'Pour vérifier une information, il faut consulter plusieurs sources fiables et reconnaître.', 10),

(1, NULL, 'Les réseaux sociaux emploient des fact-checkers', 'Les fausses infos se propagent souvent plus vite que les vraies', 'Chaque post est automatiquement vérifié', 'Les réseaux bannissent immédiatement les mensonges', FALSE, 'Les fake news trouvent de l''engagement sur les réseaux, ce qui les propage rapidement.', 10),

(1, NULL, 'Utiliser le pire outil disponible', 'Cultiver son esprit critique et vérifier les sources', 'Croire tout ce qui est écrit', 'Abandonner Internet', TRUE, 'Face à la désinformation, il faut développer son sens critique : vérifier, analyser, croiser les sources.', 10);

-- ============================================
-- Vrai/Faux sur l'IA et la désinformation
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

-- Vrai/Faux 1-20
(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les images générées par IA peuvent avoir des défauts : mains bizarres, texte illisible, reflets étranges. Un bon observateur peut les détecter.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'ChatGPT a été entraîné sur des milliards de textes et peut générer du contenu remarquablement réaliste.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les deepfakes peuvent être utilisés pour créer de fausses vidéos de politiques, de célébrités ou de n''importe qui.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'L''IA est programmée pour être honnête et ne peut jamais générer d''informations fausses volontairement.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les algorithmes des réseaux sociaux nous montrent surtout du contenu qui nous plaît, ce qui crée une "bulle informationnelle".', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Internet est le moyen le plus fiable pour vérifier une information car tout y est contrôlé.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Une même information peut être présentée différemment selon la source, reflétant un biais ou un parti pris.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les influenceurs doivent légalement indiquer quand ils publicisez un produit qui les rémunère.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les journalistes professionnels ne peuvent jamais se tromper ou publier d''informations inexactes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Checker les sources et croiser les informations sont les meilleures défenses contre la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les deepfakes sont faciles à détecter car la technologie IA n''est pas avancée.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'L''IA peut reproduire les biais contenus dans les données sur lesquelles elle a été entraînée.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les fausses informations partagées rapidement sur les réseaux peuvent influencer les opinions publiques.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Tout ce qui est publié sur un site officiel est automatiquement vrai et vérifiable.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les générateurs d''images IA comme Dall-E peuvent créer des images que personne n''a jamais vues.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Un million de partages d''une information sur les réseaux sociaux la rend automatiquement vraie.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Vérifier une information avant de la partager contribue à réduire la propagation de la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'L''IA est apte à remplacer complètement les fact-checkers et la vérification manuelle.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les deepfakes sont utilisés malveillantement pour tromper les gens ou les nuire.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'L''éducation aux médias et à l''IA est cruciale pour que les jeunes naviguent críticalement dans le monde numérique.', 10);

-- ============================================
-- Questions Image (Réel vs IA) - 1-20
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

-- Image 1-20
(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Cette image d''une personne âgée assise sur un banc avec des pigeons est une vraie photo prise par un photographe.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Cette image de Taylor Swift coiffée d''une couronne d''or futuriste avec des vêtements de science-fiction a été générée par une IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un pape vêtu d''une doudoune Balenciaga rose – cette image surréaliste est un deepfake généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une promenade dans une rue parisienne avec la Tour Eiffel en arrière-plan : une vraie photographie touristique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un chien ayant huit pattes en train de voler dans le ciel avec des ailes arc-en-ciel est clairement une création IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une main avec 8 doigts qui sort d''une tasse de café – un indice classique d''une image générée par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un enfant jouant au foot dans un parc local : une simple photo de vie quotidienne.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une chaise en train de flotter au-dessus d''une tasse de café défiant la gravité – généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un coucher de soleil sur une plage avec des vagues : une photographie naturelle.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un reflet bizarre dans les vitres avec des contours flous et incompréhensibles – signe d''une génération IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une personne tenant un livre dans une bibliothèque : une scène réaliste photographiée.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Quatre doigts sur une main au lieu de cinq – erreur courante des générateurs IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un groupe d''amis rigolant autour d''une table de restaurant : une vraie photo de moment partagé.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une texture de peau bizarrement lisse ou pixelisée avec des zones floues unexpliquées – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un paysage montagneux avec des arbres et un lac : une belle photographie naturelle.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un texte illisible ou des caractères incompréhensibles sur un panneau – les IA luttent avec le texte.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une chat endormi sur un canapé : une photo domestique ordinaire.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une biologie absurde : un oiseau avec des dents ou des yeux asymétriques – générée par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un repas servi dans une assiette : une photographie culinaire normale.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une incohérence dans la composition (murs qui se croisent bizarrement) – indice d''une IA génératrice.', 10);

-- FIN BLOC 1 (60 questions)

-- ============================================
-- BLOC 2 : QCM 21-40
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(1, NULL, 'Les images trouvées sur Google sont toutes vraies', 'Les images proviennent de sources variées et certaines peuvent être manipulées', 'Seules les images officielles existent sur Internet', 'Les images ne sont jamais retouchées', FALSE, 'Sur Internet, n''importe qui peut uploader une image modifiée. Il faut vérifier la source.', 10),

(1, NULL, 'Partager une vidéo virale sans vérifier', 'Chercher qui a créé la vidéo et si elle est authentique', 'Croire que si c''est viral, c''est vrai', 'Faire confiance au compte qui la partage', TRUE, 'Avant de partager, il faut vérifier l''authenticité et la source d''une vidéo.', 10),

(1, NULL, 'À cause de la facilité d''accès à Internet', 'Grâce aux IA générative et aux algorithmes de réseaux sociaux', 'Les IA n''affectent pas la désinformation', 'Internet n''a rien à voir avec cela', FALSE, 'Les IA permettent de créer du contenu faux très convaincant, et les algorithmes l''amplifient.', 10),

(1, NULL, 'L''IA générative et l''IA discriminante', 'L''IA générative crée du contenu, l''IA discriminante peut classer/analyser', 'L''IA ne peut faire qu''une seule chose', 'Les deux sont pareil', TRUE, 'Les IA génératives créent (images, texte), tandis que les discriminantes classifient ou prédisent.', 10),

(1, NULL, 'Pour garder les utilisateurs engagés plus longtemps', 'Pour montrer uniquement la vérité', 'Pour respecter la vie privée', 'Pour économiser de l''énergie', TRUE, 'Les algorithmes optimisent pour l''engagement, pas nécessairement pour la qualité ou la vérité.', 10),

(1, NULL, 'En lisant une seule source très détaillée', 'En croisant plusieurs sources différentes et vérifiées', 'En croyant la première explication trouvée', 'En acceptant l''avis le plus populaire', TRUE, 'La triangulation de sources fiables est la meilleure façon de vérifier une information.', 10),

(1, NULL, 'Une arnaque où on demande des données personnelles par email', 'Un contenu modifié pour tromper', 'Une image floue d''une célébrité', 'Une nouvelle qui n''est pas à jour', FALSE, 'Le phishing est une attaque cybersécurité, pas nécessairement liée à la désinformation IA.', 10),

(1, NULL, 'Elle analyse l''expression faciale et la comparaît avec une vidéo authentique', 'Elle scanne simplement l''image et dit si elle est IA', 'Elle demande à ChatGPT', 'C''est 100% failproof', FALSE, 'Même la détection avancée peut être trompée par des deepfakes très bien créés.', 10),

(1, NULL, 'C''est impossible, l''IA ne peut pas imiter les documents', 'Elle peut créer des documents falsifiés très convaincants', 'L''IA ne communique qu''en texte', 'Les faux documents sont visuellement simples à détecter', FALSE, 'Les IA peuvent générer des faux documents (billet, diplôme, passeport) très réalistes.', 10),

(1, NULL, 'Ignorer complètement Internet et les réseaux', 'Utiliser Internet mais de manière critique et vérifiée', 'Croire tout ce qu''on voit en ligne', 'Accepter les infos d''amis sans vérifier', TRUE, 'Être numérique responsable, c''est utiliser Internet intelligemment, pas l''éviter.', 10),

(1, NULL, 'Seulement les politiques', 'Seulement les célébrités', 'N''importe qui peut être victime', 'Seulement les personnes riches', FALSE, 'Les deepfakes peuvent viser n''importe qui : jeunes, amis, collègues.', 10),

(1, NULL, 'Les fausses infos se répandent plus vite que les vraies', 'Les vraies infos se répandent toujours plus rapidement', 'La vitesse dépend du contenu, pas de la vérité', 'Les algorithmes favorisent la vérité', TRUE, 'Étude scientifique : les mensonges se propagent 6x plus vite que la vérité sur les réseaux.', 10),

(1, NULL, 'Partager sans vérifier le contexte', 'Lire l''article complet et chercher le contexte original', 'Partager juste le titre', 'Faire confiance à la source sans question', TRUE, 'Beaucoup partagent juste le titre : il faut lire l''article complet pour bien comprendre.', 10),

(1, NULL, 'Une vidéo où quelqu''un parle différemment', 'Une vidéo où la personne dit des choses qu''elle n''aurait pas dites', 'Un texte écrit bizarrement', 'Une photo sans couleur', FALSE, 'Un deepfake video peut faire dire à quelqu''un des choses qu''elle n''a jamais dites.', 10),

(1, NULL, 'L''IA remplace les humains dans les médias', 'L''IA et les humains doivent collaborer pour plus d''éthique', 'L''IA n''a pas d''impact sur les médias', 'L''IA aidera seulement les fakes news', FALSE, 'L''IA peut aider (analyse, vérification) comme elle peut nuire (deepfakes). La collaboration est clé.', 10),

(1, NULL, 'En posant les bonnes questions et en pensant par soi-même', 'En mémorisant tous les fakes news', 'En refusant tout contenu nouveau', 'En ignorant les réseaux sociaux', TRUE, 'L''esprit critique, c''est questioner, vérifier, analyser plutôt que croire aveuglément.', 10),

(1, NULL, 'Oui, tout ce qui est écrit en ligne est vrai', 'Non, beaucoup de contenu en ligne est faux ou manipulé', 'Uniquement ce qui est sur Wikipédia', 'Seulement les nouvelles officielles', FALSE, 'Internet contient une énorme quantité de fausses infos, d''où l''importance de vérifier.', 10),

(1, NULL, 'En comparant les pixels et les couleurs', 'En cherchant des incohérences logiques, géométriques ou biologiques', 'C''est impossible', 'Avec un simple détecteur en ligne', FALSE, 'Observer les mains, la géométrie, la physique, les objets bizarres aide à détecter les IA.', 10),

(1, NULL, 'Elle crée du texte très réaliste et cohérent', 'Elle comprend vraiment les sujets', 'Elle a ses propres opinions', 'Elle ne peut jamais se tromper', FALSE, 'ChatGPT génère du texte probable : elle peut halluci​ner ou inventer des infos fausses.', 10),

(1, NULL, 'Combattre la désinformation en ligne', 'Éduquer aux médias et à l''IA', 'Développer l''esprit critique chez les jeunes', 'Tout ce qui précède', TRUE, 'Éducation, critique et action ensemble combattent efficacement la désinformation.', 10);

-- ============================================
-- BLOC 2 : Vrai/Faux 21-40
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les IA peuvent être entraînées sur des données contenant des préjugés, et reproduisent ces biais.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les réseaux sociaux vérifient automatiquement chaque information avant publication.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les informations partagées par des amis peuvent aussi être fausses ou trompeuses.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'L''IA ne peut créer que du texte, pas d''images ou de vidéos.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les générateurs d''images IA comme Dall-E, Midjourney créent du contenu à partir d''un texte.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les bulles informationnelles nous enferment dans nos propres idées et opinions.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Un article viral sur les réseaux sociaux est automatiquement vérifié et fiable.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les influenceurs reçoivent souvent de l''argent pour promouvoir un produit sans le dire.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Des deepfakes peuvent être utilisés pour manipuler l''opinion publique.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'C''est facile de reconnaître une image générée par IA juste en la regardant.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les deepfakes représentent un risque pour la sécurité personnelle et l''identité.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les titres sensationnalistes peuvent tromper les gens sans lire le contenu complet.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Seules les personnes sans éducation sont victimes de désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'L''IA peut être utilisée pour à la fois créer et détecter des deepfakes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les médias traditionnels font aussi des erreurs et peuvent diffuser des infos inexactes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les gouvernements contrôlent 100% de ce qu''on voit sur les réseaux sociaux.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La désinformation peut influencer les élections et les décisions politiques.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les mèmes et les images drôles peuvent aussi contenir de fausses informations.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Googler rapidement est la meilleure façon de vérifier une information complexe.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'L''IA générative peut produire du contenu convaincant mais techniquement faux en quelques secondes.', 10);

-- ============================================
-- BLOC 2 : Image (Réel vs IA) 21-40
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une femme portant des vêtements qui changent de texture comme de la lave liquide autour de son corps – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un jeune homme dans un magasin achetant un café : une photographie quotidienne classique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des bâtiments avec une architecture surréaliste impossibles géométriquement – généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une femme souriant avec sa famille lors d''un repas de famille : une simple photo de réunion.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une main humaine se transformant en patte d''animal – impossible réellement, générée par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un marché avec des étals de fruits et légumes : une vraie photographie de commerce.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des bijoux qui brillent avec des reflets étrangement pixelisés – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un enfant dormant dans son lit la nuit : une photo sentimentale normale.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une personne ayant 11 doigts sur chaque main – erreur classique des générateurs IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Deux chats jouant ensemble sur un tapis : une photo animalière authentique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un robot qui fond physiquement comme du métal liquide – une création IA surréaliste.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un bureau avec ordinateur et documents : un espace de travail photographié.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des yeux qui n''ont pas la même forme ou taille sur le même visage – glitch de l''IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un paysage forestier avec des arbres, mousse et rochers : une naturelle photographie.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un objet qui existe en plusieurs copies avec des deformations bizarres – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une fille lisant un livre dans une bibliothèque : une scène de lecture réaliste.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un reflet qui ne suit pas les lois physiques de la réflexion – signe d''IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une plage avec des vagues et du sable : une photographie de vacances.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des lettres qui changent légèrement dans la même image – les IA n''arrivent pas bien avec le texte.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un gâteau d''anniversaire avec des bougies allumées : une photo de célébration.', 10);

-- ============================================
-- BLOC 3 : QCM 41-60
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(1, NULL, 'Elle aide à combattre la désinformation', 'Elle amplifie toujours les fausses infos', 'Elle n''a aucun impact', 'Elle supprime Internet', TRUE, 'L''IA détectrice peut aider à identifier les deepfakes, même si pas parfaite.', 10),

(1, NULL, 'Oui, complètement fiable', 'C''est un outil, pas une solution miracle', 'L''IA ne peut rien détecter', 'Les deepfakes ne peuvent pas être détectés', FALSE, 'La technologie de détection aide mais a des limites face aux deepfakes avancés.', 10),

(1, NULL, 'Elle rend la désinformation impossible', 'Elle crée de nouveaux défis en permettant le contenu faux réaliste', 'L''IA ne change rien à la désinformation', 'Elle protège les gens automatiquement', FALSE, 'L''IA générative crée de nouveaux risques de désinformation avec du contenu très convaincant.', 10),

(1, NULL, 'Partager tous les mèmes qu''on trouve drôles', 'Vérifier si le message du mème est factuellement correct', 'Croire que c''est forcément une blague', 'Ne jamais partager de mèmes', TRUE, 'Les mèmes peuvent véhiculer des fausses infos sous couvert d''humour.', 10),

(1, NULL, 'À la vitesse d''Internet', 'En quelques secondes avec l''IA générative', 'Cela prend des mois', 'C''est très lent avec l''IA', FALSE, 'Les IA génératives créent du contenu en secondes, ce qui accélère la désinformation.', 10),

(1, NULL, 'Jamais, l''IA est parfaite', 'Oui, l''IA peut générer des informations factuellement fausses involontairement', 'L''IA ne donne que la vérité', 'ChatGPT ne ment jamais', FALSE, 'L''IA peut "halluciner" et inventer des infos fausses qui sonnent très réalistes.', 10),

(1, NULL, 'Chercher le bouton "vérifier la source"', 'Regarder le profil du compte, vérifier la date, chercher l''article source', 'Croire automatiquement si c''est trending', 'Accepter ce qu''on lit sans analyser', TRUE, 'Pour vérifier une info partagée, il faut remonter à la source originale.', 10),

(1, NULL, 'Les IA ne sont jamais biaisées', 'Les IA reflètent les biais des données d''entraînement', 'Les biais humains n''existent pas', 'L''IA crée de biais supplémentaires toujours', FALSE, 'Si les données contiennent des biais, l''IA les apprend et les reproduit.', 10),

(1, NULL, 'Une personne qui partage et propage des mensonges volontairement', 'Une personne qui accepte et partage des infos sans les vérifier', 'Un journaliste qui écrit', 'Un scientifique qui cherche la vérité', FALSE, 'Un désinformateur peut aussi être quelqu''un qui partage sans vérifier.', 10),

(1, NULL, 'C''est pire car cela touche l''identité des gens', 'C''est utile pour les arts seulement', 'C''est moins grave que les deepfakes texte', 'C''est seulement un jeu', FALSE, 'Les deepfakes vidéo représentent un grave risque pour la réputation et la sécurité.', 10),

(1, NULL, 'En ignorant les réseaux complètement', 'En étant actif mais critique et vérificateur sur les réseaux', 'En partageant sans lire', 'En croyant tout ce qu''on voit', TRUE, 'Être responsable en ligne, c''est utiliser les réseaux intelligemment.', 10),

(1, NULL, 'Parce que les algorithmes la favorisent pour l''engagement', 'Parce que la vérité est ennuyeuse', 'Parce que tout le monde ment', 'Parce que l''IA crée que du faux', TRUE, 'Les algorithmes optimisent l''engagement, et les mensonges créent plus d''engagement.', 10),

(1, NULL, 'C''est gratuit, donc fiable', 'Il faut vérifier la méthode et la source du détecteur', 'Tous les détecteurs IA sont égaux', 'Les détecteurs en ligne sont parfaits', FALSE, 'Les outils en ligne peuvent avoir des erreurs. Mieux vaut en combiner plusieurs.', 10),

(1, NULL, 'À ceux qui lisent les articles complets', 'À ceux qui partagent sans lire', 'À ceux qui vérifient les sources', 'À ceux qui posent des questions', FALSE, 'Les gens qui partagent sans lire sont plus vulnérables à la désinformation.', 10),

(1, NULL, 'Un mensonge partagé par beaucoup de gens', 'Une information vérifiée par des experts', 'Un texte long sans source', 'Une vidéo de qualité médiocre', TRUE, 'La désinformation peut être populaire : la popularité ne prouve pas la vérité.', 10),

(1, NULL, 'Contrôler la pensée des jeunes', 'Leur apprendre à penser critiquement et vérifier les sources', 'Interdire Internet', 'Partager plus de contenu IA', FALSE, 'L''éducation aux médias enseigne l''autonomie et l''esprit critique, pas le contrôle.', 10),

(1, NULL, 'Unique et inalérable', 'Peut être modifiée avec des techniques appropriées', 'Impossible à changer', 'Protégée par la loi toujours', FALSE, 'Les données biométriques peuvent être utilisées par les deepfakes pour usurper l''identité.', 10),

(1, NULL, 'Oui, grâce aux détecteurs IA', 'Non, beaucoup passent à travers sans être détectés', 'Tous les deepfakes sont détectés', 'Les deepfakes disparaissent d''eux-mêmes', FALSE, 'Des deepfakes très avancés peuvent échapper à la détection, même les meilleures.', 10),

(1, NULL, 'Critiquer les fake news sans agir', 'Partager des ressources éducatives et signaler le contenu dangereux', 'Faire confiance que les réseaux vont tout résoudre', 'Ignorer le problème', TRUE, 'Chacun peut contribuer en signalant, en éduquant et en partageant intelligemment.', 10),

(1, NULL, 'Impossible, les IA are too advanced', 'Oui, en étant attentif aux défauts et aux incohérences', 'Seulement avec des outils payants', 'Never, ce sera la fin des vraies images', FALSE, 'Avec le temps et la pratique, on peut apprendre à identifier les images IA.', 10);

-- ============================================
-- BLOC 3 : Vrai/Faux 41-60
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Il est plus facile de partager rapidement une fausse info que de vérifier sa véracité.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les algorithmes sont programmés pour favoriser la vérité plutôt que l''engagement.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La désinformation peut influencer les comportements, les opinions et les décisions des gens.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les images générées par IA peuvent être très réalistes et tromper les gens.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Une personne éduquée ne peut jamais être victime de désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les journalistes peuvent faire des erreurs involontaires dans leurs reportages.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les réseaux sociaux facilitent la propagation rapide de fausses informations.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Seuls les réseaux sociaux diffusent de la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les deepfakes pose un risque pour la sécurité des élections et de la démocratie.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'L''IA générative peut crée du texte, des images et des vidéos réalistes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Tous les influenceurs divulguent clairement quand ils publicisent un produit payé.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les bulles informationnelles nous isolent des opinions différentes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'On peut être manipulé par une fausse information même si on pense être critique.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Si un article a beaucoup de likes, cela garantit qu''il est vrai.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La vérification des sources demande du temps, mais c''est crucial contre la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les mèmes peuvent contenir des informations fausses ou trompeuses.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'L''IA ne peut jamais être utilisée pour combattre la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les données personnelles peuvent être utilisées pour créer des deepfakes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Une image officiellement publiée sur un site gouvernemental est nécessairement vraie.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La littératie médias est une compétence essentielle au 21e siècle.', 10);

-- ============================================
-- BLOC 3 : Image (Réel vs IA) 41-60
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une femme avec une moitié du corps faite de cristal et l''autre de chair – impossible réellement, créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un enfant jouant avec un ballon dans un jardin : une scène enfantine normale.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des cheveux qui changent de couleur et de texture dans une même image – glitch IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un homme travaillant à son bureau avec un ordinateur : une photo de travail classique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un bâtiment qui ça penche d''un côté de manière surréaliste – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un groupe de gens partageant un repas : une vraie scène de convivialité.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des dents qui sortent de manière incohérente du visage – erreur IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une fleur avec ses détails naturels : une photographie botanique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des yeux avec des pupilles de tailles différentes – signe de génération IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un coucher de soleil sur l''océan : une vraie photographie naturelle.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une main avec des doigts mal proportionnés et des articulations bizarres – généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un chien courant dans un parc : une photo animalière authentique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un objet qui flotte mystérieusement sans support visible défiant la gravité – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un portrait d''une personne souriante : une vraie photographie.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une texture de tissu qui change bizarrement de motif – glitch IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une rue animée avec voitures et piétons : une vraie photo urbaine.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un reflet de miroir qui ne correspond pas à l''objet – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Des fleurs dans un vase : une nature morte photographiée.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'De l''eau qui coule dans des directions incohérentes – générée par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un paysage montagneux avec neige : une belle photo naturelle.', 10);

-- ============================================
-- BLOC 4 : QCM 61-80
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(1, NULL, 'Les données d''entraînement contenaient des biais', 'L''IA a ses propres préjugés moraux', 'C''est un bug du code', 'L''IA est naturellement biaisée', TRUE, 'Les IA apprennent des biais présents dans les données historiques.', 10),

(1, NULL, 'C''est une exagération', 'C''est un risque réel et croissant', 'Les deepfakes ne sont qu''une boutade', 'C''est impossible techniquement', FALSE, 'Les deepfakes sont déjà utilisés malveillantement pour tromper et nuire.', 10),

(1, NULL, 'À ceux qui ignorent Internet', 'À tout le monde, quel que soit le niveau d''éducation', 'Aux enfants seulement', 'Aux personnes âgées uniquement', FALSE, 'La désinformation cible tout le monde : jeunes, adultes, experts inclus.', 10),

(1, NULL, 'Partager rapidement avec tes amis', 'Prendre du temps pour vérifier la source', 'Chercher qui d''autre partage la même info', 'Croire le titre sans lire', TRUE, 'Vérifier prend du temps mais c''est crucial avant de partager.', 10),

(1, NULL, 'Pour protéger la vie privée des gens', 'Pour optimiser l''engagement et les revenus publicitaires', 'Pour la sécurité des utilisateurs', 'Pour montrer seulement du contenu pertinent', FALSE, 'Les algorithmes optimisent surtout pour l''engagement, générant des revenus pubs.', 10),

(1, NULL, 'Elle comprend vraiment les nuances', 'Elle prédit le prochain mot probable basé sur des patterns', 'Elle lit et comprend comme un humain', 'Elle a une vraie conscience', FALSE, 'ChatGPT est un modèle de prédiction statistique, pas une vraie compréhension.', 10),

(1, NULL, 'Partager de la désinformation délibérément', 'Chercher et partager des infos sans les vérifier au préalable', 'Écrire un article factuel basé sur des sources', 'Être journaliste professionnel', TRUE, 'La désinformation peut aussi venir de gens qui ne cherchent pas à vérifier.', 10),

(1, NULL, 'C''est seulement un problème religieux', 'C''est une menace pour la sécurité et la démocratie', 'C''est un problème sans gravité', 'C''est amusant et inoffensif', FALSE, 'Les deepfakes menacent l''intégrité électorale et la sécurité personnelle.', 10),

(1, NULL, 'À l''aide du détecteur IA seulement', 'En combinant plusieurs approches : analyse visuelle, détecteurs IA, fact-checking', 'C''est imposible', 'En ignorant l''image', TRUE, 'Combiner plusieurs méthodes est plus efficace qu''une seule.', 10),

(1, NULL, 'Les vrais journalistes ne publient jamais d''infos fausses', 'Les médias peuvent aussi faire des erreurs ou avoir des biais', 'Tous les médias sont également fiables', 'Les médias sont tous corrompus', FALSE, 'Même les médias professionnels peuvent errer, d''où l''importance de vérifier.', 10),

(1, NULL, 'C''est seulement un problème pour les adultes', 'C''est un problème qui touche les jeunes comme les adultes', 'Les jeunes ne sont jamais victimes', 'Les jeunes inventent toutes les fausses infos', FALSE, 'Les jeunes peuvent aussi être victimes ou vecteurs de désinformation.', 10),

(1, NULL, 'Regarder des médias traditionnel seulement', 'Utiliser une diversité de sources et d''approches critiques', 'Ignorer complètement les réseaux sociaux', 'Suivre un seul influenceur', TRUE, 'La diversité des sources aide à avoir une vision plus complète et équilibrée.', 10),

(1, NULL, 'Elle aide seulement les artistes', 'Elle pose de sérieux problèmes éthiques et légaux', 'Elle n''a aucun impact', 'C''est une technologie sans risques', FALSE, 'L''IA générative pose d''énormes questions sur l''authentification et l''éthique.', 10),

(1, NULL, 'À partager tout sans penser', 'À penser avant de partager et à vérifier', 'À croire les mèmes', 'À ignorer les source', TRUE, 'Avant de partager, demande-toi : d''où ça vient ? C''est vrai ? ', 10),

(1, NULL, 'Les gouvernements interdisent les deepfakes', 'Les deepfakes restent difficiles à réguler légalement et techniquement', 'Les deepfakes sont tous bloqués automatiquement', 'Il n''y a pas de solutions possibles', FALSE, 'Réguler les deepfakes reste un défi legal et technique complexe.', 10),

(1, NULL, 'Aucune, c''est trop tard', 'Education, technologie de détection, régulation et conscience collective', 'Abandonner Internet', 'Donner tous les pouvoirs aux IA', FALSE, 'Combiner éducation, technologie et régulation peut aider à limiter les dégâts.', 10),

(1, NULL, 'C''est seulement sur TikTok', 'C''est un problème sur tous les réseaux et plateformes', 'Les réseaux sociaux n''ont pas ce problème', 'Youtube est épargné', FALSE, 'La désinformation existe sur tous les réseaux : Instagram, Twitter, Facebook, TikTok...', 10),

(1, NULL, 'Jamais, c''est impossible', 'Oui, mais cela demande connaissance technique et vigilance', 'Avec n''importe quel téléphone', 'Les IA ne peuvent jamais être trompées', FALSE, 'Certains experts peuvent tromper les détecteurs IA en modifiant légèrement le contenu.', 10),

(1, NULL, 'Seulement des célèbrités négatives', 'N''importe quel type de contenu : politique, commerce, crime, etc.', 'Seulement des vidéos amusantes', 'Pas de contenu criminel', FALSE, 'Les deepfakes peuvent être utilisés pour du chantage, des arnaques, du vol d''identité.', 10),

(1, NULL, 'Pas important en 2026', 'Cruciale pour naviguer un monde d''infos mélangées', 'Seulement pour les professionnels des médias', 'Existe pas vraiment', TRUE, 'La littératie médias est une compétence essentielle pour tous actuellement.', 10);

-- ============================================
-- BLOC 4 : Vrai/Faux 61-80
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les IA génératives ne peuvent créer que du texte, pas d''images.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Un mensonge dit mille fois peut sembler vrai pour beaucoup de gens.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les cyberattaques utilisent souvent de fausses informations pour distraire.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Tous les faux documents créés par IA sont immédiatement détectables.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les réseaux sociaux ont une responsabilité dans la propagation de la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Un fact-checker est quelqu''un qui vérifie les informations avant publication.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les parents n''ont pas besoin d''éduquer leurs enfants sur Internet.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Des études montrent que les mensonges se propagent plus vite que les vérités.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'L''IA générative ChatGPT ne commet jamais d''erreurs factuelles.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'L''utilisation de sources d''images fiables est importante pour éviter les fausses images.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La liberté d''expression doit être équilibrée avec la responsabilité de dire la vérité.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les deepfakes ne peuvent affecter que les personnes publiques.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La désinformation peut causer des dégâts psychologiques et sociaux.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Chercher des sources multiples est une perte de temps.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les utilisateurs doivent apprendre à identifier les publicités déguisées en contenu.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les deepfakes deviennent techniquement plus difficiles à détecter au fil du temps.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Un site avec beaucoup de publicités est toujours une source fiable d''infos.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les IA peuvent être entraînes à détecter et combattre d''autres IA.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les enfants ne sont pas concernés par la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La transparence sur l''utilisation de l''IA est importante pour la confiance.', 10);

-- ============================================
-- BLOC 4 : Image (Réel vs IA) 61-80
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un élephant translucide avec des ailes de papillon – clairement généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une fille tenant un parapluie sous la pluie : une vraie photo d''un jour pluvieux.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des bâtiments avec des portes et fenêtres qui ne correspondent pas – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un repas cuisinésprésenté sur une table : une photo culinaire réelle.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une personne avec des oreilles en positions bizarres ou asymétriques – générée par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Des enfants jouant dans un parc : une vraie scène de loisir.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une chaise avec quatre jambes d''une même longueur impossible – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un coucher de soleil coloré : une magnifique photographie naturelle.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des lettres qui changent de police ou de taille de manière incohérente – IA signe.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un cafè avec des clients : une vraie photo du quotidien.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des mains avec des doigts qui se chevauchent bizarrement – erreur classique IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un paysage urbain avec rues et buildings : une vraie photo de ville.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une personne qui semble fondre physiquement à la limite de l''image – généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un animal dans son habitat naturel : une photo de faune authentique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un reflet dans l''eau qui ne correspond pas à la position de l''objet – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une forêt avec arbres, feuilles et lumière naturelle : une vraie photographie.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des motifs ou textures qui semblent imposibles géométriquement – signe d''IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un vélo dans une rue : une photo de transport vélos ordinaire.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un ciel avec des nuages de formes impossibles – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une bibliothèque avec des livres : une vraie photo de lieu de connaissance.', 10);

-- ============================================
-- BLOC 5 : QCM 81-100
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(1, NULL, 'C''est la même chose', 'La désinformation est volontaire, la misinformation involontaire', 'Il n''y a pas de différence', 'La désinformation n''existe pas', FALSE, 'Désinformation = mensonge intentionnel. Misinformation = erreur involontaire.', 10),

(1, NULL, 'Partager rapidement sans lire', 'Lire l''article en entier avant de partager', 'Faire confiance au titre seulement', 'Croire ce qu''on voit', TRUE, 'Il faut lire complètement avant de partager pour éviter la désinformation involontaire.', 10),

(1, NULL, 'Elle sauve les gens des fausses infos', 'Elle crée de nouveaux types de fausses infos plus réalistes', 'Elle supprime Internet', 'Elle rend toutes les infos vraies', FALSE, 'L''IA générative,simultainément, crée et combat la désinformation.', 10),

(1, NULL, 'Jamais, les algorithmes sont neutres', 'Oui, les algorithmes peuvent amplifier certains points de vue', 'Les algorithmes n''influencent rien', 'C''est seulement sur TikTok', FALSE, 'Les algorithmes favorisent content qui crée engagement, pouvant amplifier certains points de vue.', 10),

(1, NULL, 'C''est une nécessité pour la sécurité', 'C''est une violation grave de la vie privée', 'C''est pratique pour vérifier les infos', 'La surveillance aide tous les gens', FALSE, 'Bien que techniquement possible, la surveillance de masse en ligne soulève des questions éthiques graves.', 10),

(1, NULL, 'Les IA apprennent exactement comme les humains', 'Les IA apprennent selon des patterns mathématiques dans les données', 'Les IA comprennent vraiment', 'Les IA ont une conscience', FALSE, 'Les IA apprennent par patterns statistiques, pas vraiment comprendront.', 10),

(1, NULL, 'C''est impossible', 'Oui, en créant de fausses lignes de preuve ou de faux «experts»', 'Seuls les réseaux sociaux peuvent faire ça', 'Les scientifiques ne peuvent jamais être trompés', FALSE, 'Les IA peuvent créer des preuves scientifiques fausses très convaincantes.', 10),

(1, NULL, 'Toujours, c''est plus sûr', 'Rarement, cela crée une fausse confiance', 'Jamais, cela ralentit tout', 'Les anonymes sont plus honnêtes', FALSE, 'L''anonymat peut paradoxalement augmenter la désinformation (absence de responsabilité).', 10),

(1, NULL, 'Elle ne peut parler que d''un sujet', 'Elle peut générer du contenu sur presque n''importe quel sujet', 'Elle refuse de créer du contenu', 'Elle n''est bonne qu''en mathématiques', FALSE, 'ChatGPT peut écrire sur une infinité de sujets, d''où le risque de fausse expertise.', 10),

(1, NULL, 'Uniquement pour les jeunes', 'Pour tout le monde : jeunes, adultes, seniors, experts', 'Seulement pour les moins éduqués', 'Seuls les enfants en ont besoin', FALSE, 'L''éducation aux médias est essentielle pour TOUS, quel que soit l''âge.', 10),

(1, NULL, 'C''est sauver la vérité', 'C''est parfois utile, souvent dangereux', 'C''est un super pouvoir', 'C''est toujours moral', FALSE, 'L''IA générative est un outil neutre : son utilité dépend de son utilisation.', 10),

(1, NULL, 'Vérifier rapidement une seule source', 'Croiser au moins 3 sources indépendantes avant de conclure', 'Croire la source la plus populaire', 'Ignorer les faits alternatifs', TRUE, 'La triangulation (3+ sources) augmente la fiabilité de votre vérification.', 10),

(1, NULL, 'C''est une théorie, pas un risque réel', 'C''était déjà utilisémalveillantement, c''est un risque actuel', 'Les deepfakes ne trompent jamais', 'C''est impossible à créer', FALSE, 'Des deepfakes ont déjà été utilisés pour du chantage, des arnaques, de la désinformation.', 10),

(1, NULL, 'Accepter tout ce qu''on lit en ligne', 'Développer son esprit critique et sa vérification de sources', 'Croire uniquement les médias traditionnels', 'Ignorer complètement Internet', TRUE, 'La clé est l''équilibre : utiliser Internet intelligemment avec analyse critique.', 10),

(1, NULL, 'C''est garanti de réduire la désinformation pneu', 'C''est un outil utile mais pas suffisant seul', 'La technologie ne peut rien faire', 'Ça rend pire', FALSE, 'La technologie peut aider (détecteurs IA, blockchain) mais pas résoudre seule.', 10),

(1, NULL, 'Ne rien partager jamais', 'Partager intelligemment : vérifier, analyser, diversifier les sources', 'Partager tout ce qu''on voit', 'Partager seulement les mèmes', TRUE, 'Partager intelligemment est une responsabilité numérique essentielle.', 10),

(1, NULL, 'C''est scientifiquement prouvé impossible', 'C''est difficile mais possible avec effort et vigilance', 'Tous les biais sont éliminables', 'Les biais n''existent que dans l''IA', FALSE, 'Réduire les biais de l''IA est un processus constant, jamais 100% complet.', 10),

(1, NULL, 'Seulement la police peut vérifier les infos', 'Chacun peut contribuer en vérifiant et signalant le contenu douteux', 'Les gouvernements doivent vérifier tout', 'Seuls les experts scientifiques peuvent vérifier', FALSE, 'Chacun a un rôle dans la lutte contre la désinformation : vérifier et signaler.', 10),

(1, NULL, 'À cause du manque de technologie', 'À cause de la complexité des algorithmes et des vecteurs d''attaque multiples', 'C''est facile de réguler', 'La régulation n''existe pas', FALSE, 'Réguler la désinformation est complexe : techniquement, légalement, culturellement.', 10),

(1, NULL, 'C''est impossible aujourd''hui', 'Oui, en combinant transparence, audit et régulation', 'Les IA ne peuvent jamais être audittées', 'La transparence tue l''innovation', FALSE, 'Audit, transparence et régulation peuvent améliorer la confiabilité et l''équité de l''IA.', 10);

-- ============================================
-- BLOC 5 : Vrai/Faux 81-100
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les bots sociaux peuvent automatiquement amplifier certains messages en ligne.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Internet a rendu la vérification des informations plus facile qu''avant.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Une vidéo peut être manipulée pour montrer quelque chose qui ne s''est jamais produit.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les images de stock ne peuvent jamais être manipulées ou utilisées hors contexte.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les IA peuvent générer des textes académiques convincants mais factuellement faux.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La polarisation des opinions est amplifiée par les bulles informationnelles.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les publicités en ligne sont toujours clairement identifiées comme telles.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Une information partagée par un scientifique peut encore être fausse.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les gouvernements maîtrisent parfaitement la désinformation sur Internet.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les médias sociaux conservent les données utilisateurs qui peuvent être utilisées pour des deepfakes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'L''éducation au numérique dès l''école primaire est bénéfique.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Vérifier chaque information prend moins d''une seconde.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les historiens et archéologues doivent adapter leurs méthodes face aux deepfakes.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'L''authenticité d''une image est facile à garantir avec la technologie actuelle.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les données sur les réseau sociaux peuvent être utilisées pour créer des IA plus sophisti​quées.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La vérifcation des sources est une tâche continuellement plus difficile.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les enfants complètement protégés d''Internet ne subissent pas les effets de la désinformation.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'Les deepfakes pourraient être utilisés pour influencer les élections futures.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, FALSE, 'Les IA ne peuvent jamais apprendre à mieux détecter les autres IA.', 10),

(2, NULL, 'Vrai', 'Faux', NULL, NULL, TRUE, 'La collaboration entre humains et IA est nécessaire pour combattre la désinformation.', 10);

-- ============================================
-- BLOC 5 : Image (Réel vs IA) 81-100
-- ============================================

INSERT INTO Jeu_quizz (type_question, media_url, option_a, option_b, option_c, option_d, reponse_correcte, explication, points_accordes) VALUES

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une fusée qui traverse un nuage en déformant l''air de manière impossible – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un enfant dessinant sur le sol avec une craie : une vraie photo de jeu.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une main qui s''étiré vers l''infini de manière surréaliste – généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une piscine avec reflets d''eau naturels : une vraie photo de loisir.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un objet qui existe dans plusieurs états contradictoires – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un jardin avec fleurs et plantes : une vraie photo botanique.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des yeux qui regardent dans deux directions différentes – erreur classique IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une montagne enneigée au loin : une vraie photographie de paysage.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des murs qui se croisent de manière géométriquement impossible – généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une personne faisant du skateboard dans un parc : une vraie photo de sport.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une couleur qui transition bizarrement sans dégradé progressif – signe d''IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Une famille au cinéma regardant un film : une vraie photo de loisir.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un visage avec une expression anatomiquement impossible – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un chat dormant paisiblement : une vraie photo animale.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Une texture de cuir qui semble vivante ou mouvante – généré par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un marché nocturne avec lumières artificielles : une vraie photo urbaine.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Un ciel avec des constellations qui ne correspondent à aucune réalité – créé par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un apiculteur travaillant avec des ruches : une vraie photo de travail.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, FALSE, 'Des fleurs qui poussent en spirale impossible – générée par IA.', 10),

(3, NULL, 'Réel', 'IA', NULL, NULL, TRUE, 'Un musée avec peintures et sculptures : une vraie photo de culture.', 10);