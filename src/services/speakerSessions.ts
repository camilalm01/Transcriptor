import { storage } from './storage';

export type SpeakerSession = {
  id: string;
  title: string;
  date: string;
  createdAt: number;
};

const SESSIONS_KEY = 'speakerSessions';
const LAST_DATE_KEY = 'speakerLastSelectedDate';

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function formatDateLabel(dateKey: string) {
  return fromDateKey(dateKey).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function getSpeakerSessions() {
  return storage.getJSON<SpeakerSession[]>(SESSIONS_KEY) ?? [];
}

export function setSpeakerSessions(sessions: SpeakerSession[]) {
  storage.setJSON(SESSIONS_KEY, sessions);
}

export function addSpeakerSession(input: { title: string; date?: string }) {
  const current = getSpeakerSessions();
  const sessionDate = input.date ?? getLastSelectedSpeakerDate() ?? toDateKey(new Date());
  const session: SpeakerSession = {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: input.title.trim(),
    date: sessionDate,
    createdAt: Date.now()
  };

  setSpeakerSessions([session, ...current]);
  setLastSelectedSpeakerDate(sessionDate);
  return session;
}

export function deleteSpeakerSession(sessionId: string) {
  const next = getSpeakerSessions().filter((session) => session.id !== sessionId);
  setSpeakerSessions(next);
  return next;
}

export function getLastSelectedSpeakerDate() {
  return storage.get(LAST_DATE_KEY);
}

export function setLastSelectedSpeakerDate(dateKey: string) {
  storage.set(LAST_DATE_KEY, dateKey);
}
