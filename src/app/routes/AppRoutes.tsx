import { Routes, Route } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Login</h1>}/>
      <Route path="/meetings" element={<h1>Reuniones</h1>}/>
      <Route path="/record" element={<h1>Grabar</h1>}/>
      <Route path="/accessibility" element={<h1>Accesibilidad</h1>}/>
      <Route path="/profile" element={<h1>Perfil</h1>}/>
    </Routes>
  );
}