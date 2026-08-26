package com.example.Clima_RestAPI.model;

import com.example.Clima_RestAPI.model.ResultadoItem;

import java.util.List;

public class Cidade {
        private List<com.example.Clima_RestAPI.model.ResultadoItem> results;

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
