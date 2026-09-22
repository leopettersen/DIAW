package com.example.RadioBrowserAPI.service;

import com.example.RadioBrowserAPI.config.SupabaseConfig;
import com.example.RadioBrowserAPI.model.Favorite;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@Service
public class FavoriteService {

    private final SupabaseConfig supabaseConfig;

    public FavoriteService(SupabaseConfig supabaseConfig) {
        this.supabaseConfig = supabaseConfig;
    }

    private final RestTemplate restTemplate = new RestTemplate();

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", supabaseConfig.getServiceKey());
        headers.set("Authorization", "Bearer " + supabaseConfig.getServiceKey());
        return headers;
    }

    public List<Favorite> list(String clientId) {
        String url = UriComponentsBuilder
                .fromUriString(supabaseConfig.getUrl())
                .queryParam("select", "*")
                .queryParam("client_id", "eq." + clientId)
                .queryParam("order", "created_at.desc")
                .toUriString();

        try {
            HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {});
            return convert(response.getBody());
        } catch (Exception e) {
            System.err.println("Erro ao listar favoritos: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public Favorite save(Favorite favorite) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("client_id", favorite.getClienteId());
        body.put("stationuuid", favorite.getStationuuid());
        body.put("name", favorite.getName());
        body.put("favicon", favorite.getFavicon());
        body.put("url", favorite.getUrl());
        try {
            HttpHeaders headers = buildHeaders();
            headers.set("Prefer", "return=representation");
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    supabaseConfig.getUrl(), HttpMethod.POST, entity,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {});
            List<Map<String, Object>> rows = response.getBody();
            return (rows == null || rows.isEmpty()) ? favorite : convert(rows).get(0);
        } catch (HttpClientErrorException e){
            if (e.getStatusCode().value() == 409) {
                System.err.println("Favorito já existente");
                return favorite;
            }
            System.err.println("Erro ao salvar favorito: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("Erro ao salvar favorito: " + e.getMessage());
            return null;
        }
    }

    public void remove(String clientId, String stationuuid) {
        String url = UriComponentsBuilder
                .fromUriString(supabaseConfig.getUrl())
                .queryParam("client_id", "eq." + clientId)
                .queryParam("stationuuid", "eq." + stationuuid)
                .toUriString();
        try {
            HttpEntity<Void> entity = new HttpEntity<>(buildHeaders());
            restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
        } catch (Exception e){
            System.err.println("Erro ao remover favorito: " + e.getMessage());
        }
    }

    private List<Favorite> convert(List<Map<String, Object>> rows) {
        List<Favorite> favorites = new ArrayList<>();
        if (rows == null) return favorites;
        for (Map<String, Object> row : rows) {
            Favorite f = new Favorite();
            f.setClienteId((String)row.get("client_id"));
            f.setStationuuid((String)row.get("stationuuid"));
            f.setName((String)row.get("name"));
            f.setFavicon((String)row.get("favicon"));
            f.setUrl((String)row.get("url"));
            favorites.add(f);
        }
        return favorites;
    }
}