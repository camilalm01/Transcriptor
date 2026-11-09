import { useMemo } from "react";
import { useRecordings } from "./useRecordings";

import {
  isDraft,
  isProcessing,
  isPublished,
} from "../utils/recordingFilters";

import type {
  RecordingTab,
} from "../types/recordings.types";

interface Params {
  spaceId: string;
  tab: RecordingTab;
  search?: string;
}

export function useFilteredRecordings({
  spaceId,
  tab,
  search,
}: Params) {
  const {
    data: recordings = [],
    isLoading,
    error,
  } = useRecordings({
    spaceId,
    q: search,
  });

  const filtered = useMemo(() => {
    switch (tab) {
      case "published":
        return recordings.filter(
          isPublished
        );

      case "draft":
        return recordings.filter(
          isDraft
        );

      case "processing":
        return recordings.filter(
          isProcessing
        );

      default:
        return recordings;
    }
  }, [recordings, tab]);

  return {
    recordings: filtered,
    isLoading,
    error,
  };
}