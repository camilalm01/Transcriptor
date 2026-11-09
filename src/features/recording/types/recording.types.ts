export interface UploadRecordingRequest {
  audioBlob: Blob;

  spaceId: string;

  title: string;
}

export interface CreateRecordingResponse {
  id: string;
}

export interface StartRecordingRequest {
  spaceId: string;

  title: string;

  consent: boolean;

  /** Difundir subtítulos en vivo a los miembros del espacio */
  liveCaptions?: boolean;
}

export interface StartRecordingResponse {
  recording: {
    id: string;
  };

  chunkSeconds: number;

  maxChunks: number;

  uploadUrlTemplate: string;
}

export interface UploadChunkRequest {
  recordingId: string;

  sequence: number;

  chunk: Blob;
}

export interface FinishRecordingRequest {
  recordingId: string;
    lastSeq: number;
}