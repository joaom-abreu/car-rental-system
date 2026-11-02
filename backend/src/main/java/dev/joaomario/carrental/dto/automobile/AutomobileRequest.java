package dev.joaomario.carrental.dto.automobile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AutomobileRequest(
        @NotBlank(message = "Informe a matrícula.")
        String registration,

        @NotNull(message = "Informe o ano.")
        Integer year,

        @NotBlank(message = "Informe a marca.")
        String brand,

        @NotBlank(message = "Informe o modelo.")
        String model,

        @NotBlank(message = "Informe a placa.")
        String plate
) {
}
