package dev.joaomario.carrental.repository;

import dev.joaomario.carrental.model.CreditContract;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditContractRepository extends JpaRepository<CreditContract, Long> {
}
