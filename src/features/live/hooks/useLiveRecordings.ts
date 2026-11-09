import { useQuery } from "@tanstack/react-query";

import { api } from "../../../api/client";
import { buildQuery } from "../../../api/pagination";
import type { Page } from "../../../api/pagination";
import type { LiveRecordingSummary } from "../types/live.types";

/**
 * Clases que se están grabando ahora y a las que el estudiante tiene acceso.
 * El backend no avisa cuando empieza una clase, por eso se consulta cada 10 s.
 */
export function useLiveRecordings(spaceId?: string) {
  return useQuery({
    queryKey: ["recordings", "live", spaceId ?? "all"],

    queryFn: async () => {
      const page = await api<Page<LiveRecordingSummary>>(
        `/recordings${buildQuery({
          scope: "shared",
          status: "RECORDING",
          spaceId,
          limit: 20,
        })}`
      );
      return page.items.filter((r) => r.liveCaptions && r.space);
    },

    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
}

export function useRecordingSummary(recordingId: string) {
  return useQuery({
    queryKey: ["recordings", "detail", recordingId],
    queryFn: () => api<LiveRecordingSummary>(`/recordings/${recordingId}`),
    enabled: !!recordingId,
  });
}
