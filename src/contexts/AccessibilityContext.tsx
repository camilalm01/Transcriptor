import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import type {
  AccessibilitySettings,
  NavigationMode,
} from "../shared/types/accessibility";

interface AccessibilityContextType {
  settings: AccessibilitySettings;

  setNavigationMode: ( mode: NavigationMode) => void;

  toggleVisionSupport: () => void;

  setScale: ( scale: number) => void;

  setTheme: ( theme: "light" | "dark" | "high-contrast") => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

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
    useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem("accessibility-settings");

    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

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

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility debe utilizarse dentro de AccessibilityProvider"
    );
  }

  return context;
}