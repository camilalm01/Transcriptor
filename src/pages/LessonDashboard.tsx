import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecordingById, toggleComplementaryResource } from '../services/recordings';

export default function LessonDashboard() {
  const navigate = useNavigate();
  const { recordingId } = useParams();
  const recording = useMemo(() => getRecordingById(recordingId ?? '') ?? getRecordingById('rec-1'), [recordingId]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(12);
  const [showResources, setShowResources] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    document.title = 'Dashboard Lección | Mi App Accesible';
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setProgress((current) => (current >= 100 ? 100 : current + 2));
    }, 220);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (progress >= 100) setPlaying(false);
  }, [progress]);

  if (!recording) {
    return (
      <section className="lesson-wrap">
        <div className="auth-card__inner lesson-panel">
          <p>No hay lección disponible.</p>
          <button type="button" className="home__btn" onClick={() => navigate('/grabaciones')}>Volver</button>
        </div>
      </section>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: recording.title, text: recording.title, url });
        setShareMessage('Compartido');
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMessage('Enlace copiado');
    } catch {
      setShareMessage('No se pudo compartir');
    }
    window.setTimeout(() => setShareMessage(''), 1800);
  };

  const handleResources = () => {
    toggleComplementaryResource(recording.id);
    setShowResources((value) => !value);
  };

  return (
    <section className="lesson-wrap" aria-labelledby="lesson-title">
      <div className="auth-card__inner lesson-panel">
        <div className="lesson-topbar">
          <button type="button" className="lesson-back" onClick={() => navigate(-1)}>
            <span aria-hidden="true">←</span>
            <span>Volver</span>
          </button>
          <button type="button" className="lesson-home" aria-label="Ir al inicio" onClick={() => navigate('/home')}>
            <span aria-hidden="true">⌂</span>
          </button>
        </div>

        <div className="lesson-header">
          <h1 id="lesson-title" className="lesson-title">{recording.title}</h1>
          <p className="lesson-date">{recording.createdAt}</p>
        </div>

        <div className="lesson-player" aria-label="Reproductor de audio">
          <button type="button" className="lesson-play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pausar' : 'Reproducir'}>
            {playing ? '❚❚' : '▶'}
          </button>
          <div className="lesson-progress">
            <div className="lesson-progress__time">
              <span>12:45</span>
              <span>45:23</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="lesson-progress__bar"
              aria-label="Progreso de reproducción"
            />
          </div>
        </div>

        <article className="lesson-card">
          <h2 className="lesson-card__title">Conceptos Básicos</h2>
          <p className="lesson-card__subtitle">Resumen de la lección y notas principales.</p>
          <div className="lesson-card__placeholder" aria-hidden="true">
            <span />
            <span />
          </div>
        </article>

        {showResources && (
          <section className="lesson-resources" aria-live="polite">
            <p className="lesson-resources__title">Recursos activos</p>
            <p className="lesson-resources__text">Guía, PDF y material complementario vinculado a esta lección.</p>
          </section>
        )}

        <div className="lesson-actions">
          <button type="button" className="btn-primary lesson-actions__btn" onClick={handleResources}>
            Recursos complementarios
          </button>
          <button type="button" className="home__btn lesson-actions__btn" onClick={handleShare}>
            Exportar/Compartir
          </button>
        </div>

        {shareMessage && <p className="lesson-share-message" role="status">{shareMessage}</p>}
      </div>
    </section>
  );
}
