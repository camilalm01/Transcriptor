import { storage } from './storage';

export type RecordingStatus = 'published' | 'ready' | 'processing';

export type RecordingItem = {
  id: string;
  title: string;
  code: string;
  createdAt: string;
  sortOrder: number;
  duration: string;
  status: RecordingStatus;
  visibleToStudents: boolean;
  hasComplementaryResource: boolean;
  sessionDate?: string;
  comment?: string;
};

const RECORDINGS_KEY = 'recordingsDashboardItems';

const DEFAULT_RECORDINGS: RecordingItem[] = [
  {
    id: 'rec-1',
    title: 'Sesion 1',
    code: 'X7B - 9P',
    createdAt: '28 Feb 2026',
    sortOrder: 1,
    duration: '45:23',
    status: 'published',
    visibleToStudents: true,
    hasComplementaryResource: true
  },
  {
    id: 'rec-2',
    title: 'Sesion 4',
    code: 'X7B - 9P',
    createdAt: '28 Feb 2026',
    sortOrder: 2,
    duration: '45:23',
    status: 'ready',
    visibleToStudents: false,
    hasComplementaryResource: true
  },
  {
    id: 'rec-3',
    title: 'Sesion 5',
    code: 'X7B - 9P',
    createdAt: '28 Feb 2026',
    sortOrder: 3,
    duration: '45:23',
    status: 'ready',
    visibleToStudents: false,
    hasComplementaryResource: false
  },
  {
    id: 'rec-4',
    title: 'Sesion 6',
    code: 'X7B - 9P',
    createdAt: '28 Feb 2026',
    sortOrder: 4,
    duration: '45:23',
    status: 'processing',
    visibleToStudents: false,
    hasComplementaryResource: false
  },
  {
    id: 'rec-5',
    title: 'Sesion 7',
    code: 'X7B - 9P',
    createdAt: '01 Mar 2026',
    sortOrder: 5,
    duration: '45:23',
    status: 'processing',
    visibleToStudents: false,
    hasComplementaryResource: false
  },
  {
    id: 'rec-6',
    title: 'Sesion 8',
    code: 'X7B - 9P',
    createdAt: '01 Mar 2026',
    sortOrder: 6,
    duration: '45:23',
    status: 'processing',
    visibleToStudents: false,
    hasComplementaryResource: false
  }
];

function cloneDefaults() {
  return DEFAULT_RECORDINGS.map((item) => ({ ...item }));
}

export function getRecordings() {
  const stored = storage.getJSON<RecordingItem[]>(RECORDINGS_KEY);
  if (stored && stored.length > 0) return stored;

  const seeded = cloneDefaults();
  storage.setJSON(RECORDINGS_KEY, seeded);
  return seeded;
}

export function setRecordings(recordings: RecordingItem[]) {
  storage.setJSON(RECORDINGS_KEY, recordings);
}

export function getRecordingById(id: string) {
  return getRecordings().find((recording) => recording.id === id);
}

export function addRecording(input: { status?: RecordingStatus }) {
  const current = getRecordings();
  const nextNumber = current.length + 1;
  const status = input.status ?? 'processing';
  const recording: RecordingItem = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: `Sesion ${nextNumber}`,
    code: 'X7B - 9P',
    createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    sortOrder: Date.now(),
    duration: '45:23',
    status,
    visibleToStudents: status === 'published',
    hasComplementaryResource: false
  };

  const next = [recording, ...current];
  setRecordings(next);
  return { recording, next };
}

export function saveRecordingSession(input: {
  title: string;
  duration: string;
  sessionDate: string;
  comment?: string;
}) {
  const current = getRecordings();
  const recording: RecordingItem = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: input.title.trim(),
    code: 'X7B - 9P',
    createdAt: input.sessionDate,
    sortOrder: Date.now(),
    duration: input.duration,
    status: 'published',
    visibleToStudents: true,
    hasComplementaryResource: false,
    sessionDate: input.sessionDate,
    comment: input.comment?.trim() || undefined
  };

  const next = [recording, ...current];
  setRecordings(next);
  return { recording, next };
}

export function updateRecording(id: string, updater: (item: RecordingItem) => RecordingItem) {
  const next = getRecordings().map((item) => (item.id === id ? updater(item) : item));
  setRecordings(next);
  return next;
}

export function removeRecording(id: string) {
  const next = getRecordings().filter((item) => item.id !== id);
  setRecordings(next);
  return next;
}

export function toggleVisibility(id: string) {
  return updateRecording(id, (item) => ({
    ...item,
    visibleToStudents: !item.visibleToStudents,
    status: !item.visibleToStudents ? 'published' : 'ready'
  }));
}

export function toggleComplementaryResource(id: string) {
  return updateRecording(id, (item) => ({
    ...item,
    hasComplementaryResource: !item.hasComplementaryResource
  }));
}

export function cycleRecordingStatus(id: string) {
  return updateRecording(id, (item) => {
    const nextStatus: RecordingStatus =
      item.status === 'processing' ? 'ready' : item.status === 'ready' ? 'published' : 'processing';

    return {
      ...item,
      status: nextStatus,
      visibleToStudents: nextStatus === 'published'
    };
  });
}
