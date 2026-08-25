package com.example.Clima_RestAPI.controller;

import com.example.Clima_RestAPI.service.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class Controller {

    Service service = new Service();

    @GetMapping("/clima") // https://localhost:8080/clima (BH é o padrão)
    public String consultarClima() {
        return service.consultarClima("belo horizonte");
    }

    @GetMapping("/clima/{cidade}")
    public String consultarClima(@PathVariable String cidade) {
        return service.consultarClima(cidade);
    }
}
