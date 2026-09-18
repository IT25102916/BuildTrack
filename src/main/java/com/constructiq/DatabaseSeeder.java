package com.constructiq;

import com.constructiq.model.User;
import com.constructiq.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@SuppressWarnings("null")
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DatabaseSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUser("Admin User", "admin@constructiq.com", "Admin", "AU", "demo");
        seedUser("Project Manager", "pm@constructiq.com", "PM", "PM", "demo");
        seedUser("Site Supervisor", "supervisor@constructiq.com", "Supervisor", "SS", "demo");
        seedUser("Finance Executive", "finance@constructiq.com", "Finance", "FE", "demo");
        seedUser("Procurement Specialist", "procurement@constructiq.com", "Procurement", "PR", "demo");
        seedUser("Client Representative", "client@constructiq.com", "Client", "CL", "demo");
    }

    private void seedUser(String name, String email, String role, String initials, String password) {
        User user = userRepository.findByEmail(email).orElse(new User());
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setAvatarInitials(initials);
        user.setPasswordHash(password);
        user.setActive(true);
        userRepository.save(user);
    }
}
