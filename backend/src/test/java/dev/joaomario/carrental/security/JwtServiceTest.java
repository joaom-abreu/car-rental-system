package dev.joaomario.carrental.security;

import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET = "dGVzdC1zZWNyZXQtd2l0aC1hdC1sZWFzdC0zMi1ieXRlcyE=";
    private static final long EXPIRATION_MINUTES = 120;

    private final JwtService jwtService = new JwtService(SECRET, EXPIRATION_MINUTES);
    private final Agent agent = new Agent("locadora", "hash", "Locadora Savassi", AgentType.COMPANY);

    @Test
    void generatedTokenReturnsTheUsernameWhenRead() {
        String token = jwtService.generateToken(agent);

        assertThat(jwtService.extractUsername(token)).isEqualTo("locadora");
    }

    @Test
    void tamperedTokenIsRejected() {
        String[] parts = jwtService.generateToken(agent).split("\\.");
        String fakePayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString("{\"sub\":\"banco\",\"role\":\"AGENT\"}".getBytes(StandardCharsets.UTF_8));
        String tamperedToken = parts[0] + "." + fakePayload + "." + parts[2];

        assertThatThrownBy(() -> jwtService.extractUsername(tamperedToken)).isInstanceOf(JwtException.class);
    }
}
