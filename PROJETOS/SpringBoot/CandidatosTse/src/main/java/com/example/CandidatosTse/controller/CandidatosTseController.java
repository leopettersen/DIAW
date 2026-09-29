package com.example.CandidatosTse.controller;

import com.example.CandidatosTse.model.Candidato;
import com.example.CandidatosTse.service.CandidatosTseService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

import java.util.List;
@Controller
public class CandidatosTseController {
    private final CandidatosTseService candidatosTseService;

    public CandidatosTseController(CandidatosTseService candidatosTseService) {
        this.candidatosTseService = candidatosTseService;
    }

    @GetMapping("/")
    public String index(
        @RequestParam(required = false) String cargo,
        @RequestParam(required = false) String partido,
        @RequestParam(required = false) String texto,
        Model model){

        candidatosTseService.carregarCsv();
        List<Candidato> candidatos = candidatosTseService.filtrar(cargo, partido, texto);
        List<String> partidos = candidatosTseService.listarPartidos();
        List<String> cargos = candidatosTseService.listarCargos();

        model.addAttribute("candidatos", candidatos);
        model.addAttribute("partidos", partidos);
        model.addAttribute("cargos", cargos);
        model.addAttribute("cargoSelecionado", cargo);
        model.addAttribute("partidoSelecionado", partido);
        model.addAttribute("textoSelecionado", texto);

        return "index";
    }
}
