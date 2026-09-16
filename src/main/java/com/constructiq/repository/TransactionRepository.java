package com.constructiq.repository;

import com.constructiq.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByProjectId(Long projectId);
    List<Transaction> findByCategory(String category);
    List<Transaction> findByProjectIdAndCategory(Long projectId, String category);
}
