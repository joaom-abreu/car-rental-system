package dev.joaomario.carrental.dto.rentalrequest;

import dev.joaomario.carrental.model.RequestStatus;

import java.time.Instant;
import java.time.LocalDate;

public record RentalRequestResponse(
        Long id,
        RequestStatus status,
        LocalDate startDate,
        LocalDate endDate,
        Instant createdAt,
        Instant updatedAt,
        ClientSummary client,
        AutomobileSummary automobile,
        EvaluationSummary evaluation
) {

    public record ClientSummary(Long id, String name, String cpf) {
    }

    public record AutomobileSummary(Long id, String brand, String model, int year, String plate) {
    }

    public record EvaluationSummary(String agentName, String opinion, Instant evaluatedAt) {
    }
}
