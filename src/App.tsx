// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import AppShell from './app/AppShell';
import RoutesWithAnnouncements from './app/RoutesWithAnnouncements';

import Welcome from './features/pages/Welcome';
import Home from './features/pages/Home';
import Login from './features/pages/Login';
import Register from './features/pages/Register';
import SpeakerDashboard from './features/pages/SpeakerDashboard';
import NewSession from './features/pages/NewSession';
import RecordingsDashboard from './features/pages/RecordingsDashboard';
import LessonDashboard from './features/pages/LessonDashboard';
import NewRecording from './features/pages/NewRecording';
import RecordingLobby from './features/pages/RecordingLobby';
import RecordingLive from './features/pages/RecordingLive';
import RecordingPaused from './features/pages/RecordingPaused';
import RecordingSave from './features/pages/RecordingSave';

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