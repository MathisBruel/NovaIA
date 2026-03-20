USE specialweek;

CREATE TABLE IF NOT EXISTS `profil` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`prenom` varchar(50) NOT NULL,
	`nom` varchar(50) NOT NULL,
	`mail` varchar(100) NOT NULL,
	`mdp` varchar(50) NOT NULL,
	`points` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `jeu_quizz` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`type_question` int NOT NULL,
	`media_url` varchar(255),
	`option_a` varchar(255) NOT NULL,
	`option_b` varchar(255) NOT NULL,
	`option_c` varchar(255),
	`option_d` varchar(255),
	`reponse_correcte` boolean NOT NULL,
	`explication` varchar(255) NOT NULL,
	`points_accordes` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `jeu_chasse_anomalies` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`image_url` text NOT NULL,
	`titre_image` varchar(255) NOT NULL,
	`coordonnes_anomalie_json` text NOT NULL,
	`explication` varchar(255) NOT NULL,
	`points_accordes` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `jeu_swiper` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`image_post_url` text NOT NULL,
	`est_fiable` boolean NOT NULL,
	`explication` varchar(255) NOT NULL,
	`points_accordes` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `type_question_quizz` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `question_mytho` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`id_reponses` int,
	`question` varchar(255) NOT NULL,
	`est_coherent` boolean,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `reponse_mytho` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`reponse_1` varchar(255) NOT NULL,
	`reponse_2` varchar(255) NOT NULL,
	`question_answer_1` int NOT NULL,
	`question_answer_2` int NOT NULL,
	PRIMARY KEY (`id`)
);


ALTER TABLE `jeu_quizz` ADD CONSTRAINT `jeu_quizz_fk1` FOREIGN KEY (`type_question`) REFERENCES `type_question_quizz`(`id`);



ALTER TABLE `question_mytho` ADD CONSTRAINT `question_mytho_fk1` FOREIGN KEY (`id_reponses`) REFERENCES `reponse_mytho`(`id`);
ALTER TABLE `reponse_mytho` ADD CONSTRAINT `reponse_mytho_fk3` FOREIGN KEY (`question_answer_1`) REFERENCES `question_mytho`(`id`);

ALTER TABLE `reponse_mytho` ADD CONSTRAINT `reponse_mytho_fk4` FOREIGN KEY (`question_answer_2`) REFERENCES `question_mytho`(`id`);

