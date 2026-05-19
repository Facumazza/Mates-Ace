package com.matesace.config;

import com.matesace.entity.User;
import com.matesace.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedAdmin(UserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (!users.existsByEmail("admin@matesace.com")) {
                User admin = new User();
                admin.setName("Administrador");
                admin.setEmail("admin@matesace.com");
                admin.setPassword(encoder.encode("mates2024"));
                admin.setRole("ADMIN");
                users.save(admin);
                System.out.println("✓ Admin creado: admin@matesace.com / mates2024");
            }
        };
    }
}
