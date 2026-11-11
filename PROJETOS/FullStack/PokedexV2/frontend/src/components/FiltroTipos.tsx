import type { CSSProperties } from "react";
import { corDoTipo } from "../types";
import type { Tipo } from "../types";

interface FiltroTiposProps {
  tipos: Tipo[];
  selecionado: string;
  onSelecionar: (tipo: string) => void;
}

export default function FiltroTipos({ tipos, selecionado, onSelecionar }: FiltroTiposProps) {
  return (
    <div className="filtro-tipos">
      <button
        type="button"
        className={selecionado === "Todos" ? "filtro-btn ativo" : "filtro-btn"}
        onClick={() => onSelecionar("Todos")}
      >
        Todos
      </button>
      {tipos.map((tipo) => (
        <button
          key={tipo.id}
          type="button"
          className={selecionado === tipo.name ? "filtro-btn ativo" : "filtro-btn"}
          style={{ "--cor-tipo": corDoTipo(tipo.name) } as CSSProperties}
          onClick={() => onSelecionar(tipo.name)}
        >
          {tipo.name}
        </button>
      ))}
    </div>
  );
}