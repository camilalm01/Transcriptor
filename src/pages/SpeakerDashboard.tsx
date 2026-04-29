import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteSpeakerSession,
  formatDateLabel,
  fromDateKey,
  getLastSelectedSpeakerDate,
  getSpeakerSessions,
  setLastSelectedSpeakerDate,
  toDateKey,
  type SpeakerSession
} from '../services/speakerSessions';

function shortMonth(date: Date) {
  return date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
}

function weekRangeLabel(days: Date[]) {
  const first = days[0];
  const last = days[6];
  const firstMonth = shortMonth(first);
  const lastMonth = shortMonth(last);
  const start = `${firstMonth} ${first.getDate()}`;
  const end = firstMonth === lastMonth
    ? `${last.getDate()}`
    : `${lastMonth} ${last.getDate()}`;

  return `${start} - ${end}`;
}

export default function SpeakerDashboard() {
  const navigate = useNavigate();
  const todayKey = toDateKey(new Date());
  const initialDate = getLastSelectedSpeakerDate() ?? todayKey;

  const [sessions, setSessions] = useState<SpeakerSession[]>(() => getSpeakerSessions());
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Dashboard Orador | Mi App Accesible';
  }, []);

  useEffect(() => {
    setLastSelectedSpeakerDate(selectedDate);
  }, [selectedDate]);

  const sessionsByDate = useMemo(() => {
    return sessions.reduce<Record<string, SpeakerSession[]>>((accumulator, session) => {
      if (!accumulator[session.date]) accumulator[session.date] = [];
      accumulator[session.date].push(session);
      return accumulator;
    }, {});
  }, [sessions]);

  // (month grid removed in favor of a compact weekly strip)
  // compute the week that contains selectedDate (Mon..Sun)
  const weekDays = useMemo(() => {
    const base = fromDateKey(selectedDate);
    // get Monday of the week (ISO-like, Monday=1)
    const day = base.getDay();
    const monday = new Date(base);
    // JS: Sunday=0, Monday=1... transform so Monday is start
    const offset = (day + 6) % 7; // days since Monday
    monday.setDate(base.getDate() - offset);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [selectedDate]);
  const selectedSessions = sessionsByDate[selectedDate] ?? [];
  const selectedSession = sessions.find((session) => session.id === activeSessionId) ?? selectedSessions[0] ?? null;
  const weekLabel = weekRangeLabel(weekDays);

  const goToDate = (date: Date) => {
    const dateKey = toDateKey(date);
    setSelectedDate(dateKey);
    setActiveSessionId(null);
  };

  const shiftWeek = (offsetDays: number) => {
    const base = fromDateKey(selectedDate);
    const next = new Date(base);
    next.setDate(base.getDate() + offsetDays);
    goToDate(next);
  };

  const handleCreateSession = () => {
    navigate('/orador/nueva-sesion');
  };

  const handleDeleteSession = (sessionId: string) => {
    const next = deleteSpeakerSession(sessionId);
    setSessions(next);
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  };

  const handleOpenSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  return (
    <section className="orador-wrap" aria-labelledby="orador-title">
      <div className="auth-card__inner orador-panel">
        <div className="orador-panel__top">
          <div>
            <h1 id="orador-title" className="orador-title">Bienvenido</h1>
            <p className="orador-subtitle">Aqui puedes crear sesiones para ordenar tus grabaciones</p>
          </div>

          <button type="button" className="orador-home-btn" aria-label="Ir al inicio" onClick={() => navigate('/home')}>
            <span aria-hidden="true">⌂</span>
          </button>
        </div>

        <div className="orador-toolbar">
          <h2 className="orador-toolbar__title">Mis Sesiones</h2>
          <button type="button" className="orador-icon-btn" aria-label="Buscar sesiones" onClick={() => navigate('/orador/nueva-sesion')}>
            ⌕
          </button>
        </div>

        <div className="orador-calendar" aria-label={`Semana ${weekLabel}`}>
          <div className="orador-calendar-controls">
            <button type="button" className="orador-cal-arrow" onClick={() => shiftWeek(-7)} aria-label="Semana anterior">‹</button>
            <div className="orador-calendar-range" aria-hidden="true">{weekLabel}</div>
            <button type="button" className="orador-cal-arrow" onClick={() => shiftWeek(7)} aria-label="Semana siguiente">›</button>
          </div>

          <div className="orador-calendar__week orador-calendar__week--labels" aria-hidden="true">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mie</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sab</span>
            <span>Dom</span>
          </div>

          <div className="orador-calendar__grid orador-week-strip">
            {weekDays.map((day) => {
              const dateKey = toDateKey(day);
              const isSelected = dateKey === selectedDate;
              const count = sessionsByDate[dateKey]?.length ?? 0;

              return (
                <button
                  key={dateKey}
                  type="button"
                  className={`orador-calendar__day${isSelected ? ' is-selected' : ''}`}
                  onClick={() => goToDate(day)}
                  aria-pressed={isSelected}
                  aria-label={`${formatDateLabel(dateKey)}${count ? `, ${count} reunión${count === 1 ? '' : 'es'}` : ''}`}
                >
                  <span className="orador-calendar__day-number">{day.getDate()}</span>
                  {count > 0 && <span className="orador-calendar__day-badge">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="orador-divider" />

        <div className="orador-toolbar orador-toolbar--compact">
          <p className="orador-date">{formatDateLabel(selectedDate)}</p>
          <button type="button" className="orador-sort" onClick={() => setSessions([...sessions].sort((left, right) => right.createdAt - left.createdAt))}>
            Ordenar por más reciente
          </button>
        </div>

        <ul className="orador-list" aria-label="Listado de sesiones">
          {selectedSessions.length === 0 ? (
            <li className="orador-empty">No hay reuniones para esta fecha. Crea una nueva para verla aquí.</li>
          ) : (
            selectedSessions.map((session) => (
              <li key={session.id}>
                <div className={`orador-card${activeSessionId === session.id ? ' is-active' : ''}`}>
                  <button
                    type="button"
                    className="orador-card__main"
                    onClick={() => handleOpenSession(session.id)}
                    aria-label={`Abrir reunión ${session.title}`}
                  >
                    <span className="orador-card__dot" aria-hidden="true" />
                    <span className="orador-card__text">
                      <span className="orador-card__title">{session.title}</span>
                      <span className="orador-card__meta">{formatDateLabel(session.date)}</span>
                    </span>
                    <span className="orador-card__actions" aria-hidden="true">⋮</span>
                  </button>

                  <button
                    type="button"
                    className="orador-card__delete"
                    onClick={() => handleDeleteSession(session.id)}
                    aria-label={`Eliminar reunión ${session.title}`}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {selectedSession && (
          <section className="orador-details" aria-live="polite">
            <p className="orador-details__label">Reunión activa</p>
            <h3 className="orador-details__title">{selectedSession.title}</h3>
            <p className="orador-details__text">Fecha: {formatDateLabel(selectedSession.date)}</p>
          </section>
        )}

        <button type="button" className="orador-fab" onClick={handleCreateSession} aria-label="Crear nueva sesion">
          <span aria-hidden="true">+</span>
        </button>
      </div>
    </section>
  );
}
