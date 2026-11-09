import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "../../../api/client";
import { useRecordingContext } from "../../../contexts/recording/useRecordingContext";
import { recordingService } from "../services/recordingService";

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

const MAX_UPLOAD_ATTEMPTS = 4;

/** El backend ya cerró la grabación (2 h o inactividad): seguir subiendo no sirve. */
const SERVER_CLOSED_CODES = new Set(["MAX_DURATION_REACHED", "RECORDING_NOT_ACTIVE"]);

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function pickMimeType(): string | undefined {
  return MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
}

/** Errores que vale la pena reintentar: red caída, límite de peticiones o fallo del servidor. */
function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return true;
  return error.status === 0 || error.status === 429 || error.status >= 500;
}

export function useRecording() {
  const {
    recording: recordingData,
    setDuration,
    setRecordingId,
  } = useRecordingContext();

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [liveRecordingId, setLiveRecordingId] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIdRef = useRef<string | null>(null);
  const mimeTypeRef = useRef<string | undefined>(undefined);
  const chunkMsRef = useRef(30_000);
  const segmentTimerRef = useRef<number | null>(null);
  const nextSeqRef = useRef(0);
  const elapsedRef = useRef(0);

  // true mientras cada segmento debe encadenar al siguiente al terminar
  const keepSegmentingRef = useRef(false);

  // Cola de subida: los fragmentos salen en orden, de uno en uno.
  const uploadChainRef = useRef<Promise<void>>(Promise.resolve());

  // Se rellena más abajo: corta la grabación local cuando el servidor ya la cerró.
  const serverClosedRef = useRef<() => void>(() => {});

  /* --------------------- aviso al cerrar la pestaña --------------------- */

  useEffect(() => {
    if (!recording) return;

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [recording]);

  /* ------------------------------ cronómetro ------------------------------ */

  useEffect(() => {
    if (!recording || paused) return;

    const timer = window.setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSeconds(elapsedRef.current);
    }, 1000);

    return () => clearInterval(timer);
  }, [recording, paused]);

  /* -------------------------------- subida -------------------------------- */

  const uploadWithRetry = useCallback(
    async (recordingId: string, sequence: number, chunk: Blob) => {
      for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
        try {
          await recordingService.uploadChunk({ recordingId, sequence, chunk });
          return;
        } catch (err) {
          if (err instanceof ApiError && SERVER_CLOSED_CODES.has(err.code)) {
            setError(err.message);
            serverClosedRef.current();
            return;
          }

          if (attempt === MAX_UPLOAD_ATTEMPTS || !isRetryable(err)) {
            setError(
              err instanceof Error
                ? err.message
                : "No se pudo enviar un fragmento de audio."
            );
            return; // no rompe la cola: los siguientes fragmentos siguen
          }
          await sleep(1000 * 2 ** (attempt - 1));
        }
      }
    },
    []
  );

  const enqueueUpload = useCallback(
    (recordingId: string, sequence: number, chunk: Blob) => {
      uploadChainRef.current = uploadChainRef.current.then(() =>
        uploadWithRetry(recordingId, sequence, chunk)
      );
    },
    [uploadWithRetry]
  );

  /* ------------------------------- segmentos ------------------------------- */
  /* Cada segmento es un MediaRecorder nuevo sobre el mismo stream y produce */
  /* un WebM COMPLETO (con cabecera). Con start(timeslice) solo el primer    */
  /* pedazo la trae y el backend rechaza los demás.                          */

  const startSegment = useCallback(() => {
    const stream = streamRef.current;
    const recordingId = recordingIdRef.current;
    if (!stream || !recordingId) return;

    const mimeType = mimeTypeRef.current;
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const parts: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) parts.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(parts, { type: recorder.mimeType || mimeType });

      if (blob.size > 0) {
        enqueueUpload(recordingId, nextSeqRef.current, blob);
        nextSeqRef.current += 1;
      }

      if (keepSegmentingRef.current) startSegment();
    };

    recorder.onerror = () => {
      setError("Error del micrófono durante la grabación.");
    };

    recorder.start(); // sin timeslice
    recorderRef.current = recorder;

    segmentTimerRef.current = window.setTimeout(() => {
      if (recorder.state === "recording") recorder.stop();
    }, chunkMsRef.current);
  }, [enqueueUpload]);

  /** Cierra el segmento actual (lo sube) y espera a que termine. No inicia otro. */
  const closeCurrentSegment = useCallback((): Promise<void> => {
    keepSegmentingRef.current = false;

    if (segmentTimerRef.current !== null) {
      clearTimeout(segmentTimerRef.current);
      segmentTimerRef.current = null;
    }

    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return Promise.resolve();

    return new Promise<void>((resolve) => {
      const previousOnStop = recorder.onstop;
      recorder.onstop = (event) => {
        previousOnStop?.call(recorder, event);
        resolve();
      };
      recorder.stop();
    });
  }, []);

  const releaseResources = useCallback(() => {
    keepSegmentingRef.current = false;

    if (segmentTimerRef.current !== null) {
      clearTimeout(segmentTimerRef.current);
      segmentTimerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    recordingIdRef.current = null;
    nextSeqRef.current = 0;
    uploadChainRef.current = Promise.resolve();
  }, []);

  useEffect(() => {
    serverClosedRef.current = () => {
      releaseResources();
      setRecording(false);
      setPaused(false);
      setLiveRecordingId(null);
    };
  }, [releaseResources]);

  // Si se sale de la pantalla a mitad de grabación, se libera el micrófono.
  useEffect(() => releaseResources, [releaseResources]);

  /* --------------------------------- acciones -------------------------------- */

  const startRecording = async () => {
    setError(null);

    if (!recordingData.spaceId || !recordingData.sessionTitle) {
      setError("Faltan datos para iniciar la grabación.");
      return;
    }

    try {
      const mimeType = pickMimeType();
      if (!mimeType) {
        setError("Este navegador no puede grabar audio WebM u Ogg.");
        return;
      }

      const response = await recordingService.startRecording({
        spaceId: recordingData.spaceId,
        title: recordingData.sessionTitle,
        consent: true,
        liveCaptions: true, // los miembros pueden leer la clase mientras se graba
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      streamRef.current = stream;
      recordingIdRef.current = response.recording.id;
      mimeTypeRef.current = mimeType;
      chunkMsRef.current = response.chunkSeconds * 1000;
      nextSeqRef.current = 0;
      elapsedRef.current = 0;
      uploadChainRef.current = Promise.resolve();

      setRecordingId(response.recording.id);
      setLiveRecordingId(response.recording.id);

      keepSegmentingRef.current = true;
      startSegment();

      setElapsedSeconds(0);
      setRecording(true);
      setPaused(false);
    } catch (err) {
      releaseResources();
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar la grabación."
      );
    }
  };

  const pauseRecording = async () => {
    if (!recorderRef.current || paused) return;

    // El audio grabado hasta ahora se cierra y se sube como un fragmento completo.
    await closeCurrentSegment();
    setPaused(true);
  };

  const resumeRecording = () => {
    if (!streamRef.current || !paused) return;

    keepSegmentingRef.current = true;
    startSegment();
    setPaused(false);
  };

  const stopRecording = async (onFinished?: () => void) => {
    const recordingId = recordingIdRef.current;

    if (!recorderRef.current || !recordingId) {
      setError("No hay una grabación en curso.");
      return;
    }

    try {
      await closeCurrentSegment();
      await uploadChainRef.current; // espera a que se suban todos los fragmentos

      if (nextSeqRef.current === 0) {
        setError("No se capturó audio.");
        return;
      }

      await recordingService.finishRecording({
        recordingId,
        lastSeq: nextSeqRef.current - 1,
      });

      setDuration(elapsedRef.current);
      onFinished?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo finalizar la grabación."
      );
    } finally {
      releaseResources();
      setRecording(false);
      setPaused(false);
      setLiveRecordingId(null);
    }
  };

  const resetRecording = () => {
    releaseResources();
    elapsedRef.current = 0;
    setElapsedSeconds(0);
    setDuration(0);
    setRecording(false);
    setPaused(false);
    setLiveRecordingId(null);
    setError(null);
  };

  return {
    recording,
    paused,
    elapsedSeconds,
    error,
    /** id de la grabación en curso (para mostrar los subtítulos al orador) */
    recordingId: liveRecordingId,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
  };
}
