import type { Pokemon } from "../types";

interface BotaoAleatorioProps {
  pokemons: Pokemon[];
  onSelecionar: (pokemon: Pokemon) => void;
}

export default function BotaoAleatorio({ pokemons, onSelecionar }: BotaoAleatorioProps) {
  function sortear() {
    if (pokemons.length === 0) return;
    const indice = Math.floor(Math.random() * pokemons.length);
    onSelecionar(pokemons[indice]);
  }

  return (
    <button
      type="button"
      onClick={sortear}
      style={{
        padding: "12px 16px",
        background: "var(--superficie)",
        color: "var(--texto)",
        border: "1px solid var(--borda)",
        borderRadius: "8px",
        fontSize: "0.9rem",
        height: "48px",
        whiteSpace: "nowrap",
      }}
    >
      Aleatório
    </button>
  );
}
