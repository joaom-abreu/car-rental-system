package dev.joaomario.carrental.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "agents")
public class Agent extends User {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgentType type;

    protected Agent() {
    }

    public Agent(String username, String passwordHash, String name, AgentType type) {
        super(username, passwordHash, name);
        this.type = type;
    }

    @Override
    public Role getRole() {
        return Role.AGENT;
    }

    public boolean isBank() {
        return type == AgentType.BANK;
    }

    public AgentType getType() {
        return type;
    }
}
