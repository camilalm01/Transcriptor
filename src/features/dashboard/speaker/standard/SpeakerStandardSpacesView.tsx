import MainLayout from "../../../../app/layouts/MainLayout";

import Button from "../../../../shared/components/ui/buttons/Button";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";

import SortSelector from "../../../../shared/components/filters/SortSelector";
import {
    sortByDate,
    type SortOption,
} from "../../../../shared/utils/sortByDate";

import type {
    DateRange,
} from "../../../../shared/components/calendar/WeekRangeCalendar";
import WeekRangePicker from "../../../../shared/components/calendar/WeekRangePicker";
import { useOwnedSpaces } from "../../../spaces/hooks/useOwnedSpaces";
import SpaceCard from "../../../spaces/components/SpaceCard";

export default function SpeakerStandardSpacesView() {

    const navigate = useNavigate();
    const [
        selectedWeek,
        setSelectedWeek,
    ] = useState<DateRange>({
        startDate: null,
        endDate: null,
    });

    const isDateInRange = (
        date: Date,
        startDate: Date,
        endDate: Date
    ) => {

        const target = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        target.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return (
            target >= start &&
            target <= end
        );
    };
     const [search, setSearch] = useState("");

    const {
        data: spaces = [],
        isLoading,
        error,
    } = useOwnedSpaces({ q: search });


    const filteredSpaces =
        selectedWeek.startDate &&
            selectedWeek.endDate
            ? spaces.filter(
                (space) =>
                    isDateInRange(
                        new Date(
                            space.createdAt
                        ),
                        selectedWeek.startDate!,
                        selectedWeek.endDate!
                    )
            )
            : spaces;

    const hasNoResults =
        selectedWeek.startDate &&
        selectedWeek.endDate &&
        filteredSpaces.length === 0;

    const [sort, setSort] = useState<SortOption>("newest");
    const sortedSpaces =
        sortByDate(
            hasNoResults
                ? spaces
                : filteredSpaces,
            sort
        );
   

    return (
        <MainLayout>
            <div className="p-4 space-y-6">

                <div className="flex justify-between items-start py-2">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Mis Reuniones
                        </h1>

                        <p className="text-(--text-secondary) text-sm">
                            Organiza tus grabaciones en reuniones.
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

                    <p
                        className=" text-center text-sm text-(--text-secondary)"
                    >
                        Inicia una grabación y guárdala en una reunión
                    </p>
                </div>

                <SearchInput
                    placeholder="Buscar reuniones..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
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
                    <p>Cargando reuniones...</p>
                )}

                {error && (
                    <p className="text-red-500">
                        {error instanceof Error
                            ? error.message
                            : "Error cargando reuniones"}
                    </p>
                )}

                {hasNoResults && (
                    <div
                        className="
                            rounded-2xl
                            border
                            border-yellow-300
                            bg-yellow-50
                            p-4
                            text-yellow-700
                            "
                    >
                        No existen reuniones en el rango seleccionado.
                    </div>
                )}

                {sortedSpaces.map((space) => (
                    <SpaceCard
                        key={space.id}
                        title={space.name}
                        recordingCount={0}
                        memberCount={0}
                        secondaryInfo={
                            new Date(
                                space.createdAt
                            ).toLocaleDateString()
                        }
                        onClick={() =>
                            navigate(
                                `/spaces/${space.id}/recordings`
                            )
                        }
                    />
                ))}
            </div>
        </MainLayout>
    );
}