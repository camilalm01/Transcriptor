import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import SpaceInfoCard from "../../../recordings/components/SpaceInfoCard";
import RecordingCardSimple from "../../../recordings/components/RecordingCardSimple";

import { useRecordings } from "../../../recordings/hooks/useRecordings";
import { useSpace } from "../../../spaces/hooks/useSpace";

import type {
  Recording,
} from "../../../recordings/types/recordings.types";

export default function ViewerSimpleRecordingsView() {
  const navigate = useNavigate();
  const { spaceId } = useParams();

  const [search, setSearch] =
    useState("");

  const { data: space } =
    useSpace(spaceId);

  const {
    data: recordings = [],
    isLoading,
  } = useRecordings({
    spaceId,
    visibility: "PUBLISHED",
    q: search,
  });

  console.log(recordings);

  if (!spaceId) {
    return null;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">

      <SpaceInfoCard
        spaceCode={
          space?.invite?.code ?? "----"
        }
      />

      <SearchInput
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Buscar grabaciones..."
      />

      <h2
        className="
          text-2xl
          font-bold
        "
      >
        Sesiones
      </h2>

      <div className="space-y-3">
        {recordings.map(
          (
            recording: Recording
          ) => (
            <RecordingCardSimple
              key={recording.id}
              recording={recording}
              onOpen={() =>
                navigate(
                  `/recordings/${recording.id}/details`
                )
              }
            />
          )
        )}
      </div>

    </div>
  );
}