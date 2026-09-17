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
@SuppressWarnings("null")
public class SafetyController {

    @Autowired private IncidentRepository incidentRepository;

    @GetMapping("/project/{projectId}")
    public List<Incident> getByProject(@PathVariable Long projectId) {
        return incidentRepository.findByProjectIdOrderByIncidentDateDesc(projectId);
    }

    @PostMapping
    @RequireRole({"supervisor", "pm", "admin"})
    public Incident create(@RequestBody Incident incident) { return incidentRepository.save(incident); }

    @PutMapping("/{id}")
    @RequireRole({"supervisor", "pm", "admin"})
    public ResponseEntity<Incident> update(@PathVariable Long id, @RequestBody Incident updates) {
        return incidentRepository.findById(id).map(i -> {
            i.setStatus(updates.getStatus());
            i.setActionTaken(updates.getActionTaken());
            i.setSeverity(updates.getSeverity());
            return ResponseEntity.ok(incidentRepository.save(i));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RequireRole({"supervisor", "pm", "admin"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!incidentRepository.existsById(id)) return ResponseEntity.notFound().build();
        incidentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
