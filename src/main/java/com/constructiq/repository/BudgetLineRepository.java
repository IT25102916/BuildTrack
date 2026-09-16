package com.constructiq.repository;

import com.constructiq.model.BudgetLine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetLineRepository extends JpaRepository<BudgetLine, Long> {
    List<BudgetLine> findByProjectId(Long projectId);
}
