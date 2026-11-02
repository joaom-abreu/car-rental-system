package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.auth.LoginRequest;
import dev.joaomario.carrental.dto.auth.LoginResponse;
import dev.joaomario.carrental.dto.auth.UserSummaryResponse;
import dev.joaomario.carrental.exception.InvalidCredentialsException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.User;
import dev.joaomario.carrental.repository.UserRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import dev.joaomario.carrental.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CurrentUserProvider currentUserProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       CurrentUserProvider currentUserProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(InvalidCredentialsException::new);
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        return new LoginResponse(jwtService.generateToken(user), toSummary(user));
    }

    @Transactional(readOnly = true)
    public UserSummaryResponse getCurrentUser() {
        return toSummary(currentUserProvider.getCurrentUser());
    }

    private UserSummaryResponse toSummary(User user) {
        AgentType agentType = user instanceof Agent agent ? agent.getType() : null;
        return new UserSummaryResponse(user.getId(), user.getUsername(), user.getName(), user.getRole(), agentType);
    }
}
