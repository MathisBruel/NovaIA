package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.Profil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for profile persistence.
 */
public interface ProfilRepository extends JpaRepository<Profil, Integer> {

    /**
     * Finds a profile by email.
     *
     * @param mail email address
     * @return optional profile
     */
    Optional<Profil> findByMail(String mail);
}

