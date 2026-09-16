package com.constructiq.repository;

import com.constructiq.model.ChangeOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChangeOrderRepository extends JpaRepository<ChangeOrder, Long> {
    List<ChangeOrder> findByProjectId(Long projectId);
}
