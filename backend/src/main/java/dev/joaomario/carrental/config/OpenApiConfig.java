package dev.joaomario.carrental.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String TITLE = "API do Sistema de Aluguel de Carros";
    private static final String DESCRIPTION = "Gestão de clientes, automóveis, pedidos de aluguel e contratos. "
            + "Faça login em /api/auth/login e use o token no botão Authorize.";
    private static final String VERSION = "v1";
    private static final String BEARER_SCHEME = "bearerAuth";
    private static final String BEARER = "bearer";
    private static final String JWT_FORMAT = "JWT";

    @Bean
    public OpenAPI openAPI() {
        SecurityScheme bearerScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme(BEARER)
                .bearerFormat(JWT_FORMAT);
        return new OpenAPI()
                .info(new Info().title(TITLE).description(DESCRIPTION).version(VERSION))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME, bearerScheme))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME));
    }
}
