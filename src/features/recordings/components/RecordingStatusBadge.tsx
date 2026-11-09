import type { Recording } from "../types/recordings.types";

interface Props {
  recording: Recording;
}

export default function RecordingStatusBadge({
  recording,
}: Props) {

  let label = "";
  let styles = "";

  if (recording.status === "FAILED") {
    label = "Error";
    styles =
      "bg-red-100 text-red-700";
  }

  else if (
    [
      "RECORDING",
      "UPLOADED",
      "TRANSCRIBING",
      "SUMMARIZING",
    ].includes(recording.status)
  ) {
    label = "Procesando";

    styles =
      "bg-yellow-100 text-yellow-700";
  }

  else if (recording.status === "READY") {

    const isPublished =
      recording.myRole === "MEMBER" ||
      recording.visibility ===
      "PUBLISHED";

    label = isPublished
      ? "Publicada"
      : "Por publicar";

    styles = isPublished
      ? "bg-green-100 text-green-700"
      : "bg-blue-100 text-blue-700";
  }
  else if (recording.status === "PARTIAL") {
    label = "Parcial";

    styles =
      "bg-orange-100 text-orange-700";
  }

  else {
    label = recording.status;

    styles =
      "bg-slate-100 text-slate-700";
  }


  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${styles}
      `}
    >
      {label}
    </span>
  );
}