interface BarraBuscaProps {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}

export default function BarraBusca({ valor, onChange, placeholder = "Pesquisar Pokémon por nome ou ID..." }: BarraBuscaProps) {
  return (
    <div className="barra-busca">
      <input
        type="text"
        value={valor}
        placeholder={placeholder}
        aria-label="Pesquisar Pokémon"
        onChange={(e) => onChange(e.target.value)}
      />
      {valor && (
        <button type="button" aria-label="Limpar pesquisa" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </div>
  );
}