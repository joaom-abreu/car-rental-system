package dev.joaomario.carrental.dto.auth;

public record LoginResponse(String token, UserSummaryResponse user) {
}
