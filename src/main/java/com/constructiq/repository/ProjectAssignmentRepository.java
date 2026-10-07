package com.constructiq.repository;

import com.constructiq.model.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long> {
    List<ProjectAssignment> findByProjectId(Long projectId);
    List<ProjectAssignment> findByUserId(Long userId);
    void deleteByProjectId(Long projectId);
}
