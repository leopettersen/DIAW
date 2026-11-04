import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  obterVotos,
  calcularTotalVotos,
  calcularResultado,
  zerarVotos,
} from '../services/votacaoService';

export default function Resultado() {
  const [votos, setVotos] = useState(() => obterVotos());
  const total = calcularTotalVotos(votos);
  const resultado = calcularResultado(votos);

  function handleZerar() {
    if (window.confirm('Tem certeza de que deseja zerar todos os votos?')) {
      zerarVotos();
      setVotos({});
    }
  }

  return (
    <main className="container pagina-resultado">
      <header className="resultado-parcial">
        <h1>Parcial da eliminação</h1>
        <p><strong>{total}</strong> votos computados</p>
      </header>

      {total === 0 ? (
        <section className="resultado-vazio" aria-live="polite">
          <p>Nenhum voto ainda. Escolha quem sai da roça para ver a parcial.</p>
          <Link className="botao botao-principal" to="/votacao">
            Ir para votação
          </Link>
        </section>
      ) : (
        <>
          <section className="ranking-resultado" aria-label="Parcial dos votos">
            {resultado.map((participante, indice) => (
              <article
                className={`participante-resultado ${indice === 0 ? 'sairia-hoje' : ''}`}
                key={participante.id}
              >
                <div className="participante-resultado-fotoNome">
                  <img src={participante.foto} alt={`Foto de ${participante.nome}`} />
                </div>

                <div className="participante-resultado-conteudo">
                  <div className="participante-resultado-nome">
                    <h2>{participante.nome}</h2>
                    {indice === 0 && <span className="selo-sairia-hoje">Sairia hoje</span>}
                  </div>

                  <div
                    className="barra"
                    role="progressbar"
                    aria-label={`Percentual de votos de ${participante.nome}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Number(participante.percentual.toFixed(1))}
                  >
                    <div
                      className="barra-preenchida"
                      style={{ width: `${participante.percentual}%` }}
                    />
                  </div>

                  <p className="participante-resultado-votos">
                    {participante.percentual.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
                    {' '}({participante.votos} votos)
                  </p>
                </div>
              </article>
            ))}
          </section>

          <button className="botao botao-secundario" onClick={handleZerar}>
            Zerar votação
          </button>
        </>
      )}
    </main>
  );
}
