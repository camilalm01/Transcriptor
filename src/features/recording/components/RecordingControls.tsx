import {Pause, Play, Square, Mic} from "lucide-react";
import IconButton from "../../../shared/components/ui/buttons/IconButton";

interface RecordingControlsProps {
  recording: boolean;
  paused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export default function RecordingControls({
  recording,
  paused,

  onStart,
  onPause,
  onResume,
  onStop,
}: RecordingControlsProps) {

  if (!recording) {
    return (
      <div className="flex justify-center">
        <IconButton
          icon={Mic}
          aria-label="Iniciar grabación"
          onClick={onStart}
          className="
            h-20
            w-20
            text-white

            rounded-full
          "
        />
      </div>
    );
  }

  return (
    <div
      className="
        flex
        justify-center
        gap-6
      "
    >
      {paused ? (
        <IconButton
          icon={Play}
          aria-label="Continuar grabación"
          onClick={onResume}
          className="
            h-16
            w-16

            rounded-full
          "
        />
      ) : (
        <IconButton
          icon={Pause}
          aria-label="Pausar grabación"
          onClick={onPause}
          className="
            h-16
            w-16
            text-white

            rounded-full
          "
        />
      )}

      <IconButton
        icon={Square}
        aria-label="Detener grabación"
        onClick={onStop}
        className="
          h-16
          w-16

          rounded-full

          bg-red-500

          hover:bg-red-600

          text-white
        "
      />
    </div>
  );
}