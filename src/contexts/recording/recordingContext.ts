import { createContext } from "react";

export interface RecordingState {
  audioBlob: Blob | null;
  duration: number;
  spaceId: string | null;
  spaceName: string | null;
  inviteCode: string | null;
  recordingId: string | null;
  sessionTitle: string;
  comment: string;
}

export interface RecordingContextType {
  recording: RecordingState;
  setAudioBlob: (blob: Blob | null) => void;
  setDuration: (duration: number) => void;
  setSpaceId: (spaceId: string | null) => void;
  setSpaceName: (spaceName: string | null) => void;
  setInviteCode: (inviteCode: string | null) => void;
  setRecordingId: (recordingId: string | null) => void;
  setSessionTitle: (sessionTitle: string) => void;
  setComment: (comment: string) => void;
  clearRecording: () => void;
}

export const RecordingContext =
  createContext<
    RecordingContextType | undefined>(undefined);