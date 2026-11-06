import { api, apiFetch } from "../../../api/client";

import type {
  Recording,
  RecordingPageResponse,
  RecordingsFilter,
  SummaryResponse,
  TranscriptResponse,
} from "../types/recordings.types";

export const recordingsService = {
  /* -------------------------------------------------- */
  /* Listado                                              */
  /* -------------------------------------------------- */

  async getRecordings(
    filters?: RecordingsFilter
  ): Promise<Recording[]> {

    const params = new URLSearchParams();

    if (filters?.spaceId) {
      params.append("spaceId", filters.spaceId);
    }

    if (filters?.status) {
      params.append("status",filters.status);
    }

    if (filters?.visibility) {
      params.append("visibility", filters.visibility);
    }

    if (filters?.q) {
      params.append("q", filters.q);
    }

    const query = params.toString();

    const endpoint =
      query.length > 0
        ? `/recordings?${query}`
        : "/recordings";

    const response =
      await api<RecordingPageResponse>(
        endpoint
      );

    return response.items;
  },


  /* -------------------------------------------------- */
  /* Detalle                                              */
  /* -------------------------------------------------- */

  getRecordingById(
    recordingId: string
  ): Promise<Recording> {

    return api<Recording>(
      `/recordings/${recordingId}`
    );
  },

  /* -------------------------------------------------- */
  /* Transcript                                           */
  /* -------------------------------------------------- */

  getTranscript(
    recordingId: string
  ): Promise<TranscriptResponse> {

    return api<TranscriptResponse>(
      `/recordings/${recordingId}/transcript`
    );
  },

  /* -------------------------------------------------- */
  /* Summary                                              */
  /* -------------------------------------------------- */

  getSummary(
    recordingId: string
  ): Promise<SummaryResponse> {

    return api<SummaryResponse>(
      `/recordings/${recordingId}/summary`
    );
  },

  /* -------------------------------------------------- */
  /* Export                                               */
  /* -------------------------------------------------- */

  async exportRecording(
    recordingId: string,
    format: "pdf" | "txt" | "srt"
  ) {

    const response =
      await apiFetch(
        `/recordings/${recordingId}/export?format=${format}`
      );

    return response.blob();
  },

  /* -------------------------------------------------- */
  /* Editar                                               */
  /* -------------------------------------------------- */

  updateRecording(
    recordingId: string,
    data: {
      title?: string;
      visibility?: string;
    }
  ) {

    return api(
      `/recordings/${recordingId}`,
      {
        method: "PATCH",
        json: data,
      }
    );
  },

  /* -------------------------------------------------- */
  /* Eliminar                                             */
  /* -------------------------------------------------- */

  deleteRecording(
    recordingId: string
  ) {

    return api(
      `/recordings/${recordingId}`,
      {
        method: "DELETE",
      }
    );
  },
};
