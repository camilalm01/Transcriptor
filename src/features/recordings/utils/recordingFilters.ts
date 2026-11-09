import type {
  Recording,
  RecordingTab,
} from "../types/recordings.types";

export function isPublished(
  recording: Recording
) {
  return (
    recording.status === "READY" &&
    recording.visibility === "PUBLISHED"
  );
}

export function isDraft(
  recording: Recording
) {
  return (
    recording.status === "READY" &&
    recording.visibility === "PRIVATE"
  );
}

export function isProcessing(
  recording: Recording
) {
  return [
    "RECORDING",
    "UPLOADED",
    "TRANSCRIBING",
    "SUMMARIZING",
  ].includes(recording.status);
}

export function filterRecordings(
  recordings: Recording[],
  tab: RecordingTab
) {
  switch (tab) {
    case "published":
      return recordings.filter(
        isPublished
      );

    case "draft":
      return recordings.filter(
        isDraft
      );

    case "processing":
      return recordings.filter(
        isProcessing
      );

    default:
      return recordings;
  }
}