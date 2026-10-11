package com.constructiq.controller;

import com.constructiq.model.User;
import com.constructiq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.constructiq.security.RequireRole;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired private UserRepository userRepository;

    @GetMapping
    public List<User> getAll() { return userRepository.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @RequireRole({"admin"})
    public User create(@RequestBody User user) { return userRepository.save(user); }

    @PutMapping("/{id}")
    @RequireRole({"admin"})
    public ResponseEntity<User> update(@PathVariable Long id, @RequestBody User updates) {
        return userRepository.findById(id).map(u -> {
            u.setName(updates.getName());
            u.setEmail(updates.getEmail());
            u.setRole(updates.getRole());
            u.setPhone(updates.getPhone());
            if (updates.getPasswordHash() != null && !updates.getPasswordHash().isBlank()) {
                u.setPasswordHash(updates.getPasswordHash().trim());
            }
            return ResponseEntity.ok(userRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @RequireRole({"admin"})
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
