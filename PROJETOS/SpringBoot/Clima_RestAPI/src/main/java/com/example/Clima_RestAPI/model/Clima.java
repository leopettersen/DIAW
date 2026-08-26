package com.example.Clima_RestAPI.model;

import com.example.Clima_RestAPI.model.Current;
import com.example.Clima_RestAPI.model.Daily;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Clima {
    private com.example.Clima_RestAPI.model.Current current;
    private com.example.Clima_RestAPI.model.Daily daily;
    public String cidadeClima;

    public com.example.Clima_RestAPI.model.Current getCurrent() {
        return current;
    }

    public com.example.Clima_RestAPI.model.Daily getDaily() {
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
