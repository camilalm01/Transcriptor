import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecordingFlowState, updateRecordingFlowState } from '../services/recordingFlow';

export default function RecordingLobby() {
  const navigate = useNavigate();
  const [flow, setFlow] = useState(() => getRecordingFlowState());

  useEffect(() => {
    document.title = 'Grabación | Mi App Accesible';
  }, []);

  const toggleQr = () => {
    setFlow(updateRecordingFlowState({ showQr: !flow.showQr }));
  };

  const toggleMic = () => {
    setFlow(updateRecordingFlowState({ microphoneReady: !flow.microphoneReady }));
  };

  const startRecording = () => {
    updateRecordingFlowState({ isRecording: true, isPaused: false, elapsedSeconds: 0 });
    navigate('/grabacion/grabando');
  };

  return (
    <section className="recording-flow-wrap" aria-labelledby="lobby-title">
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

        <h1 id="lobby-title" className="recording-flow-page-title">Reunion</h1>

        <div className="recording-flow-code-card">
          <p className="recording-flow-code-card__label">Código de Acceso</p>
          <p className="recording-flow-code-card__code">{flow.code}</p>
          <p className="recording-flow-code-card__text">Comparte este código o el QR para que otros se unan a tu sesión.</p>
          <button type="button" className="home__btn recording-flow-code-card__button" onClick={toggleQr}>
            Mostrar QR
          </button>
          {flow.showQr && <div className="recording-flow-qr" aria-hidden="true">▣ ▢ ▣ ▢</div>}
        </div>

        <div className="recording-flow-section">
          <h2 className="recording-flow-section__title">Antes de Grabar</h2>
          <p className="recording-flow-section__text">Para iniciar necesitas comprobar que tu micrófono está conectado y funcionando.</p>
          <button type="button" className={`recording-flow-mic${flow.microphoneReady ? ' is-ready' : ''}`} onClick={toggleMic}>
            <span aria-hidden="true">🎙</span>
            {flow.microphoneReady ? 'Micrófono listo para grabar' : 'Comprobar micrófono'}
          </button>
          <p className="recording-flow-section__hint">{flow.microphoneReady ? 'Ya puedes grabar.' : 'Ya puedes grabar.'}</p>
        </div>

        <div className="recording-flow-actions">
          <button type="button" className="btn-primary recording-flow-actions__primary" onClick={startRecording}>
            Iniciar grabación
          </button>
          <button type="button" className="home__btn recording-flow-actions__secondary" onClick={() => navigate('/grabaciones')}>
            Cancelar
          </button>
        </div>
      </div>
    </section>
  );
}
