package dev.joaomario.carrental.repository;

import dev.joaomario.carrental.model.Automobile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AutomobileRepository extends JpaRepository<Automobile, Long> {

    boolean existsByPlate(String plate);

    boolean existsByRegistration(String registration);

    List<Automobile> findAllByOrderByBrandAscModelAsc();
}
