package com.constructiq.controller;

import com.constructiq.model.Rfi;
import com.constructiq.model.Submittal;
import com.constructiq.repository.RfiRepository;
import com.constructiq.repository.SubmittalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@SuppressWarnings("null")
public class RfiController {

    @Autowired private RfiRepository rfiRepository;
    @Autowired private SubmittalRepository submittalRepository;

    // ── RFIs ──────────────────────────────────────────────

    @GetMapping("/rfis")
    public List<Rfi> getAllRfis() { return rfiRepository.findAll(); }

    @GetMapping("/rfis/project/{projectId}")
    public List<Rfi> getRfis(@PathVariable Long projectId) { return rfiRepository.findByProjectId(projectId); }

    @PostMapping("/rfis")
    public Rfi createRfi(@RequestBody Rfi rfi) { return rfiRepository.save(rfi); }

    @PutMapping("/rfis/{id}")
    public ResponseEntity<Rfi> updateRfi(@PathVariable Long id, @RequestBody Rfi updates) {
        return rfiRepository.findById(id).map(r -> {
            r.setStatus(updates.getStatus());
            r.setResponse(updates.getResponse());
            r.setBallInCourt(updates.getBallInCourt());
            r.setAssignedTo(updates.getAssignedTo());
            r.setDueDate(updates.getDueDate());
            return ResponseEntity.ok(rfiRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/rfis/{id}")
    public ResponseEntity<Void> deleteRfi(@PathVariable Long id) {
        if (!rfiRepository.existsById(id)) return ResponseEntity.notFound().build();
        rfiRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Submittals ────────────────────────────────────────

    @GetMapping("/submittals")
    public List<Submittal> getAllSubmittals() { return submittalRepository.findAll(); }

    @GetMapping("/submittals/project/{projectId}")
    public List<Submittal> getSubmittals(@PathVariable Long projectId) { return submittalRepository.findByProjectId(projectId); }

    @PostMapping("/submittals")
    public Submittal createSubmittal(@RequestBody Submittal s) { return submittalRepository.save(s); }

    @PutMapping("/submittals/{id}")
    public ResponseEntity<Submittal> updateSubmittal(@PathVariable Long id, @RequestBody Submittal updates) {
        return submittalRepository.findById(id).map(s -> {
            s.setStatus(updates.getStatus());
            s.setReviewedBy(updates.getReviewedBy());
            return ResponseEntity.ok(submittalRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }
}
