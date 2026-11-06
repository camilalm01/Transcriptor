import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../../../app/layouts/MainLayout";
import Header from "../../../../shared/components/ui/navigation/Header";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";

import { useRecordings } from "../../../../features/recordings/hooks/useRecordings";
import RecordingCard from "../../../../features/recordings/components/RecordingCard";

export default function ViewerSimpleRecordingsView() {

  const navigate = useNavigate();

  const { spaceId } = useParams();

  const [search, setSearch ] = useState("");

  const {
    data: recordings = [],
    isLoading,
    error,
  } = useRecordings({
    spaceId,
    q: search,
  });

  return (
    <MainLayout>

      <div className="p-6 space-y-6">

        <Header
          title="Grabaciones"
          showBackButton
        />

        <SearchInput
          placeholder="Buscar grabación..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        {isLoading && (
          <p>
            Cargando...
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error instanceof Error
              ? error.message
              : "Error cargando grabaciones"}
          </p>
        )}

        {recordings.map(
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