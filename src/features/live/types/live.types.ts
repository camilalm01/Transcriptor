export interface CaptionSegment {
  /** segundos desde el inicio de la grabación */
  start: number;
  end: number;
  text: string;
}

export interface CaptionEvent {
  recordingId: string;
  seq: number;
  segments: CaptionSegment[];
}

export type LiveStatus =
  | "connecting"
  | "live"
  | "ended"
  | "disabled"
  | "error";

export interface LiveRecordingSummary {
  id: string;
  title: string;
  owner: { id: string; name: string };
  space: { id: string; name: string } | null;
  status: string;
  liveCaptions: boolean;
  startedAt: string;
}

export interface TranscriptResponse {
  segments: CaptionSegment[];
  text: string;
}
