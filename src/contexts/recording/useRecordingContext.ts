import { useContext } from "react";

import { RecordingContext } from "./recordingContext";

export function useRecordingContext() {

  const context = useContext( RecordingContext);
  if (!context) {
    throw new Error(
      "useRecordingContext debe utilizarse dentro de RecordingProvider"
    );
  }
  return context;
}