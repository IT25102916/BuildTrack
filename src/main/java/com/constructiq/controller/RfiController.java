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
    @Autowired private com.constructiq.repository.UserRepository userRepository;
    @Autowired private com.constructiq.service.ProjectService projectService;

    // ── RFIs ──────────────────────────────────────────────

    @GetMapping("/rfis")
    public List<Rfi> getAllRfis(jakarta.servlet.http.HttpSession session) {
        Long userId = (session != null) ? (Long) session.getAttribute("userId") : null;
        if (userId != null) {
            com.constructiq.model.User user = userRepository.findById(userId).orElse(null);
            if (user != null && !"admin".equalsIgnoreCase(user.getRole())) {
                List<Long> pIds = projectService.getAccessibleProjectIds(userId, user.getRole());
                return pIds.isEmpty() ? List.of() : rfiRepository.findByProjectIdIn(pIds);
            }
        }
        return rfiRepository.findAll();
    }

    @GetMapping("/rfis/project/{projectId}")
    public List<Rfi> getRfis(@PathVariable Long projectId) { return rfiRepository.findByProjectId(projectId); }

    @PostMapping("/rfis")
    @com.constructiq.security.RequireRole({"pm", "site_engineer", "subcontractor", "admin", "client"})
    public Rfi createRfi(@RequestBody Rfi rfi) { return rfiRepository.save(rfi); }

    @PutMapping("/rfis/{id}")
    @com.constructiq.security.RequireRole({"pm", "site_engineer", "subcontractor", "admin"})
    public ResponseEntity<Rfi> updateRfi(@PathVariable Long id, @RequestBody Rfi updates) {
        return rfiRepository.findById(id).map(r -> {
            if (updates.getRfiNumber() != null) r.setRfiNumber(updates.getRfiNumber());
            if (updates.getSubject() != null) r.setSubject(updates.getSubject());
            if (updates.getStatus() != null) r.setStatus(updates.getStatus());
            if (updates.getResponse() != null) r.setResponse(updates.getResponse());
            if (updates.getBallInCourt() != null) r.setBallInCourt(updates.getBallInCourt());
            if (updates.getAssignedTo() != null) r.setAssignedTo(updates.getAssignedTo());
            if (updates.getDueDate() != null) r.setDueDate(updates.getDueDate());
            return ResponseEntity.ok(rfiRepository.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/rfis/{id}")
    @com.constructiq.security.RequireRole({"pm", "admin"})
    public ResponseEntity<Void> deleteRfi(@PathVariable Long id) {
        if (!rfiRepository.existsById(id)) return ResponseEntity.notFound().build();
        rfiRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── Submittals ────────────────────────────────────────

    @GetMapping("/submittals")
    public List<Submittal> getAllSubmittals(jakarta.servlet.http.HttpSession session) {
        Long userId = (session != null) ? (Long) session.getAttribute("userId") : null;
        if (userId != null) {
            com.constructiq.model.User user = userRepository.findById(userId).orElse(null);
            if (user != null && !"admin".equalsIgnoreCase(user.getRole())) {
                List<Long> pIds = projectService.getAccessibleProjectIds(userId, user.getRole());
                return pIds.isEmpty() ? List.of() : submittalRepository.findByProjectIdIn(pIds);
            }
        }
        return submittalRepository.findAll();
    }

    @GetMapping("/submittals/project/{projectId}")
    public List<Submittal> getSubmittals(@PathVariable Long projectId) { return submittalRepository.findByProjectId(projectId); }

    @PostMapping("/submittals")
    @com.constructiq.security.RequireRole({"pm", "site_engineer", "subcontractor", "admin"})
    public Submittal createSubmittal(@RequestBody Submittal s) { return submittalRepository.save(s); }

    @PutMapping("/submittals/{id}")
    @com.constructiq.security.RequireRole({"pm", "site_engineer", "subcontractor", "admin"})
    public ResponseEntity<Submittal> updateSubmittal(@PathVariable Long id, @RequestBody Submittal updates) {
        return submittalRepository.findById(id).map(s -> {
            if (updates.getSubmittalNumber() != null) s.setSubmittalNumber(updates.getSubmittalNumber());
            if (updates.getSpecSection() != null) s.setSpecSection(updates.getSpecSection());
            if (updates.getDescription() != null) s.setDescription(updates.getDescription());
            if (updates.getStatus() != null) s.setStatus(updates.getStatus());
            if (updates.getSubmittedByName() != null) s.setSubmittedByName(updates.getSubmittedByName());
            if (updates.getReviewedBy() != null) s.setReviewedBy(updates.getReviewedBy());
            return ResponseEntity.ok(submittalRepository.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/submittals/{id}")
    @com.constructiq.security.RequireRole({"pm", "admin"})
    public ResponseEntity<Void> deleteSubmittal(@PathVariable Long id) {
        if (!submittalRepository.existsById(id)) return ResponseEntity.notFound().build();
        submittalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
