package dev.joaomario.carrental.dto.rentalrequest;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RentalRequestRequest(
        @NotNull(message = "Escolha o automóvel.")
        Long automobileId,

        @NotNull(message = "Informe a data de início.")
        LocalDate startDate,

        @NotNull(message = "Informe a data de fim.")
        LocalDate endDate
) {
}
