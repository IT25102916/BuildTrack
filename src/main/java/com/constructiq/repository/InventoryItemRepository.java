package com.constructiq.repository;

import com.constructiq.model.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    List<InventoryItem> findByIsActiveTrue();
    List<InventoryItem> findByQuantityOnHandLessThanEqual(BigDecimal threshold);
}
