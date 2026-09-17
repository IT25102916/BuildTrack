package com.constructiq.repository;

import com.constructiq.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByProjectIdOrderByCreatedAtDesc(Long projectId);
}
