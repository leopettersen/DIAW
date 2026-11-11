export type Aba = "pokedex" | "treinadores" | "comparar" | "favoritos";
export type Tema = "claro" | "escuro";

interface CabecalhoProps {
  abaAtual: Aba;
  onMudarAba: (aba: Aba) => void;
  temaAtual: Tema;
  onAlternarTema: () => void;
}

export default function Cabecalho({ abaAtual, onMudarAba, temaAtual, onAlternarTema }: CabecalhoProps) {
  return (
    <header className="cabecalho">
      <h1>Pokédex</h1>
      <nav className="abas">
        <button
          type="button"
          className={abaAtual === "pokedex" ? "aba ativa" : "aba"}
          onClick={() => onMudarAba("pokedex")}
        >
          Pokémon
        </button>
        <button
          type="button"
          className={abaAtual === "treinadores" ? "aba ativa" : "aba"}
          onClick={() => onMudarAba("treinadores")}
        >
          Treinadores
        </button>
        <button
        type="button"
        className={abaAtual === "favoritos" ? "aba ativa" : "aba"}
        onClick={() => onMudarAba("favoritos")}>
          Favoritos
        </button>
        <button 
        type="button" 
        className={abaAtual === "comparar" ? "aba ativa" : "aba"} 
        onClick={() => onMudarAba("comparar")}>
          Comparar
        </button>
        <button type="button" className="aba" onClick={onAlternarTema}>
          {temaAtual === "escuro" ? "☀️ Tema claro" : "🌙 Tema escuro"}
        </button>
      </nav>
    </header>
  );
}