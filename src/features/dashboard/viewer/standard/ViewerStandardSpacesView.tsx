import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";

import MainLayout from "../../../../app/layouts/MainLayout";

import Button from "../../../../shared/components/ui/buttons/Button";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import SpaceCard from "../../../spaces/components/SpaceCard";
import SortSelector from "../../../../shared/components/filters/SortSelector";
import type { SortOption } from "../../../../shared/utils/sortByDate";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";

import { useAuth } from "../../../../contexts/auth/useAuth";
import { useSpaces } from "../../../spaces/hooks/useSpaces";
import JoinSpaceModal from "../../../spaces/components/JoinSpaceModal";
import MembershipRequests from "../../../spaces/components/MembershipRequests";
import LiveNowList from "../../../live/components/LiveNowList";

export default function ViewerStandardSpacesView() {

  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [joinOpen, setJoinOpen] = useState(false);

  const q = useDebouncedValue(search.trim(), 300);

  const {
    data: spaces = [],
    isLoading,
    error,
  } = useSpaces(user?.id ?? "", "viewer", {
    q,
    sort: sort === "newest" ? "createdAt:desc" : "createdAt:asc",
  });

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
          Aquí puedes encontrar las reuniones a las que tienes acceso
        </p>

        <Button
          fullWidth
          size="lg"
          onClick={() => setJoinOpen(true)}
        >
          <Plus />
          Unirse a una reunión
        </Button>

        <LiveNowList />

        <MembershipRequests />

        <SearchInput
          placeholder="Buscar reuniones..."
          aria-label="Buscar reuniones"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SortSelector
          value={sort}
          onChange={setSort}
        />

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

        {!isLoading && !error && spaces.length === 0 && !q && (
          <p className="text-center text-(--text-secondary)">
            Todavía no perteneces a ninguna reunión. Pide el código a tu orador.
          </p>
        )}

        {spaces.map((space) => (
          <SpaceCard
            key={space.id}
            title={space.name}
            secondaryInfo={`Organiza ${space.owner.name}`}
            onClick={() => {
              navigate(`/spaces/${space.id}/recordings`, {
                state: { meetingName: space.name },
              });
            }}
          />
        ))}
      </div>

      <JoinSpaceModal
        isOpen={joinOpen}
        onClose={() => setJoinOpen(false)}
      />
    </MainLayout>
  );
}
