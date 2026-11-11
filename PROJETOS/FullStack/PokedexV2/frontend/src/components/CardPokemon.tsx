import { memo } from "react";
import { ORDEM_STATS, ROTULOS_STATS, corDoTipo, formatarId } from "../types";
import type { Pokemon } from "../types";
import ImagemPokemon from "./ImagemPokemon";
import "../css/CardPokemon.css";

interface CardPokemonProps {
  pokemon: Pokemon;
  onSelecionar: (pokemon: Pokemon) => void;
  onAlternarFavorito?: (id: number) => void;
  emComparacao?: boolean;
  onRemoverComparacao?: (id: number) => void;
}

function CardPokemon({
  pokemon,
  onSelecionar,
  onAlternarFavorito,
  emComparacao = false,
  onRemoverComparacao,
}: CardPokemonProps) {
  const nomesTipos = pokemon.types.length > 0 ? pokemon.types.map((t) => t.name) : ["Typeless"];
  const corPrimaria = corDoTipo(nomesTipos[0]);

  function handleFavoritoClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (emComparacao && onRemoverComparacao) {
      onRemoverComparacao(pokemon.id);
      return;
    }
    if (onAlternarFavorito) {
      onAlternarFavorito(pokemon.id);
    }
  }

  return (
    <article
      className="pokemon-card"
      style={{ borderTopColor: corPrimaria, width: emComparacao ? "200px" : undefined }}
      onClick={() => {
        if (emComparacao) return;
        onSelecionar(pokemon);
      }}
    >
      <div className="pokemon-card-header">
        <span className="pokemon-card-id">{formatarId(pokemon.id)}</span>
        <button
          type="button"
          className="pokemon-card-button"
          onClick={handleFavoritoClick}
          aria-label={emComparacao ? "Remover da comparação" : pokemon.favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          style={emComparacao ? { color: "var(--texto)" } : undefined}
        >
          {emComparacao ? "X" : pokemon.favorito ? "❤️" : "🤍"}
        </button>
      </div>
      <div
        className="pokemon-avatar"
        style={{
          background:
            `radial-gradient(circle at 50% 70%, rgb(255 255 255 / 0.55), transparent 65%), linear-gradient(180deg, color-mix(in srgb, ${corPrimaria} 25%, var(--superficie)), var(--superficie-2))`,
          boxShadow: `inset 0 0 0 1.5px color-mix(in srgb, ${corPrimaria} 45%, var(--borda))`,
        }}
      >
        <ImagemPokemon src={pokemon.imagem} nome={pokemon.name} className="pokemon-avatar__img" />
      </div>
      <h2>{pokemon.name}</h2>
      <p className="tipos">
        {nomesTipos.map((nome) => (
          <span key={nome} className="tipo" style={{ background: corDoTipo(nome) }}>
            {nome}
          </span>
        ))}
      </p>
      <dl className="pokemon-card-stats">
        {ORDEM_STATS.map((chave) => (
          <div key={chave}>
            <dt>{ROTULOS_STATS[chave]}</dt>
            <dd>{pokemon.stats[chave]}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default memo(CardPokemon);