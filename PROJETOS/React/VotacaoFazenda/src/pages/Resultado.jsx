import { useState } from 'react';
import { obterVotos, calcularTotalVotos, calcularResultado, zerarVotos } from '../services/votacaoService';
import { Link } from 'react-router-dom';

export default function Resultado() {
  const [votos, setVotos] = useState(() => obterVotos());
  const total = calcularTotalVotos(votos);
  const resultado = calcularResultado(votos, total);

  function handleZerar() {
    if (window.confirm('Tem certeza de que deseja zerar todos os votos?')) {
      zerarVotos();
      setVotos({});
    }
  }

  return (
    <div className="container">
      <div className="resultado-parcial">
        <h1>Parcial da eliminação</h1>
        <p><strong>{total}</strong> Votos computados</p>
      </div>

      {total === 0 ? (
        <div className="resultado-vazio">
          <p>Nenhum voto ainda. Escolha quem sai da roça para ver a parcial.</p>
          <Link className="botao botao-principal" to="/votacao">Ir para votação</Link>
        </div>
        ) : (
          <>
          <div className="ranking-resultado">
            {resultado.map((participante, indice) => (
              <div className={`participante-resultado ${indice === 0 ? 'sairia-hoje' : ''}`} key={participante.id}>
                <div className="participante-resultado">
                  <div className="participante-resultado-fotoNome">
                    <img src={participante.foto} alt={participante.nome} />
                    <div className="participante-resultado-nome">
                      <h2>{participante.nome}</h2>
                      {indice === 0 && <span className="selo-sairia-hoje">Sairia hoje</span>}
                    </div>
                  </div>
                </div>
              <div className="barra">
                    <div className="barra-preenchida" style={{ width: `${participante.percentual}%` }} /></div>
                <div className="participante-resultado-votos">
                  <p><strong>{participante.votos}</strong> votos · {participante.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%</p>
                </div>
                </div>
            ))}
          </div>
          <button className="botao botao-secundario" onClick={handleZerar}>Zerar votação</button>
          </>
        )}
    </div>
  )
}