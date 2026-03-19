USE specialweek;

UPDATE type_question_quizz
SET name = CONVERT(BINARY(CONVERT(name USING latin1)) USING utf8mb4)
WHERE id = 3;

UPDATE jeu_quizz
SET
  option_a = COALESCE(CONVERT(BINARY(CONVERT(option_a USING latin1)) USING utf8mb4), option_a),
  option_b = COALESCE(CONVERT(BINARY(CONVERT(option_b USING latin1)) USING utf8mb4), option_b),
  option_c = COALESCE(CONVERT(BINARY(CONVERT(option_c USING latin1)) USING utf8mb4), option_c),
  option_d = COALESCE(CONVERT(BINARY(CONVERT(option_d USING latin1)) USING utf8mb4), option_d),
  explication = COALESCE(CONVERT(BINARY(CONVERT(explication USING latin1)) USING utf8mb4), explication);

UPDATE jeu_swiper
SET explication = COALESCE(CONVERT(BINARY(CONVERT(explication USING latin1)) USING utf8mb4), explication);

UPDATE jeu_chasse_anomalies
SET
  titre_image = COALESCE(CONVERT(BINARY(CONVERT(titre_image USING latin1)) USING utf8mb4), titre_image),
  explication = COALESCE(CONVERT(BINARY(CONVERT(explication USING latin1)) USING utf8mb4), explication);

