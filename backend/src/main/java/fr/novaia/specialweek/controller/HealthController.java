package fr.novaia.specialweek.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Health check endpoint.
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    /**
     * Returns API health status.
     *
     * @return status map
     */
    @GetMapping
    public Map<String, String> health() {
        return Map.of("status", "OK");
    }
}

