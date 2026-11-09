import {
  useMemo,
  useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";
import SearchInput from "../../../../shared/components/ui/forms/SearchInput";
import SortSelector from "../../../../shared/components/filters/SortSelector";

import type {
  SortOption,
} from "../../../../shared/utils/sortByDate";

import RecordingCardStandard from "../../../recordings/components/RecordingCardStandard";
import { useRecordings } from "../../../recordings/hooks/useRecordings";
import type {
  Recording,
} from "../../../recordings/types/recordings.types";


export default function ViewerStandardRecordingsView() {

  const navigate = useNavigate();
  const { spaceId } = useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const {
    data: recordings = [],
    isLoading,
  } = useRecordings({
    spaceId,
    q: search,
  });

  console.log(recordings);
  const sorted =
    useMemo(() => {

      const data = [...recordings,];

      data.sort((a, b) =>
        sort === "newest"
          ? Date.parse(
            b.createdAt
          ) -
          Date.parse(
            a.createdAt
          )
          : Date.parse(
            a.createdAt
          ) -
          Date.parse(
            b.createdAt
          )
      );

      return data;

    }, [
      recordings,
      sort,
    ]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-5">

      <SearchInput
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Buscar grabaciones..."
      />

      <div
        className="
          flex
          justify-end
        "
      >
        <SortSelector
          value={sort}
          onChange={setSort}
        />
      </div>

      <div className="space-y-3">
        {sorted.map(
          (
            recording: Recording
          ) => (
            <RecordingCardStandard
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