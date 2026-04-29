import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecordingFlowState, secondsToDuration, updateRecordingFlowState } from '../services/recordingFlow';

export default function RecordingPaused() {
  const navigate = useNavigate();
  const [, forceRender] = useState(0);
  const flow = getRecordingFlowState();

  useEffect(() => {
    document.title = 'Grabando | Mi App Accesible';
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = getRecordingFlowState();
      if (!current.isRecording || current.isPaused) return;
      updateRecordingFlowState({ elapsedSeconds: current.elapsedSeconds + 1, duration: secondsToDuration(current.elapsedSeconds + 1) });
      forceRender((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const togglePause = () => {
    const next = getRecordingFlowState();
    updateRecordingFlowState({ isPaused: !next.isPaused, isRecording: true });
    forceRender((value) => value + 1);
  };

  const stopRecording = () => {
    updateRecordingFlowState({ isRecording: false, isPaused: false });
    navigate('/grabacion/guardar');
  };

  return (
    <section className="recording-flow-wrap" aria-labelledby="paused-title">
      <div className="auth-card__inner recording-flow-panel">
        <div className="recording-flow-topbar">
          <button type="button" className="recording-flow-back" onClick={() => navigate('/grabacion/preparar')}>
            <span aria-hidden="true">←</span>
            <span>Volver</span>
          </button>
          <button type="button" className="recording-flow-icon" onClick={() => navigate('/home')} aria-label="Ir al inicio">
            <span aria-hidden="true">⌂</span>
          </button>
        </div>

        <h1 id="paused-title" className="recording-flow-page-title">Reunion</h1>

        <div className="recording-flow-code-card">
          <p className="recording-flow-code-card__label">Código de Acceso</p>
          <p className="recording-flow-code-card__code">{flow.code}</p>
          <p className="recording-flow-code-card__text">Comparte este código o el QR para que otros se unan a tu sesión.</p>
          <button type="button" className="home__btn recording-flow-code-card__button" onClick={() => navigate('/grabacion/preparar')}>
            Mostrar QR
          </button>
        </div>

        <div className="recording-flow-timer">
          <div className="recording-flow-ring recording-flow-ring--active" aria-hidden="true">
            <span className="recording-flow-ring__value">{flow.duration}</span>
            <span className="recording-flow-ring__label">{flow.isPaused ? 'Pausado' : 'Grabando…'}</span>
          </div>
          <button type="button" className="recording-flow-record-btn" onClick={togglePause} aria-label="Pausar o reanudar">
            {flow.isPaused ? '▶' : '❚❚'}
          </button>
        </div>

        <div className="recording-flow-actions recording-flow-actions--compact">
          <button type="button" className="recording-flow-round-btn" onClick={togglePause} aria-label="Pausar o reanudar">
            {flow.isPaused ? '▶' : '❚❚'}
          </button>
          <button type="button" className="recording-flow-round-btn" onClick={stopRecording} aria-label="Detener">
            ■
          </button>
        </div>

        <p className="recording-flow-status">{flow.isPaused ? 'Grabación en pausa' : 'Grabación iniciada'}</p>
      </div>
    </section>
  );
}
