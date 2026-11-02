package dev.joaomario.carrental.repository;

import dev.joaomario.carrental.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByRg(String rg);

    List<Client> findByNameContainingIgnoreCaseOrCpfContainingOrderByNameAsc(String name, String cpf);
}
