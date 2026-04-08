package fr.novaia.specialweek.repository;

import fr.novaia.specialweek.domain.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserActivityRepository extends JpaRepository<UserActivity, Integer> {
    List<UserActivity> findByProfilId(Integer profilId);
    List<UserActivity> findByGameId(Integer gameId);
}
