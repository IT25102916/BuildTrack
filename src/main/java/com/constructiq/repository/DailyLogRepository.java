package com.constructiq.repository;

import com.constructiq.model.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    List<DailyLog> findByProjectIdOrderByLogDateDesc(Long projectId);
    List<DailyLog> findByProjectIdInOrderByLogDateDesc(List<Long> projectIds);
    void deleteByProjectId(Long projectId);
}
