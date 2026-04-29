import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { saveRecordingSession } from '../services/recordings';
import { getRecordingFlowState, resetRecordingFlowState, updateRecordingFlowState } from '../services/recordingFlow';

export default function RecordingSave() {
  const navigate = useNavigate();
  const flow = getRecordingFlowState();
  const [duration, setDuration] = useState(flow.duration);
  const [title, setTitle] = useState(flow.title);
  const [date, setDate] = useState(flow.date);
  const [comment, setComment] = useState(flow.comment);

  useEffect(() => {
    document.title = 'Guardar | Mi App Accesible';
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const saved = saveRecordingSession({
      title,
      duration,
      sessionDate: date,
      comment
    });
    resetRecordingFlowState(saved.recording.title);
    navigate('/grabaciones');
  };

  return (
    <section className="recording-flow-wrap" aria-labelledby="save-title">
      <div className="auth-card__inner recording-flow-panel">
        <div className="recording-flow-topbar">
          <button type="button" className="recording-flow-back" onClick={() => navigate('/grabacion/pausa')}>
            <span aria-hidden="true">←</span>
            <span>Volver</span>
          </button>
          <button type="button" className="recording-flow-icon" aria-label="Ir al inicio" onClick={() => navigate('/home')}>
            <span aria-hidden="true">⌂</span>
          </button>
        </div>

        <h1 id="save-title" className="recording-flow-page-title">Guardar Grabación</h1>

        <form className="recording-flow-form recording-flow-form--save" onSubmit={onSubmit} noValidate>
          <FormField
            id="recording-duration"
            label="Duración de la grabación"
            name="duration"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            placeholder="23:32"
          />

          <FormField
            id="recording-title"
            label="Nombre de la sesión"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ej: Sesión 1"
          />

          <FormField
            id="recording-date"
            label="Fecha"
            name="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            placeholder="28/02/2026"
          />

          <div className="field">
            <label htmlFor="recording-comment" className="field__label">Comentario <span className="field__hint-inline">(opcional)</span></label>
            <textarea
              id="recording-comment"
              className="field__input recording-flow-textarea"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Escribe una nota corta..."
              rows={4}
            />
          </div>

          <div className="recording-flow-actions recording-flow-actions--stacked">
            <button type="submit" className="btn-primary recording-flow-actions__primary">
              Guardar
            </button>
            <button type="button" className="home__btn recording-flow-actions__secondary" onClick={() => navigate('/grabaciones')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
