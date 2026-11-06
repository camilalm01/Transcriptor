import { useAuth } from "../../../contexts/auth/useAuth";
import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";

import SpeakerStandardRecordingsView from "../../dashboard/speaker/standard/SpeakerStandardRecordingsView";
import SpeakerSimpleRecordingsView from "../../dashboard/speaker/simple/SpeakerSimpleRecordingsView";
import ViewerStandardRecordingsView from "../../dashboard/viewer/standard/ViewerStandardRecordingsView";
import ViewerSimpleRecordingsView from "../../dashboard/viewer/simple/ViewerSimpleRecordingsView";

export default function RecordingsPage() {

  const { role } = useAuth();

  const { settings } =  useAccessibility();

  const isSimple =
    settings.navigationMode ===
    "simple";

  if (role === "speaker") {
    return isSimple
      ? <SpeakerSimpleRecordingsView />
      : <SpeakerStandardRecordingsView />;
  }

  return isSimple
    ? <ViewerSimpleRecordingsView />
    : <ViewerStandardRecordingsView />;
}