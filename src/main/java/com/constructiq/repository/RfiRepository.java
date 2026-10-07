package com.constructiq.repository;

import com.constructiq.model.Rfi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RfiRepository extends JpaRepository<Rfi, Long> {
    List<Rfi> findByProjectId(Long projectId);
    List<Rfi> findByProjectIdIn(List<Long> projectIds);
    void deleteByProjectId(Long projectId);
}
