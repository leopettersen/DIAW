import ParticipanteCard from '../components/ParticipanteCard';
import { listarNaRoca, listarForaDaRoca, registrarVoto } from '../services/votacaoService' ;
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Votacao() {
  const [ultimoVoto, setUltimoVoto] = useState(null);
  const [votosNaSessao, setVotosNaSessao] = useState(0);

  const roca = listarNaRoca();
  const foraDaRoca = listarForaDaRoca();

  function handleVotar(participante) {
    registrarVoto(participante.id);
    setUltimoVoto(participante);
    setVotosNaSessao((quantidade) => quantidade + 1);
  }

  return (
    <div className="container">
      <h1>Quem você quer eliminar?</h1>
      <p>Cada clique conta um voto para tirar o peão da fazenda.</p>
      {ultimoVoto && (
        <div className="confirmacao-voto" role="status">
            <p>
              Voto registrado para eliminar <strong>{ultimoVoto.nome}</strong>. Você já votou {votosNaSessao} {votosNaSessao === 1 ? 'vez' : 'vezes'}.
            </p>
            <Link to="/resultado"><strong>Ver resultado</strong></Link>
        </div>
      )}
      <div className="grade-roca">
        {roca.map((p) => (
          <ParticipanteCard
            key={p.id}
            participante={p}
            onVotar={handleVotar}
          />
        ))}
      </div>
      <div className="demais-peoes">
        <h2>Demais peões</h2>
        <p>Fora da roça essa semana, não podem receber votos.</p>
      </div>
      <div className="grade-demais-peoes">
            {foraDaRoca.map((p) => (
              <ParticipanteCard key={p.id} participante={p} />
            ))}
      </div>
    </div>
  )
}