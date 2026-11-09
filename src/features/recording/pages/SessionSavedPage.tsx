import { useNavigate } from "react-router-dom";

import MainLayout from "../../../app/layouts/MainLayout";
import Button from "../../../shared/components/ui/buttons/Button";
import { useRecordingContext } from "../../../contexts/recording/useRecordingContext";

import {CircleCheck, FolderOpen, Voicemail } from "lucide-react";

export default function SessionSavedPage() {
  const navigate = useNavigate();
  const {recording, clearRecording } = useRecordingContext();

  const handleGoToSessions = () => {
    const spaceId = recording.spaceId;
    clearRecording();
    if (!spaceId) {
      navigate("/spaces");
      return;
    }
    navigate(`/spaces/${spaceId}/recordings`
    );
  };

  const handleContinueRecording =
    () => {
      navigate("/recording/live");
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
        <CircleCheck
          strokeWidth={2}
          stroke="#ffffff"
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
          ¡Grabación finalizada!
        </h1>

        <p
          className="
            mt-4
            text-(--text-secondary)
          "
        >
          La grabación ha sido enviada
          para procesamiento.
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
            <FolderOpen
              size={36}
              className=" text-(--primary)"
            />

            <div>
              <p
                className="text-sm text-(--text-secondary)"
              >
                Reunión
              </p>

              <h3 className="font-semibold">
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
            <Voicemail
              size={36}
              className=" text-(--primary)"
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

              <h3 className="font-semibold">
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
      </div>
    </MainLayout>
  );
}