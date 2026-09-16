package com.constructiq;

import com.constructiq.model.User;
import com.constructiq.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DatabaseSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@constructiq.com");
            admin.setRole("Admin");
            admin.setPasswordHash("admin");
            admin.setAvatarInitials("AU");
            
            User pm = new User();
            pm.setName("Project Manager");
            pm.setEmail("pm@constructiq.com");
            pm.setRole("Project Manager");
            pm.setPasswordHash("pm");
            pm.setAvatarInitials("PM");
            
            User fe = new User();
            fe.setName("Finance Executive");
            fe.setEmail("finance@constructiq.com");
            fe.setRole("Finance Executive");
            fe.setPasswordHash("finance");
            fe.setAvatarInitials("FE");

            userRepository.saveAll(List.of(admin, pm, fe));
        }
    }
}
