package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.Profil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfilRepository extends JpaRepository<Profil, Integer> {

    Optional<Profil> findByMail(String mail);
}

