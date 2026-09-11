package com.example.LoginPUC.repository;

import com.example.LoginPUC.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Usuario, Long> {
    Usuario findByEmail(String email);
    Usuario findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}