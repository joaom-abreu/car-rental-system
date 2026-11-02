package dev.joaomario.carrental.dto.client;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record EmploymentDto(
        @NotBlank(message = "Informe o empregador.")
        String employer,

        @NotNull(message = "Informe o rendimento.")
        @Positive(message = "O rendimento deve ser maior que zero.")
        BigDecimal income
) {
}
