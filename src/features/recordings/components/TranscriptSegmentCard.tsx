import type {TranscriptSegment} from "../types/recordings.types";

interface Props {
  segment: TranscriptSegment;
}

function formatTime(
  seconds: number
) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${remaining
    .toString()
    .padStart(2, "0")}`;
}

export default function TranscriptSegmentCard({
  segment,
}: Props) {

  return (
    <div
      className="
        rounded-2xl
        border
        border-(--border)
        bg-(--surface)
        p-4
      "
    >
      <div
        className="
          mb-3
          flex
          items-center
          gap-2
          text-sm
          text-(--text-secondary)
        "
      >
        <span>
          {formatTime(
            segment.start
          )}
        </span>

        <span>•</span>

        <span>
          {formatTime(
            segment.end
          )}
        </span>

        {segment.speaker && (
          <>
            <span>•</span>

            <span>
              {segment.speaker}
            </span>
          </>
        )}
      </div>

      <p
        className="
          whitespace-pre-wrap
        "
      >
        {segment.text}
      </p>
    </div>
  );
}