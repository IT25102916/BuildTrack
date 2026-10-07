package com.constructiq.repository;

import com.constructiq.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByProjectIdAndParentIdIsNull(Long projectId);
    List<Task> findByProjectIdIn(List<Long> projectIds);
    void deleteByProjectId(Long projectId);
}
