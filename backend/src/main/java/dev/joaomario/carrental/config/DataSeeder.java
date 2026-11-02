package dev.joaomario.carrental.config;

import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.Automobile;
import dev.joaomario.carrental.model.User;
import dev.joaomario.carrental.repository.AgentRepository;
import dev.joaomario.carrental.repository.AutomobileRepository;
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
    private final AutomobileRepository automobileRepository;
    private final PasswordEncoder passwordEncoder;
    private final String agentPassword;

    public DataSeeder(UserRepository userRepository, AgentRepository agentRepository,
                      AutomobileRepository automobileRepository, PasswordEncoder passwordEncoder,
                      @Value("${app.seed.agent-password}") String agentPassword) {
        this.userRepository = userRepository;
        this.agentRepository = agentRepository;
        this.automobileRepository = automobileRepository;
        this.passwordEncoder = passwordEncoder;
        this.agentPassword = agentPassword;
    }

    @Override
    public void run(String... args) {
        createAgentIfMissing(COMPANY_USERNAME, COMPANY_NAME, AgentType.COMPANY);
        createAgentIfMissing(BANK_USERNAME, BANK_NAME, AgentType.BANK);
        User company = userRepository.findByUsername(COMPANY_USERNAME).orElseThrow();
        createAutomobileIfMissing(new Automobile("LOC-0001", 2023, "Fiat", "Argo", "SAV1A23", company));
        createAutomobileIfMissing(new Automobile("LOC-0002", 2022, "Hyundai", "HB20", "SAV2B34", company));
        createAutomobileIfMissing(new Automobile("LOC-0003", 2024, "Chevrolet", "Onix", "SAV3C45", company));
        createAutomobileIfMissing(new Automobile("LOC-0004", 2023, "Volkswagen", "Polo", "SAV4D56", company));
    }

    private void createAgentIfMissing(String username, String name, AgentType type) {
        if (userRepository.existsByUsername(username)) {
            return;
        }
        agentRepository.save(new Agent(username, passwordEncoder.encode(agentPassword), name, type));
        log.info("Agente inicial criado: {}", username);
    }

    private void createAutomobileIfMissing(Automobile automobile) {
        if (automobileRepository.existsByPlate(automobile.getPlate())) {
            return;
        }
        automobileRepository.save(automobile);
        log.info("Automóvel inicial criado: {}", automobile.getPlate());
    }
}
