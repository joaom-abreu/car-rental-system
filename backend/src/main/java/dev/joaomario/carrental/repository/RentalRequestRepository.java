package dev.joaomario.carrental.repository;

import dev.joaomario.carrental.model.RentalRequest;
import dev.joaomario.carrental.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RentalRequestRepository extends JpaRepository<RentalRequest, Long> {

    List<RentalRequest> findAllByOrderByCreatedAtDesc();

    List<RentalRequest> findByClientIdOrderByCreatedAtDesc(Long clientId);

    boolean existsByClientId(Long clientId);

    boolean existsByAutomobileId(Long automobileId);

    @Query("""
            select count(r) > 0 from RentalRequest r
            where r.automobile.id = :automobileId and r.status in :statuses
              and r.startDate <= :endDate and r.endDate >= :startDate
            """)
    boolean existsOverlapping(Long automobileId, List<RequestStatus> statuses, LocalDate startDate,
                              LocalDate endDate);
}
