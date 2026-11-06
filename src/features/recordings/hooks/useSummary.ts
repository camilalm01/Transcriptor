import { useQuery } from "@tanstack/react-query";

import { recordingsService } from "../services/recordingsService";

export function useSummary(
  recordingId?: string
) {
  return useQuery({
    queryKey: ["summary", recordingId ],

    queryFn: () =>
      recordingsService.getSummary(
        recordingId!
      ),

    enabled: !!recordingId,
  });
}