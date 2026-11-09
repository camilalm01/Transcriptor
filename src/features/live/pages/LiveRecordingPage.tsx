import { useParams } from "react-router-dom";

import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";

import { useSpace } from "../../spaces/hooks/useSpace";
import LiveCaptions from "../components/LiveCaptions";
import { useLiveCaptions } from "../hooks/useLiveCaptions";
import { useRecordingSummary } from "../hooks/useLiveRecordings";

/** Pantalla del estudiante: sigue la clase en vivo desde su dispositivo. */
export default function LiveRecordingPage() {
  const { spaceId = "", recordingId = "" } = useParams();

  const { space } = useSpace(spaceId);
  const { data: recording } = useRecordingSummary(recordingId);
  const live = useLiveCaptions(recordingId);

  return (
    <MainLayout>
      <Header
        title={recording?.title ?? space?.name ?? "Clase en vivo"}
        showBackButton
      />

      <div className="space-y-4 p-5">
        {recording && (
          <p className="text-sm text-(--text-secondary)">
            {recording.space?.name} · {recording.owner.name}
          </p>
        )}

        <LiveCaptions
          segments={live.segments}
          status={live.status}
          connected={live.connected}
          isFinal={live.isFinal}
        />
      </div>
    </MainLayout>
  );
}
