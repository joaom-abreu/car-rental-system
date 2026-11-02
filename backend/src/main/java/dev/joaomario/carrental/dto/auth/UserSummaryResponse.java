package dev.joaomario.carrental.dto.auth;

import dev.joaomario.carrental.model.AgentType;
import dev.joaomario.carrental.model.Role;

public record UserSummaryResponse(Long id, String username, String name, Role role, AgentType agentType) {
}
