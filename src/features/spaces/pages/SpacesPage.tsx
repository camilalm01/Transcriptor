import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";

import { useAuth } from "../../../contexts/auth/useAuth";

import SpeakerSimpleSpacesView from "../../dashboard/speaker/simple/SpeakerSimpleSpacesView";
import SpeakerStandardSpacesView from "../../dashboard/speaker/standard/SpeakerStandardSpacesView";
import ViewerSimpleSpacesView from "../../dashboard/viewer/simple/ViewerSimpleSpacesView";
import ViewerStandardSpacesView from "../../dashboard/viewer/standard/ViewerStandardSpacesView";

export default function SpacesPage() {

  const { role } = useAuth();
  const { settings } = useAccessibility();

  const isSimple =
    settings.navigationMode === "simple";

  if (role === "speaker") {
    return isSimple
      ? <SpeakerSimpleSpacesView />
      : <SpeakerStandardSpacesView />;
  }

  return isSimple
    ? <ViewerSimpleSpacesView />
    : <ViewerStandardSpacesView />;
}