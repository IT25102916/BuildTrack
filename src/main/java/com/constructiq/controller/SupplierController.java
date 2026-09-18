package com.constructiq.controller;

import com.constructiq.model.Supplier;
import com.constructiq.model.Subcontractor;
import com.constructiq.repository.SupplierRepository;
import com.constructiq.repository.SubcontractorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/suppliers")
@RequireRole({"procurement", "inventory_manager", "pm", "admin"})
@SuppressWarnings("null")
public class SupplierController {

    @Autowired private SupplierRepository supplierRepository;
    @Autowired private SubcontractorRepository subcontractorRepository;

    // ── Suppliers ─────────────────────────────────────────

    @GetMapping
    public List<Supplier> getAllSuppliers() { return supplierRepository.findAll(); }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier s) { return supplierRepository.save(s); }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier updates) {
        return supplierRepository.findById(id).map(s -> {
            s.setName(updates.getName());
            s.setContactName(updates.getContactName());
            s.setPhone(updates.getPhone());
            s.setEmail(updates.getEmail());
            s.setType(updates.getType());
            s.setRating(updates.getRating());
            s.setOnTimePercent(updates.getOnTimePercent());
            s.setActive(updates.isActive());
            return ResponseEntity.ok(supplierRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) return ResponseEntity.notFound().build();
        supplierRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Subcontractors ────────────────────────────────────

    @GetMapping("/subcontractors")
    public List<Subcontractor> getAllSubcontractors() { return subcontractorRepository.findAll(); }

    @PostMapping("/subcontractors")
    public Subcontractor createSubcontractor(@RequestBody Subcontractor s) { return subcontractorRepository.save(s); }

    @PutMapping("/subcontractors/{id}")
    public ResponseEntity<Subcontractor> updateSubcontractor(@PathVariable Long id, @RequestBody Subcontractor updates) {
        return subcontractorRepository.findById(id).map(s -> {
            s.setName(updates.getName());
            s.setContactName(updates.getContactName());
            s.setPhone(updates.getPhone());
            s.setEmail(updates.getEmail());
            s.setLicenseNumber(updates.getLicenseNumber());
            s.setInsuranceExpiry(updates.getInsuranceExpiry());
            s.setRating(updates.getRating());
            s.setStatus(updates.getStatus());
            return ResponseEntity.ok(subcontractorRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/subcontractors/{id}")
    public ResponseEntity<Void> deleteSubcontractor(@PathVariable Long id) {
        if (!subcontractorRepository.existsById(id)) return ResponseEntity.notFound().build();
        subcontractorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
