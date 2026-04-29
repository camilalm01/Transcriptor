import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecordingFlowState, updateRecordingFlowState } from '../services/recordingFlow';

export default function RecordingLive() {
  const navigate = useNavigate();
  const flow = getRecordingFlowState();

  useEffect(() => {
    document.title = 'Grabando | Mi App Accesible';
  }, []);

  const startRecording = () => {
    updateRecordingFlowState({ isRecording: true, isPaused: false, elapsedSeconds: 0, duration: '00:00' });
    navigate('/grabacion/pausa');
  };

  return (
    <section className="recording-flow-wrap" aria-labelledby="live-title">
      <div className="auth-card__inner recording-flow-panel">
        <div className="recording-flow-topbar">
          <button type="button" className="recording-flow-back" onClick={() => navigate(-1)}>
            <span aria-hidden="true">←</span>
            <span>Volver</span>
          </button>
          <button type="button" className="recording-flow-icon" onClick={() => navigate('/home')} aria-label="Ir al inicio">
            <span aria-hidden="true">⌂</span>
          </button>
        </div>

        <h1 id="live-title" className="recording-flow-page-title">Reunion</h1>

        <div className="recording-flow-code-card">
          <p className="recording-flow-code-card__label">Código de Acceso</p>
          <p className="recording-flow-code-card__code">{flow.code}</p>
          <p className="recording-flow-code-card__text">Comparte este código o el QR para que otros se unan a tu sesión.</p>
          <button type="button" className="home__btn recording-flow-code-card__button" onClick={() => navigate('/grabacion/preparar')}>
            Mostrar QR
          </button>
        </div>

        <div className="recording-flow-timer">
          <div className="recording-flow-ring" aria-hidden="true">
            <span className="recording-flow-ring__value">{flow.duration}</span>
            <span className="recording-flow-ring__label">00:00</span>
          </div>
          <button type="button" className="recording-flow-record-btn" onClick={startRecording} aria-label="Iniciar grabación">
            <span aria-hidden="true">●</span>
          </button>
        </div>

        <p className="recording-flow-status">Pulsa el botón para empezar la grabación.</p>
      </div>
    </section>
  );
}
