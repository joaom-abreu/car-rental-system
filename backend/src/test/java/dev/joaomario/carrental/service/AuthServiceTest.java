package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.auth.LoginRequest;
import dev.joaomario.carrental.dto.auth.LoginResponse;
import dev.joaomario.carrental.exception.InvalidCredentialsException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.Role;
import dev.joaomario.carrental.repository.UserRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import dev.joaomario.carrental.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private AuthService authService;

    private final Agent agent = new Agent("locadora", "hash", "Locadora Savassi", AgentType.COMPANY);

    @Test
    void loginWithCorrectPasswordReturnsTokenAndUserSummary() {
        when(userRepository.findByUsername("locadora")).thenReturn(Optional.of(agent));
        when(passwordEncoder.matches("senha-certa", "hash")).thenReturn(true);
        when(jwtService.generateToken(agent)).thenReturn("token");

        LoginResponse response = authService.login(new LoginRequest("locadora", "senha-certa"));

        assertThat(response.token()).isEqualTo("token");
        assertThat(response.user().username()).isEqualTo("locadora");
        assertThat(response.user().role()).isEqualTo(Role.AGENT);
        assertThat(response.user().agentType()).isEqualTo(AgentType.COMPANY);
    }

    @Test
    void loginWithWrongPasswordThrowsInvalidCredentials() {
        when(userRepository.findByUsername("locadora")).thenReturn(Optional.of(agent));
        when(passwordEncoder.matches("senha-errada", "hash")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("locadora", "senha-errada")))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void loginWithUnknownUserThrowsInvalidCredentials() {
        when(userRepository.findByUsername("ninguem")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("ninguem", "qualquer")))
                .isInstanceOf(InvalidCredentialsException.class);
    }
}
