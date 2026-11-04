import { useState } from 'react';
import { Link } from 'react-router-dom';
import ParticipanteCard from '../components/ParticipanteCard';
import {
  listarNaRoca,
  listarForaDaRoca,
  registrarVoto,
} from '../services/votacaoService';

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
    <main className="container pagina-votacao">
      <header className="pagina-intro">
        <h1>Quem você quer eliminar?</h1>
        <p>Cada clique conta um voto para tirar o peão da fazenda.</p>
      </header>

      {ultimoVoto && (
        <div className="confirmacao-voto" role="status" aria-live="polite">
          <p>
            Voto registrado para eliminar <strong>{ultimoVoto.nome}</strong>. Você já votou{' '}
            {votosNaSessao} {votosNaSessao === 1 ? 'vez' : 'vezes'}.
          </p>
          <Link to="/resultado">Ver resultado</Link>
        </div>
      )}

      <section className="grade-roca" aria-label="Participantes na roça">
        {roca.map((participante) => (
          <ParticipanteCard
            key={participante.id}
            participante={participante}
            onVotar={handleVotar}
          />
        ))}
      </section>

      <section className="demais-peoes" aria-labelledby="titulo-demais-peoes">
        <h2 id="titulo-demais-peoes">Demais peões</h2>
        <p>Fora da roça essa semana, não podem receber votos.</p>
      </section>

      <section className="grade-demais-peoes" aria-label="Demais participantes">
        {foraDaRoca.map((participante) => (
          <ParticipanteCard key={participante.id} participante={participante} />
        ))}
      </section>
    </main>
  );
}
