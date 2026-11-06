import MainLayout from "../../../../app/layouts/MainLayout";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput"; 
import Button from "../../../../shared/components/ui/buttons/Button";

import SpaceCard from "../../../spaces/components/SpaceCard";
import { LayoutGrid, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemberSpaces } from "../../../spaces/hooks/useMemberSpaces";

export default function ViewerSimpleMeetingsView() {

  const navigate = useNavigate();

  const {
    data: spaces = [],
    isLoading,
    error,
  } = useMemberSpaces();

  return (
    <MainLayout>
      <div className="space-y-6">

        <div
          className="
            bg-[#5B7CF0]
            p-6
            text-white
          "
        >
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
        </div>

        <div className="px-4 space-y-6">

          <Button
            fullWidth
            size="lg"
            onClick={() => { navigate("/spaces/join"); }}
          >
            <Plus />
            Unirse a nueva sesión
          </Button>

          <SearchInput
            placeholder="Buscar reuniones..."
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

          {spaces.map((space) => (
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
      </div>
    </MainLayout>
  );
}
                  