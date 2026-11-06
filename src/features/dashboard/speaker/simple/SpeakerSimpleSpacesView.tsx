import MainLayout from "../../../../app/layouts/MainLayout";

import Button from "../../../../shared/components/ui/buttons/Button";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import SpaceCard from "../../../spaces/components/SpaceCard";

import { useOwnedSpaces } from "../../../spaces/hooks/useOwnedSpaces";
import { LayoutGrid, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SpeakerSimpleMeetingsView() {


  const {
    data: spaces = [],
    isLoading,
    error,
  } = useOwnedSpaces();
  const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="space-y-6 ">

        <div
          className="
            bg-[#5B7CF0]
            p-4
            text-white
          "
        >
          <div className="flex justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                Mis Reuniones
              </h1>

              <p>
                Crea y organiza tus grabaciones
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
        </div>

        <div className="px-4 space-y-6">

          <Button
            onClick={() => { navigate("/recording/start"); }}
            fullWidth
            size="lg"
          >
            <Plus />
            Nueva grabación
          </Button>

          <SearchInput
            placeholder="Buscar reunión..."
          />

          {isLoading && (
            <p>
              Cargando reuniones...
            </p>
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