import { useState } from "react";
import type { ReactNode } from "react";

import {
  RecordingContext,
  type RecordingState,
} from "./recordingContext";

interface RecordingProviderProps {
  children: ReactNode;
}

const initialState: RecordingState = {
  audioBlob: null,
  duration: 0,
  spaceId: null,
  spaceName: null,
  inviteCode: null,
  recordingId: null,
  sessionTitle: "",
  comment: "",
};

export function RecordingProvider({
  children,
}: RecordingProviderProps) {

  const [recording, setRecording ] = useState<RecordingState>(initialState);

  const setAudioBlob = (audioBlob: Blob | null
  ) => {
    setRecording((prev) => ({
      ...prev,
      audioBlob,
    }));
  };

  const setDuration = ( duration: number
  ) => {

    setRecording((prev) => ({
      ...prev,
      duration,
    }));
  };

  const setSpaceId = (spaceId: string | null
  ) => {
    setRecording((prev) => ({
      ...prev,
      spaceId,
    }));
  };

  const setSpaceName = ( spaceName: string | null
  ) => {
    setRecording((prev) => ({
      ...prev,
      spaceName,
    }));
  };

  const setInviteCode = ( inviteCode: string | null
  ) => {
    setRecording((prev) => ({
      ...prev,
      inviteCode,
    }));
  };

  const setRecordingId = (
    recordingId: string | null
  ) => {
    setRecording((prev) => ({
      ...prev,
      recordingId,
    }));
  };

  const setSessionTitle = ( sessionTitle: string
  ) => {
    setRecording((prev) => ({
      ...prev,
      sessionTitle,
    }));
  };

  const setComment = ( comment: string
  ) => {
    setRecording((prev) => ({
      ...prev,
      comment,
    }));
  };

  const clearRecording = () => { setRecording(initialState);};

  return (
    <RecordingContext.Provider
      value={{
        recording,
        setAudioBlob,
        setDuration,
        setSpaceId,
        setSpaceName,
        setInviteCode,
        setRecordingId,
        setSessionTitle,
        setComment,
        clearRecording,
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
}