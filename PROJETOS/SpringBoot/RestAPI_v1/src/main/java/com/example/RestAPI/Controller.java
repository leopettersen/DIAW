package com.example.RestAPI;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    // Exemplo de endpoint usando Spring Boot
    @GetMapping("/test")
    public String helloWorld(){
        return "Essa é minha primeira API REST";
    }

    @GetMapping("/diaw")
    public String diaw() {
        return "Esse é meu segundo endpoint.";
    }
}