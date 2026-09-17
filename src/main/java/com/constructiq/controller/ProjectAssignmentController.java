package com.constructiq.controller;

import com.constructiq.model.ProjectAssignment;
import com.constructiq.repository.ProjectAssignmentRepository;
import com.constructiq.repository.ProjectRepository;
import com.constructiq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/assignments")
@SuppressWarnings("null")
public class ProjectAssignmentController {

    private final ProjectAssignmentRepository assignmentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProjectAssignmentController(ProjectAssignmentRepository assignmentRepository, ProjectRepository projectRepository, UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ProjectAssignment>> getAssignments(@PathVariable Long projectId) {
        return ResponseEntity.ok(assignmentRepository.findByProjectId(projectId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<ProjectAssignment> assignUser(@PathVariable Long projectId, @PathVariable Long userId) {
        ProjectAssignment assignment = new ProjectAssignment();
        assignment.setProject(projectRepository.findById(projectId).orElseThrow());
        assignment.setUser(userRepository.findById(userId).orElseThrow());
        assignment.setAssignedDate(LocalDate.now());
        return ResponseEntity.ok(assignmentRepository.save(assignment));
    }

    @DeleteMapping("/{assignmentId}")
    public ResponseEntity<Void> removeAssignment(@PathVariable Long projectId, @PathVariable Long assignmentId) {
        assignmentRepository.deleteById(assignmentId);
        return ResponseEntity.noContent().build();
    }
}
