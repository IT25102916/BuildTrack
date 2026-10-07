package com.constructiq.controller;

import com.constructiq.model.Supplier;
import com.constructiq.model.Subcontractor;
import com.constructiq.repository.SupplierRepository;
import com.constructiq.repository.SubcontractorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/suppliers")
@RequireRole({"procurement", "inventory_manager", "pm", "admin"})
@SuppressWarnings("null")
public class SupplierController {

    @Autowired private SupplierRepository supplierRepository;
    @Autowired private SubcontractorRepository subcontractorRepository;
    @Autowired private JdbcTemplate jdbcTemplate;

    // ── Suppliers ─────────────────────────────────────────

    @GetMapping
    public List<Supplier> getAllSuppliers() { return supplierRepository.findAll(); }

    @PostMapping
    @Transactional
    @com.constructiq.security.RequireRole({"procurement", "pm", "admin"})
    public ResponseEntity<?> createSupplier(@RequestBody Supplier s) {
        if (s.getId() != null) {
            if (supplierRepository.existsById(s.getId())) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "Supplier with ID " + s.getId() + " already exists."));
            }
            try {
                jdbcTemplate.execute("SET IDENTITY_INSERT suppliers ON");
                jdbcTemplate.update(
                    "INSERT INTO suppliers (id, name, contact_name, phone, email, type, rating, on_time_percent, is_active, created_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())",
                    s.getId(),
                    s.getName(),
                    s.getContactName(),
                    s.getPhone(),
                    s.getEmail(),
                    s.getType(),
                    s.getRating() != null ? s.getRating() : BigDecimal.ZERO,
                    s.getOnTimePercent(),
                    s.isActive() ? 1 : 0
                );
            } finally {
                jdbcTemplate.execute("SET IDENTITY_INSERT suppliers OFF");
            }
            return ResponseEntity.ok(supplierRepository.findById(s.getId()).orElse(s));
        }
        return ResponseEntity.ok(supplierRepository.save(s));
    }

    @PutMapping("/{id}")
    @com.constructiq.security.RequireRole({"procurement", "pm", "admin"})
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
    @com.constructiq.security.RequireRole({"procurement", "pm", "admin"})
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepository.existsById(id)) return ResponseEntity.notFound().build();
        supplierRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Subcontractors ────────────────────────────────────

    @GetMapping("/subcontractors")
    public List<Subcontractor> getAllSubcontractors() { return subcontractorRepository.findAll(); }

    @PostMapping("/subcontractors")
    @Transactional
    @com.constructiq.security.RequireRole({"pm", "admin"})
    public ResponseEntity<?> createSubcontractor(@RequestBody Subcontractor s) {
        if (s.getId() != null) {
            if (subcontractorRepository.existsById(s.getId())) {
                return ResponseEntity.badRequest().body(java.util.Map.of("message", "Subcontractor with ID " + s.getId() + " already exists."));
            }
            try {
                jdbcTemplate.execute("SET IDENTITY_INSERT subcontractors ON");
                jdbcTemplate.update(
                    "INSERT INTO subcontractors (id, name, contact_name, phone, email, license_number, insurance_expiry, rating, status, created_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, GETDATE())",
                    s.getId(),
                    s.getName(),
                    s.getContactName(),
                    s.getPhone(),
                    s.getEmail(),
                    s.getLicenseNumber(),
                    s.getInsuranceExpiry(),
                    s.getRating() != null ? s.getRating() : BigDecimal.ZERO,
                    s.getStatus() != null ? s.getStatus() : "active"
                );
            } finally {
                jdbcTemplate.execute("SET IDENTITY_INSERT subcontractors OFF");
            }
            return ResponseEntity.ok(subcontractorRepository.findById(s.getId()).orElse(s));
        }
        return ResponseEntity.ok(subcontractorRepository.save(s));
    }

    @PutMapping("/subcontractors/{id}")
    @com.constructiq.security.RequireRole({"pm", "admin"})
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
    @com.constructiq.security.RequireRole({"pm", "admin"})
    public ResponseEntity<Void> deleteSubcontractor(@PathVariable Long id) {
        if (!subcontractorRepository.existsById(id)) return ResponseEntity.notFound().build();
        subcontractorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
