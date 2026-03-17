import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Athletes from "./pages/Athletes.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Inscripcion from "./pages/Inscripcion.jsx";
import TransEventos from "./pages/TransEventos.jsx";
import Contacto from "./pages/Contacto.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/atletas" element={<Athletes />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inscripcion" element={<Inscripcion />} />
      <Route path="/eventos" element={<TransEventos />} />
      <Route path="/contacto" element={<Contacto />} />
    </Routes>
  );
}
