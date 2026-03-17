package fr.novaia.specialweek.service;

import fr.novaia.specialweek.domain.Profil;
import fr.novaia.specialweek.repository.ProfilRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProfilService {

    private final ProfilRepository profilRepository;

    public ProfilService(ProfilRepository profilRepository) {
        this.profilRepository = profilRepository;
    }

    public List<Profil> findAll() {
        return profilRepository.findAll();
    }

    public Optional<Profil> findById(Integer id) {
        return profilRepository.findById(id);
    }

    public Profil create(Profil profil) {
        profil.setId(null);
        return profilRepository.save(profil);
    }

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

    public void delete(Integer id) {
        profilRepository.deleteById(id);
    }

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

