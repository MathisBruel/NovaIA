package fr.novaia.specialweek.service;

import fr.novaia.specialweek.domain.Profil;
import fr.novaia.specialweek.repository.ProfilRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for profile management.
 */
@Service
@Transactional
public class ProfilService {

    private final ProfilRepository profilRepository;

    /**
     * Creates the service with its repository dependency.
     *
     * @param profilRepository repository for profiles
     */
    public ProfilService(ProfilRepository profilRepository) {
        this.profilRepository = profilRepository;
    }

    /**
     * Lists all profiles.
     *
     * @return list of profiles
     */
    public List<Profil> findAll() {
        return profilRepository.findAll();
    }

    /**
     * Finds a profile by id.
     *
     * @param id profile id
     * @return optional profile
     */
    public Optional<Profil> findById(Integer id) {
        return profilRepository.findById(id);
    }

    /**
     * Creates a new profile and clears its id.
     *
     * @param profil payload
     * @return saved profile
     */
    public Profil create(Profil profil) {
        profil.setId(null);
        return profilRepository.save(profil);
    }

    /**
     * Updates an existing profile by id.
     *
     * @param id profile id
     * @param updated payload
     * @return updated profile
     */
    public Profil update(Integer id, Profil updated) {
        return profilRepository.findById(id)
                .map(existing -> {
                    existing.setPrenom(updated.getPrenom());
                    existing.setNom(updated.getNom());
                    existing.setMail(updated.getMail());
                    existing.setMotDePasse(updated.getMotDePasse());
                    existing.setPoints(updated.getPoints());
                    return profilRepository.save(existing);
                })
                .orElseThrow();
    }

    /**
     * Deletes a profile by id.
     *
     * @param id profile id
     */
    public void delete(Integer id) {
        profilRepository.deleteById(id);
    }

    /**
     * Adds a points delta to a profile.
     *
     * @param id profile id
     * @param delta points delta
     * @return updated profile
     */
    public Profil addPoints(Integer id, int delta) {
        return profilRepository.findById(id)
                .map(existing -> {
                    int current = existing.getPoints() == null ? 0 : existing.getPoints();
                    existing.setPoints(current + delta);
                    return profilRepository.save(existing);
                })
                .orElseThrow();
    }
}

