package com.constructiq.repository;

import com.constructiq.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByProjectId(Long projectId);
    List<Invoice> findBySupplierId(Long supplierId);
    List<Invoice> findByStatus(String status);
}
