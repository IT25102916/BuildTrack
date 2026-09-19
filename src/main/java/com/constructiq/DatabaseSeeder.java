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
        // List of unwanted legacy/duplicate account emails to remove
        List<String> unwantedEmails = List.of(
            "admin_officer@constructiq.com",
            "finance_exec@constructiq.com",
            "inventory_sup@constructiq.com",
            "procurement_off@constructiq.com",
            "jdoe@example.com",
            "client@example.com"
        );

        for (String email : unwantedEmails) {
            userRepository.findByEmail(email).ifPresent(user -> {
                try {
                    userRepository.delete(user);
                } catch (Exception ignored) {
                    // Ignore if foreign keys prevent deletion
                }
            });
        }

        // Ensure standard user accounts exist with password 'demo'
        seedUser("Alexander Vance", "admin@constructiq.com", "admin", "AV", "+1 (555) 010-1001");
        seedUser("Marcus Brody", "pm@constructiq.com", "pm", "MB", "+1 (555) 010-1002");
        seedUser("Elena Rostova", "site_eng@constructiq.com", "site_engineer", "ER", "+1 (555) 010-1003");
        seedUser("Sarah Jenkins", "finance@constructiq.com", "finance", "SJ", "+1 (555) 010-1004");
        seedUser("David Chen", "procurement@constructiq.com", "procurement", "DC", "+1 (555) 010-1005");
        seedUser("Carlos Mendez", "inventory@constructiq.com", "inventory_manager", "CM", "+1 (555) 010-1006");
        seedUser("Site Supervisor", "supervisor@constructiq.com", "supervisor", "SS", "+1 (555) 010-1009");
        seedUser("Liam O'Connor", "subcontractor@constructiq.com", "subcontractor", "LO", "+1 (555) 010-1007");
        seedUser("Victoria Sterling", "client@constructiq.com", "client", "VS", "+1 (555) 010-1008");
    }

    private void seedUser(String name, String email, String role, String avatar, String phone) {
        User user = userRepository.findByEmail(email).orElseGet(User::new);
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setPasswordHash("demo");
        user.setAvatarInitials(avatar);
        user.setPhone(phone);
        user.setActive(true);
        userRepository.save(user);
    }
}
