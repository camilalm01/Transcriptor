import { useQuery } from "@tanstack/react-query";
import { recordingsService } from "../../recordings/services/recordingsService";
import type {
  RecordingsFilter,
} from "../types/recordings.types";


export function useRecordings(
  filters?: RecordingsFilter
) {
  return useQuery({
    queryKey: ["recordings", filters],

    queryFn: () =>
      recordingsService.getRecordings(
        filters
      ),
  });
}