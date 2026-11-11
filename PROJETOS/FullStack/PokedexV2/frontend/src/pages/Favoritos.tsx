import { ListaFavoritos } from "../components/ListaFavoritos";
import type { Pokemon } from "../types";

interface FavoritosProps {
  pokemons: Pokemon[];
  onSelecionarPokemon: (pokemon: Pokemon) => void;
  onAlternarFavorito: (id: number) => void;
}

export function Favoritos({ pokemons, onSelecionarPokemon, onAlternarFavorito }: FavoritosProps) {
  const favoritos = pokemons.filter((pokemon) => pokemon.favorito);

  return (
    <main>
      <h2>Meus Favoritos</h2>
      {favoritos.length === 0 ? (
        <p className="mensagem">Nenhum Pokémon adicionado aos favoritos.</p>
      ) : (
        <ListaFavoritos pokemons={favoritos} onSelecionar={onSelecionarPokemon} onAlternarFavorito={onAlternarFavorito} />
      )}
    </main>
  );
}
