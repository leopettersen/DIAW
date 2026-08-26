package com.example.Clima_RestAPI.model;

public class Current {
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
