package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.QuestionMytho;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for mytho questions.
 */
public interface QuestionMythoRepository extends JpaRepository<QuestionMytho, Integer> {
}

