import { api } from "../../../api/client";

import type {
  CreateRecordingResponse,
  FinishRecordingRequest,
  StartRecordingRequest,
  StartRecordingResponse,
  UploadChunkRequest,
  UploadRecordingRequest,
} from "../types/recording.types";

export const recordingService = {

  /* ------------------------------------------ */
  /* Flujo actual (blob completo)               */
  /* ------------------------------------------ */

  async uploadRecording({
    audioBlob,
    spaceId,
    title,
  }: UploadRecordingRequest) {

    const recording =
      await api<CreateRecordingResponse>(
        "/recordings/upload",
        {
          method: "POST",
          json: {
            title,
            spaceId,
            consent: true,
          },
        }
      );

    await api(
      `/recordings/${recording.id}/file`,
      {
        method: "PUT",
        body: audioBlob,
        headers: {
          "Content-Type":
            audioBlob.type ||
            "audio/webm",
        },
      }
    );

    return recording.id;
  },

  /* ------------------------------------------ */
  /* Futuro: grabación en vivo por chunks       */
  /* ------------------------------------------ */

  startRecording(
    data: StartRecordingRequest
  ) {
    return api<StartRecordingResponse>(
      "/recordings",
      {
        method: "POST",
        json: data,
      }
    );
  },

  uploadChunk({
    recordingId,
    sequence,
    chunk,
  }: UploadChunkRequest) {

    return api(
      `/recordings/${recordingId}/chunks/${sequence}`,
      {
        method: "PUT",
        body: chunk,
        headers: {
          "Content-Type":
            chunk.type ||
            "audio/webm",
        },
      }
    );
  },

  finishRecording({
    recordingId,
    lastSeq,
  }: FinishRecordingRequest) {

    return api(
      `/recordings/${recordingId}/finish`,
      {
        method: "POST",
        json: {
          lastSeq,
        },
      }
    );
  },
};