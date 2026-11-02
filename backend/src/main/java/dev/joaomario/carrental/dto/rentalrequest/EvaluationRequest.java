package dev.joaomario.carrental.dto.rentalrequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EvaluationRequest(
        @NotNull(message = "Escolha aprovar ou reprovar.")
        Boolean approved,

        @NotBlank(message = "Escreva o parecer.")
        @Size(min = 5, max = 500, message = "O parecer deve ter de 5 a 500 caracteres.")
        String opinion
) {
}
