package dev.joaomario.carrental.security;

import dev.joaomario.carrental.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Configuration
public class SecurityConfig {

    private static final String AGENT = "AGENT";
    private static final String CLIENT = "CLIENT";
    private static final String UNAUTHORIZED_MESSAGE = "Faça login para continuar.";
    private static final String FORBIDDEN_MESSAGE = "Você não tem permissão para esta ação.";

    private final JwtService jwtService;
    private final AppUserDetailsService userDetailsService;
    private final JsonMapper jsonMapper;

    public SecurityConfig(JwtService jwtService, AppUserDetailsService userDetailsService, JsonMapper jsonMapper) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.jsonMapper = jsonMapper;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/clients").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/clients").hasRole(AGENT)
                        .requestMatchers(HttpMethod.POST, "/api/automobiles/**").hasRole(AGENT)
                        .requestMatchers(HttpMethod.PUT, "/api/automobiles/**").hasRole(AGENT)
                        .requestMatchers(HttpMethod.DELETE, "/api/automobiles/**").hasRole(AGENT)
                        .requestMatchers(HttpMethod.PATCH, "/api/rental-requests/*/evaluation").hasRole(AGENT)
                        .requestMatchers(HttpMethod.POST, "/api/rental-requests/*/contract").hasRole(AGENT)
                        .requestMatchers(HttpMethod.POST, "/api/rental-requests").hasRole(CLIENT)
                        .requestMatchers(HttpMethod.PATCH, "/api/rental-requests/*/cancel").hasRole(CLIENT)
                        .anyRequest().authenticated())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) ->
                                writeError(request, response, HttpStatus.UNAUTHORIZED, UNAUTHORIZED_MESSAGE))
                        .accessDeniedHandler((request, response, exception) ->
                                writeError(request, response, HttpStatus.FORBIDDEN, FORBIDDEN_MESSAGE)))
                .addFilterBefore(new JwtAuthenticationFilter(jwtService, userDetailsService),
                        UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private void writeError(HttpServletRequest request, HttpServletResponse response, HttpStatus status,
                            String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        ErrorResponse body = ErrorResponse.of(status, message, request.getRequestURI(), Map.of());
        jsonMapper.writeValue(response.getOutputStream(), body);
    }
}
