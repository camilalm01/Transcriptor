// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import AppShell from './app/AppShell';
import RoutesWithAnnouncements from './app/RoutesWithAnnouncements';

import Welcome from './pages/Welcome.tsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function Placeholder({ title }: { title: string }) {
  return (
    <section style={{ padding: '1rem' }}>
      <h1>{title}</h1>
      <p>Pantalla en construcción.</p>
    </section>
  );
}

export default function App() {
  return (
    <AppShell>
      <RoutesWithAnnouncements>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Próximas pantallas */}
          <Route path="/orador" element={<Placeholder title="Orador" />} />
          <Route path="/espectador" element={<Placeholder title="Espectador" />} />
        </Routes>
      </RoutesWithAnnouncements>
    </AppShell>
  );
}