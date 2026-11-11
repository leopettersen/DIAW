import { useEffect, useState } from "react";
import type { DadosPokedex, Pokemon, Tipo, Treinador } from "../types";

const BASE_URL = "https://pokeapi.co/api/v2";
const LIMITE = 1351;
const CONCORRENCIA = 24;
const PASSO_ATUALIZACAO = 120;
const CHAVE_CACHE = "pokedex-cache-v1";

interface RespostaLista {
  results: { name: string; url: string }[];
}

interface RespostaPokemon {
  id: number;
  name: string;
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string; url: string } }[];
  sprites: {
    front_default: string | null;
    other: { "official-artwork": { front_default: string | null } };
  };
}

function formatarNome(nome: string): string {
  return nome
    .split("-")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function idDoTipo(url: string): number {
  const partes = url.split("/").filter(Boolean);
  return Number(partes[partes.length - 1]);
}

function converterPokemon(resposta: RespostaPokemon): Pokemon {
  const valor = (nome: string) =>
    resposta.stats.find((s) => s.stat.name === nome)?.base_stat ?? 0;

  return {
    id: resposta.id,
    name: formatarNome(resposta.name),
    stats: {
      hp: valor("hp"),
      attack: valor("attack"),
      defense: valor("defense"),
      specialAttack: valor("special-attack"),
      specialDefense: valor("special-defense"),
      speed: valor("speed"),
    },
    types: resposta.types.map((item) => ({
      id: idDoTipo(item.type.url),
      name: formatarNome(item.type.name),
    })),
    imagem:
      resposta.sprites.other["official-artwork"].front_default ??
      resposta.sprites.front_default ??
      "",
    favorito: false,
  };
}

function lerCache(): Pokemon[] | null {
  try {
    const bruto = localStorage.getItem(CHAVE_CACHE);
    if (!bruto) return null;
    const dados = JSON.parse(bruto) as Pokemon[];
    return Array.isArray(dados) && dados.length > 0 ? dados : null;
  } catch {
    return null;
  }
}

function salvarCache(pokemons: Pokemon[]) {
  try {
    localStorage.setItem(CHAVE_CACHE, JSON.stringify(pokemons));
  } catch {
    localStorage.removeItem(CHAVE_CACHE);
  }
}

async function buscarPokemons(
  sinal: AbortSignal,
  aoProgredir: (parcial: Pokemon[]) => void,
): Promise<Pokemon[]> {
  const respostaLista = await fetch(`${BASE_URL}/pokemon?limit=${LIMITE}&offset=0`, { signal: sinal });
  if (!respostaLista.ok) {
    throw new Error(`HTTP ${respostaLista.status}`);
  }
  const lista = (await respostaLista.json()) as RespostaLista;

  const resultados: (Pokemon | undefined)[] = new Array(lista.results.length);
  let proximo = 0;
  let concluidos = 0;

  async function trabalhador() {
    while (proximo < lista.results.length) {
      const indice = proximo++;
      const resposta = await fetch(lista.results[indice].url, { signal: sinal });
      if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}`);
      }
      resultados[indice] = converterPokemon((await resposta.json()) as RespostaPokemon);
      concluidos++;
      if (concluidos % PASSO_ATUALIZACAO === 0) {
        aoProgredir(resultados.filter((p): p is Pokemon => p !== undefined));
      }
    }
  }

  await Promise.all(Array.from({ length: CONCORRENCIA }, trabalhador));
  return resultados as Pokemon[];
}

function extrairTipos(pokemons: Pokemon[]): Tipo[] {
  const tipos = new Map<number, Tipo>();
  pokemons.forEach((pokemon) => {
    pokemon.types.forEach((tipo) => tipos.set(tipo.id, tipo));
  });
  return [...tipos.values()].sort((a, b) => a.id - b.id);
}

export function useCarregarPokemons() {
  const [dados, setDados] = useState<DadosPokedex | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const controle = new AbortController();
    const cache = lerCache();

    import("../data/pokedex-data.json").then(async (json) => {
      const trainers = json.default.trainers as Treinador[];
      const montar = (pokemon: Pokemon[]) =>
        setDados({ types: extrairTipos(pokemon), pokemon, trainers });

      try {
        if (cache) {
          montar(cache);
          return;
        }
        const pokemon = await buscarPokemons(controle.signal, (parcial) => {
          montar(parcial);
          setCarregando(false);
        });
        montar(pokemon);
        salvarCache(pokemon);
      } catch {
        if (!controle.signal.aborted) setErro("Não foi possível carregar os dados da Pokédex.");
      } finally {
        if (!controle.signal.aborted) setCarregando(false);
      }
    });

    return () => controle.abort();
  }, []);

  return { dados, carregando, erro };
}