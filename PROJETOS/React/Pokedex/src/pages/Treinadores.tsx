import ListaTreinadores from "../components/ListaTreinadores";
import type { Pokemon, Treinador } from "../types";

interface TreinadoresProps {
  treinadores: Treinador[];
  pokemons: Pokemon[];
  onSelecionarPokemon: (pokemon: Pokemon) => void;
}

export function Treinadores({ treinadores, pokemons, onSelecionarPokemon }: TreinadoresProps) {
  return (
    <main>
      <ListaTreinadores
        treinadores={treinadores}
        pokemons={pokemons}
        onSelecionarPokemon={onSelecionarPokemon}
      />
    </main>
  );
}
