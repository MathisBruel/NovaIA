package fr.novaia.specialweek.controller;

import fr.novaia.specialweek.domain.JeuChasseAnomalies;
import fr.novaia.specialweek.domain.JeuQuizz;
import fr.novaia.specialweek.domain.JeuSwiper;
import fr.novaia.specialweek.domain.QuestionMytho;
import fr.novaia.specialweek.domain.ReponseMytho;
import fr.novaia.specialweek.domain.TypeQuestionQuizz;
import fr.novaia.specialweek.service.JeuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
@Tag(name = "Games", description = "Gestion des jeux et contenus de gamification")
public class JeuController {

    private final JeuService jeuService;

    public JeuController(JeuService jeuService) {
        this.jeuService = jeuService;
    }

    @GetMapping("/quizz/types")
    @Operation(summary = "Lister les types de questions pour le quizz")
    public List<TypeQuestionQuizz> getTypesQuizz() {
        return jeuService.findAllTypesQuizz();
    }

    @GetMapping("/quizz")
    @Operation(summary = "Lister les jeux de type quizz")
    public List<JeuQuizz> getJeuxQuizz() {
        return jeuService.findAllJeuxQuizz();
    }

    @GetMapping("/quizz/{id}")
    @Operation(summary = "Récupérer un jeu quizz par son identifiant")
    public ResponseEntity<JeuQuizz> getJeuQuizz(@PathVariable Integer id) {
        return jeuService.findJeuQuizzById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/quizz")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer ou mettre à jour un jeu quizz")
    public JeuQuizz saveJeuQuizz(@RequestBody JeuQuizz jeuQuizz) {
        return jeuService.saveJeuQuizz(jeuQuizz);
    }

    @DeleteMapping("/quizz/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un jeu quizz")
    public void deleteJeuQuizz(@PathVariable Integer id) {
        jeuService.deleteJeuQuizz(id);
    }

    @GetMapping("/anomalies")
    @Operation(summary = "Lister les jeux de chasse aux anomalies")
    public List<JeuChasseAnomalies> getJeuxAnomalies() {
        return jeuService.findAllJeuxAnomalies();
    }

    @GetMapping("/anomalies/{id}")
    @Operation(summary = "Récupérer un jeu de chasse aux anomalies par son identifiant")
    public ResponseEntity<JeuChasseAnomalies> getJeuAnomalies(@PathVariable Integer id) {
        return jeuService.findJeuAnomaliesById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/anomalies")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer ou mettre à jour un jeu de chasse aux anomalies")
    public JeuChasseAnomalies saveJeuAnomalies(@RequestBody JeuChasseAnomalies jeu) {
        return jeuService.saveJeuAnomalies(jeu);
    }

    @DeleteMapping("/anomalies/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un jeu de chasse aux anomalies")
    public void deleteJeuAnomalies(@PathVariable Integer id) {
        jeuService.deleteJeuAnomalies(id);
    }

    @GetMapping("/swiper")
    @Operation(summary = "Lister les jeux de type swiper")
    public List<JeuSwiper> getJeuxSwiper() {
        return jeuService.findAllJeuxSwiper();
    }

    @GetMapping("/swiper/{id}")
    @Operation(summary = "Récupérer un jeu swiper par son identifiant")
    public ResponseEntity<JeuSwiper> getJeuSwiper(@PathVariable Integer id) {
        return jeuService.findJeuSwiperById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/swiper")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer ou mettre à jour un jeu swiper")
    public JeuSwiper saveJeuSwiper(@RequestBody JeuSwiper jeuSwiper) {
        return jeuService.saveJeuSwiper(jeuSwiper);
    }

    @DeleteMapping("/swiper/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un jeu swiper")
    public void deleteJeuSwiper(@PathVariable Integer id) {
        jeuService.deleteJeuSwiper(id);
    }

    @GetMapping("/mytho/questions")
    @Operation(summary = "Lister les questions du jeu mytho")
    public List<QuestionMytho> getQuestionsMytho() {
        return jeuService.findAllQuestionsMytho();
    }

    @GetMapping("/mytho/questions/{id}")
    @Operation(summary = "Récupérer une question mytho par son identifiant")
    public ResponseEntity<QuestionMytho> getQuestionMytho(@PathVariable Integer id) {
        return jeuService.findQuestionMythoById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/mytho/questions")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer ou mettre à jour une question mytho")
    public QuestionMytho saveQuestionMytho(@RequestBody QuestionMytho questionMytho) {
        return jeuService.saveQuestionMytho(questionMytho);
    }

    @DeleteMapping("/mytho/questions/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer une question mytho")
    public void deleteQuestionMytho(@PathVariable Integer id) {
        jeuService.deleteQuestionMytho(id);
    }

    @GetMapping("/mytho/reponses")
    @Operation(summary = "Lister les réponses mytho")
    public List<ReponseMytho> getReponsesMytho() {
        return jeuService.findAllReponsesMytho();
    }

    @GetMapping("/mytho/reponses/{id}")
    @Operation(summary = "Récupérer une réponse mytho par son identifiant")
    public ResponseEntity<ReponseMytho> getReponseMytho(@PathVariable Integer id) {
        return jeuService.findReponseMythoById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/mytho/reponses")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer ou mettre à jour une réponse mytho")
    public ReponseMytho saveReponseMytho(@RequestBody ReponseMytho reponseMytho) {
        return jeuService.saveReponseMytho(reponseMytho);
    }

    @DeleteMapping("/mytho/reponses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer une réponse mytho")
    public void deleteReponseMytho(@PathVariable Integer id) {
        jeuService.deleteReponseMytho(id);
    }
}

