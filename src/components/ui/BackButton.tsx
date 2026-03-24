import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function BackButton({
  label = 'Volver',
  hotkey = true
}: { label?: string; hotkey?: boolean }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hotkey, navigate]);

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label={label}
      className="btn-back"
    >
      {/* Ícono simple con carácter unicode; cámbialo por SVG cuando lo tengas */}
      <span aria-hidden="true" style={{ marginRight: '.25rem' }}>←</span>
      {label}
    </button>
  );
}