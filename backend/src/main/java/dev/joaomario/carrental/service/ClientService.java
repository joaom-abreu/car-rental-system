package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.client.ClientCreateRequest;
import dev.joaomario.carrental.dto.client.ClientResponse;
import dev.joaomario.carrental.dto.client.ClientUpdateRequest;
import dev.joaomario.carrental.dto.client.EmploymentDto;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.exception.ForbiddenException;
import dev.joaomario.carrental.exception.NotFoundException;
import dev.joaomario.carrental.model.Client;
import dev.joaomario.carrental.model.Employment;
import dev.joaomario.carrental.model.Role;
import dev.joaomario.carrental.model.User;
import dev.joaomario.carrental.repository.ClientRepository;
import dev.joaomario.carrental.repository.UserRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClientService {

    private static final int MAX_EMPLOYMENTS = 3;
    private static final String NON_DIGITS = "\\D";
    private static final String USERNAME_FIELD = "username";
    private static final String CPF_FIELD = "cpf";
    private static final String RG_FIELD = "rg";
    private static final String EMPLOYMENTS_FIELD = "employments";
    private static final String DUPLICATE_USERNAME_MESSAGE = "Este usuário já está em uso.";
    private static final String DUPLICATE_CPF_MESSAGE = "Já existe um cliente com este CPF.";
    private static final String DUPLICATE_RG_MESSAGE = "Já existe um cliente com este RG.";
    private static final String TOO_MANY_EMPLOYMENTS_MESSAGE = "O cliente pode ter no máximo 3 empregos.";
    private static final String FORBIDDEN_MESSAGE = "Você só pode acessar os seus próprios dados.";
    private static final String NOT_FOUND_MESSAGE = "Cliente não encontrado.";

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserProvider currentUserProvider;

    public ClientService(ClientRepository clientRepository, UserRepository userRepository,
                         PasswordEncoder passwordEncoder, CurrentUserProvider currentUserProvider) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public ClientResponse create(ClientCreateRequest request) {
        String cpf = onlyDigits(request.cpf());
        if (userRepository.existsByUsername(request.username())) {
            throw new BusinessRuleException(DUPLICATE_USERNAME_MESSAGE, USERNAME_FIELD);
        }
        checkCpfAvailable(cpf);
        checkRgAvailable(request.rg());
        checkEmploymentLimit(request.employments());
        Client client = new Client(request.username(), passwordEncoder.encode(request.password()), request.name(),
                request.rg(), cpf, request.address(), request.profession(), toEmployments(request.employments()));
        return toResponse(clientRepository.save(client));
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> search(String search) {
        String term = search == null ? "" : search.trim();
        return clientRepository.findByNameContainingIgnoreCaseOrCpfContainingOrderByNameAsc(term, term).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientResponse findById(Long id) {
        return toResponse(findAccessibleClient(id));
    }

    @Transactional
    public ClientResponse update(Long id, ClientUpdateRequest request) {
        Client client = findAccessibleClient(id);
        String cpf = onlyDigits(request.cpf());
        if (!cpf.equals(client.getCpf())) {
            checkCpfAvailable(cpf);
        }
        if (!request.rg().equals(client.getRg())) {
            checkRgAvailable(request.rg());
        }
        checkEmploymentLimit(request.employments());
        client.setName(request.name());
        client.setRg(request.rg());
        client.setCpf(cpf);
        client.setAddress(request.address());
        client.setProfession(request.profession());
        client.setEmployments(toEmployments(request.employments()));
        return toResponse(client);
    }

    @Transactional
    public void delete(Long id) {
        clientRepository.delete(findAccessibleClient(id));
    }

    private Client findAccessibleClient(Long id) {
        User currentUser = currentUserProvider.getCurrentUser();
        if (currentUser.getRole() == Role.CLIENT && !id.equals(currentUser.getId())) {
            throw new ForbiddenException(FORBIDDEN_MESSAGE);
        }
        return clientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(NOT_FOUND_MESSAGE));
    }

    private void checkCpfAvailable(String cpf) {
        if (clientRepository.existsByCpf(cpf)) {
            throw new BusinessRuleException(DUPLICATE_CPF_MESSAGE, CPF_FIELD);
        }
    }

    private void checkRgAvailable(String rg) {
        if (clientRepository.existsByRg(rg)) {
            throw new BusinessRuleException(DUPLICATE_RG_MESSAGE, RG_FIELD);
        }
    }

    private void checkEmploymentLimit(List<EmploymentDto> employments) {
        if (employments.size() > MAX_EMPLOYMENTS) {
            throw new BusinessRuleException(TOO_MANY_EMPLOYMENTS_MESSAGE, EMPLOYMENTS_FIELD);
        }
    }

    private String onlyDigits(String value) {
        return value.replaceAll(NON_DIGITS, "");
    }

    private List<Employment> toEmployments(List<EmploymentDto> employments) {
        return employments.stream()
                .map(employment -> new Employment(employment.employer(), employment.income()))
                .toList();
    }

    private ClientResponse toResponse(Client client) {
        List<EmploymentDto> employments = client.getEmployments().stream()
                .map(employment -> new EmploymentDto(employment.getEmployer(), employment.getIncome()))
                .toList();
        return new ClientResponse(client.getId(), client.getUsername(), client.getName(), client.getRg(),
                client.getCpf(), client.getAddress(), client.getProfession(), employments, client.getCreatedAt());
    }
}
