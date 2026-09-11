package com.example.LoginPUC.config;

import com.example.LoginPUC.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserConfig userConfig;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/login/**").permitAll() // Permitir acesso a GET na URL de login
                        .requestMatchers(HttpMethod.POST, "/login/**").permitAll() // Permitir acesso a POST na URL de login
                        .requestMatchers(HttpMethod.GET, "/css/**").permitAll() // Permitir acesso a arquivos CSS
                        .requestMatchers(HttpMethod.GET, "/images/**").permitAll() // Permitir acesso a arquivos de imagem
                        .requestMatchers(HttpMethod.GET, "/register").permitAll() // Permitir acesso à página de registro
                        .requestMatchers(HttpMethod.POST, "/register").permitAll() // Permitir envio do formulário de registro
                        .requestMatchers(HttpMethod.GET, "/recoverpassword").permitAll() // Permitir acesso à página de recuperação de senha
                        .requestMatchers(HttpMethod.POST, "/recoverpassword").permitAll() // Permitir acesso à página de recuperação de senha
                        .requestMatchers(HttpMethod.GET, "/error").permitAll() // Permitir acesso à página de erro
                        .requestMatchers(HttpMethod.GET, "/recovererror").permitAll() // Permitir acesso à página de erro de recuperação de senha
                        .requestMatchers(HttpMethod.GET, "/resetpassword").permitAll() // Permitir acesso à página de criar nova senha
                        .requestMatchers(HttpMethod.POST, "/resetpassword").permitAll() // Permitir acesso à página de criar nova senha
                        .requestMatchers("/admin/**").hasRole("ADMIN") // Proteger URLs que começam com /admin para apenas ADMIN
                        .anyRequest().authenticated() // Proteger todas as outras URLs
                )
                .formLogin(form -> form
                        .loginPage("/login") // Especifica a URL da página de login
                        .permitAll()
                        //.defaultSuccessUrl("/home", true) // Redireciona após o login com sucesso
                        .successHandler((request, response, authentication) -> {
                            // Verifica se o usuário tem a role ADMIN
                            if (authentication.getAuthorities().stream()
                                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
                                response.sendRedirect("/admin"); // Redireciona para /admin
                            } else {
                                response.sendRedirect("/home"); // Redireciona para /home
                            }
                        })
                        .failureHandler((request, response, authentication) -> {
                            response.sendRedirect("/error"); // Redireciona para /error em caso de falha
                        })
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // Define a URL para logout
                        .logoutSuccessUrl("/login?logout=true") // Redireciona após logout com sucesso
                        .permitAll());
        return http.build();
    }

    @Autowired
    private UserService userService;

    @Bean
    public UserDetailsService inMemoryUserDetailsService() {
        UserDetails user = User.builder()
                .username(userConfig.getUserUsername())
                .password(passwordEncoder.encode(userConfig.getUserPassword()))
                .roles("USER")
                .build();
        UserDetails admin = User.builder()
                .username(userConfig.getAdminUsername())
                .password(passwordEncoder.encode(userConfig.getAdminPassword()))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user, admin);
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);

        authBuilder.userDetailsService(inMemoryUserDetailsService())
                .passwordEncoder(passwordEncoder);

        authBuilder.userDetailsService(userService)
                .passwordEncoder(passwordEncoder);

        return authBuilder.build();
    }


}