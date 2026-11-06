import MainLayout from "../../../../app/layouts/MainLayout";

import Button from "../../../../shared/components/ui/buttons/Button";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import { useState } from "react";
import { LayoutGrid, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SortSelector from "../../../../shared/components/filters/SortSelector";
import {
  sortByDate,
  type SortOption,
} from "../../../../shared/utils/sortByDate";
import SpaceCard from "../../../spaces/components/SpaceCard";
import { useMemberSpaces } from "../../../spaces/hooks/useMemberSpaces";


export default function ViewerStandardMeetingsView() {

  const navigate = useNavigate();


  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const {
    data: spaces = [],
    isLoading,
    error,
  } = useMemberSpaces();

  const sortedSpaces =
    sortByDate(
      spaces,
      sort
    );

  return (
    <MainLayout>
      <div className="p-4 space-y-6">

        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">
            Bienvenido
          </h1>

          <Button
            onClick={() => { navigate("/roles"); }}
            variant="secondary"
          >
            <LayoutGrid />
            Rol
          </Button>
        </div>

        <p className="text-(--text-secondary) text-sm text-center">
          Aquí puedes encontrar las sesiones a las que tienes acceso
        </p>


        <Button
          onClick={() => { navigate("/spaces/join"); }}
          fullWidth
          size="lg"
        >
          <Plus />
          Unirse a nueva reunion
        </Button>

        <SearchInput
          placeholder="Buscar reuniones..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
        <SortSelector
          value={sort}
          onChange={setSort}
        />

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

        {sortedSpaces.map(
          (space) => (
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
              onClick={() => {
                navigate(`/spaces/${space.id}/recordings`,
                  {
                    state: {
                      meetingName: space.name,
                      meetingCode: space.invite?.code,
                    }
                  }
                );
              }}
            />
          )
        )}
      </div>
    </MainLayout>
  );
}