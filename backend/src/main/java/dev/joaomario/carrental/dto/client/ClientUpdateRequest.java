package dev.joaomario.carrental.dto.client;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.util.List;

public record ClientUpdateRequest(
        @NotBlank(message = "Informe o nome.")
        @Size(max = 100, message = "O nome deve ter até 100 caracteres.")
        String name,

        @NotBlank(message = "Informe o RG.")
        @Size(max = 20, message = "O RG deve ter até 20 caracteres.")
        String rg,

        @NotBlank(message = "Informe o CPF.")
        @CPF(message = "CPF inválido.")
        String cpf,

        @NotBlank(message = "Informe o endereço.")
        @Size(max = 200, message = "O endereço deve ter até 200 caracteres.")
        String address,

        @NotBlank(message = "Informe a profissão.")
        @Size(max = 60, message = "A profissão deve ter até 60 caracteres.")
        String profession,

        @NotNull(message = "Informe os empregos (a lista pode ser vazia).")
        @Size(max = 3, message = "Informe no máximo 3 empregos.")
        List<@Valid EmploymentDto> employments
) {
}
