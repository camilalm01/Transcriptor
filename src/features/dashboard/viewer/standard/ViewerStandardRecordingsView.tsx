import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../../../app/layouts/MainLayout";
import Header from "../../../../shared/components/ui/navigation/Header";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";

import SortSelector from "../../../../shared/components/filters/SortSelector";
import {
  sortByDate,
  type SortOption,
} from "../../../../shared/utils/sortByDate";

import { useRecordings } from "../../../../features/recordings/hooks/useRecordings";
import RecordingCard from "../../../../features/recordings/components/RecordingCard";

export default function ViewerStandardRecordingsView() {

  const navigate = useNavigate();
  const { spaceId } = useParams();

  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const {
      data: recordings = [],
      isLoading,
      error,
    } = useRecordings({
      spaceId,
      q: search,
    });

  const sortedRecordings =
    sortByDate(
      recordings,
      sort
    );

  return (
    <MainLayout>

      <div className="p-4 space-y-6">

        <Header
          title="Grabaciones"
          showBackButton
        />

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
          <p>
            Cargando grabaciones...
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error instanceof Error
              ? error.message
              : "Error cargando grabaciones"}
          </p>
        )}

        {sortedRecordings.map(
          (recording) => (
            <RecordingCard
              key={recording.id}
              recording={recording}
              onClick={() =>
                navigate(
                  `/recordings/${recording.id}`
                )
              }
            />
          )
        )}

      </div>

    </MainLayout>
  );
}