import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { resetRecordingFlowState } from '../services/recordingFlow';

export default function NewRecording() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');

  useEffect(() => {
    document.title = 'Nueva Grabación | Mi App Accesible';
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subject.trim()) return;

    resetRecordingFlowState(subject.trim());
    navigate('/grabacion/preparar');
  };

  return (
    <section className="recording-flow-wrap" aria-labelledby="new-recording-title">
      <div className="auth-card__inner recording-flow-panel recording-flow-panel--centered">
        <h1 id="new-recording-title" className="recording-flow-title">Nueva Grabación</h1>

        <form className="recording-flow-form" onSubmit={onSubmit} noValidate>
          <FormField
            id="recording-name"
            label="Nombre"
            name="title"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Sesion 1"
            autoComplete="off"
          />

          <div className="recording-flow-actions recording-flow-actions--stacked">
            <button type="submit" className="btn-primary recording-flow-actions__primary" disabled={!subject.trim()}>
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
