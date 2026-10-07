package com.constructiq.repository;

import com.constructiq.model.Submittal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmittalRepository extends JpaRepository<Submittal, Long> {
    List<Submittal> findByProjectId(Long projectId);
    List<Submittal> findByProjectIdIn(List<Long> projectIds);
    void deleteByProjectId(Long projectId);
}
