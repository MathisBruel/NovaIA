package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.ReponseMytho;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for mytho answers.
 */
public interface ReponseMythoRepository extends JpaRepository<ReponseMytho, Integer> {
}

