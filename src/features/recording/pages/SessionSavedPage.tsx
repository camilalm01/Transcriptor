import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../app/layouts/MainLayout";
import Button from "../../../shared/components/ui/buttons/Button";

import { useRecordingContext } from "../../../contexts/recording/useRecordingContext";
import { useAuth } from "../../../contexts/auth/useAuth";
import { recordingService } from "../services/recordingService";

import { FolderOpen, Voicemail, CircleCheck, TriangleAlert } from "lucide-react";

export default function SessionSavedPage() {

  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const uploadStartedRef = useRef(false);
  const { recording, clearRecording, setRecordingId } = useRecordingContext();

  useEffect(() => {
    if (
      uploaded ||
      !recording.audioBlob ||
      !recording.spaceId ||
      !recording.sessionTitle ||
      !user
    ) {
      return;
    }

    const audioBlob = recording.audioBlob;
    const spaceId = recording.spaceId;
    const title = recording.sessionTitle;

    if (uploadStartedRef.current) {
      return;
    }

    uploadStartedRef.current = true;

    const uploadRecording = async () => {
      try {
        setLoading(true);

        const recordingId =
          await recordingService.uploadRecording({
            audioBlob,
            spaceId,
            title,
          });

        setRecordingId(
          recordingId
        );

        setUploaded(true);
      } catch (error) {
        uploadStartedRef.current = false;

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            "No fue posible guardar la grabación."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    uploadRecording();

  }, [
    uploaded,
    recording.audioBlob,
    recording.spaceId,
    recording.sessionTitle,
    user,
    setRecordingId,
  ]);



  const handleGoToSessions = () => {
    clearRecording();
    navigate(`/spaces/${recording.spaceId}/recordings`);
  };

  const handleContinueRecording = () => {
    clearRecording();
    navigate("/recording/start");
  };

  return (
    <MainLayout>

      <div
        className="
          p-6
          flex
          flex-col
          items-center
          text-center
        "
      >
        {loading && (
          <>
            <div
              className="
                h-16
                w-16
                animate-spin
                rounded-full
                border-4
                border-(--primary)
                border-t-transparent
              "
            />

            <h1
              className="
                mt-6
                text-3xl
                font-bold
              "
            >
              Guardando grabación...
            </h1>

            <p
              className="
                mt-4

                text-(--text-secondary)
              "
            >
              Estamos procesando tu grabación.
            </p>
          </>
        )}

        {!loading && error && (
          <>
            <TriangleAlert strokeWidth={2}
              stroke="#ffff"
              width={150}
              height={150}
              fill="#e4b313" />

            <h1
              className="
                mt-6
                text-3xl
                font-bold
              "
            >
              Error
            </h1>

            <p
              className="
                mt-4
                text-red-500
              "
            >
              {error}
            </p>
          </>
        )}

        {!loading &&
          !error &&
          uploaded && (
            <>
              <CircleCheck strokeWidth={2}
                stroke="#ffff"
                width={150}
                height={150}
                fill="#6ed470"
              />
              <h1
                className="
                  mt-8
                  text-4xl
                  font-bold
                  text-(--primary)
                "
              >
                ¡Grabación guardada!
              </h1>

              <p
                className="
                  mt-4
                  text-(--text-secondary)     
                "
              >
                La grabación se guardó correctamente.
              </p>

              <div
                className="
                  mt-8
                  w-full
                  rounded-3xl
                  border
                  border-(--border)
                  bg-(--surface)
                  p-6
                  space-y-8
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <FolderOpen size={36}
                    className="text-(--primary)"
                  />

                  <div>
                    <p
                      className="
                        text-sm
                        text-(--text-secondary)
                      "
                    >
                      Reunión
                    </p>

                    <h3
                      className="font-semibold"
                    >
                      {recording.spaceName}
                    </h3>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <Voicemail size={36}
                    className="text-(--primary)"
                  />

                  <div>
                    <p
                      className="
                        text-sm
                        text-(--text-secondary)
                      "
                    >
                      Grabación
                    </p>

                    <h3
                      className="font-semibold"
                    >
                      {recording.sessionTitle}
                    </h3>
                  </div>
                </div>
              </div>

              <div
                className="
                  mt-8
                  w-full
                  space-y-4
                "
              >
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleGoToSessions}
                >
                  Ver grabaciones
                </Button>

                <Button
                  fullWidth
                  size="lg"
                  variant="secondary"
                  onClick={handleContinueRecording}
                >
                  Continuar grabando
                </Button>
              </div>
            </>
          )}
      </div>

    </MainLayout>
  );
}