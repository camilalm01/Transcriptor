import { useState } from "react";

import Button from "../../../shared/components/ui/buttons/Button";
import { useLiveCaptions } from "../hooks/useLiveCaptions";
import LiveCaptions from "./LiveCaptions";

interface LiveCaptionsPanelProps {
  recordingId: string;
}

function Subscribed({ recordingId }: LiveCaptionsPanelProps) {
  const live = useLiveCaptions(recordingId);
  return (
    <LiveCaptions
      segments={live.segments}
      status={live.status}
      connected={live.connected}
      isFinal={live.isFinal}
    />
  );
}

/** Para el orador: muestra lo que están leyendo los estudiantes. Solo se suscribe si se abre. */
export default function LiveCaptionsPanel({ recordingId }: LiveCaptionsPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <Button
        fullWidth
        variant="secondary"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Ocultar subtítulos" : "Ver subtítulos en vivo"}
      </Button>

      {open && <Subscribed recordingId={recordingId} />}
    </div>
  );
}
