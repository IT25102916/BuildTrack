package com.constructiq.controller;

import com.constructiq.model.InventoryItem;
import com.constructiq.model.InventoryTransaction;
import com.constructiq.model.Supplier;
import com.constructiq.repository.InventoryItemRepository;
import com.constructiq.repository.InventoryTransactionRepository;
import com.constructiq.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.constructiq.security.RequireRole;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired private InventoryItemRepository itemRepo;
    @Autowired private InventoryTransactionRepository txRepo;
    @Autowired private SupplierRepository supplierRepo;

    // ── Items ──────────────────────────────────────────────────────────────

    @GetMapping("/items")
    public List<InventoryItem> getAllItems() {
        return itemRepo.findByIsActiveTrue();
    }

    @PostMapping("/items")
    @RequireRole({"inventory_manager", "admin"})
    public InventoryItem createItem(@RequestBody InventoryItem item) {
        return itemRepo.save(item);
    }

    @PutMapping("/items/{id}")
    @RequireRole({"inventory_manager", "admin"})
    public ResponseEntity<InventoryItem> updateItem(@PathVariable Long id, @RequestBody InventoryItem updates) {
        return itemRepo.findById(id).map(item -> {
            item.setName(updates.getName());
            item.setDescription(updates.getDescription());
            item.setUnit(updates.getUnit());
            item.setCategory(updates.getCategory());
            item.setReorderLevel(updates.getReorderLevel());
            item.setUnitCost(updates.getUnitCost());
            item.setSupplierId(updates.getSupplierId());
            return ResponseEntity.ok(itemRepo.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/items/{id}")
    @RequireRole({"inventory_manager", "admin"})
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        return itemRepo.findById(id).map(item -> {
            item.setActive(false);
            itemRepo.save(item);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }



    // ── Receive Stock ──────────────────────────────────────────────────────

    @PostMapping("/items/{id}/receive")
    @RequireRole({"inventory_manager", "admin"})
    public ResponseEntity<?> receiveStock(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return itemRepo.findById(id).map(item -> {
            BigDecimal qty = new BigDecimal(body.get("quantity").toString());
            if (qty.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be positive"));
            }

            // Update stock level
            item.setQuantityOnHand(item.getQuantityOnHand().add(qty));
            itemRepo.save(item);

            // Record transaction
            InventoryTransaction tx = new InventoryTransaction();
            tx.setInventoryItemId(id);
            tx.setType("RECEIPT");
            tx.setQuantity(qty);
            tx.setNotes(body.getOrDefault("notes", "").toString());
            if (body.containsKey("performedByUserId")) {
                tx.setPerformedByUserId(Long.parseLong(body.get("performedByUserId").toString()));
            }
            if (body.containsKey("performedByName")) {
                tx.setPerformedByName(body.get("performedByName").toString());
            }
            txRepo.save(tx);

            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Issue Stock ────────────────────────────────────────────────────────

    @PostMapping("/items/{id}/issue")
    @RequireRole({"inventory_manager", "admin"})
    public ResponseEntity<?> issueStock(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return itemRepo.findById(id).map(item -> {
            BigDecimal qty = new BigDecimal(body.get("quantity").toString());
            if (qty.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be positive"));
            }
            if (item.getQuantityOnHand().compareTo(qty) < 0) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "Insufficient stock. Available: " + item.getQuantityOnHand()));
            }

            // Update stock level
            item.setQuantityOnHand(item.getQuantityOnHand().subtract(qty));
            itemRepo.save(item);

            // Record transaction
            InventoryTransaction tx = new InventoryTransaction();
            tx.setInventoryItemId(id);
            tx.setType("ISSUE");
            tx.setQuantity(qty);
            if (body.containsKey("projectId")) {
                tx.setProjectId(Long.parseLong(body.get("projectId").toString()));
            }
            tx.setNotes(body.getOrDefault("notes", "").toString());
            if (body.containsKey("performedByUserId")) {
                tx.setPerformedByUserId(Long.parseLong(body.get("performedByUserId").toString()));
            }
            if (body.containsKey("performedByName")) {
                tx.setPerformedByName(body.get("performedByName").toString());
            }
            txRepo.save(tx);

            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── Transactions / Ledger ──────────────────────────────────────────────

    @GetMapping("/transactions")
    @RequireRole({"inventory_manager", "admin"})
    public List<InventoryTransaction> getAllTransactions() {
        return txRepo.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/items/{id}/transactions")
    public List<InventoryTransaction> getItemTransactions(@PathVariable Long id) {
        return txRepo.findByInventoryItemIdOrderByCreatedAtDesc(id);
    }

    // ── Low-Stock Alerts ───────────────────────────────────────────────────

    @GetMapping("/low-stock")
    public List<InventoryItem> getLowStockItems() {
        // Returns items where quantityOnHand <= reorderLevel (and reorderLevel > 0)
        return itemRepo.findByIsActiveTrue().stream()
            .filter(i -> i.getReorderLevel().compareTo(BigDecimal.ZERO) > 0
                      && i.getQuantityOnHand().compareTo(i.getReorderLevel()) <= 0)
            .toList();
    }

    // ── Suppliers (re-use existing) ────────────────────────────────────────

    @GetMapping("/suppliers")
    public List<Supplier> getSuppliers() {
        return supplierRepo.findAll();
    }
}
