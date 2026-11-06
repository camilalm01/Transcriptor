import { Mic, MicOff } from "lucide-react";

interface Props {
  ready: boolean;
}

export default function MicrophoneStatusCard({
  ready,
}: Props) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--surface)]
        p-4
        flex
        items-center
        justify-center
        gap-4
      "
    >
      {ready ? (
        <Mic />
      ) : (
        <MicOff />
      )}

      <span className="font-medium">
        {ready
          ? "Micrófono listo para grabar"
          : "Micrófono no disponible"}
      </span>
    </div>
  );
}