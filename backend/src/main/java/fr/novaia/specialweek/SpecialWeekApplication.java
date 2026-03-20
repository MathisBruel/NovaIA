package fr.novaia.specialweek;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application entry point for the Special Week backend.
 */
@SpringBootApplication
public class SpecialWeekApplication {

    /**
     * Bootstraps the Spring Boot application.
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(SpecialWeekApplication.class, args);
    }
}

