import BarraBusca from "../components/BarraBusca";
import FiltroTipos from "../components/FiltroTipos";
import ListaPokemons from "../components/ListaPokemons";
import BotaoAleatorio from "../components/BotaoAleatorio";
import type { Pokemon, Tipo } from "../types";

interface PokedexProps {
  busca: string;
  setBusca: (valor: string) => void;
  tipos: Tipo[];
  tipoSelecionado: string;
  setTipoSelecionado: (tipo: string) => void;
  pokemonsFiltrados: Pokemon[];
  onSelecionarPokemon: (pokemon: Pokemon) => void;
  onAlternarFavorito: (id: number) => void;
  ordenacao: string;
  setOrdenacao: (valor: string) => void;
  todosPokemons: Pokemon[];
}

export function Pokedex({
  busca,
  setBusca,
  tipos,
  tipoSelecionado,
  setTipoSelecionado,
  pokemonsFiltrados,
  onSelecionarPokemon,
  onAlternarFavorito,
  ordenacao,
  setOrdenacao,
  todosPokemons,
}: PokedexProps) {
  return (
    <main>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", maxWidth: "580px", margin: "0 auto 16px" }}>
        <div style={{ flex: 1, margin: 0 }}>
          <BarraBusca valor={busca} onChange={setBusca} />
        </div>
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          style={{
            padding: "12px 8px",
            background: "var(--superficie)",
            color: "var(--texto)",
            border: "1px solid var(--borda)",
            borderRadius: "8px",
            fontSize: "0.9rem",
            height: "48px",
            marginTop: 0,
          }}
        >
          <option value="id">ID</option>
          <option value="nome">Nome</option>
          <option value="hp">HP</option>
          <option value="attack">Attack</option>
          <option value="defense">Defense</option>
          <option value="specialAttack">Special Attack</option>
          <option value="specialDefense">Special Defense</option>
          <option value="speed">Speed</option>
        </select>
        <BotaoAleatorio pokemons={todosPokemons} onSelecionar={onSelecionarPokemon} />
      </div>
      <FiltroTipos
        tipos={tipos}
        selecionado={tipoSelecionado}
        onSelecionar={setTipoSelecionado}
      />
      <p className="contador">{pokemonsFiltrados.length} Pokémon encontrados</p>
      <ListaPokemons
        key={`${busca}|${tipoSelecionado}|${ordenacao}`}
        pokemons={pokemonsFiltrados}
        onSelecionar={onSelecionarPokemon}
        onAlternarFavorito={onAlternarFavorito}
      />
    </main>
  );
}