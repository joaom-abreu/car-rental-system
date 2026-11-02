package dev.joaomario.carrental.dto.automobile;

import dev.joaomario.carrental.model.Role;

public record AutomobileResponse(
        Long id,
        String registration,
        int year,
        String brand,
        String model,
        String plate,
        String ownerName,
        Role ownerRole
) {
}
