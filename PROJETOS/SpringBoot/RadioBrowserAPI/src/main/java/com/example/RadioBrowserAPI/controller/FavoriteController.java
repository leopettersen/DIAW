package com.example.RadioBrowserAPI.controller;

import com.example.RadioBrowserAPI.model.Favorite;
import com.example.RadioBrowserAPI.service.FavoriteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public List<Favorite> list(@RequestParam String clientId) { return favoriteService.list(clientId); }

    @PostMapping
    public Favorite save(@RequestBody Favorite favorite) { return favoriteService.save(favorite); }

    @DeleteMapping
    public void delete(@RequestParam String clientId, @RequestParam String stationuuid) {
        favoriteService.remove(clientId, stationuuid);
    }
}