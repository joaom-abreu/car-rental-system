package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.contract.ContractRequest;
import dev.joaomario.carrental.dto.contract.ContractResponse;
import dev.joaomario.carrental.dto.contract.CreditRequest;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.Automobile;
import dev.joaomario.carrental.model.Client;
import dev.joaomario.carrental.model.Contract;
import dev.joaomario.carrental.model.CreditContract;
import dev.joaomario.carrental.model.OwnershipType;
import dev.joaomario.carrental.model.RentalRequest;
import dev.joaomario.carrental.model.RequestStatus;
import dev.joaomario.carrental.repository.ContractRepository;
import dev.joaomario.carrental.repository.CreditContractRepository;
import dev.joaomario.carrental.repository.RentalRequestRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContractServiceTest {

    private static final Long REQUEST_ID = 100L;
    private static final CreditRequest CREDIT = new CreditRequest(new BigDecimal("30000.00"),
            new BigDecimal("1.50"), 36);

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private CreditContractRepository creditContractRepository;

    @Mock
    private RentalRequestRepository rentalRequestRepository;

    @Mock
    private CurrentUserProvider currentUserProvider;

    @InjectMocks
    private ContractService contractService;

    private final Agent company = new Agent("locadora", "hash", "Locadora Savassi", AgentType.COMPANY);
    private final Agent bank = new Agent("banco", "hash", "Banco Pampulha", AgentType.BANK);
    private final Client client = client();
    private final Automobile automobile = new Automobile("LOC-0001", 2023, "Fiat", "Argo", "SAV1A23", company);

    @Test
    void signWithClientOwnershipTransfersCarToClientAndMarksContracted() {
        RentalRequest rentalRequest = requestWithStatus(RequestStatus.APPROVED);
        givenSigner(company, rentalRequest);
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContractResponse response = contractService.sign(REQUEST_ID, new ContractRequest(OwnershipType.CLIENT, null));

        assertThat(automobile.getOwner()).isSameAs(client);
        assertThat(rentalRequest.getStatus()).isEqualTo(RequestStatus.CONTRACTED);
        assertThat(response.signedByName()).isEqualTo("Locadora Savassi");
        assertThat(response.credit()).isNull();
    }

    @Test
    void signWithBankOwnershipAndCreditTransfersCarToBank() {
        givenSigner(bank, requestWithStatus(RequestStatus.APPROVED));
        when(creditContractRepository.save(any(CreditContract.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContractResponse response = contractService.sign(REQUEST_ID, new ContractRequest(OwnershipType.BANK, CREDIT));

        assertThat(automobile.getOwner()).isSameAs(bank);
        assertThat(response.ownershipType()).isEqualTo(OwnershipType.BANK);
        assertThat(response.credit().bankName()).isEqualTo("Banco Pampulha");
        assertThat(response.credit().installments()).isEqualTo(36);
    }

    @Test
    void signWithCompanyOwnershipKeepsCurrentOwner() {
        givenSigner(company, requestWithStatus(RequestStatus.APPROVED));
        when(contractRepository.save(any(Contract.class))).thenAnswer(invocation -> invocation.getArgument(0));

        contractService.sign(REQUEST_ID, new ContractRequest(OwnershipType.COMPANY, null));

        assertThat(automobile.getOwner()).isSameAs(company);
    }

    @Test
    void creditFromAgentThatIsNotBankThrowsBusinessRule() {
        RentalRequest rentalRequest = requestWithStatus(RequestStatus.APPROVED);
        givenSigner(company, rentalRequest);

        assertThatThrownBy(() -> contractService.sign(REQUEST_ID, new ContractRequest(OwnershipType.CLIENT, CREDIT)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Só bancos podem conceder contrato de crédito.");
        assertThat(rentalRequest.getStatus()).isEqualTo(RequestStatus.APPROVED);
        verify(contractRepository, never()).save(any());
    }

    @Test
    void bankOwnershipWithoutCreditThrowsBusinessRule() {
        givenSigner(bank, requestWithStatus(RequestStatus.APPROVED));

        assertThatThrownBy(() -> contractService.sign(REQUEST_ID, new ContractRequest(OwnershipType.BANK, null)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("A propriedade do banco exige um contrato de crédito.");
        assertThat(automobile.getOwner()).isSameAs(company);
    }

    @Test
    void signRequestThatIsNotApprovedThrowsBusinessRule() {
        givenSigner(company, requestWithStatus(RequestStatus.PENDING));

        assertThatThrownBy(() -> contractService.sign(REQUEST_ID, new ContractRequest(OwnershipType.CLIENT, null)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Só é possível executar o contrato de pedidos aprovados.");
        verify(contractRepository, never()).save(any());
    }

    private void givenSigner(Agent agent, RentalRequest rentalRequest) {
        when(currentUserProvider.getCurrentUser()).thenReturn(agent);
        when(rentalRequestRepository.findById(REQUEST_ID)).thenReturn(Optional.of(rentalRequest));
    }

    private RentalRequest requestWithStatus(RequestStatus status) {
        LocalDate start = LocalDate.now().plusDays(1);
        RentalRequest rentalRequest = new RentalRequest(client, automobile, start, start.plusDays(3));
        ReflectionTestUtils.setField(rentalRequest, "status", status);
        return rentalRequest;
    }

    private static Client client() {
        Client client = new Client("maria", "hash", "Maria Silva", "MG1234567", "52998224725", "Rua A, 1",
                "Professora", List.of());
        ReflectionTestUtils.setField(client, "id", 1L);
        return client;
    }
}
