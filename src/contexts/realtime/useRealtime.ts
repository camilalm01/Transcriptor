import { useContext } from "react";

import { RealtimeContext } from "./realtimeContext";

export function useRealtime() {
  const context = useContext(RealtimeContext);

  if (!context) {
    throw new Error("useRealtime debe usarse dentro de RealtimeProvider");
  }
  return context;
}
