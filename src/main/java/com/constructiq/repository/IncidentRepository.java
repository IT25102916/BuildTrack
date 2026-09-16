package com.constructiq.repository;

import com.constructiq.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByProjectIdOrderByIncidentDateDesc(Long projectId);
}
