package com.expensetracker;

import com.expensetracker.model.ERole;
import com.expensetracker.model.Role;
import com.expensetracker.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ExpensetrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpensetrackerApplication.class, args);
	}

	@Bean
	public CommandLineRunner demo(RoleRepository roleRepository) {
		return (args) -> {
			if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_USER));
			}
			if (roleRepository.findByName(ERole.ROLE_MODERATOR).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_MODERATOR));
			}
			if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
				roleRepository.save(new Role(ERole.ROLE_ADMIN));
			}
		};
	}

}