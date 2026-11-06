import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { QrCode, Mic } from "lucide-react";

import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";
import Button from "../../../shared/components/ui/buttons/Button";
import Input from "../../../shared/components/ui/forms/Input";

import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";
import { useSpaceActions } from "../hooks/useSpaceActions";
import QrScannerModal from "../components/QrScannerModal";
import { useSpeechCode } from "../hooks/useSpeechCode";

export default function JoinSpacePage() {

    const navigate = useNavigate();
    const { settings } = useAccessibility();

    const isSimple = settings.navigationMode === "simple";

    const { joinSpace } = useSpaceActions();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const { listening, startListening } = useSpeechCode();
    const [scannerOpen, setScannerOpen] = useState(false);
    const handleJoin = async () => {
        try {
            setError("");

            const result =
                await joinSpace.mutateAsync({
                    code,
                });

            navigate(
                "/spaces",
                {
                    state: {
                        joinSuccess: true,
                        spaceName:
                            result.spaceName,
                        status:
                            result.status,
                    },
                }
            );

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "No fue posible solicitar acceso."
            );
        }
    };
    return (
        <MainLayout>

            <Header
                title="Volver"
                showBackButton
            />

            <div
                className={`
          ${isSimple
                        ? "p-6"
                        : "p-5"
                    }

          flex
          flex-col
          gap-6
        `}
            >

                <h1
                    className="
            text-center
            text-3xl
            font-bold
          "
                >
                    Acceso
                    Espectador
                </h1>

                <div>

                    <label
                        className="
              mb-3
              block
              text-xl
              font-semibold
            "
                    >
                        Código de invitación
                    </label>

                    <Input
                        value={code}
                        onChange={(e) =>
                            setCode(
                                e.target.value
                            )
                        }
                        placeholder="X7B-9P"
                        className="
              h-20
              text-center
              text-3xl
              tracking-widest
            "
                    />

                </div>

                <div
                    className="
            grid
            grid-cols-2
            gap-4
          "
                >

                    <Button
                        variant="secondary"
                        size="lg"
                        icon={QrCode}
                        onClick={() =>
                            setScannerOpen(true)
                        }
                    >
                        Escanear QR
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                        icon={Mic}
                        onClick={() => {
                            startListening(setCode);
                        }}
                    >
                        {listening
                            ? "Escuchando..."
                            : "Dictar por voz"}
                    </Button>

                </div>

                {error && (
                    <p
                        className="
              text-center
              text-red-500
            "
                    >
                        {error}
                    </p>
                )}

                <Button
                    fullWidth
                    size="lg"
                    onClick={
                        handleJoin
                    }
                    disabled={
                        !code.trim() ||
                        joinSpace.isPending
                    }
                >
                    {
                        joinSpace.isPending
                            ? "Solicitando..."
                            : "Entrar a sesión"
                    }
                </Button>

                <QrScannerModal
                    open={scannerOpen}
                    onClose={() => setScannerOpen(false)}
                    onCodeScanned={(code) => setCode(code)}
                />



            </div>

        </MainLayout>
    );
}