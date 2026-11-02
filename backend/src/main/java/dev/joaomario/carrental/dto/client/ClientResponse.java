package dev.joaomario.carrental.dto.client;

import java.time.Instant;
import java.util.List;

public record ClientResponse(
        Long id,
        String username,
        String name,
        String rg,
        String cpf,
        String address,
        String profession,
        List<EmploymentDto> employments,
        Instant createdAt
) {
}
