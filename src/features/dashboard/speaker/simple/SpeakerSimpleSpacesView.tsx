import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";

import MainLayout from "../../../../app/layouts/MainLayout";

import Button from "../../../../shared/components/ui/buttons/Button";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import SpaceCardSimple from "../../../spaces/components/SpaceCardSimple";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";

import { useAuth } from "../../../../contexts/auth/useAuth";
import { useSpaces } from "../../../spaces/hooks/useSpaces";

export default function SpeakerSimpleSpacesView() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search.trim(), 300);

  const {
    data: spaces = [],
    isLoading,
    error,
  } = useSpaces(user?.id ?? "", "speaker", { q });

  return (
    <MainLayout>
      <div className="space-y-6 ">

        <div className="bg-[#5B7CF0] p-4 text-white">
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
            aria-label="Buscar reunión"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isLoading && (
            <p role="status">
              Cargando reuniones...
            </p>
          )}

          {error && (
            <p role="alert" className="text-red-500">
              {error instanceof Error
                ? error.message
                : "Error cargando reuniones"}
            </p>
          )}

          {spaces.map((space) => (
            <SpaceCardSimple
              title={space.name}
              participants={space.memberCounts?.approved ?? 0}
              pendingRequests={space.memberCounts?.pending ?? 0}
              onClick={() => navigate(`/spaces/${space.id}/recordings`)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
