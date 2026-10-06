import {
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import type { AccessibilitySettings, NavigationMode } from "../../shared/types/accessibility";
import { AccessibilityContext } from "./accessibilityContextValue";

interface Props {
  children: ReactNode;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  navigationMode: "standard",
  visionSupport: false,
  scale: 100,
  theme: "light",
};

export function AccessibilityProvider({
  children,
}: Props) {
  const [settings, setSettings] =
  useState<AccessibilitySettings>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS;
    }

    const saved = window.localStorage.getItem(
      "accessibility-settings"
    );

    if (!saved) {
      return DEFAULT_SETTINGS;
    }

    try {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  const setNavigationMode = (
    mode: NavigationMode
  ) => {
    setSettings((prev) => ({
      ...prev,
      navigationMode: mode,
    }));
  };

  const setScale = (
    scale: number
  ) => {
    setSettings((prev) => ({
      ...prev,
      scale,
    }));
  };

  const setTheme = (
    theme: "light" | "dark" | "high-contrast"
  ) => {
    setSettings((prev) => ({
      ...prev,
      theme,
    }));
  };

  const toggleVisionSupport =
    () => {
      setSettings((prev) => ({
        ...prev,

        visionSupport:
          !prev.visionSupport,

        scale:
          !prev.visionSupport
            ? 125
            : 100,

        theme:
          !prev.visionSupport
            ? "high-contrast"
            : "light",
      }));
    };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        setNavigationMode,
        toggleVisionSupport,
        setScale,
        setTheme,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}
