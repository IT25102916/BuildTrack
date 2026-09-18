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
        seedUser("admin@constructiq.com", "Admin User", "admin", "demo", "AD");
        seedUser("pm@constructiq.com", "Project Manager", "pm", "demo", "PM");
        seedUser("supervisor@constructiq.com", "Site Supervisor", "supervisor", "demo", "SS");
        seedUser("finance@constructiq.com", "Finance Team", "finance", "demo", "FI");
        seedUser("procurement@constructiq.com", "Procurement", "procurement", "demo", "PR");
        seedUser("client@constructiq.com", "Client", "client", "demo", "CL");
    }

    private void seedUser(String email, String name, String role, String password, String avatarInitials) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setEmail(email);
        user.setName(name);
        user.setRole(role);
        user.setPasswordHash(password);
        user.setAvatarInitials(avatarInitials);
        user.setActive(true);
        userRepository.save(user);
    }
}
