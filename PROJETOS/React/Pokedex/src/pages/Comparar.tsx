import { useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import BarraBusca from "../components/BarraBusca";
import CardPokemon from "../components/CardPokemon";
import type { Pokemon } from "../types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface CompararProps {
  pokemons: Pokemon[];
}

const CORES_GRAFICO = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
];

const CORES_BORDA = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
];

export function Comparar({ pokemons }: CompararProps) {
  const [selecionados, setSelecionados] = useState<Pokemon[]>([]);
  const [busca, setBusca] = useState("");

  function adicionarPokemon(pokemon: Pokemon) {
    if (selecionados.find((p) => p.id === pokemon.id)) return;
    if (selecionados.length >= 4) return;
    setSelecionados([...selecionados, pokemon]);
  }

  function removerPokemon(id: number) {
    setSelecionados(selecionados.filter((p) => p.id !== id));
  }

  const pokemonsFiltrados = pokemons
    .filter((p) => {
      const texto = busca.toLowerCase().trim().replace(/^#/, "");
      if (texto === "") return false;
      return (
        p.name.toLowerCase().includes(texto) ||
        String(p.id).startsWith(texto)
      );
    })
    .filter((p) => !selecionados.find((s) => s.id === p.id))
    .slice(0, 10);

  const data = {
    labels: ["HP", "Ataque", "Defesa", "Atq. Esp.", "Def. Esp.", "Velocidade"],
    datasets: selecionados.map((pokemon, index) => ({
      label: pokemon.name,
      data: [
        pokemon.stats.hp,
        pokemon.stats.attack,
        pokemon.stats.defense,
        pokemon.stats.specialAttack,
        pokemon.stats.specialDefense,
        pokemon.stats.speed,
      ],
      backgroundColor: CORES_GRAFICO[index % CORES_GRAFICO.length],
      borderColor: CORES_BORDA[index % CORES_BORDA.length],
      borderWidth: 2,
      pointRadius: 4,
    })),
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 200,
        angleLines: {
          display: true,
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
        ticks: {
          display: false,
          showLabelBackdrop: false,
          backdropColor: "rgba(0,0,0,0)",
        },
        grid: {
          color: "rgba(128, 128, 128, 0.3)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <main style={{ textAlign: "center" }}>
      <h2>Comparar Pokémons</h2>
      <p style={{ marginBottom: "1.5rem" }}>Selecione até 4 Pokémon para comparar</p>

      <div style={{ margin: "0 auto 1.5rem", maxWidth: "400px" }}>
        <BarraBusca valor={busca} onChange={setBusca} placeholder="Buscar Pokémon para adicionar..." />
      </div>

      {busca && pokemonsFiltrados.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 auto 1rem", maxWidth: "400px", textAlign: "left" }}>
          {pokemonsFiltrados.map((pokemon) => (
            <li
              key={pokemon.id}
              onClick={() => {
                adicionarPokemon(pokemon);
                setBusca("");
              }}
              style={{
                padding: "0.5rem",
                cursor: "pointer",
                border: "1px solid var(--borda)",
                marginBottom: "0.25rem",
              }}
            >
              {pokemon.name} #{pokemon.id.toString().padStart(3, "0")}
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", margin: "0 auto 1rem", justifyContent: "center", maxWidth: "900px" }}>
        {selecionados.map((pokemon) => (
          <CardPokemon
            key={pokemon.id}
            pokemon={pokemon}
            onSelecionar={() => {}}
            emComparacao={true}
            onRemoverComparacao={removerPokemon}
          />
        ))}
      </div>

      {selecionados.length >= 2 ? (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Radar data={data} options={options} />
        </div>
      ) : (
        <p className="mensagem">Selecione pelo menos 2 Pokémon para ver a comparação</p>
      )}
    </main>
  );
}
