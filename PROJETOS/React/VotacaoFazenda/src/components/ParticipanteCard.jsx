export default function ParticipanteCard({ participante, onVotar }) {
  return (
    <article className={`participante-card ${participante.naRoca ? 'card-roca' : ''}`}>
      <div className="participante-img">
        {participante.naRoca && <span className="selo-roca">Na roça</span>}
        <img src={participante.foto} alt={participante.nome} />
      </div>
      <div className="participante-detalhes">
        <h3>{participante.nome}</h3>
        {onVotar && (
          <button className="botao botao-principal" onClick={() => onVotar(participante)}>
            Votar para eliminar
          </button>
        )}
      </div>
    </article>
  );
}