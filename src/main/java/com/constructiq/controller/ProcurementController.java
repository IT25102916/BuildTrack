package com.constructiq.controller;

import com.constructiq.model.MaterialRequest;
import com.constructiq.model.PurchaseOrder;
import com.constructiq.model.Quotation;
import com.constructiq.repository.MaterialRequestRepository;
import com.constructiq.repository.PurchaseOrderRepository;
import com.constructiq.repository.QuotationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/procurement")
@SuppressWarnings("null")
public class ProcurementController {

    @Autowired private MaterialRequestRepository materialRequestRepository;
    @Autowired private PurchaseOrderRepository purchaseOrderRepository;
    @Autowired private QuotationRepository quotationRepository;
    @Autowired private com.constructiq.repository.SupplierRepository supplierRepository;

    // ── Material Requests ─────────────────────────────────

    @GetMapping("/material-requests/project/{projectId}")
    public List<MaterialRequest> getMRs(@PathVariable Long projectId) {
        return materialRequestRepository.findByProjectId(projectId);
    }

    @PostMapping("/material-requests")
    @RequireRole({"site_engineer", "procurement", "inventory_manager", "admin"})
    public MaterialRequest createMR(@RequestBody MaterialRequest mr) { return materialRequestRepository.save(mr); }

    @PutMapping("/material-requests/{id}")
    @RequireRole({"site_engineer", "procurement", "inventory_manager", "admin"})
    public ResponseEntity<MaterialRequest> updateMR(@PathVariable Long id, @RequestBody MaterialRequest updates) {
        return materialRequestRepository.findById(id).map(mr -> {
            mr.setStatus(updates.getStatus());
            mr.setNotes(updates.getNotes());
            return ResponseEntity.ok(materialRequestRepository.save(mr));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/material-requests/{id}")
    @RequireRole({"site_engineer", "procurement", "inventory_manager", "admin"})
    public ResponseEntity<Void> deleteMR(@PathVariable Long id) {
        if (!materialRequestRepository.existsById(id)) return ResponseEntity.notFound().build();
        materialRequestRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Purchase Orders ──────────────────────────────────────────────────

    @GetMapping("/purchase-orders")
    public List<PurchaseOrder> getAllPOs() {
        return purchaseOrderRepository.findAll();
    }

    @GetMapping("/purchase-orders/project/{projectId}")
    public List<PurchaseOrder> getPOs(@PathVariable Long projectId) {
        return purchaseOrderRepository.findByProjectId(projectId);
    }

    @PostMapping("/purchase-orders")
    @RequireRole({"procurement", "inventory_manager", "admin"})
    public PurchaseOrder createPO(@RequestBody PurchaseOrder po) {
        if (po.getAmount() == null || po.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Purchase order amount must be greater than zero.");
        }
        return purchaseOrderRepository.save(po);
    }

    @PutMapping("/purchase-orders/{id}")
    @RequireRole({"procurement", "inventory_manager", "admin"})
    public ResponseEntity<PurchaseOrder> updatePO(@PathVariable Long id, @RequestBody PurchaseOrder updates) {
        return purchaseOrderRepository.findById(id).map(po -> {
            po.setStatus(updates.getStatus());
            po.setDescription(updates.getDescription());
            if (updates.getAmount() != null) {
                if (updates.getAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                    throw new IllegalArgumentException("Purchase order amount must be greater than zero.");
                }
                po.setAmount(updates.getAmount());
            }
            return ResponseEntity.ok(purchaseOrderRepository.save(po));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/purchase-orders/{id}")
    @RequireRole({"procurement", "inventory_manager", "admin"})
    public ResponseEntity<Void> deletePO(@PathVariable Long id) {
        if (!purchaseOrderRepository.existsById(id)) return ResponseEntity.notFound().build();
        purchaseOrderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Quotations ───────────────────────────────────────────────────────

    @GetMapping("/quotations/request/{requestId}")
    public List<Quotation> getQuotationsForRequest(@PathVariable Long requestId) {
        return quotationRepository.findByMaterialRequestId(requestId);
    }

    @PostMapping("/quotations")
    @RequireRole({"procurement", "inventory_manager", "admin"})
    public Quotation createQuotation(@RequestBody Quotation quotation) {
        return quotationRepository.save(quotation);
    }

    @PutMapping("/quotations/{id}/accept")
    @RequireRole({"procurement", "inventory_manager", "admin"})
    public ResponseEntity<Quotation> acceptQuotation(@PathVariable Long id) {
        return quotationRepository.findById(id).map(acceptedQuote -> {
            acceptedQuote.setStatus("ACCEPTED");
            Quotation savedQuote = quotationRepository.save(acceptedQuote);

            // Reject all other quotations for the same material request
            List<Quotation> otherQuotes = quotationRepository.findByMaterialRequestId(acceptedQuote.getMaterialRequestId());
            for (Quotation quote : otherQuotes) {
                if (!quote.getId().equals(id)) {
                    quote.setStatus("REJECTED");
                    quotationRepository.save(quote);
                }
            }

            // Auto-create Purchase Order from accepted quotation
            PurchaseOrder po = new PurchaseOrder();
            po.setMaterialRequestId(acceptedQuote.getMaterialRequestId());
            po.setSupplierId(acceptedQuote.getSupplierId());
            if (acceptedQuote.getSupplierId() != null) {
                supplierRepository.findById(acceptedQuote.getSupplierId())
                    .ifPresent(s -> po.setSupplierName(s.getName()));
            }
            po.setDescription("PO auto-generated from Accepted Quotation #" + id);
            po.setAmount(acceptedQuote.getPrice() != null ? acceptedQuote.getPrice() : java.math.BigDecimal.ZERO);
            po.setStatus("ordered");
            po.setOrderDate(java.time.LocalDate.now());
            materialRequestRepository.findById(acceptedQuote.getMaterialRequestId())
                .ifPresent(mr -> po.setProjectId(mr.getProjectId()));
            if (po.getProjectId() == null) po.setProjectId(1L);
            purchaseOrderRepository.save(po);

            return ResponseEntity.ok(savedQuote);
        }).orElse(ResponseEntity.notFound().build());
    }
}
