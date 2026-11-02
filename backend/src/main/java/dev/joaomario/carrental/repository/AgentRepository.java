package dev.joaomario.carrental.repository;

import dev.joaomario.carrental.model.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, Long> {
}
