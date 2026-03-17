package fr.novaia.specialweek.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI specialWeekApi() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("Special Week API")
                        .description("API pour la gamification, les comptes et les jeux Special Week")
                        .version("1.0.0"));
    }
}

