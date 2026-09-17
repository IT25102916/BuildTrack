package com.constructiq.controller;

import com.constructiq.model.Task;
import com.constructiq.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@SuppressWarnings("null")
public class TaskController {

    @Autowired private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getAll() { return taskRepository.findAll(); }

    @GetMapping("/project/{projectId}")
    public List<Task> getByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        return taskRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task create(@RequestBody Task task) { return taskRepository.save(task); }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task updates) {
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
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
