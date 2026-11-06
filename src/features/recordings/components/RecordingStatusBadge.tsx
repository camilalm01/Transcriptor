import type {RecordingStatus} from "../types/recordings.types";

interface Props {
  status: RecordingStatus;
}

export default function RecordingStatusBadge({
  status,
}: Props) {

  const styles = {
    RECORDING:
      "bg-red-100 text-red-700",

    UPLOADED:
      "bg-yellow-100 text-yellow-700",

    TRANSCRIBING:
      "bg-yellow-100 text-yellow-700",

    SUMMARIZING:
      "bg-yellow-100 text-yellow-700",

    READY:
      "bg-green-100 text-green-700",

    PARTIAL:
      "bg-orange-100 text-orange-700",

    FAILED:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}