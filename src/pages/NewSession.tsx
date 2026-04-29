import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { addSpeakerSession } from '../services/speakerSessions';

export default function NewSession() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');

  useEffect(() => {
    document.title = 'Nueva Sesion | Mi App Accesible';
  }, []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subject.trim()) return;

    addSpeakerSession({ title: subject });
    navigate('/orador');
  };

  return (
    <section className="nueva-sesion-wrap" aria-labelledby="nueva-sesion-title">
      <div className="auth-card__inner nueva-sesion-panel">
        <button type="button" className="nueva-sesion-back" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span>
          <span>Volver</span>
        </button>

        <form className="nueva-sesion-form" onSubmit={onSubmit} noValidate>
          <h1 id="nueva-sesion-title" className="nueva-sesion-form__title">Nueva Sesion</h1>

          <FormField
            id="sesion"
            label="Nombre Sesion"
            name="sesion"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Nombre de la sesion"
            autoComplete="off"
          />

          <div className="nueva-sesion-form__actions">
            <button type="submit" className="btn-primary nueva-sesion-form__save" disabled={!subject.trim()}>
              Guardar
            </button>
            <button type="button" className="home__btn nueva-sesion-form__cancel" onClick={() => navigate('/orador')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
