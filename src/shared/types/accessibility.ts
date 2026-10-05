export type NavigationMode =
  | "standard"
  | "simple";

export interface AccessibilitySettings {
  navigationMode: "standard" | "simple";

  visionSupport: boolean;

  scale: number;

  theme: "light" | "dark" | "high-contrast";
}