package dev.joaomario.carrental.dto.contract;

import dev.joaomario.carrental.model.OwnershipType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ContractRequest(
        @NotNull(message = "Escolha o tipo de propriedade.")
        OwnershipType ownershipType,

        @Valid
        CreditRequest credit
) {
}
