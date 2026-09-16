package com.constructiq.controller;

import com.constructiq.model.MaterialRequest;
import com.constructiq.model.PurchaseOrder;
import com.constructiq.repository.MaterialRequestRepository;
import com.constructiq.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procurement")
@SuppressWarnings("null")
public class ProcurementController {

    @Autowired private MaterialRequestRepository materialRequestRepository;
    @Autowired private PurchaseOrderRepository purchaseOrderRepository;

    // ── Material Requests ─────────────────────────────────

    @GetMapping("/api/material-requests/project/{projectId}")
    public List<MaterialRequest> getMRs(@PathVariable Long projectId) {
        return materialRequestRepository.findByProjectId(projectId);
    }

    @PostMapping("/api/material-requests")
    public MaterialRequest createMR(@RequestBody MaterialRequest mr) { return materialRequestRepository.save(mr); }

    @PutMapping("/api/material-requests/{id}")
    public ResponseEntity<MaterialRequest> updateMR(@PathVariable Long id, @RequestBody MaterialRequest updates) {
        return materialRequestRepository.findById(id).map(mr -> {
            mr.setStatus(updates.getStatus());
            mr.setNotes(updates.getNotes());
            return ResponseEntity.ok(materialRequestRepository.save(mr));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/material-requests/{id}")
    public ResponseEntity<Void> deleteMR(@PathVariable Long id) {
        if (!materialRequestRepository.existsById(id)) return ResponseEntity.notFound().build();
        materialRequestRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Purchase Orders ───────────────────────────────────

    @GetMapping("/api/purchase-orders/project/{projectId}")
    public List<PurchaseOrder> getPOs(@PathVariable Long projectId) {
        return purchaseOrderRepository.findByProjectId(projectId);
    }

    @PostMapping("/api/purchase-orders")
    public PurchaseOrder createPO(@RequestBody PurchaseOrder po) { return purchaseOrderRepository.save(po); }

    @PutMapping("/api/purchase-orders/{id}")
    public ResponseEntity<PurchaseOrder> updatePO(@PathVariable Long id, @RequestBody PurchaseOrder updates) {
        return purchaseOrderRepository.findById(id).map(po -> {
            po.setStatus(updates.getStatus());
            po.setDescription(updates.getDescription());
            po.setAmount(updates.getAmount());
            return ResponseEntity.ok(purchaseOrderRepository.save(po));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/purchase-orders/{id}")
    public ResponseEntity<Void> deletePO(@PathVariable Long id) {
        if (!purchaseOrderRepository.existsById(id)) return ResponseEntity.notFound().build();
        purchaseOrderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
