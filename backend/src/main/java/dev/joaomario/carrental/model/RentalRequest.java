package dev.joaomario.carrental.model;

import dev.joaomario.carrental.exception.BusinessRuleException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "rental_requests")
public class RentalRequest {

    private static final String NOT_EDITABLE_MESSAGE = "Só é possível modificar pedidos em análise.";
    private static final String NOT_CANCELLABLE_MESSAGE = "Só é possível cancelar pedidos em análise ou aprovados.";
    private static final String NOT_EVALUABLE_MESSAGE = "Só é possível avaliar pedidos em análise.";
    private static final int OPINION_MAX_LENGTH = 500;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "automobile_id")
    private Automobile automobile;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @ManyToOne
    @JoinColumn(name = "evaluated_by_id")
    private Agent evaluatedBy;

    @Column(length = OPINION_MAX_LENGTH)
    private String evaluationOpinion;

    private Instant evaluatedAt;

    protected RentalRequest() {
    }

    public RentalRequest(Client client, Automobile automobile, LocalDate startDate, LocalDate endDate) {
        this.client = client;
        this.automobile = automobile;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = RequestStatus.PENDING;
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
    }

    public void update(Automobile automobile, LocalDate startDate, LocalDate endDate) {
        if (status != RequestStatus.PENDING) {
            throw new BusinessRuleException(NOT_EDITABLE_MESSAGE);
        }
        this.automobile = automobile;
        this.startDate = startDate;
        this.endDate = endDate;
        this.updatedAt = Instant.now();
    }

    public void approve(Agent agent, String opinion) {
        evaluate(agent, opinion, RequestStatus.APPROVED);
    }

    public void reject(Agent agent, String opinion) {
        evaluate(agent, opinion, RequestStatus.REJECTED);
    }

    public void cancel() {
        if (status != RequestStatus.PENDING && status != RequestStatus.APPROVED) {
            throw new BusinessRuleException(NOT_CANCELLABLE_MESSAGE);
        }
        this.status = RequestStatus.CANCELLED;
        this.updatedAt = Instant.now();
    }

    public boolean belongsTo(User user) {
        return client.getId().equals(user.getId());
    }

    private void evaluate(Agent agent, String opinion, RequestStatus newStatus) {
        if (status != RequestStatus.PENDING) {
            throw new BusinessRuleException(NOT_EVALUABLE_MESSAGE);
        }
        this.status = newStatus;
        this.evaluatedBy = agent;
        this.evaluationOpinion = opinion;
        this.evaluatedAt = Instant.now();
        this.updatedAt = evaluatedAt;
    }

    public Long getId() {
        return id;
    }

    public Client getClient() {
        return client;
    }

    public Automobile getAutomobile() {
        return automobile;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Agent getEvaluatedBy() {
        return evaluatedBy;
    }

    public String getEvaluationOpinion() {
        return evaluationOpinion;
    }

    public Instant getEvaluatedAt() {
        return evaluatedAt;
    }
}
