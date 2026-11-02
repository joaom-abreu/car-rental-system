package dev.joaomario.carrental.dto.contract;

import dev.joaomario.carrental.model.OwnershipType;

import java.math.BigDecimal;
import java.time.Instant;

public record ContractResponse(
        Long id,
        OwnershipType ownershipType,
        String signedByName,
        Instant signedAt,
        CreditSummary credit
) {

    public record CreditSummary(String bankName, BigDecimal amount, BigDecimal monthlyInterestRate,
                                int installments) {
    }
}
