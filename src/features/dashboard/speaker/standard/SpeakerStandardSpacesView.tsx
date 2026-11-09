import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";

import MainLayout from "../../../../app/layouts/MainLayout";

import Button from "../../../../shared/components/ui/buttons/Button";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import SpaceCard from "../../../spaces/components/SpaceCard";
import SortSelector from "../../../../shared/components/filters/SortSelector";
import type { SortOption } from "../../../../shared/utils/sortByDate";
import WeekRangePicker from "../../../../shared/components/calendar/WeekRangePicker";
import type { DateRange } from "../../../../shared/components/calendar/WeekRangeCalendar";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";

import { useAuth } from "../../../../contexts/auth/useAuth";
import { useSpaces } from "../../../spaces/hooks/useSpaces";
import type { Space } from "../../../spaces/types/spaces.types";

import { useSpaceActions } from "../../../spaces/hooks/useSpaceActions";
import RenameModal from "../../../../shared/components/ui/modals/RenameModal";
import ConfirmModal from "../../../../shared/components/ui/modals/ConfirmModal";

const isDateInRange = (date: Date, startDate: Date, endDate: Date) => {
    const target = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    target.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return target >= start && target <= end;
};

const describeSpace = (space: Space) => {
    const parts = [new Date(space.createdAt).toLocaleDateString()];

    if (space.memberCounts) {
        parts.push(`${space.memberCounts.approved} participantes`);
        if (space.memberCounts.pending > 0) {
            parts.push(`${space.memberCounts.pending} solicitudes`);
        }
    }
    return parts.join(" · ");
};

export default function SpeakerStandardSpacesView() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("newest");
    const [selectedWeek, setSelectedWeek] = useState<DateRange>({
        startDate: null,
        endDate: null,
    });
    const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
    const [renameOpen, setRenameOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const {updateSpace, deleteSpace} = useSpaceActions();
    
    const q = useDebouncedValue(search.trim(), 300);

    const {
        data: meetings = [],
        isLoading,
        error,
    } = useSpaces(user?.id ?? "", "speaker", {
        q,
        sort: sort === "newest" ? "createdAt:desc" : "createdAt:asc",
    });

    const filteredMeetings =
        selectedWeek.startDate && selectedWeek.endDate
            ? meetings.filter((space) =>
                isDateInRange(
                    new Date(space.createdAt),
                    selectedWeek.startDate!,
                    selectedWeek.endDate!
                )
            )
            : meetings;

    const hasNoResults =
        selectedWeek.startDate &&
        selectedWeek.endDate &&
        filteredMeetings.length === 0;

    return (
        <MainLayout>
            <div className="p-4 space-y-6">

                <div className="flex justify-between items-start py-2">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Mis Reuniones
                        </h1>

                        <p className="text-(--text-secondary) text-sm">
                            Crea sesiones para organizar tus grabaciones
                        </p>
                    </div>

                    <Button
                        onClick={() => { navigate("/roles"); }}
                        variant="secondary"
                    >
                        <LayoutGrid />
                        Rol
                    </Button>
                </div>

                <div className="space-y-1">
                    <Button
                        onClick={() => { navigate("/recording/start"); }}
                        fullWidth
                        size="lg"
                        icon={Plus}
                    >
                        Nueva grabación
                    </Button>

                    <p className=" text-center text-sm text-(--text-secondary)">
                        Inicia una grabación y guárdala en una reunión
                    </p>
                </div>

                <SearchInput
                    placeholder="Buscar reunión..."
                    aria-label="Buscar reunión"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <p className="font-bold text-md">Rango de fechas</p>

                <WeekRangePicker
                    value={selectedWeek}
                    onChange={setSelectedWeek}
                />

                <div className=" flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        Reuniones
                    </h2>
                    <SortSelector
                        value={sort}
                        onChange={setSort}
                    />
                </div>

                {isLoading && (
                    <p role="status">Cargando reuniones...</p>
                )}

                {error && (
                    <p role="alert" className="text-red-500">
                        {error instanceof Error
                            ? error.message
                            : "Error cargando reuniones"}
                    </p>
                )}

                {hasNoResults && (
                    <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-yellow-700">
                        No existen reuniones en el rango seleccionado.
                    </div>
                )}

                {!isLoading && !error && meetings.length === 0 && !q && (
                    <p className="text-center text-(--text-secondary)">
                        Aún no tienes reuniones. Crea una con "Nueva grabación".
                    </p>
                )}

                {(hasNoResults ? meetings : filteredMeetings).map((space) => (
                    <SpaceCard
                        key={space.id}
                        title={space.name}
                        secondaryInfo={describeSpace(space)}
                        onManage={() =>
                            navigate(`/spaces/${space.id}/members`)
                        }
                        onClick={() =>
                            navigate(`/spaces/${space.id}/recordings`)
                        }
                        onRename={() => {
                            setSelectedSpace(space);
                            setRenameOpen(true);
                        }}
                        onDelete={() => {
                            setSelectedSpace(space);
                            setDeleteOpen(true);
                        }}
                    />
                ))}
            </div>
            <RenameModal
    isOpen={renameOpen}
    defaultValue={selectedSpace?.name}
    onClose={() => setRenameOpen(false)}
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
    onClose={() => setDeleteOpen(false)}
    onConfirm={() => {
        if (!selectedSpace) {
            return;
        }

        deleteSpace.mutate(
            selectedSpace.id
        );

        setDeleteOpen(false);
    }}
/>
        </MainLayout>
    );
}
