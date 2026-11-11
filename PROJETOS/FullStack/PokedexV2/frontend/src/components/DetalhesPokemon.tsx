import { useEffect } from "react";
import { ORDEM_STATS, ROTULOS_STATS, corDoStat, corDoTipo, formatarId } from "../types";
import type { Pokemon } from "../types";
import ImagemPokemon from "./ImagemPokemon";
import "../css/DetalhesPokemon.css";

interface DetalhesPokemonProps {
  pokemon: Pokemon;
  onFechar: () => void;
}

const VALOR_MAXIMO_BARRA = 160;

export default function DetalhesPokemon({ pokemon, onFechar }: DetalhesPokemonProps) {
  useEffect(() => {
    function aoPressionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", aoPressionarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoPressionarTecla);
      document.body.style.overflow = "";
    };
  }, [onFechar]);

  const nomesTipos = pokemon.types.length > 0 ? pokemon.types.map((t) => t.name) : ["Typeless"];
  const corPrimaria = corDoTipo(nomesTipos[0]);
  const total = ORDEM_STATS.reduce((soma, chave) => soma + pokemon.stats[chave], 0);

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        style={{ borderTopColor: corPrimaria }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-fechar" aria-label="Fechar" onClick={onFechar}>
          ✕
        </button>
        <div
          className="pokemon-avatar pokemon-avatar--lg"
          style={{
            margin: "0 auto 12px",
            background:
              `radial-gradient(circle at 50% 70%, rgb(255 255 255 / 0.55), transparent 65%), linear-gradient(180deg, color-mix(in srgb, ${corPrimaria} 25%, var(--superficie)), var(--superficie-2))`,
            boxShadow: `inset 0 0 0 1.5px color-mix(in srgb, ${corPrimaria} 45%, var(--borda))`,
          }}
        >
          <ImagemPokemon src={pokemon.imagem} nome={pokemon.name} className="pokemon-avatar__img" />
        </div>
        <h2>
          {formatarId(pokemon.id)} — {pokemon.name}
        </h2>
        <p className="tipos">
          {nomesTipos.map((nome) => (
            <span key={nome} className="tipo" style={{ background: corDoTipo(nome) }}>
              {nome}
            </span>
          ))}
        </p>
        <ul className="stats">
          {ORDEM_STATS.map((chave) => {
            const valor = pokemon.stats[chave];
            const largura = Math.min(100, (valor / VALOR_MAXIMO_BARRA) * 100);
            return (
              <li key={chave}>
                <span className="stat-nome">{ROTULOS_STATS[chave]}</span>
                <span className="stat-valor">{valor}</span>
                <div className="stat-barra">
                  <div
                    className="stat-preenchimento"
                    style={{ width: `${largura}%`, background: corDoStat(valor) }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <p className="stat-total">Total: {total}</p>
      </div>
    </div>
  );
}