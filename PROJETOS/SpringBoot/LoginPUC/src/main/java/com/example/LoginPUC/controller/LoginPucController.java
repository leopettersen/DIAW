package com.example.LoginPUC.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// @RestController -> apenas Back-end -> API Rest
// @Controller -> também com Front-end -> HTML, CSS, JS, Thymeleaf

@Controller
public class LoginPucController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }
}