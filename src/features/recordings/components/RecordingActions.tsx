import {
  Download,
  Pencil,
  Trash2,
} from "lucide-react";

import { useAuth } from "../../../contexts/auth/useAuth";
import { useRecordingActions } from "../hooks/useRecordingActions";

import {recordingsService} from "../services/recordingsService";

interface Props {
  recordingId: string;
}

export default function RecordingActions({
  recordingId,
}: Props) {

  const { role } = useAuth();

  const {deleteRecording} = useRecordingActions();

  async function handleExport() {
    const blob =
      await recordingsService.exportRecording(
        recordingId,
        "pdf"
      );

    const url = URL.createObjectURL(blob);

    window.open(
      url,
      "_blank"
    );
  }

  async function handleDelete() {
    if (
      !confirm(
        "¿Eliminar grabación?"
      )
    ) {
      return;
    }

    await deleteRecording.mutateAsync(
      recordingId
    );
  }

  return (
    <div className="space-y-3">

      <button
        type="button"
        onClick={handleExport}
        className="
          w-full
          rounded-2xl
          bg-(--primary)
          py-4
          font-semibold
          text-white
        "
      >
        <span
          className="
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <Download size={18} />
          Exportar transcripción
        </span>
      </button>

      {role === "speaker" && (
        <div
          className="
            flex
            gap-3
          "
        >
          <button
            type="button"
            disabled
            className="
              flex-1
              rounded-2xl
              border
              py-4
            "
          >
            <Pencil
              size={18}
              className="mx-auto"
            />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="
              flex-1
              rounded-2xl
              bg-red-500
              py-4
              text-white
            "
          >
            <Trash2
              size={18}
              className="mx-auto"
            />
          </button>
        </div>
      )}

    </div>
  );
}