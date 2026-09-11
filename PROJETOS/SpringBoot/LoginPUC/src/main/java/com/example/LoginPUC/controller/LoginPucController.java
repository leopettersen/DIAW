package com.example.LoginPUC.controller;

import com.example.LoginPUC.exception.SendEmailException;
import com.example.LoginPUC.model.Usuario;
import com.example.LoginPUC.repository.UserRepository;
import com.example.LoginPUC.service.SendEmailService;
import com.example.LoginPUC.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
            @RequestParam("password") String password,
            RedirectAttributes redirectAttributes) {

        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            redirectAttributes.addFlashAttribute("erro", "Nome de usuário ou e-mail já cadastrado.");
            redirectAttributes.addAttribute("username", username);
            redirectAttributes.addAttribute("email", email);
            redirectAttributes.addAttribute("cpf", cpf);
            redirectAttributes.addAttribute("rg", rg);
            redirectAttributes.addAttribute("endereco", endereco);
            redirectAttributes.addAttribute("instituicao", instituicao);
            return "redirect:/register";
        }
        if (password.length() < 3) {
            redirectAttributes.addFlashAttribute("erro", "A senha precisa ter pelo menos 3 caracteres.");
            redirectAttributes.addAttribute("username", username);
            redirectAttributes.addAttribute("email", email);
            redirectAttributes.addAttribute("cpf", cpf);
            redirectAttributes.addAttribute("rg", rg);
            redirectAttributes.addAttribute("endereco", endereco);
            redirectAttributes.addAttribute("instituicao", instituicao);
            return "redirect:/register";
        }

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SendEmailService sendEmailService;

    @PostMapping("/recoverpassword")
    public String handleRecoverPassword(
            @RequestParam("email") String email,
            RedirectAttributes redirectAttributes) {

        Usuario usuario = userRepository.findByEmail(email);

        if (usuario == null) {
            return "redirect:/recovererror";
        }

        String subject = "Recuperação de senha - LoginPuc";
        String body = "Olá, " + usuario.getUsername() + "!\n\n"
                + "Recebemos um pedido de recuperação de senha para o e-mail " + email + ".\n"
                + "Se não foi você, ignore esta mensagem.\n\n"
                + "Link para recuperação de senha: http://localhost:8080/resetpassword?email=" + email;
        try {
            sendEmailService.sendEmail(email, subject, body);
        } catch (SendEmailException e) {
            redirectAttributes.addFlashAttribute("erro", "Não foi possível enviar o e-mail agora. Tente novamente mais tarde.");
            redirectAttributes.addAttribute("email", email);
            return "redirect:/recoverpassword";
        }
        return "redirect:/login"; // Após a recuperação de senha, redirecionar para a página de login
    }

    @GetMapping("/recovererror")
    public String recovererror() { return "recovererror"; }

    @GetMapping("/resetpassword")
    public String resetpassword() { return "resetpassword"; }

    @PostMapping("/resetpassword")
    public String handleResetPassword(
            @RequestParam("email") String email,
            @RequestParam("novaSenha") String novaSenha,
            @RequestParam("confirmarSenha") String confirmarSenha,
            RedirectAttributes redirectAttributes) {
        if (novaSenha.length() < 3) {
            redirectAttributes.addFlashAttribute("erro", "A senha precisa ter pelo menos 3 caracteres.");
            return "redirect:/resetpassword?email=" + email;
        }
        if (!novaSenha.equals(confirmarSenha)) {
            redirectAttributes.addFlashAttribute("erro", "As senhas não coincidem. Tente novamente.");
            return "redirect:/resetpassword?email=" + email;
        }
        if (!userService.resetPassword(email, novaSenha)) {
            return "redirect:/recovererror";
        }
        return "redirect:/login";
    }
}