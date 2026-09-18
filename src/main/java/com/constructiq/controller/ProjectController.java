package com.constructiq.controller;

import com.constructiq.model.Project;
import com.constructiq.model.User;
import com.constructiq.repository.UserRepository;
import com.constructiq.service.ProjectService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.constructiq.security.RequireRole;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    @Autowired
    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return null;
        return userRepository.findById(userId).orElse(null);
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(HttpSession session) {
        User user = getCurrentUser(session);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(projectService.getAllProjects(user.getId(), user.getRole().toLowerCase()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    @RequireRole({"admin"})
    public ResponseEntity<Project> createProject(@Valid @RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @RequireRole({"pm", "admin"})
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @Valid @RequestBody Project project, HttpSession session) {
        User user = getCurrentUser(session);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        try {
            Project updated = projectService.updateProject(id, project, user.getId(), user.getRole().toLowerCase());
            return ResponseEntity.ok(updated);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @DeleteMapping("/{id}")
    @RequireRole({"admin"})
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
