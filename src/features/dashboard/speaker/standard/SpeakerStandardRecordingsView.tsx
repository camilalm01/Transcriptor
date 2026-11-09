import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, MoreVertical, UsersRound } from "lucide-react";

import MainLayout from "../../../../app/layouts/MainLayout";
import Header from "../../../../shared/components/ui/navigation/Header";
import Button from "../../../../shared/components/ui/buttons/Button";

import SpaceInfoCard from "../../../recordings/components/SpaceInfoCard";

import { useSpace } from "../../../spaces/hooks/useSpace";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import SortSelector from "../../../../shared/components/filters/SortSelector";
import type {
    SortOption,
} from "../../../../shared/utils/sortByDate";

import RecordingTabs from "../../../recordings/components/RecordingTabs";
import RecordingCardStandard from "../../../recordings/components/RecordingCardStandard";

import { useFilteredRecordings } from "../../../recordings/hooks/useFilteredRecordings";
import type {
    Recording,
    RecordingTab,
} from "../../../recordings/types/recordings.types";

import { useRecordingActions } from "../../../recordings/hooks/useRecordingActions";
import ConfirmModal from "../../../../shared/components/ui/modals/ConfirmModal";
import RenameModal from "../../../../shared/components/ui/modals/RenameModal";

export default function SpeakerStandardRecordingsView() {

    const navigate = useNavigate();
    const { spaceId } = useParams();
    const [tab, setTab] = useState<RecordingTab>("published");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("newest");
    const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { updateRecording, deleteRecording } = useRecordingActions();

    const {
        recordings,
        isLoading,
    } = useFilteredRecordings({
        spaceId: spaceId ?? "",
        tab,
        search,
    });

    const { data: space } = useSpace(spaceId);

    const sorted = useMemo(() => {

        const result = [...recordings,];

        result.sort((a, b) =>
            sort === "newest"
                ? Date.parse(b.createdAt
                ) -
                Date.parse(
                    a.createdAt
                )
                : Date.parse(
                    a.createdAt
                ) -
                Date.parse(
                    b.createdAt
                )
        );

        return result;

    }, [
        recordings,
        sort,
    ]);

    if (isLoading) {
        return (
            <div>Cargando...</div>
        );
    }
    return (
        <MainLayout>
            <Header
                title={space?.name ?? "Reunión"}
                showBackButton
                rightActions={
                    <>
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/spaces/${spaceId}/members`
                                )
                            }
                            className="
                                rounded-lg
                                bg-white/20
                                p-2
                                "
                        >
                            <UsersRound size={22} />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                console.log("menu")
                            }
                        >
                            <MoreVertical size={22} />
                        </button>
                    </>
                }
            />
        <div className="p-4 space-y-6">
            
            {space && (
                <SpaceInfoCard
                    spaceCode={
                        space.invite?.code ?? "----"
                    }
                />
            )}

            <Button
                onClick={() => {
                    navigate(`/recording/start`);
                }}
                fullWidth
                size="lg"
                icon={Plus}
            >
                Nueva grabación
            </Button>


            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar grabación..."
            />

            <SortSelector
                value={sort}
                onChange={setSort}
            />

            <RecordingTabs
                value={tab}
                onChange={setTab}
            />

            <div className="space-y-3">
                {sorted.map((recording) => (
                    <RecordingCardStandard
                        key={recording.id}
                        recording={recording}
                        onOpen={() =>
                            navigate(
                                `/recordings/${recording.id}/details`
                            )
                        }
                        onPublish={() => {
                            updateRecording.mutate({
                                id: recording.id,
                                data: {
                                    visibility: "PUBLISHED",
                                },
                            });
                        }}
                        onRename={() => {
                              console.log("RENAME");

                            setSelectedRecording(
                                recording
                            );

                            setRenameOpen(true);
                        }}
                        onUnpublish={() => {
                            updateRecording.mutate({
                                id: recording.id,
                                data: {
                                    visibility: "PRIVATE",
                                },
                            });
                        }}
                        onDelete={() => {
                            setSelectedRecording(
                                recording
                            );

                            setDeleteOpen(true);
                        }}
                    />
                ))}
            </div>

            <RenameModal
                isOpen={renameOpen}
                defaultValue={
                    selectedRecording?.title
                }
                onClose={() =>
                    setRenameOpen(false)
                }
                onConfirm={(title: string) => {

                    if (!selectedRecording) {
                        return;
                    }

                    updateRecording.mutate({
                        id: selectedRecording.id,
                        data: {
                            title,
                        },
                    });

                    setRenameOpen(false);
                }}
            />

            <ConfirmModal
                isOpen={deleteOpen}
                title="Eliminar grabación"
                message="
    Esta grabación será eliminada.
  "
                danger
                onClose={() =>
                    setDeleteOpen(false)
                }
                onConfirm={() => {

                    if (!selectedRecording) {
                        return;
                    }

                    deleteRecording.mutate(
                        selectedRecording.id
                    );

                    setDeleteOpen(false);
                }}
            />

        </div>
        </MainLayout>
    );
}