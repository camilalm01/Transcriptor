import { useQuery } from "@tanstack/react-query";

import { recordingsService }
  from "../services/recordingsService";

export function useRecordingDetails(
  recordingId?: string
) {
  return useQuery({
    queryKey: ["recording", recordingId],
    queryFn: () => recordingsService.getRecordingById(recordingId!),
    enabled: !!recordingId,
  });
}