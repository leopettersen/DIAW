import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import Cabecalho from "./components/Cabecalho";
import type { Aba, Tema } from "./components/Cabecalho";
import DetalhesPokemon from "./components/DetalhesPokemon";
import { useCarregarPokemons } from "./hooks/carregarPokemons";
import type { Pokemon } from "./types";
import "./css/App.css";
import { Pokedex } from "./pages/Pokedex";
import { Treinadores } from "./pages/Treinadores";
import { Favoritos } from "./pages/Favoritos";

const Comparar = lazy(() => import("./pages/Comparar").then((m) => ({ default: m.Comparar })));

function temaInicial(): Tema {
  const salvo = localStorage.getItem("tema");
  if (salvo === "claro" || salvo === "escuro") return salvo;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "claro" : "escuro";
}

export default function App() {
  const { dados, carregando, erro } = useCarregarPokemons();
  const [aba, setAba] = useState<Aba>("pokedex");
  const [busca, setBusca] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
  const [pokemonSelecionado, setPokemonSelecionado] = useState<Pokemon | null>(null);
  const [tema, setTema] = useState<Tema>(temaInicial);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [ordenacao, setOrdenacao] = useState("id");

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    localStorage.setItem("tema", tema);
  }, [tema]);

  useEffect(() => {
    if (dados) {
      setPokemons((anteriores) => {
        const favoritos = new Set(anteriores.filter((p) => p.favorito).map((p) => p.id));
        return dados.pokemon.map((p) => (favoritos.has(p.id) ? { ...p, favorito: true } : p));
      });
    }
  }, [dados]);

  const pokemonsFiltrados = useMemo(() => {
    if (!pokemons.length) return [];
    const texto = busca.toLowerCase().trim().replace(/^#/, "");

    const filtrados = pokemons.filter((pokemon) => {
      const bateBusca =
        texto === "" ||
        pokemon.name.toLowerCase().includes(texto) ||
        String(pokemon.id).startsWith(texto);

      const bateTipo =
        tipoSelecionado === "Todos" ||
        (tipoSelecionado === "Typeless"
          ? pokemon.types.length === 0
          : pokemon.types.some((t) => t.name === tipoSelecionado));

      return bateBusca && bateTipo;
    });

    return [...filtrados].sort((a, b) => {
      if (ordenacao === "nome") return a.name.localeCompare(b.name);
      if (ordenacao === "hp") return b.stats.hp - a.stats.hp;
      if (ordenacao === "attack") return b.stats.attack - a.stats.attack;
      if (ordenacao === "defense") return b.stats.defense - a.stats.defense;
      if (ordenacao === "specialAttack") return b.stats.specialAttack - a.stats.specialAttack;
      if (ordenacao === "specialDefense") return b.stats.specialDefense - a.stats.specialDefense;
      if (ordenacao === "speed") return b.stats.speed - a.stats.speed;
      return a.id - b.id;
    });
  }, [pokemons, busca, tipoSelecionado, ordenacao]);

  const alternarFavorito = useCallback((id: number) => {
    setPokemons((anteriores) =>
      anteriores.map((pokemon) =>
        pokemon.id === id ? { ...pokemon, favorito: !pokemon.favorito } : pokemon
      )
    );
  }, []);

  if (carregando) return <p className="mensagem">Carregando Pokédex...</p>;
  if (erro || !dados) return <p className="mensagem erro">{erro}</p>;

  return (
    <div className="app">
      <Cabecalho
        abaAtual={aba}
        onMudarAba={setAba}
        temaAtual={tema}
        onAlternarTema={() => setTema((atual) => (atual === "escuro" ? "claro" : "escuro"))}
      />

      {aba === "pokedex" ? (
        <Pokedex
          busca={busca}
          setBusca={setBusca}
          tipos={dados.types}
          tipoSelecionado={tipoSelecionado}
          setTipoSelecionado={setTipoSelecionado}
          pokemonsFiltrados={pokemonsFiltrados}
          onSelecionarPokemon={setPokemonSelecionado}
          onAlternarFavorito={alternarFavorito}
          ordenacao={ordenacao}
          setOrdenacao={setOrdenacao}
          todosPokemons={pokemons}
        />
      ) : aba === "treinadores" ? (
        <Treinadores
          treinadores={dados.trainers}
          pokemons={pokemons}
          onSelecionarPokemon={setPokemonSelecionado}
        />
      ) : aba === "comparar" ? (
        <Suspense fallback={<p className="mensagem">Carregando...</p>}>
          <Comparar pokemons={pokemons} />
        </Suspense>
      ) : (
        <Favoritos pokemons={pokemons} onSelecionarPokemon={setPokemonSelecionado} onAlternarFavorito={alternarFavorito} />
      )}

      {pokemonSelecionado && (
        <DetalhesPokemon
          pokemon={pokemonSelecionado}
          onFechar={() => setPokemonSelecionado(null)}
        />
      )}
    </div>
  );
}