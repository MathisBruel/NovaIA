package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.JeuChasseAnomalies;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for anomaly hunt games.
 */
public interface JeuChasseAnomaliesRepository extends JpaRepository<JeuChasseAnomalies, Integer> {
}

