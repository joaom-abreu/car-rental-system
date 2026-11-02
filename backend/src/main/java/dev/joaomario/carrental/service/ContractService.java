package dev.joaomario.carrental.service;

import dev.joaomario.carrental.dto.contract.ContractRequest;
import dev.joaomario.carrental.dto.contract.ContractResponse;
import dev.joaomario.carrental.dto.contract.ContractResponse.CreditSummary;
import dev.joaomario.carrental.dto.contract.CreditRequest;
import dev.joaomario.carrental.exception.BusinessRuleException;
import dev.joaomario.carrental.exception.ForbiddenException;
import dev.joaomario.carrental.exception.NotFoundException;
import dev.joaomario.carrental.model.Agent;
import dev.joaomario.carrental.model.Contract;
import dev.joaomario.carrental.model.CreditContract;
import dev.joaomario.carrental.model.OwnershipType;
import dev.joaomario.carrental.model.RentalRequest;
import dev.joaomario.carrental.repository.ContractRepository;
import dev.joaomario.carrental.repository.CreditContractRepository;
import dev.joaomario.carrental.repository.RentalRequestRepository;
import dev.joaomario.carrental.security.CurrentUserProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContractService {

    private static final String NOT_FOUND_MESSAGE = "Pedido não encontrado.";
    private static final String ONLY_AGENTS_MESSAGE = "Só agentes podem executar contratos.";
    private static final String CREDIT_ONLY_BY_BANK_MESSAGE = "Só bancos podem conceder contrato de crédito.";
    private static final String BANK_OWNERSHIP_NEEDS_CREDIT_MESSAGE =
            "A propriedade do banco exige um contrato de crédito.";

    private final ContractRepository contractRepository;
    private final CreditContractRepository creditContractRepository;
    private final RentalRequestRepository rentalRequestRepository;
    private final CurrentUserProvider currentUserProvider;

    public ContractService(ContractRepository contractRepository,
                           CreditContractRepository creditContractRepository,
                           RentalRequestRepository rentalRequestRepository,
                           CurrentUserProvider currentUserProvider) {
        this.contractRepository = contractRepository;
        this.creditContractRepository = creditContractRepository;
        this.rentalRequestRepository = rentalRequestRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public ContractResponse sign(Long rentalRequestId, ContractRequest request) {
        Agent agent = currentAgent();
        RentalRequest rentalRequest = rentalRequestRepository.findById(rentalRequestId)
                .orElseThrow(() -> new NotFoundException(NOT_FOUND_MESSAGE));
        checkCreditRules(agent, request);
        rentalRequest.markAsContracted();
        CreditContract creditContract = saveCreditContract(agent, request.credit());
        Contract contract = contractRepository.save(
                new Contract(rentalRequest, request.ownershipType(), agent, creditContract));
        transferOwnership(rentalRequest, request.ownershipType(), agent);
        return toResponse(contract);
    }

    @Transactional(readOnly = true)
    public ContractResponse findByRentalRequestId(Long rentalRequestId) {
        return contractRepository.findByRentalRequestId(rentalRequestId)
                .map(this::toResponse)
                .orElse(null);
    }

    private Agent currentAgent() {
        if (currentUserProvider.getCurrentUser() instanceof Agent agent) {
            return agent;
        }
        throw new ForbiddenException(ONLY_AGENTS_MESSAGE);
    }

    private void checkCreditRules(Agent agent, ContractRequest request) {
        if (request.credit() != null && !agent.isBank()) {
            throw new BusinessRuleException(CREDIT_ONLY_BY_BANK_MESSAGE);
        }
        if (request.ownershipType() == OwnershipType.BANK && request.credit() == null) {
            throw new BusinessRuleException(BANK_OWNERSHIP_NEEDS_CREDIT_MESSAGE);
        }
    }

    private CreditContract saveCreditContract(Agent bank, CreditRequest credit) {
        if (credit == null) {
            return null;
        }
        return creditContractRepository.save(new CreditContract(bank, credit.amount(),
                credit.monthlyInterestRate(), credit.installments()));
    }

    private void transferOwnership(RentalRequest rentalRequest, OwnershipType ownershipType, Agent agent) {
        switch (ownershipType) {
            case CLIENT -> rentalRequest.getAutomobile().transferTo(rentalRequest.getClient());
            case BANK -> rentalRequest.getAutomobile().transferTo(agent);
            case COMPANY -> {
            }
        }
    }

    private ContractResponse toResponse(Contract contract) {
        return new ContractResponse(contract.getId(), contract.getOwnershipType(),
                contract.getSignedBy().getName(), contract.getSignedAt(),
                toCreditSummary(contract.getCreditContract()));
    }

    private CreditSummary toCreditSummary(CreditContract creditContract) {
        if (creditContract == null) {
            return null;
        }
        return new CreditSummary(creditContract.getBank().getName(), creditContract.getAmount(),
                creditContract.getMonthlyInterestRate(), creditContract.getInstallments());
    }
}
