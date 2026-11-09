import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";
import Button from "../../../shared/components/ui/buttons/Button";
import Input from "../../../shared/components/ui/forms/Input";

import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";
import { useRecordingContext } from "../../../contexts/recording/useRecordingContext";

import { useSpaces } from "../../spaces/hooks/useSpaces";
import { useAuth } from "../../../contexts/auth/useAuth"; import { useCreateSpace } from "../../spaces/hooks/useSpaceActions";
import type { Space } from "../../spaces/types/spaces.types";

export default function SessionSetupPage() {
  const navigate = useNavigate();

  const { settings } = useAccessibility();

  const isSimple = settings.navigationMode === "simple";

  const {
    setSpaceId,
    setInviteCode,
    setSpaceName,
    setSessionTitle,
    setComment,
  } = useRecordingContext();

  const { user } = useAuth();

  const {
    data: spaces = [],
    isLoading,
  } = useSpaces(
    user?.id ?? "",
    "speaker"
  );
  const createSpace = useCreateSpace();

  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [newSpaceName, setNewSpaceName] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [hasConsent, setHasConsent] = useState(false);

  const handleContinue = async () => {
    if (!sessionName.trim()) {
      return;
    }
    if (!hasConsent) {
      return;
    }
    setSessionTitle(sessionName);
    setComment(commentValue);

    try {
      if (selectedSpaceId) {
        const space = spaces.find(
          (s: Space) =>
            s.id === selectedSpaceId
        );

        if (!space) {
          return;
        }

        setSpaceId(space.id);
        setInviteCode(space.invite?.code || null);
        setSpaceName(space.name);
      } else {
        const newSpace =
          await createSpace.mutateAsync(newSpaceName);

        setSpaceId(newSpace.id);
        setInviteCode(
          newSpace.invite?.code || null
        );
        setSpaceName(
          newSpace.name
        );
      }

      navigate("/recording/live");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <Header
        title={
          isSimple
            ? "Preparar grabación"
            : "Nueva grabación"
        }
        showBackButton
      />

      <div
        className={`
          space-y-6
          ${isSimple
            ? "p-6"
            : "p-5"
          }
        `}
      >
        <div className="relative">
          <label className="font-semibold">
            Espacio existente
          </label>

          <select
            value={selectedSpaceId}
            disabled={!!newSpaceName}
            onChange={(e) => {
              const value =
                e.target.value;

              setSelectedSpaceId(
                value
              );

              if (value) {
                setNewSpaceName("");
              }
            }}
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-(--border)
              bg-(--surface)
              p-4
              pr-12
              appearance-none
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <option value="">
              Seleccionar Reunion
            </option>

            {!isLoading &&
              spaces.length === 0 && (
                <option>
                  No existen Reuniones
                </option>
              )}

            {spaces.map((space: Space) => (
              <option
                key={space.id}
                value={space.id}
              >
                {space.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={25}
            className="
              pointer-events-none
              absolute
              right-4
              top-1/2
              text-(--text-secondary)
            "
          />
        </div>

        <div
          className="
            text-center
            text-(--text-secondary)
          "
        >
          --------------------- o
          ---------------------
        </div>

        <div
          className={`
            rounded-2xl
            border
            border-(--border)
            p-4
            transition-opacity
            ${selectedSpaceId
              ? "opacity-50"
              : ""
            }
          `}
        >
          <p
            className="
              mb-3
              font-semibold
              text-(--primary)
            "
          >
            Nueva Reunion
          </p>

          <Input
            className="
              border-(--primary)
              bg-(--surface)
            "
            value={newSpaceName}
            disabled={!!selectedSpaceId}
            onChange={(e) => {
              if (
                selectedSpaceId
              ) {
                setSelectedSpaceId("");
              }

              setNewSpaceName(
                e.target.value
              );
            }}
            placeholder="Nombre del espacio"
          />
        </div>

        <div>
          <label className="font-semibold">
            Nombre de la grabación
          </label>

          <Input
            className="
              border-(--border)
              bg-(--surface)
            "
            value={sessionName}
            onChange={(e) =>
              setSessionName(
                e.target.value
              )
            }
            placeholder="Ej: Clase 1"
          />
        </div>

        <div>
          <label className="font-semibold">
            Comentario
          </label>

          <textarea
            className="
              mt-2
              h-32
              w-full
              rounded-xl
              border
              border-(--border)
              bg-(--surface)
              p-4
            "
            value={commentValue}
            onChange={(e) =>
              setCommentValue(
                e.target.value
              )
            }
          />
        </div>

        <label
          className="
            flex
            items-start
            gap-3
          "
        >
          <input
            type="checkbox"
            checked={hasConsent}
            onChange={(e) =>
              setHasConsent(
                e.target.checked
              )
            }
          />

          <span>
            Tengo autorización
            para grabar y
            procesar este
            contenido.
          </span>
        </label>

        <Button
          fullWidth
          size="lg"
          disabled={
            !sessionName.trim() ||
            !hasConsent ||
            (
              !selectedSpaceId &&
              !newSpaceName.trim()
            )
          }
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
    </MainLayout>
  );
}