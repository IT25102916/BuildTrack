package com.constructiq.repository;

import com.constructiq.model.MaterialRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MaterialRequestRepository extends JpaRepository<MaterialRequest, Long> {
    List<MaterialRequest> findByProjectId(Long projectId);
}
