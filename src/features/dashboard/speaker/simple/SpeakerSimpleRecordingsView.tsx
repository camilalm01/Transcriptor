import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Share2, Trash2, UsersRound } from "lucide-react";

import MainLayout from "../../../../app/layouts/MainLayout";
import Header from "../../../../shared/components/ui/navigation/Header";
import Button from "../../../../shared/components/ui/buttons/Button";
import ConfirmModal from "../../../../shared/components/ui/modals/ConfirmModal";
import RenameModal from "../../../../shared/components/ui/modals/RenameModal";

import RecordingTabs from "../../../recordings/components/RecordingTabs";
import RecordingCardSimple from "../../../recordings/components/RecordingCardSimple";
import SpaceInfoCard from "../../../recordings/components/SpaceInfoCard";

import { useSpace } from "../../../spaces/hooks/useSpace";
import { useSpaceActions } from "../../../spaces/hooks/useSpaceActions";

import { useFilteredRecordings } from "../../../recordings/hooks/useFilteredRecordings";

import type { Space } from "../../../spaces/types/spaces.types";
import type {
  Recording,
  RecordingTab,
} from "../../../recordings/types/recordings.types";

export default function SpeakerSimpleRecordingsView() {
  const navigate = useNavigate();

  const { spaceId } = useParams();

  const [tab, setTab] =
    useState<RecordingTab>("published");

  const [renameOpen, setRenameOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedSpace, setSelectedSpace] =
    useState<Space | null>(null);

  const { data: space } = useSpace(spaceId);

  const {updateSpace, deleteSpace} = useSpaceActions();

  const {
    recordings,
    isLoading,
  } = useFilteredRecordings({
    spaceId: spaceId ?? "",
    tab,
  });

  const handleShare = async () => {
    if (!space?.invite?.code) {
      return;
    }

    const text = `Únete a "${space.name}" con el código ${space.invite.code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: space.name,
          text,
        });

        return;
      } catch {
        // usuario canceló
      }
    }

    await navigator.clipboard.writeText(
      space.invite.code
    );
    alert("Código copiado al portapapeles");

  };

  if (!spaceId) {
    return null;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <MainLayout>
      <Header
        title={space?.name ?? "Reunión"}
        showBackButton
      />

      <div className="p-4 space-y-4">
        {space && (
          <SpaceInfoCard
            spaceCode={space.invite?.code ?? "----"}
          />
        )}

        {/* Opciones */}
        <div className="space-y-3">
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
            <Button
              variant="secondary"
              icon={UsersRound}
              className="h-14"
              onClick={() =>
                navigate(
                  `/spaces/${spaceId}/members`
                )
              }
            >
              Gestionar usuarios
            </Button>

            <Button
              variant="secondary"
              icon={Pencil}
              className="h-14"
              onClick={() => {
                if (!space) return;

                setSelectedSpace(space);
                setRenameOpen(true);
              }}
            />

            <Button
              variant="danger"
              icon={Trash2}
              className="h-14"
              onClick={() => {
                if (!space) return;

                setSelectedSpace(space);
                setDeleteOpen(true);
              }}
            />
          </div>

          <Button
            icon={Share2}
            className="w-full h-12"
            onClick={handleShare}
          >
            Compartir
          </Button>
        </div>

        <RecordingTabs
          value={tab}
          onChange={setTab}
        />

        <div className="space-y-3">
          {recordings.map(
            (recording: Recording) => (
              <RecordingCardSimple
                key={recording.id}
                recording={recording}
                onOpen={() =>
                  navigate(
                    `/recordings/${recording.id}/details`
                  )
                }
              />
            )
          )}
        </div>
      </div>

      <RenameModal
        isOpen={renameOpen}
        defaultValue={selectedSpace?.name}
        onClose={() =>
          setRenameOpen(false)
        }
        onConfirm={(name) => {
          if (!selectedSpace) {
            return;
          }

          updateSpace.mutate({
            id: selectedSpace.id,
            data: {
              name,
            },
          });

          setRenameOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        title="Eliminar reunión"
        message="Esta reunión será eliminada."
        danger
        onClose={() =>
          setDeleteOpen(false)
        }
        onConfirm={() => {
          if (!selectedSpace) {
            return;
          }

          deleteSpace.mutate(
            selectedSpace.id,
            {
              onSuccess: () => {
                navigate("/spaces");
              },
            }
          );

          setDeleteOpen(false);
        }}
      />
    </MainLayout>
  );
}