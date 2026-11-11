export interface Tipo {
  id: number;
  name: string;
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Pokemon {
  id: number;
  name: string;
  stats: Stats;
  types: Tipo[];
  imagem: string;
  favorito: boolean;
}

export interface Treinador {
  id: number;
  name: string;
  badges: number;
  pokemonIds: number[];
  imagem?: string;
}

export interface DadosPokedex {
  types: Tipo[];
  pokemon: Pokemon[];
  trainers: Treinador[];
}

export const CORES_TIPO: Record<string, string> = {
  typeless: "#888888",
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const ROTULOS_STATS: Record<keyof Stats, string> = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defesa",
  specialAttack: "Atq. Esp.",
  specialDefense: "Def. Esp.",
  speed: "Velocidade",
};

export const ORDEM_STATS: (keyof Stats)[] = [
  "hp",
  "attack",
  "defense",
  "specialAttack",
  "specialDefense",
  "speed",
];

export function corDoTipo(nome: string): string {
  return CORES_TIPO[nome.toLowerCase()] ?? CORES_TIPO.typeless;
}

export function corDoStat(valor: number): string {
  if (valor >= 100) return "#2a9d8f";
  if (valor >= 60) return "#f4a261";
  return "#e63946";
}

export function formatarId(id: number): string {
  return "#" + String(id).padStart(3, "0");
}