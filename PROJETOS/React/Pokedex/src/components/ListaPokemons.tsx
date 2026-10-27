import { useEffect, useRef, useState } from "react";
import type { Pokemon } from "../types";
import CardPokemon from "./CardPokemon";

const TAMANHO_PAGINA = 48;

interface ListaPokemonsProps {
  pokemons: Pokemon[];
  onSelecionar: (pokemon: Pokemon) => void;
  onAlternarFavorito?: (id: number) => void;
}

export default function ListaPokemons({ pokemons, onSelecionar, onAlternarFavorito }: ListaPokemonsProps) {
  const [visiveis, setVisiveis] = useState(TAMANHO_PAGINA);
  const sentinela = useRef<HTMLDivElement>(null);
  const temMais = visiveis < pokemons.length;

  useEffect(() => {
    const alvo = sentinela.current;
    if (!alvo) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) setVisiveis((atual) => atual + TAMANHO_PAGINA);
      },
      { rootMargin: "600px" },
    );
    observador.observe(alvo);
    return () => observador.disconnect();
  }, [visiveis, temMais]);

  if (pokemons.length === 0) {
    return <p className="vazio">Nenhum Pokémon encontrado.</p>;
  }

  return (
    <>
      <section className="lista-pokemons">
        {pokemons.slice(0, visiveis).map((pokemon) => (
          <CardPokemon
            key={pokemon.id}
            pokemon={pokemon}
            onSelecionar={onSelecionar}
            onAlternarFavorito={onAlternarFavorito}
          />
        ))}
      </section>
      {temMais && <div ref={sentinela} style={{ height: 1 }} />}
    </>
  );
}