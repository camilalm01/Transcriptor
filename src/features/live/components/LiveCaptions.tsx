import { useEffect, useRef, useState } from "react";

import Button from "../../../shared/components/ui/buttons/Button";
import type { CaptionSegment, LiveStatus } from "../types/live.types";

interface LiveCaptionsProps {
  segments: CaptionSegment[];
  status: LiveStatus;
  /** false cuando el WebSocket está caído y reconectando */
  connected: boolean;
  /** true cuando son los subtítulos definitivos de una clase terminada */
  isFinal?: boolean;
}

const TEXT_SIZES = [
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
] as const;

const STATUS_TEXT: Record<LiveStatus, string> = {
  connecting: "Conectando...",
  live: "En vivo",
  ended: "La clase terminó",
  disabled: "El orador desactivó los subtítulos en vivo para esta clase.",
  error: "No se pudo seguir la clase en vivo.",
};

export default function LiveCaptions({
  segments,
  status,
  connected,
  isFinal = false,
}: LiveCaptionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);
  const [sizeIndex, setSizeIndex] = useState(2);

  // Auto-scroll: se pausa si la persona sube a releer.
  useEffect(() => {
    const el = containerRef.current;
    if (el && stickToBottom) el.scrollTop = el.scrollHeight;
  }, [segments, stickToBottom, sizeIndex]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setStickToBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80);
  };

  const statusLabel = !connected && status !== "ended"
    ? "Reconectando..."
    : STATUS_TEXT[status];

  const isLive = status === "live" && connected;

  return (
    <section aria-label="Subtítulos en vivo" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p
          role="status"
          className={`flex items-center gap-2 font-semibold ${
            isLive ? "text-red-600" : "text-(--text-secondary)"
          }`}
        >
          {isLive && (
            <span
              aria-hidden="true"
              className="h-3 w-3 animate-pulse rounded-full bg-red-600"
            />
          )}
          {statusLabel}
          {status === "ended" && isFinal && " · transcripción final"}
        </p>

        <div className="flex gap-2" role="group" aria-label="Tamaño del texto">
          <Button
            size="sm"
            variant="secondary"
            aria-label="Reducir texto"
            disabled={sizeIndex === 0}
            onClick={() => setSizeIndex((i) => Math.max(0, i - 1))}
          >
            A−
          </Button>
          <Button
            size="sm"
            variant="secondary"
            aria-label="Aumentar texto"
            disabled={sizeIndex === TEXT_SIZES.length - 1}
            onClick={() =>
              setSizeIndex((i) => Math.min(TEXT_SIZES.length - 1, i + 1))
            }
          >
            A+
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Transcripción"
        tabIndex={0}
        className="h-[55dvh] overflow-y-auto rounded-3xl border border-(--border) bg-(--surface) p-5"
      >
        {segments.length === 0 ? (
          <p className="text-(--text-secondary)">
            {status === "live"
              ? "Esperando las primeras palabras. Los subtítulos aparecen unos segundos después de que el orador habla."
              : "Aún no hay texto."}
          </p>
        ) : (
          segments.map((segment, index) => (
            <p
              key={`${segment.start}-${index}`}
              className={`${TEXT_SIZES[sizeIndex]} mb-3 leading-relaxed`}
            >
              {segment.text}
            </p>
          ))
        )}
      </div>

      {!stickToBottom && (
        <Button fullWidth variant="secondary" onClick={() => setStickToBottom(true)}>
          Ir al final
        </Button>
      )}
    </section>
  );
}
