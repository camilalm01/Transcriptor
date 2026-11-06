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
}

export interface StartRecordingResponse {
  id: string;
}

export interface UploadChunkRequest {
  recordingId: string;

  sequence: number;

  chunk: Blob;
}

export interface FinishRecordingRequest {
  recordingId: string;
}