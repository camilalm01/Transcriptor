import { useNavigate } from "react-router-dom";

import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";

import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";
import { useRecording } from "../hooks/useRecording";
import { useRecordingContext } from "../../../contexts/recording/useRecordingContext";

import MeetingCodeCard from "../components/InviteCodeCard";
import RecordingControls from "../components/RecordingControls";
import RecordingTimer from "../components/RecordingTimer";
import RecordingStatus from "../components/RecordingStatus";

export default function RecordingPage() {

    const navigate = useNavigate();
    const { settings } = useAccessibility();
    const isSimple =
        settings.navigationMode === "simple";

    const { recording: recordingData } = useRecordingContext();

    const {
        recording,
        paused,

        elapsedSeconds,

        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
    } = useRecording();

    const handleStop = () => {
        stopRecording(() => {
            navigate("/recording/saved");
        });
    };

    return (
        <MainLayout>
            <Header
                title={
                    recordingData.spaceName ??
                    "Grabación"}
                showBackButton
            />

            <div
                className={` space-y-6
                    ${isSimple
                        ? "p-6"
                        : "p-5"
                    }
                `}
            >
                {recordingData.inviteCode && (
                    <MeetingCodeCard
                        code={recordingData.inviteCode} />
                )}

                <RecordingTimer
                    seconds={elapsedSeconds}
                    isSimple={isSimple}
                />

                <RecordingControls
                    recording={recording}
                    paused={paused}
                    onStart={startRecording}
                    onPause={pauseRecording}
                    onResume={resumeRecording}
                    onStop={handleStop}
                />

                {recording && (
                    <RecordingStatus
                        paused={paused}
                    />
                )}
            </div>
        </MainLayout>
    );
}