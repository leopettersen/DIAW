interface ImagemPokemonProps {
  src: string;
  nome: string;
  className?: string;
}

export default function ImagemPokemon({ src, nome, className }: ImagemPokemonProps) {
  if (!src) return null;

  return (
    <img
      className={className}
      src={src}
      alt={nome}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}