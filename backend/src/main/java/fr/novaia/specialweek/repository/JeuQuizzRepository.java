package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.JeuQuizz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JeuQuizzRepository extends JpaRepository<JeuQuizz, Integer> {
}

