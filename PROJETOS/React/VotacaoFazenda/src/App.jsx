import Home from './pages/Home';
import Header from './components/Header';
import Votacao from './pages/Votacao';
import Resultado from './pages/Resultado';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
   <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/votacao" element={<Votacao />} />
        <Route path="/resultado" element={<Resultado />} />
      </Routes>
      <footer className="rodape">DIAW 2026, PUC Minas</footer>
    </BrowserRouter>
  )
}