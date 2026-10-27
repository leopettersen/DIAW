import type { Pokemon, Treinador } from "../types";
import ImagemPokemon from "./ImagemPokemon";
import "../css/ListaTreinadores.css";

interface ListaTreinadoresProps {
  treinadores: Treinador[];
  pokemons: Pokemon[];
  onSelecionarPokemon: (pokemon: Pokemon) => void;
}

const TREINADOR_IMAGENS: Record<string, string> = {
  Ash: "https://play.pokemonshowdown.com/sprites/trainers/ash.png",
  Brock: "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
  Misty: "https://play.pokemonshowdown.com/sprites/trainers/misty.png",
  Gary: "https://play.pokemonshowdown.com/sprites/trainers/blue.png",
  Blue: "https://play.pokemonshowdown.com/sprites/trainers/blue.png",
  "Lt. Surge": "https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png",
  Erika: "https://play.pokemonshowdown.com/sprites/trainers/erika.png",
  Koga: "https://play.pokemonshowdown.com/sprites/trainers/koga.png",
  Sabrina: "https://play.pokemonshowdown.com/sprites/trainers/sabrina.png",
  Blaine: "https://play.pokemonshowdown.com/sprites/trainers/blaine.png",
  Giovanni: "https://play.pokemonshowdown.com/sprites/trainers/giovanni.png",
  "Team Rocket": "https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png",
  "Rocket": "https://play.pokemonshowdown.com/sprites/trainers/teamrocket.png",
  Lance: "https://play.pokemonshowdown.com/sprites/trainers/lance.png",
  Professor: "https://play.pokemonshowdown.com/sprites/trainers/professor-oak.png",
};

function getTreinadorImagem(treinador: Treinador) {
  if (treinador.imagem) return treinador.imagem;
  if (TREINADOR_IMAGENS[treinador.name]) return TREINADOR_IMAGENS[treinador.name];
  const primeiro = treinador.name.split(" ")[0];
  if (TREINADOR_IMAGENS[primeiro]) return TREINADOR_IMAGENS[primeiro];
  const slug = treinador.name.toLowerCase().replace(/\./g, "").replace(/\s+/g, "");
  return `https://play.pokemonshowdown.com/sprites/trainers/${slug}.png`;
}

function getMonograma(nome: string) {
  return nome
    .split(" ")
    .map((parte) => parte[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ListaTreinadores({
  treinadores,
  pokemons,
  onSelecionarPokemon,
}: ListaTreinadoresProps) {
  return (
    <section className="lista-treinadores">
      {treinadores.map((treinador) => {
        const equipe = treinador.pokemonIds
          .map((id) => pokemons.find((p) => p.id === id))
          .filter((p): p is Pokemon => p !== undefined);

        const imagem = getTreinadorImagem(treinador);

        return (
          <article key={treinador.id} className="treinador-card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div className="trainer-avatar trainer-avatar--lg">
                {imagem ? (
                  <img
                    className="trainer-avatar__img"
                    src={imagem}
                    alt={treinador.name}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector(".trainer-avatar__monogram")) {
                        const monograma = document.createElement("div");
                        monograma.className = "trainer-avatar__monogram";
                        monograma.textContent = getMonograma(treinador.name);
                        parent.appendChild(monograma);
                      }
                    }}
                  />
                ) : (
                  <div className="trainer-avatar__monogram">{getMonograma(treinador.name)}</div>
                )}
              </div>
              <div>
                <h2 style={{ margin: 0 }}>{treinador.name}</h2>
                <p className="insignias" style={{ margin: 0 }}>🏅 {treinador.badges} insígnias</p>
              </div>
            </div>
            <ul className="equipe">
              {equipe.map((pokemon) => (
                <li key={pokemon.id}>
                  <button type="button" onClick={() => onSelecionarPokemon(pokemon)}>
                    <ImagemPokemon src={pokemon.imagem} nome={pokemon.name} />
                    <span>{pokemon.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </section>
  );
}