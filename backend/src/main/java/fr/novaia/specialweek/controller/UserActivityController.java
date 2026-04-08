package fr.novaia.specialweek.controller;

import fr.novaia.specialweek.domain.Profil;
import fr.novaia.specialweek.domain.UserActivity;
import fr.novaia.specialweek.repository.ProfilRepository;
import fr.novaia.specialweek.repository.UserActivityRepository;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/activity")
public class UserActivityController {

    private final UserActivityRepository activityRepository;
    private final ProfilRepository profilRepository;

    public UserActivityController(UserActivityRepository activityRepository, ProfilRepository profilRepository) {
        this.activityRepository = activityRepository;
        this.profilRepository = profilRepository;
    }

    @PostMapping("/start")
    @Operation(summary = "Démarrer une session de jeu")
    public ResponseEntity<UserActivity> startActivity(@RequestParam Integer userId, @RequestParam Integer gameId) {
        Optional<Profil> profilOpt = profilRepository.findById(userId);
        if (profilOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        UserActivity activity = new UserActivity();
        activity.setProfil(profilOpt.get());
        activity.setGameId(gameId);
        activity.setStartedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(activityRepository.save(activity));
    }

    @PostMapping("/{activityId}/progress")
    @Operation(summary = "Mettre à jour la progression ou terminer")
    public ResponseEntity<UserActivity> updateProgress(
            @PathVariable Integer activityId,
            @RequestParam Integer stepReached,
            @RequestParam(required = false, defaultValue = "false") Boolean completed,
            @RequestParam(required = false, defaultValue = "0") Integer pointsEarned) {
            
        Optional<UserActivity> activityOpt = activityRepository.findById(activityId);
        if (activityOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        UserActivity activity = activityOpt.get();
        if (stepReached > activity.getStepReached()) {
            activity.setStepReached(stepReached);
        }
        if (completed) {
            activity.setCompleted(true);
        }
        if (pointsEarned > activity.getPointsEarned()) {
            activity.setPointsEarned(pointsEarned);
        }
        
        return ResponseEntity.ok(activityRepository.save(activity));
    }

    @GetMapping("/advanced-kpis")
    @Operation(summary = "KPIs avancés pour le dashboard administrateur")
    public ResponseEntity<Map<String, Object>> getAdvancedKpis() {
        List<UserActivity> allActivities = activityRepository.findAll();
        
        // Jeux les plus joués
        Map<Integer, Long> gamesCount = allActivities.stream()
                .collect(Collectors.groupingBy(UserActivity::getGameId, Collectors.counting()));
                
        // Taux de complétion par jeu (completed / total)
        Map<Integer, Double> completionRate = new HashMap<>();
        Map<Integer, Double> avgStepReached = new HashMap<>();
        
        gamesCount.keySet().forEach(gameId -> {
            List<UserActivity> acts = allActivities.stream().filter(a -> a.getGameId().equals(gameId)).toList();
            long count = acts.size();
            long completed = acts.stream().filter(UserActivity::getCompleted).count();
            completionRate.put(gameId, (double) completed / count);
            
            double avgStep = acts.stream().mapToInt(UserActivity::getStepReached).average().orElse(0);
            avgStepReached.put(gameId, avgStep);
        });
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalSessions", allActivities.size());
        response.put("gamesDistribution", gamesCount);
        response.put("completionRates", completionRate);
        response.put("avgStepReached", avgStepReached);
        
        // Distribution of drop off (which step do they stop at if not completed)
        Map<Integer, Map<Integer, Long>> dropOffByGameAndStep = new HashMap<>();
        allActivities.stream().filter(a -> !a.getCompleted()).forEach(a -> {
            dropOffByGameAndStep.putIfAbsent(a.getGameId(), new HashMap<>());
            Map<Integer, Long> steps = dropOffByGameAndStep.get(a.getGameId());
            steps.put(a.getStepReached(), steps.getOrDefault(a.getStepReached(), 0L) + 1);
        });
        
        response.put("dropoffs", dropOffByGameAndStep);
        
        return ResponseEntity.ok(response);
    }
}
