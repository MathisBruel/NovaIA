package fr.novaia.specialweek.controller;

import fr.novaia.specialweek.domain.Profil;
import fr.novaia.specialweek.service.ProfilService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@Tag(name = "Accounts", description = "Gestion des comptes utilisateurs et de la gamification")
public class ProfilController {

    private final ProfilService profilService;

    public ProfilController(ProfilService profilService) {
        this.profilService = profilService;
    }

    @GetMapping
    @Operation(summary = "Lister tous les comptes")
    public List<Profil> getAll() {
        return profilService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un compte par son identifiant")
    public ResponseEntity<Profil> getById(@PathVariable Integer id) {
        return profilService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer un nouveau compte")
    public Profil create(@RequestBody Profil profil) {
        return profilService.create(profil);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un compte existant")
    public ResponseEntity<Profil> update(@PathVariable Integer id, @RequestBody Profil profil) {
        try {
            return ResponseEntity.ok(profilService.update(id, profil));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un compte")
    public void delete(@PathVariable Integer id) {
        profilService.delete(id);
    }

    @PostMapping("/{id}/add-points")
    @Operation(summary = "Ajouter des points à un compte")
    public ResponseEntity<Profil> addPoints(@PathVariable Integer id, @RequestParam int delta) {
        try {
            return ResponseEntity.ok(profilService.addPoints(id, delta));
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}

