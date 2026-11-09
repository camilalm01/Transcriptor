import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../../api/client";
import { useRealtime } from "../../../contexts/realtime/useRealtime";
import type {
  CaptionEvent,
  CaptionSegment,
  LiveStatus,
  TranscriptResponse,
} from "../types/live.types";

interface SubscribeAck {
  ok: boolean;
  code?: "NOT_FOUND" | "LIVE_CAPTIONS_DISABLED" | "NOT_LIVE";
}

/**
 * Sigue los subtítulos de una grabación en vivo.
 * - Los fragmentos pueden llegar desordenados: se guardan por `seq` y se ordenan al mostrarlos.
 * - Si el socket se cae y vuelve, se resuscribe solo (las salas se pierden al reconectar).
 * - Al terminar la clase se carga la transcripción definitiva, que corrige los cortes entre fragmentos.
 */
export function useLiveCaptions(recordingId: string) {
  const { socket, connected } = useRealtime();

  const [bySeq, setBySeq] = useState<Record<number, CaptionSegment[]>>({});
  const [status, setStatus] = useState<LiveStatus>("connecting");
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!recordingId) return;

    let cancelled = false;

    const onCaption = (event: CaptionEvent) => {
      if (event.recordingId !== recordingId) return;
      setBySeq((prev) => ({ ...prev, [event.seq]: event.segments }));
    };

    const onFinished = (event: { recordingId: string }) => {
      if (event.recordingId !== recordingId) return;
      setStatus("ended");
      setFinished(true);
    };

    socket.on("recording.caption", onCaption);
    socket.on("recording.transcribed", onFinished);
    socket.on("recording.ready", onFinished);

    const subscribe = async () => {
      setStatus("connecting");
      try {
        const ack = (await socket
          .timeout(8000)
          .emitWithAck("recording:subscribe", { recordingId })) as SubscribeAck;

        if (cancelled) return;

        if (ack.ok) {
          setStatus("live");
        } else if (ack.code === "NOT_LIVE") {
          setStatus("ended");
          setFinished(true);
        } else if (ack.code === "LIVE_CAPTIONS_DISABLED") {
          setStatus("disabled");
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    if (connected) void subscribe();

    return () => {
      cancelled = true;
      socket.off("recording.caption", onCaption);
      socket.off("recording.transcribed", onFinished);
      socket.off("recording.ready", onFinished);
      if (socket.connected) {
        socket.emit("recording:unsubscribe", { recordingId });
      }
    };
  }, [socket, connected, recordingId]);

  const finalTranscript = useQuery({
    queryKey: ["recordings", "transcript", recordingId],
    queryFn: () =>
      api<TranscriptResponse>(`/recordings/${recordingId}/transcript`),
    enabled: finished && !!recordingId,
    retry: 3,
    retryDelay: 3000, // la transcripción definitiva puede tardar unos segundos
  });

  const liveSegments = useMemo(
    () =>
      Object.entries(bySeq)
        .sort(([a], [b]) => Number(a) - Number(b))
        .flatMap(([, segments]) => segments),
    [bySeq]
  );

  const finalSegments = finalTranscript.data?.segments ?? null;

  return {
    status,
    connected,
    /** transcripción definitiva si ya está; si no, lo recibido en vivo */
    segments: finalSegments ?? liveSegments,
    isFinal: finalSegments !== null,
  };
}
