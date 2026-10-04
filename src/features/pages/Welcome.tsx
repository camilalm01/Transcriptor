import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Bienvenida | Mi App Accesible';
  }, []);

  return (
    <section className="welcome">
      <div className="welcome__inner">
        <h1 className="welcome__title">Bienvenido a Transcritor</h1>
        <p className="welcome__subtitle">
          Transcribe sesiones y comparte contenidos educativos de forma clara, accesible y ordenada.
        </p>

        <div className="welcome__illustration" aria-hidden="true">
          <div className="welcome__badge">EDU</div>
          <div className="welcome__book" />
          <div className="welcome__line welcome__line--one" />
          <div className="welcome__line welcome__line--two" />
        </div>

        <button type="button" className="btn-primary welcome__cta" onClick={() => navigate('/login')}>
          Empezar
        </button>
      </div>
    </section>
  );
}
