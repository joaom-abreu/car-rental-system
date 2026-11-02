package dev.joaomario.carrental.repository;

import dev.joaomario.carrental.model.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    Optional<Contract> findByRentalRequestId(Long rentalRequestId);
}
