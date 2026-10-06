import { createContext } from "react";

import type {
  AccessibilitySettings,
  NavigationMode,
} from "../../shared/types/accessibility";

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setNavigationMode: (mode: NavigationMode) => void;
  toggleVisionSupport: () => void;
  setScale: (scale: number) => void;
  setTheme: (theme: "light" | "dark" | "high-contrast") => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);
