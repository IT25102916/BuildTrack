package com.constructiq.repository;

import com.constructiq.model.PunchItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PunchItemRepository extends JpaRepository<PunchItem, Long> {
    List<PunchItem> findByProjectIdOrderByOpenedDateDesc(Long projectId);
    List<PunchItem> findByProjectIdInOrderByOpenedDateDesc(List<Long> projectIds);
    void deleteByProjectId(Long projectId);
}
