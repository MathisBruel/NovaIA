package fr.novaia.specialweek.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * OpenAPI and CORS configuration for the REST API.
 */
@Configuration
public class OpenApiConfig {

    /**
     * Defines the OpenAPI metadata for the service.
     *
     * @return OpenAPI definition
     */
    @Bean
    public OpenAPI specialWeekApi() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("Special Week API")
                        .description("API pour la gamification, les comptes et les jeux Special Week")
                        .version("1.0.0"));
    }

    /**
     * Configures allowed origins, methods, and headers for CORS.
     *
     * @return MVC configurer for CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:5173",
                                "http://novaia.mathisbruel.fr",
                                "https://novaia.mathisbruel.fr"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}

