import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  cycleRecordingStatus,
  getRecordings,
  removeRecording,
  toggleComplementaryResource,
  toggleVisibility,
  type RecordingItem,
  type RecordingStatus
} from '../services/recordings';

const TABS: Array<{ id: RecordingStatus | 'all'; label: string }> = [
  { id: 'published', label: 'Publicado' },
  { id: 'ready', label: 'Listo para publicar' },
  { id: 'processing', label: 'Procesando' }
];

export default function RecordingsDashboard() {
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<RecordingItem[]>(() => getRecordings());
  const [activeTab, setActiveTab] = useState<RecordingStatus>('published');
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    document.title = 'Dashboard Grabaciones | Mi App Accesible';
  }, []);

  const filteredRecordings = useMemo(() => {
    const list = recordings.filter((recording) => recording.status === activeTab);
    return [...list].sort((left, right) => {
      if (sortNewest) return right.sortOrder - left.sortOrder;
      return left.sortOrder - right.sortOrder;
    });
  }, [recordings, activeTab, sortNewest]);

  const refresh = () => setRecordings(getRecordings());

  const handleAddRecording = () => {
    navigate('/grabacion/nueva');
  };

  const handleToggleVisibility = (id: string) => {
    toggleVisibility(id);
    refresh();
  };

  const handleToggleResource = (id: string) => {
    toggleComplementaryResource(id);
    refresh();
  };

  const handleCycleStatus = (id: string) => {
    cycleRecordingStatus(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    removeRecording(id);
    refresh();
  };

  return (
    <section className="recordings-wrap" aria-labelledby="recordings-title">
      <div className="auth-card__inner recordings-panel">
        <div className="recordings-panel__top">
          <button type="button" className="recordings-back" onClick={() => navigate('/home')}>
            <span aria-hidden="true">←</span>
            <span>Volver</span>
          </button>
          <button type="button" className="recordings-home" aria-label="Ir al inicio" onClick={() => navigate('/home')}>
            <span aria-hidden="true">⌂</span>
          </button>
        </div>

        <div className="recordings-header">
          <div>
            <h1 id="recordings-title" className="recordings-title">Reunion</h1>
            <p className="recordings-code">Código: X7B - 9P</p>
          </div>
          <button type="button" className="recordings-waiting-badge">Lista de espera</button>
        </div>

        <button type="button" className="btn-primary recordings-primary-action" onClick={handleAddRecording}>
          <span aria-hidden="true">🎙</span>
          Nueva Grabación
        </button>

        <div className="recordings-tabs" role="tablist" aria-label="Estados de grabación">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`recordings-tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id as RecordingStatus)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="recordings-toolbar">
          <h2 className="recordings-toolbar__title">Grabaciones ({filteredRecordings.length})</h2>
          <button type="button" className="recordings-sort" onClick={() => setSortNewest((value) => !value)}>
            Ordenar por ⇅
          </button>
        </div>

        <ul className="recordings-list" aria-label="Listado de grabaciones">
          {filteredRecordings.map((recording) => (
            <li key={recording.id} className="recordings-item">
              <button type="button" className="recordings-play" onClick={() => navigate(`/leccion/${recording.id}`)} aria-label={`Abrir ${recording.title}`}>
                ▶
              </button>

              <div className="recordings-item__body">
                <div className="recordings-item__head">
                  <div>
                    <h3 className="recordings-item__title">{recording.title}</h3>
                    <p className="recordings-item__meta">{recording.createdAt}</p>
                    <p className="recordings-item__meta">Duración {recording.duration}</p>
                  </div>

                  <div className="recordings-item__menu">
                    {recording.status === 'processing' ? (
                      <button type="button" className="home__btn recordings-chip recordings-chip--processing" onClick={() => handleCycleStatus(recording.id)}>
                        Procesando
                      </button>
                    ) : (
                      <button type="button" className="recordings-icon-button" onClick={() => handleCycleStatus(recording.id)} aria-label="Cambiar estado">
                        ⋮
                      </button>
                    )}
                  </div>
                </div>

                <div className="recordings-item__footer">
                  <button type="button" className="home__btn recordings-resource" onClick={() => handleToggleResource(recording.id)}>
                    Recurso Complementario
                  </button>
                  <button type="button" className="recordings-visibility" onClick={() => handleToggleVisibility(recording.id)}>
                    {recording.visibleToStudents ? 'Visible para espectadores' : 'Solo para profesor'}
                  </button>
                </div>

                <div className="recordings-item__actions">
                  <button type="button" className="home__btn recordings-mini-button" onClick={() => navigate(`/leccion/${recording.id}`)}>
                    Abrir
                  </button>
                  <button type="button" className="home__btn recordings-mini-button" onClick={() => handleDelete(recording.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
