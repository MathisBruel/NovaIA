package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.JeuQuizz;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for quiz games.
 */
public interface JeuQuizzRepository extends JpaRepository<JeuQuizz, Integer> {
}

