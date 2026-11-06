import { useNavigate } from "react-router-dom";

import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";
import Button from "../../../shared/components/ui/buttons/Button";

import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";
import { useMicrophone } from "../hooks/useMicrophone";

import MicrophoneStatusCard from "../components/MicrophoneStatusCard";
import RecordingReminderCard from "../components/RecordingReminderCard";

export default function RecordingStartPage() {
    const navigate = useNavigate();
    const { settings } = useAccessibility();
    const { ready } = useMicrophone();
    const isSimple =
        settings.navigationMode ===
        "simple";

    return (
        <MainLayout>
            <Header
                title="Volver"
                showBackButton
            />

            <div
                className={`space-y-6
                    ${isSimple
                        ? "p-6"
                        : "p-5"
                    }
                `}
            >
                <p
                    className={` text-(--text-secondary) tezt-center justify-center
                        ${isSimple
                            ? "text-base"
                            : "text-sm"
                        }
                    `}
                >
                    Recuerda que para iniciar la grabación necesitas que tu micrófono
                    esté conectado y funcionando.
                </p>

                <MicrophoneStatusCard
                    ready={ready}
                />

                <Button
                    fullWidth
                    size="lg"
                    disabled={!ready}
                    onClick={() => navigate("/recording/setup")}
                >
                    Iniciar grabación
                </Button>

                <Button
                    fullWidth
                    size="lg"
                    variant="secondary"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Cancelar
                </Button>

                <RecordingReminderCard
                    isSimple={isSimple}
                />
            </div>
        </MainLayout>
    );
}