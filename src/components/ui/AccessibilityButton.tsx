import React from 'react';
import accessibilityIcon from '../../assets/icons/accessibility.svg';
import {
  applyA11yPreferences,
  loadA11yPreferences,
  saveA11yPreferences,
  type A11yPreferences,
  type Theme
} from '../../services/a11yPreferences';

function speak(message: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'es-EC';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function AccessibilityButton() {
  const panelId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<A11yPreferences>(() => loadA11yPreferences());
  const [liveMessage, setLiveMessage] = React.useState('');

  const blindAssistMessage =
    'Perfil para usuarios ciegos activado. Activa TalkBack en Android o VoiceOver en iPhone para navegar por gestos y recibir lectura de pantalla.';
  const motorAssistMessage =
    'Perfil de discapacidad motora activado. Activa Voice Access o la herramienta de control por voz de tu dispositivo para facilitar la interacción.';

  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  React.useEffect(() => {
    applyA11yPreferences(prefs);
    saveA11yPreferences(prefs);
  }, [prefs]);

  const setTheme = (theme: Theme) => {
    setPrefs((prev) => ({ ...prev, theme }));
  };

  const setBlindMode = (enabled: boolean) => {
    setPrefs((prev) => ({ ...prev, blindMode: enabled }));
  };

  const setMotorMode = (enabled: boolean) => {
    setPrefs((prev) => ({ ...prev, motorMode: enabled }));
  };

  const setContentScale = (scale: number) => {
    setPrefs((prev) => ({ ...prev, contentScale: scale }));
  };

  const toggleLowVisionProfile = (enabled: boolean) => {
    if (enabled) {
      setPrefs((prev) => ({
        ...prev,
        bigText: true,
        bigSpace: true,
        focus: true,
        contentScale: prev.contentScale < 1.1 ? 1.1 : prev.contentScale
      }));
    } else {
      setPrefs((prev) => ({ ...prev, bigText: false, bigSpace: false, focus: false }));
    }
  };

  const toggleBlindProfile = (enabled: boolean) => {
    setBlindMode(enabled);
    if (enabled) {
      setLiveMessage(blindAssistMessage);
      speak(blindAssistMessage);
    }
  };

  const toggleMotorProfile = (enabled: boolean) => {
    setMotorMode(enabled);
    if (enabled) {
      setLiveMessage(motorAssistMessage);
      speak(motorAssistMessage);
    }
  };

  return (
    <>
      <button
        className="a11y-fab"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <img
          src={accessibilityIcon}
          alt=""
          aria-hidden="true"
          className="a11y-fab__icon"
          width="22"
          height="22"
        />
        <span className="sr-only">Abrir opciones de accesibilidad</span>
      </button>

      {open && (
        <>
          <button className="a11y-backdrop" aria-label="Cerrar panel" onClick={() => setOpen(false)} />
          <div className="a11y-panel" id={panelId} role="dialog" aria-label="Opciones de accesibilidad">
            <div className="a11y-panel__head">
              <h3>Ajustes de accesibilidad</h3>
              <button className="a11y-close" onClick={() => setOpen(false)} aria-label="Cerrar ajustes">
                Cerrar
              </button>
            </div>

            <div className="a11y-group">
              <h4>Perfiles</h4>
              <label className="a11y-switch" htmlFor="p-vision">
                <span>Problemas de vision</span>
                <input
                  id="p-vision"
                  type="checkbox"
                  checked={prefs.bigText && prefs.bigSpace && prefs.focus}
                  onChange={(e) => toggleLowVisionProfile(e.target.checked)}
                />
              </label>
              <label className="a11y-switch" htmlFor="p-blind">
                <span>Usuarios ciegos</span>
                <input
                  id="p-blind"
                  type="checkbox"
                  checked={prefs.blindMode}
                  onChange={(e) => toggleBlindProfile(e.target.checked)}
                />
              </label>
              {prefs.blindMode && (
                <p className="a11y-hint">
                  Activa TalkBack (Android) o VoiceOver (iPhone). La navegacion por teclado en movil se hace con
                  gestos de la tecnologia asistiva.
                </p>
              )}
              <label className="a11y-switch" htmlFor="p-motor">
                <span>Discapacidad motora</span>
                <input
                  id="p-motor"
                  type="checkbox"
                  checked={prefs.motorMode}
                  onChange={(e) => toggleMotorProfile(e.target.checked)}
                />
              </label>
              {prefs.motorMode && (
                <p className="a11y-hint">
                  Activa Voice Access o el control por voz de tu dispositivo para navegar y ejecutar acciones sin tocar
                  la pantalla.
                </p>
              )}
            </div>

            <div className="a11y-group">
              <h4>Ajuste de contenido</h4>
              <label htmlFor="content-scale" className="a11y-range-label">
                Escalado: {Math.round(prefs.contentScale * 100)}%
              </label>
              <input
                id="content-scale"
                className="a11y-range"
                type="range"
                min="0.9"
                max="1.4"
                step="0.05"
                value={prefs.contentScale}
                onChange={(event) => setContentScale(Number(event.target.value))}
              />
            </div>

            <div className="a11y-group">
              <h4>Ajuste de colores</h4>
              <div className="a11y-theme-grid">
                <label className="a11y-radio" htmlFor="t-light">
                  <input id="t-light" type="radio" name="a11y-theme" checked={prefs.theme === 'light'} onChange={() => setTheme('light')} />
                  Claro
                </label>
                <label className="a11y-radio" htmlFor="t-dark">
                  <input id="t-dark" type="radio" name="a11y-theme" checked={prefs.theme === 'dark'} onChange={() => setTheme('dark')} />
                  Oscuro
                </label>
                <label className="a11y-radio" htmlFor="t-contrast">
                  <input
                    id="t-contrast"
                    type="radio"
                    name="a11y-theme"
                    checked={prefs.theme === 'contrast'}
                    onChange={() => setTheme('contrast')}
                  />
                  Contraste alto
                </label>
              </div>
            </div>

            <p className="a11y-tip">Tip: presiona Esc o Cerrar para salir rapido.</p>

            <div role="status" aria-live="assertive" className="sr-only">
              {liveMessage}
            </div>
          </div>
        </>
      )}
    </>
  );
}