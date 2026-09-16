package com.constructiq.repository;

import com.constructiq.model.Subcontractor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubcontractorRepository extends JpaRepository<Subcontractor, Long> {
    List<Subcontractor> findByStatus(String status);
}
