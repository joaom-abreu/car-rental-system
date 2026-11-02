package dev.joaomario.carrental.security;

import dev.joaomario.carrental.exception.NotFoundException;
import dev.joaomario.carrental.model.User;
import dev.joaomario.carrental.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserProvider {

    private static final String USER_NOT_FOUND_MESSAGE = "Usuário não encontrado.";

    private final UserRepository userRepository;

    public CurrentUserProvider(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException(USER_NOT_FOUND_MESSAGE));
    }
}
