import { storage } from './storage';

export type RecordingFlowState = {
  draftId: string;
  title: string;
  code: string;
  date: string;
  comment: string;
  duration: string;
  elapsedSeconds: number;
  microphoneReady: boolean;
  showQr: boolean;
  isRecording: boolean;
  isPaused: boolean;
};

const FLOW_KEY = 'recordingFlowState';

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayLabel() {
  return new Date().toLocaleDateString('es-ES');
}

function toDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

export function createRecordingFlowState(title = 'Sesion nueva') {
  return {
    draftId: createId(),
    title,
    code: 'X7B - 9P',
    date: todayLabel(),
    comment: '',
    duration: '00:00',
    elapsedSeconds: 0,
    microphoneReady: false,
    showQr: false,
    isRecording: false,
    isPaused: false
  } satisfies RecordingFlowState;
}

export function getRecordingFlowState() {
  return storage.getJSON<RecordingFlowState>(FLOW_KEY) ?? createRecordingFlowState();
}

export function setRecordingFlowState(state: RecordingFlowState) {
  storage.setJSON(FLOW_KEY, state);
}

export function updateRecordingFlowState(patch: Partial<RecordingFlowState>) {
  const next = { ...getRecordingFlowState(), ...patch };
  setRecordingFlowState(next);
  return next;
}

export function resetRecordingFlowState(title = 'Sesion nueva') {
  const next = createRecordingFlowState(title);
  setRecordingFlowState(next);
  return next;
}

export function secondsToDuration(seconds: number) {
  return toDuration(seconds);
}
