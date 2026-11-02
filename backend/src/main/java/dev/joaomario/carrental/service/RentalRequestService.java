package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.rentalrequest.EvaluationRequest;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestRequest;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestResponse;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestResponse.AutomobileSummary;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestResponse.ClientSummary;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestResponse.EvaluationSummary;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.exception.ForbiddenException;
import dev.joaomario.carrental.exception.NotFoundException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.Automobile;
import dev.joaomario.carrental.model.Client;
import dev.joaomario.carrental.model.RentalRequest;
import dev.joaomario.carrental.model.RequestStatus;
import dev.joaomario.carrental.model.Role;
import dev.joaomario.carrental.model.User;
import dev.joaomario.carrental.repository.AutomobileRepository;
import dev.joaomario.carrental.repository.RentalRequestRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class RentalRequestService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final List<RequestStatus> BLOCKING_STATUSES = List.of(RequestStatus.APPROVED,
            RequestStatus.CONTRACTED);
    private static final String START_DATE_FIELD = "startDate";
    private static final String END_DATE_FIELD = "endDate";
    private static final String AUTOMOBILE_FIELD = "automobileId";
    private static final String NOT_FOUND_MESSAGE = "Pedido não encontrado.";
    private static final String AUTOMOBILE_NOT_FOUND_MESSAGE = "Automóvel não encontrado.";
    private static final String FORBIDDEN_MESSAGE = "Você só pode acessar os seus próprios pedidos.";
    private static final String ONLY_CLIENTS_MESSAGE = "Só clientes podem criar pedidos.";
    private static final String ONLY_AGENTS_MESSAGE = "Só agentes podem avaliar pedidos.";
    private static final String PAST_START_MESSAGE = "A data de início não pode ser anterior a hoje.";
    private static final String END_BEFORE_START_MESSAGE = "A data de fim deve ser depois da data de início.";
    private static final String OVERLAP_MESSAGE = "Este automóvel já está reservado nesse período.";

    private final RentalRequestRepository rentalRequestRepository;
    private final AutomobileRepository automobileRepository;
    private final CurrentUserProvider currentUserProvider;

    public RentalRequestService(RentalRequestRepository rentalRequestRepository,
                                AutomobileRepository automobileRepository,
                                CurrentUserProvider currentUserProvider) {
        this.rentalRequestRepository = rentalRequestRepository;
        this.automobileRepository = automobileRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public RentalRequestResponse create(RentalRequestRequest request) {
        Client client = currentClient();
        Automobile automobile = findAutomobile(request.automobileId());
        validatePeriod(automobile, request.startDate(), request.endDate());
        RentalRequest rentalRequest = new RentalRequest(client, automobile, request.startDate(), request.endDate());
        return toResponse(rentalRequestRepository.save(rentalRequest));
    }

    @Transactional(readOnly = true)
    public List<RentalRequestResponse> list(RequestStatus status) {
        User user = currentUserProvider.getCurrentUser();
        List<RentalRequest> requests = user.getRole() == Role.AGENT
                ? rentalRequestRepository.findAllByOrderByCreatedAtDesc()
                : rentalRequestRepository.findByClientIdOrderByCreatedAtDesc(user.getId());
        return requests.stream()
                .filter(rentalRequest -> status == null || rentalRequest.getStatus() == status)
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RentalRequestResponse findById(Long id) {
        return toResponse(findAccessibleRequest(id));
    }

    @Transactional
    public RentalRequestResponse update(Long id, RentalRequestRequest request) {
        RentalRequest rentalRequest = findAccessibleRequest(id);
        Automobile automobile = findAutomobile(request.automobileId());
        if (rentalRequest.getStatus() == RequestStatus.PENDING) {
            validatePeriod(automobile, request.startDate(), request.endDate());
        }
        rentalRequest.update(automobile, request.startDate(), request.endDate());
        return toResponse(rentalRequest);
    }

    @Transactional
    public RentalRequestResponse cancel(Long id) {
        RentalRequest rentalRequest = findRequest(id);
        if (!rentalRequest.belongsTo(currentUserProvider.getCurrentUser())) {
            throw new ForbiddenException(FORBIDDEN_MESSAGE);
        }
        rentalRequest.cancel();
        return toResponse(rentalRequest);
    }

    @Transactional
    public RentalRequestResponse evaluate(Long id, EvaluationRequest request) {
        Agent agent = currentAgent();
        RentalRequest rentalRequest = findRequest(id);
        if (!request.approved()) {
            rentalRequest.reject(agent, request.opinion());
            return toResponse(rentalRequest);
        }
        if (rentalRequest.getStatus() == RequestStatus.PENDING) {
            checkAvailability(rentalRequest.getAutomobile(), rentalRequest.getStartDate(),
                    rentalRequest.getEndDate());
        }
        rentalRequest.approve(agent, request.opinion());
        return toResponse(rentalRequest);
    }

    private Client currentClient() {
        if (currentUserProvider.getCurrentUser() instanceof Client client) {
            return client;
        }
        throw new ForbiddenException(ONLY_CLIENTS_MESSAGE);
    }

    private Agent currentAgent() {
        if (currentUserProvider.getCurrentUser() instanceof Agent agent) {
            return agent;
        }
        throw new ForbiddenException(ONLY_AGENTS_MESSAGE);
    }

    private RentalRequest findRequest(Long id) {
        return rentalRequestRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(NOT_FOUND_MESSAGE));
    }

    private RentalRequest findAccessibleRequest(Long id) {
        RentalRequest rentalRequest = findRequest(id);
        User user = currentUserProvider.getCurrentUser();
        if (user.getRole() == Role.CLIENT && !rentalRequest.belongsTo(user)) {
            throw new ForbiddenException(FORBIDDEN_MESSAGE);
        }
        return rentalRequest;
    }

    private Automobile findAutomobile(Long id) {
        return automobileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(AUTOMOBILE_NOT_FOUND_MESSAGE));
    }

    private void validatePeriod(Automobile automobile, LocalDate startDate, LocalDate endDate) {
        if (startDate.isBefore(LocalDate.now(ZONE))) {
            throw new BusinessRuleException(PAST_START_MESSAGE, START_DATE_FIELD);
        }
        if (!endDate.isAfter(startDate)) {
            throw new BusinessRuleException(END_BEFORE_START_MESSAGE, END_DATE_FIELD);
        }
        checkAvailability(automobile, startDate, endDate);
    }

    private void checkAvailability(Automobile automobile, LocalDate startDate, LocalDate endDate) {
        if (rentalRequestRepository.existsOverlapping(automobile.getId(), BLOCKING_STATUSES, startDate, endDate)) {
            throw new BusinessRuleException(OVERLAP_MESSAGE, AUTOMOBILE_FIELD);
        }
    }

    private RentalRequestResponse toResponse(RentalRequest rentalRequest) {
        Client client = rentalRequest.getClient();
        Automobile automobile = rentalRequest.getAutomobile();
        return new RentalRequestResponse(rentalRequest.getId(), rentalRequest.getStatus(),
                rentalRequest.getStartDate(), rentalRequest.getEndDate(), rentalRequest.getCreatedAt(),
                rentalRequest.getUpdatedAt(),
                new ClientSummary(client.getId(), client.getName(), client.getCpf()),
                new AutomobileSummary(automobile.getId(), automobile.getBrand(), automobile.getModel(),
                        automobile.getYear(), automobile.getPlate()),
                toEvaluationSummary(rentalRequest));
    }

    private EvaluationSummary toEvaluationSummary(RentalRequest rentalRequest) {
        if (rentalRequest.getEvaluatedBy() == null) {
            return null;
        }
        return new EvaluationSummary(rentalRequest.getEvaluatedBy().getName(),
                rentalRequest.getEvaluationOpinion(), rentalRequest.getEvaluatedAt());
    }
}
