import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Athletes from "./pages/Athletes.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Inscripcion from "./pages/Inscripcion.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/atletas" element={<Athletes />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inscripcion" element={<Inscripcion />} />
    </Routes>
  );
}
