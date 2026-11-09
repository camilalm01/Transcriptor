import {ArrowLeft} from "lucide-react";

import {useNavigate, useParams} from "react-router-dom";

import TranscriptSegmentCard from "../components/TranscriptSegmentCard";
import {useTranscript} from "../hooks/useTranscript";

export default function TranscriptPage() {

  const navigate = useNavigate();
  const { recordingId } = useParams();

  const {
    data: transcript,
    isLoading,
  } = useTranscript(
    recordingId
  );

  if (isLoading) {
    return (
      <div className="p-5">
        Cargando...
      </div>
    );
  }

  return (
    <div
      className="
        mx-auto
        max-w-5xl
        space-y-6
        p-5
      "
    >
      <button
        type="button"
        onClick={() =>
          navigate(-1)
        }
        className="
          flex
          items-center
          gap-2
        "
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      <h1
        className="
          text-3xl
          font-bold
        "
      >
        Transcripción
      </h1>

      <div className="space-y-4">

        {transcript?.segments?.map(
          segment => (
            <TranscriptSegmentCard
              key={`${segment.start}-${segment.end}`}
              segment={segment}
            />
          )
        )}

      </div>
    </div>
  );
}