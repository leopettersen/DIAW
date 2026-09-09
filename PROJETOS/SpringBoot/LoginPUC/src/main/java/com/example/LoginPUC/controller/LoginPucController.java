package com.example.LoginPUC.controller;

import com.example.LoginPUC.model.Usuario;
import com.example.LoginPUC.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginPucController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/home")
    public String home() {
        return "home";
    }

    @GetMapping("/error")
    public String error() {
        return "error";
    }

    @GetMapping("/admin")
    public String admin() {
        return "admin";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String handleRegister(
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("cpf") String cpf,
            @RequestParam("rg") String rg,
            @RequestParam("endereco") String endereco,
            @RequestParam("instituicao") String instituicao,
            @RequestParam("password") String password) {

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setEmail(email);
        usuario.setCpf(cpf);
        usuario.setRg(rg);
        usuario.setEndereco(endereco);
        usuario.setInstituicao(instituicao);
        usuario.setSenha(password);

        userService.saveUser(usuario);

        return "redirect:/login";
    }

    @GetMapping("/recoverpassword")
    public String recoverpassword() {
        return "recoverpassword";
    }

    @PostMapping("/recoverpassword")
    public String handleRecoverPassword(
            @RequestParam("email") String email) {

        // Aqui você pode adicionar lógica para recuperar a senha.
        // userService.recoverPassword(email);

        // Redirecionar ou exibir uma mensagem de sucesso
        System.out.println("Recuperação de E-mail: Redirecionado para a página de login.");
        return "redirect:/login"; // Após a recuperação de senha, redirecionar para a página de login
    }
}