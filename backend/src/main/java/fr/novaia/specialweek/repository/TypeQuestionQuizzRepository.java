package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.TypeQuestionQuizz;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for quiz question types.
 */
public interface TypeQuestionQuizzRepository extends JpaRepository<TypeQuestionQuizz, Integer> {
}

