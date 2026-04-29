// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import AppShell from './app/AppShell';
import RoutesWithAnnouncements from './app/RoutesWithAnnouncements';

import Welcome from './pages/Welcome.tsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SpeakerDashboard from './pages/SpeakerDashboard';
import NewSession from './pages/NewSession';
import RecordingsDashboard from './pages/RecordingsDashboard';
import LessonDashboard from './pages/LessonDashboard';
import NewRecording from './pages/NewRecording';
import RecordingLobby from './pages/RecordingLobby';
import RecordingLive from './pages/RecordingLive.tsx';
import RecordingPaused from './pages/RecordingPaused';
import RecordingSave from './pages/RecordingSave';

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
          <Route path="/SpeakerDashboard" element={<SpeakerDashboard />} />
          <Route path="/orador" element={<SpeakerDashboard />} />
          <Route path="/NewSession" element={<NewSession />} />
          <Route path="/orador/nueva-sesion" element={<NewSession />} />
          <Route path="/grabaciones" element={<RecordingsDashboard />} />
          <Route path="/grabacion/nueva" element={<NewRecording />} />
          <Route path="/grabacion/preparar" element={<RecordingLobby />} />
          <Route path="/grabacion/grabando" element={<RecordingLive />} />
          <Route path="/grabacion/activa" element={<RecordingPaused />} />
          <Route path="/grabacion/pausa" element={<RecordingPaused />} />
          <Route path="/grabacion/guardar" element={<RecordingSave />} />
          <Route path="/leccion/:recordingId" element={<LessonDashboard />} />
          <Route path="/leccion" element={<LessonDashboard />} />
          <Route path="/espectador" element={<Placeholder title="Espectador" />} />
        </Routes>
      </RoutesWithAnnouncements>
    </AppShell>
  );
}