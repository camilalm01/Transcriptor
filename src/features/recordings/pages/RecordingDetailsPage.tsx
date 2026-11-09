import { ArrowLeft, Calendar, Clock3 } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import AudioPlayer from "../components/AudioPlayer";
import SummaryCard from "../components/SummaryCard";
import TranscriptPreview from "../components/TranscriptPreview";
import RecordingActions from "../components/RecordingActions";

import { useRecordingDetails } from "../hooks/useRecordingDetails";
import { useTranscript } from "../hooks/useTranscript";
import { useSummary } from "../hooks/useSummary";

export default function RecordingDetailsPage() {

    const navigate = useNavigate();

    const { recordingId } = useParams();

    const {
        data: recording,
        isLoading,
    } = useRecordingDetails(
        recordingId
    );

    const {
        data: transcript,
    } = useTranscript(
        recordingId
    );

    const {
        data: summary
    } = useSummary(
        recordingId
    );
    if (
        isLoading ||
        !recording
    ) {
        return (
            <div className="p-5">
                Cargando...
            </div>
        );
    }

    const transcriptText =
        transcript?.segments
            ?.map(
                segment =>
                    segment.text
            )
            .join("\n\n")
        ?? "";

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

            <div>
                <h1
                    className="
            text-3xl
            font-bold
          "
                >
                    {recording.title}
                </h1>

                <div
                    className="
            mt-2
            flex
            flex-wrap
            gap-4
            text-sm
            text-(--text-secondary)
          "
                >
                    <span
                        className="
              flex
              items-center
              gap-1
            "
                    >
                        <Calendar size={16} />

                        {new Date(
                            recording.createdAt
                        ).toLocaleDateString()}
                    </span>

                    <span
                        className="
              flex
              items-center
              gap-1
            "
                    >
                        <Clock3 size={16} />

                        {Math.floor(
                            recording.durationSec / 60
                        )}
                        min
                    </span>
                </div>
            </div>

            <AudioPlayer
                audioUrl={
                    recording.audioUrl
                }
            />

            {summary && (
                <SummaryCard
                    summary={summary}
                    onOpen={() =>
                        navigate(
                            `/recordings/${recording.id}/summary`
                        )
                    }
                />

            )}


            <TranscriptPreview
                text={transcriptText}
                onOpen={() =>
                    navigate(
                        `/recordings/${recording.id}/transcript`
                    )
                }
            />

            <RecordingActions
                recordingId={recording.id}
            />
        </div>
    );
}