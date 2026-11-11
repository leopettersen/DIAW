import type { Pokemon } from "../types";
import CardPokemon from "./CardPokemon";

interface ListaFavoritosProps {
  pokemons: Pokemon[];
  onSelecionar: (pokemon: Pokemon) => void;
  onAlternarFavorito: (id: number) => void;
}

export function ListaFavoritos({ pokemons, onSelecionar, onAlternarFavorito }: ListaFavoritosProps) {
  return (
    <section className="lista-pokemons">
      {pokemons
        .filter((pokemon) => pokemon.favorito)
        .map((pokemon) => (
          <CardPokemon
            key={pokemon.id}
            pokemon={pokemon}
            onSelecionar={onSelecionar}
            onAlternarFavorito={onAlternarFavorito}
          />
        ))}
    </section>
  );
}