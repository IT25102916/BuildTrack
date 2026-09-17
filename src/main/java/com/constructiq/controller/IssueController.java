package com.constructiq.controller;

import com.constructiq.model.Issue;
import com.constructiq.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@SuppressWarnings("null")
public class IssueController {

    @Autowired
    private IssueRepository issueRepository;

    @GetMapping("/project/{projectId}")
    public List<Issue> getProjectIssues(@PathVariable Long projectId) {
        return issueRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

    @PostMapping
    public Issue reportIssue(@RequestBody Issue issue) {
        return issueRepository.save(issue);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssueStatus(@PathVariable Long id, @RequestBody Issue updates) {
        return issueRepository.findById(id).map(issue -> {
            issue.setStatus(updates.getStatus());
            return ResponseEntity.ok(issueRepository.save(issue));
        }).orElse(ResponseEntity.notFound().build());
    }
}
