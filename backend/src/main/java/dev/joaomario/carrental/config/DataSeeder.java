package dev.joaomario.carrental.config;

import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.repository.AgentRepository;
import dev.joaomario.carrental.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String COMPANY_USERNAME = "locadora";
    private static final String COMPANY_NAME = "Locadora Savassi";
    private static final String BANK_USERNAME = "banco";
    private static final String BANK_NAME = "Banco Pampulha";

    private final UserRepository userRepository;
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private final String agentPassword;

    public DataSeeder(UserRepository userRepository, AgentRepository agentRepository, PasswordEncoder passwordEncoder,
                      @Value("${app.seed.agent-password}") String agentPassword) {
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
        this.passwordEncoder = passwordEncoder;
        this.agentPassword = agentPassword;
    }

    @Override
    public void run(String... args) {
        createAgentIfMissing(COMPANY_USERNAME, COMPANY_NAME, AgentType.COMPANY);
        createAgentIfMissing(BANK_USERNAME, BANK_NAME, AgentType.BANK);
    }

    private void createAgentIfMissing(String username, String name, AgentType type) {
        if (userRepository.existsByUsername(username)) {
            return;
        }
        agentRepository.save(new Agent(username, passwordEncoder.encode(agentPassword), name, type));
        log.info("Agente inicial criado: {}", username);
    }
}
