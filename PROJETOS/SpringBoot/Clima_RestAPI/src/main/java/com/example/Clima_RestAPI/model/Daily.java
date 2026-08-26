package com.example.Clima_RestAPI.model;

import java.util.List;

public class Daily {
    private List<Double> temperature_2m_max;
    private List<Double> temperature_2m_min;

    public double getTemperature_2m_max() {
        return temperature_2m_max.get(0);
    }

    public double getTemperature_2m_min() {
        return temperature_2m_min.get(0);
    }
}
