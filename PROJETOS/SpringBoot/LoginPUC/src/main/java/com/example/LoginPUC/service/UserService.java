package com.example.LoginPUC.service;

import com.example.LoginPUC.model.Usuario;
import com.example.LoginPUC.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void saveUser(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        userRepository.save(usuario);
    }

    public boolean resetPassword(String email, String novaSenha) {
        Usuario usuario = userRepository.findByEmail(email);
        if (usuario == null) {
            return false;
        }
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        userRepository.save(usuario);
        return true;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = userRepository.findByUsername(username);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + username);
        }
        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getSenha())
                .roles("USER")
                .build();
    }
}