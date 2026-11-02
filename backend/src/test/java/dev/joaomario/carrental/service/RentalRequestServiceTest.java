package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.rentalrequest.EvaluationRequest;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestRequest;
import dev.joaomario.carrental.dto.rentalrequest.RentalRequestResponse;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.exception.ForbiddenException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.Automobile;
import dev.joaomario.carrental.model.Client;
import dev.joaomario.carrental.model.RentalRequest;
import dev.joaomario.carrental.model.RequestStatus;
import dev.joaomario.carrental.repository.AutomobileRepository;
import dev.joaomario.carrental.repository.RentalRequestRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RentalRequestServiceTest {

    private static final LocalDate TODAY = LocalDate.now(ZoneId.of("America/Sao_Paulo"));
    private static final LocalDate START = TODAY.plusDays(1);
    private static final LocalDate END = TODAY.plusDays(5);
    private static final Long AUTOMOBILE_ID = 10L;
    private static final Long REQUEST_ID = 100L;

    @Mock
    private RentalRequestRepository rentalRequestRepository;

    @Mock
    private AutomobileRepository automobileRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private RentalRequestService rentalRequestService;

    private final Client owner = client(1L, "Maria Silva", "52998224725");
    private final Client otherClient = client(2L, "João Souza", "11144477735");
    private final Agent company = new Agent("locadora", "hash", "Locadora Savassi", AgentType.COMPANY);
    private final Agent bank = new Agent("banco", "hash", "Banco Pampulha", AgentType.BANK);
    private final Automobile automobile = automobile();

    @Test
    void createValidRequestStartsAsPending() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        when(automobileRepository.findById(AUTOMOBILE_ID)).thenReturn(Optional.of(automobile));
        when(rentalRequestRepository.save(any(RentalRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RentalRequestResponse response = rentalRequestService.create(new RentalRequestRequest(AUTOMOBILE_ID, START, END));

        assertThat(response.status()).isEqualTo(RequestStatus.PENDING);
        assertThat(response.client().name()).isEqualTo("Maria Silva");
        assertThat(response.automobile().plate()).isEqualTo("SAV1A23");
    }

    @Test
    void createWithStartDateBeforeTodayThrowsBusinessRuleOnStartDate() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        when(automobileRepository.findById(AUTOMOBILE_ID)).thenReturn(Optional.of(automobile));

        assertThatThrownBy(() -> rentalRequestService.create(
                new RentalRequestRequest(AUTOMOBILE_ID, TODAY.minusDays(1), END)))
                .isInstanceOf(BusinessRuleException.class)
                .hasFieldOrPropertyWithValue("field", "startDate");
        verify(rentalRequestRepository, never()).save(any());
    }

    @Test
    void createWithEndDateNotAfterStartDateThrowsBusinessRuleOnEndDate() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        when(automobileRepository.findById(AUTOMOBILE_ID)).thenReturn(Optional.of(automobile));

        assertThatThrownBy(() -> rentalRequestService.create(new RentalRequestRequest(AUTOMOBILE_ID, START, START)))
                .isInstanceOf(BusinessRuleException.class)
                .hasFieldOrPropertyWithValue("field", "endDate");
    }

    @Test
    void createOverlappingApprovedOrContractedRequestThrowsBusinessRule() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        when(automobileRepository.findById(AUTOMOBILE_ID)).thenReturn(Optional.of(automobile));
        when(rentalRequestRepository.existsOverlapping(eq(AUTOMOBILE_ID),
                eq(List.of(RequestStatus.APPROVED, RequestStatus.CONTRACTED)), eq(START), eq(END)))
                .thenReturn(true);

        assertThatThrownBy(() -> rentalRequestService.create(new RentalRequestRequest(AUTOMOBILE_ID, START, END)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Este automóvel já está reservado nesse período.");
        verify(rentalRequestRepository, never()).save(any());
    }

    @Test
    void otherClientViewingRequestThrowsForbidden() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));
        when(currentUserProvider.getCurrentUser()).thenReturn(otherClient);

        assertThatThrownBy(() -> rentalRequestService.findById(REQUEST_ID))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void agentCanViewAnyRequest() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));
        when(currentUserProvider.getCurrentUser()).thenReturn(company);

        assertThat(rentalRequestService.findById(REQUEST_ID).client().id()).isEqualTo(1L);
    }

    @Test
    void updateOutsidePendingThrowsBusinessRule() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.APPROVED)));
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        when(automobileRepository.findById(AUTOMOBILE_ID)).thenReturn(Optional.of(automobile));

        assertThatThrownBy(() -> rentalRequestService.update(REQUEST_ID,
                new RentalRequestRequest(AUTOMOBILE_ID, START, END.plusDays(1))))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Só é possível modificar pedidos em análise.");
    }

    @Test
    void updatePendingRequestChangesDates() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));
        when(currentUserProvider.getCurrentUser()).thenReturn(company);
        when(automobileRepository.findById(AUTOMOBILE_ID)).thenReturn(Optional.of(automobile));

        RentalRequestResponse response = rentalRequestService.update(REQUEST_ID,
                new RentalRequestRequest(AUTOMOBILE_ID, START, END.plusDays(1)));

        assertThat(response.endDate()).isEqualTo(END.plusDays(1));
    }

    @Test
    void cancelPendingRequestByOwnerSetsCancelled() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);

        assertThat(rentalRequestService.cancel(REQUEST_ID).status()).isEqualTo(RequestStatus.CANCELLED);
    }

    @Test
    void cancelApprovedRequestByOwnerSetsCancelled() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.APPROVED)));
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);

        assertThat(rentalRequestService.cancel(REQUEST_ID).status()).isEqualTo(RequestStatus.CANCELLED);
    }

    @Test
    void cancelContractedRequestThrowsBusinessRule() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.CONTRACTED)));
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);

        assertThatThrownBy(() -> rentalRequestService.cancel(REQUEST_ID))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Só é possível cancelar pedidos em análise ou aprovados.");
    }

    @Test
    void cancelByOtherClientThrowsForbidden() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));
        when(currentUserProvider.getCurrentUser()).thenReturn(otherClient);

        assertThatThrownBy(() -> rentalRequestService.cancel(REQUEST_ID))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void listWithStatusReturnsOnlyClientRequestsWithThatStatus() {
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);
        when(rentalRequestRepository.findByClientIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(
                requestWithStatus(RequestStatus.PENDING), requestWithStatus(RequestStatus.CANCELLED)));

        List<RentalRequestResponse> response = rentalRequestService.list(RequestStatus.CANCELLED);

        assertThat(response).extracting(RentalRequestResponse::status).containsExactly(RequestStatus.CANCELLED);
    }

    @Test
    void approvePendingRequestSetsApprovedWithEvaluation() {
        when(currentUserProvider.getCurrentUser()).thenReturn(bank);
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));

        RentalRequestResponse response = rentalRequestService.evaluate(REQUEST_ID,
                new EvaluationRequest(true, "Renda compatível com o valor."));

        assertThat(response.status()).isEqualTo(RequestStatus.APPROVED);
        assertThat(response.evaluation().agentName()).isEqualTo("Banco Pampulha");
        assertThat(response.evaluation().opinion()).isEqualTo("Renda compatível com o valor.");
        assertThat(response.evaluation().evaluatedAt()).isNotNull();
    }

    @Test
    void rejectPendingRequestSetsRejectedWithoutCheckingOverlap() {
        when(currentUserProvider.getCurrentUser()).thenReturn(company);
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));

        RentalRequestResponse response = rentalRequestService.evaluate(REQUEST_ID,
                new EvaluationRequest(false, "Renda insuficiente."));

        assertThat(response.status()).isEqualTo(RequestStatus.REJECTED);
        assertThat(response.evaluation().agentName()).isEqualTo("Locadora Savassi");
        verify(rentalRequestRepository, never()).existsOverlapping(anyLong(), anyList(), any(), any());
    }

    @Test
    void evaluateAlreadyEvaluatedRequestThrowsBusinessRule() {
        when(currentUserProvider.getCurrentUser()).thenReturn(bank);
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.APPROVED)));

        assertThatThrownBy(() -> rentalRequestService.evaluate(REQUEST_ID,
                new EvaluationRequest(true, "Aprovando de novo.")))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Só é possível avaliar pedidos em análise.");
    }

    @Test
    void approveWithOverlappingRequestThrowsBusinessRuleAndKeepsPending() {
        RentalRequest rentalRequest = requestWithStatus(RequestStatus.PENDING);
        when(currentUserProvider.getCurrentUser()).thenReturn(bank);
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(rentalRequest));
        when(rentalRequestRepository.existsOverlapping(eq(AUTOMOBILE_ID), anyList(), eq(START), eq(END)))
                .thenReturn(true);

        assertThatThrownBy(() -> rentalRequestService.evaluate(REQUEST_ID,
                new EvaluationRequest(true, "Renda compatível.")))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Este automóvel já está reservado nesse período.");
        assertThat(rentalRequest.getStatus()).isEqualTo(RequestStatus.PENDING);
    }

    @Test
    void responseOfNotEvaluatedRequestHasNullEvaluation() {
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(requestWithStatus(RequestStatus.PENDING)));
        when(currentUserProvider.getCurrentUser()).thenReturn(owner);

        assertThat(rentalRequestService.findById(REQUEST_ID).evaluation()).isNull();
    }

    private RentalRequest requestWithStatus(RequestStatus status) {
        RentalRequest rentalRequest = new RentalRequest(owner, automobile, START, END);
        ReflectionTestUtils.setField(rentalRequest, "id", REQUEST_ID);
        ReflectionTestUtils.setField(rentalRequest, "status", status);
        return rentalRequest;
    }

    private static Client client(Long id, String name, String cpf) {
        Client client = new Client(name.toLowerCase(), "hash", name, "RG-" + id, cpf, "Rua A, 1", "Professora",
                List.of());
        ReflectionTestUtils.setField(client, "id", id);
        return client;
    }

    private Automobile automobile() {
        Automobile car = new Automobile("LOC-0001", 2023, "Fiat", "Argo", "SAV1A23", company);
        ReflectionTestUtils.setField(car, "id", AUTOMOBILE_ID);
        return car;
    }
}
