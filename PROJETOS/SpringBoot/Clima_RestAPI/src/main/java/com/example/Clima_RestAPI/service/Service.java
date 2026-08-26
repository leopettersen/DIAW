package com.example.Clima_RestAPI.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.google.gson.Gson;
import com.example.Clima_RestAPI.model.*;

public class Service {
    private static Gson gson = new Gson();
    private static final String BASE_URL_CLIMA = "https://api.open-meteo.com/v1/forecast?";
    private static final String END_BASE_URL_CLIMA = "&daily=temperature_2m_max,temperature_2m_min&current=wind_speed_10m,wind_direction_10m,temperature_2m,relative_humidity_2m&forecast_days=1";
    private static final String BASE_URL_CIDADE = "https://geocoding-api.open-meteo.com/v1/search?name=";
    private static final String END_BASE_URL_CIDADE = "&count=1&language=pt&format=json";

    private String consultarURL(String apiUrl) {
        String dados = "";
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(apiUrl, String.class);
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            dados = responseEntity.getBody();
        } else {
            dados = "Falha ao obter dados. Código de status: " + responseEntity.getStatusCode();
        }
        return dados;
    }

    public String consultarClima(String city) {
        String dadosCidade = consultarURL(BASE_URL_CIDADE + city + END_BASE_URL_CIDADE);
        Cidade cidade = gson.fromJson(dadosCidade, Cidade.class);
        double latitude = cidade.getLatitude();
        double longitude = cidade.getLongitude();
        String dados = consultarURL(BASE_URL_CLIMA + "latitude=" + latitude + "&longitude=" + longitude + END_BASE_URL_CLIMA);
        Clima clima = gson.fromJson(dados, Clima.class);
        clima.cidadeClima = cidade.getName();
        return clima.getResponse();
    }
}