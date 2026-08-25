package com.example.Clima_RestAPI.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.example"})
public class ClimaRestApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClimaRestApiApplication.class, args);
	}

}
