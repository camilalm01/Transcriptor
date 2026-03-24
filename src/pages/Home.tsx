import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  useEffect(() => { document.title = 'Home | Mi App Accesible'; }, []);
  const navigate = useNavigate();

  return (
    <section className="home">
      <div className="home__inner">
        <div className="home__logo" aria-hidden="true">EDU</div>
        <div className="home__actions">
          <button className="home__btn" onClick={() => navigate('/orador')}>Soy Orador</button>
          <button className="home__btn" onClick={() => navigate('/espectador')}>Soy Espectador</button>
        </div>
      </div>
    </section>
  );
}