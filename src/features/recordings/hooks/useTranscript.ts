import { useQuery } from "@tanstack/react-query";

import { recordingsService }
  from "../services/recordingsService";

export function useTranscript(
  recordingId?: string
) {
  return useQuery({
    queryKey: [
      "transcript",
      recordingId,
    ],

    queryFn: () =>
      recordingsService.getTranscript(
        recordingId!
      ),

    enabled: !!recordingId,
  });
}