package com.example.Clima_RestAPI.service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.google.gson.Gson;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.time.LocalDateTime;

class Cidade {
    private List<ResultadoItem> results;

    public double getLatitude() {
        return results.get(0).getLatitude();
    }

    public double getLongitude() {
        return results.get(0).getLongitude();
    }

    public String getName() {
        return results.get(0).getName();
    }
}

class ResultadoItem {
    private String name;
    private double latitude;
    private double longitude;

    public String getName() {
        return name;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }
}

class Clima {
    private Current current;
    private Daily daily;
    public String cidadeClima;

    public Current getCurrent() {
        return current;
    }

    public Daily getDaily() {
        return daily;
    }

    public String getCidadeClima() {
        return cidadeClima;
    }

    public String getResponse() {
        DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String cidadeClima = getCidadeClima();
        double temperatura = getCurrent().getTemperature_2m();
        double humidade = getCurrent().getRelative_humidity_2m();
        double vento = getCurrent().getWind_speed_10m();
        double tempMax = getDaily().getTemperature_2m_max();
        double tempMin = getDaily().getTemperature_2m_min();

        LocalDateTime horaAtual = LocalDateTime.now();
        return "----Resumo do clima em " + cidadeClima + "-----\n"
                + "Temperatura atual: " + temperatura + "°C\n"
                + "Humidade relativa do ar: " + humidade + "%\n"
                + "Velocidade do vento: " + vento + " Km/h\n"
                + "Temperatura máxima: " + tempMax + "°C\n"
                + "Temperatura mínima: " + tempMin + "°C\n"
                + "Data e horario da consulta: " + formato.format(horaAtual);
    }
}

class Current {
    private double temperature_2m;
    private double relative_humidity_2m;
    private double wind_speed_10m;

    public double getTemperature_2m() {
        return temperature_2m;
    }

    public double getRelative_humidity_2m() {
        return relative_humidity_2m;
    }

    public double getWind_speed_10m() {
        return wind_speed_10m;
    }
}

class Daily {

    private List<Double> temperature_2m_max;
    private List<Double> temperature_2m_min;

    public double getTemperature_2m_max() {
        return temperature_2m_max.get(0);
    }

    public double getTemperature_2m_min() {
        return temperature_2m_min.get(0);
    }
}

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