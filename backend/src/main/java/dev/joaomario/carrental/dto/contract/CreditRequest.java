package dev.joaomario.carrental.dto.contract;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CreditRequest(
        @NotNull(message = "Informe o valor do crédito.")
        @Positive(message = "O valor do crédito deve ser maior que zero.")
        BigDecimal amount,

        @NotNull(message = "Informe a taxa de juros mensal.")
        @DecimalMin(value = "0", message = "A taxa de juros deve estar entre 0 e 100.")
        @DecimalMax(value = "100", message = "A taxa de juros deve estar entre 0 e 100.")
        BigDecimal monthlyInterestRate,

        @NotNull(message = "Informe o número de parcelas.")
        @Min(value = 1, message = "O número de parcelas deve estar entre 1 e 60.")
        @Max(value = 60, message = "O número de parcelas deve estar entre 1 e 60.")
        Integer installments
) {
}
