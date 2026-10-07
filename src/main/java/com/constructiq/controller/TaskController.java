package com.constructiq.controller;

import com.constructiq.model.Task;
import com.constructiq.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/tasks")
@SuppressWarnings("null")
public class TaskController {

    @Autowired private TaskRepository taskRepository;
    @Autowired private com.constructiq.repository.UserRepository userRepository;
    @Autowired private com.constructiq.service.ProjectService projectService;

    private void validateTask(Task task) {
        if (task.getEndDate() != null && task.getStartDate() != null && task.getEndDate().isBefore(task.getStartDate())) {
            throw new IllegalArgumentException("Task end date cannot be earlier than start date.");
        }
        if (task.getPercentComplete() < 0 || task.getPercentComplete() > 100) {
            throw new IllegalArgumentException("Task completion percentage must be between 0 and 100.");
        }
    }

    @GetMapping
    public List<Task> getAll(jakarta.servlet.http.HttpSession session) {
        Long userId = (session != null) ? (Long) session.getAttribute("userId") : null;
        if (userId != null) {
            com.constructiq.model.User user = userRepository.findById(userId).orElse(null);
            if (user != null && !"admin".equalsIgnoreCase(user.getRole())) {
                List<Long> pIds = projectService.getAccessibleProjectIds(userId, user.getRole());
                return pIds.isEmpty() ? List.of() : taskRepository.findByProjectIdIn(pIds);
            }
        }
        return taskRepository.findAll();
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        return taskRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @RequireRole({"pm", "admin"})
    public Task create(@RequestBody Task task) {
        validateTask(task);
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    @RequireRole({"pm", "admin"})
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task updates) {
        validateTask(updates);
        return taskRepository.findById(id).map(t -> {
            t.setName(updates.getName());
            t.setStatus(updates.getStatus());
            t.setPercentComplete(updates.getPercentComplete());
            t.setStartDate(updates.getStartDate());
            t.setEndDate(updates.getEndDate());
            t.setAssignedUserId(updates.getAssignedUserId());
            t.setAssignedName(updates.getAssignedName());
            t.setMilestone(updates.isIsMilestone());
            t.setCritical(updates.isIsCritical());
            return ResponseEntity.ok(taskRepository.save(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RequireRole({"pm", "admin"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
