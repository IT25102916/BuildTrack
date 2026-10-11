package com.constructiq.controller;

import com.constructiq.model.Incident;
import com.constructiq.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/safety")
public class SafetyController {

    @Autowired private IncidentRepository incidentRepository;

    @GetMapping
    public List<Incident> getAll() {
        return incidentRepository.findAll();
    }

    @GetMapping("/project/{projectId}")
    public List<Incident> getByProject(@PathVariable Long projectId) {
        return incidentRepository.findByProjectIdOrderByIncidentDateDesc(projectId);
    }

    @PostMapping
    @RequireRole({"site_engineer", "pm", "admin"})
    public Incident create(@RequestBody Incident incident) { return incidentRepository.save(incident); }

    @PutMapping("/{id}")
    @RequireRole({"site_engineer", "pm", "admin"})
    public ResponseEntity<Incident> update(@PathVariable Long id, @RequestBody Incident updates) {
        return incidentRepository.findById(id).map(i -> {
            if (updates.getIncidentDate() != null) i.setIncidentDate(updates.getIncidentDate());
            if (updates.getDescription() != null) i.setDescription(updates.getDescription());
            if (updates.getStatus() != null) i.setStatus(updates.getStatus());
            if (updates.getActionTaken() != null) i.setActionTaken(updates.getActionTaken());
            if (updates.getSeverity() != null) i.setSeverity(updates.getSeverity());
            return ResponseEntity.ok(incidentRepository.save(i));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RequireRole({"site_engineer", "pm", "admin"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!incidentRepository.existsById(id)) return ResponseEntity.notFound().build();
        incidentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
