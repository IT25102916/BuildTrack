package com.constructiq.controller;

import com.constructiq.model.PunchItem;
import com.constructiq.repository.PunchItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/punch")
@SuppressWarnings("null")
public class PunchController {

    @Autowired private PunchItemRepository punchItemRepository;

    @GetMapping
    public List<PunchItem> getAll() {
        return punchItemRepository.findAll();
    }

    @GetMapping("/project/{projectId}")
    public List<PunchItem> getByProject(@PathVariable Long projectId) {
        return punchItemRepository.findByProjectIdOrderByOpenedDateDesc(projectId);
    }

    @PostMapping
    @RequireRole({"site_engineer", "pm", "admin"})
    public PunchItem create(@RequestBody PunchItem item) { return punchItemRepository.save(item); }

    @PutMapping("/{id}")
    @RequireRole({"site_engineer", "pm", "admin"})
    public ResponseEntity<PunchItem> update(@PathVariable Long id, @RequestBody PunchItem updates) {
        return punchItemRepository.findById(id).map(p -> {
            if (updates.getLocation() != null) p.setLocation(updates.getLocation());
            if (updates.getDescription() != null) p.setDescription(updates.getDescription());
            if (updates.getStatus() != null) p.setStatus(updates.getStatus());
            if (updates.getResponsibleParty() != null) p.setResponsibleParty(updates.getResponsibleParty());
            if (updates.getDueDate() != null) p.setDueDate(updates.getDueDate());
            if ("closed".equals(updates.getStatus()) && p.getClosedDate() == null) {
                p.setClosedDate(LocalDate.now());
            }
            return ResponseEntity.ok(punchItemRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RequireRole({"site_engineer", "pm", "admin"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!punchItemRepository.existsById(id)) return ResponseEntity.notFound().build();
        punchItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
