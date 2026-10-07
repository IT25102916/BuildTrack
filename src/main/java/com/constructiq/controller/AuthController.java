package com.constructiq.controller;

import com.constructiq.model.User;
import com.constructiq.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpSession session) {
        String email    = body.getOrDefault("email", "").trim();
        String password = body.getOrDefault("password", "").trim();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "No account found for that email."));
        }
        User user = userOpt.get();
        if (!user.getPasswordHash().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Incorrect password."));
        }
        // Store user id in session
        session.setAttribute("userId", user.getId());
        return ResponseEntity.ok(sanitize(user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Not logged in."));
        return userRepository.findById(userId)
            .map(u -> ResponseEntity.ok(sanitize(u)))
            .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Not logged in."));

        String oldPassword = body.getOrDefault("oldPassword", "").trim();
        String newPassword = body.getOrDefault("newPassword", "").trim();

        if (newPassword.length() < 3) {
            return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 3 characters."));
        }

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.status(404).body(Map.of("error", "User not found."));

        User user = userOpt.get();
        if (!user.getPasswordHash().equals(oldPassword)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Current password does not match."));
        }

        user.setPasswordHash(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

    /** Return user without the password hash */
    private Map<String, Object> sanitize(User u) {
        return Map.of(
            "id",             u.getId(),
            "name",           u.getName(),
            "email",          u.getEmail(),
            "role",           u.getRole(),
            "phone",          u.getPhone() != null ? u.getPhone() : "",
            "avatarInitials", u.getAvatarInitials()
        );
    }
}
