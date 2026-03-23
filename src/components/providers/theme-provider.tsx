"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeKey = "greenlight" | "midnight" | "ember" | "ocean" | "violet";

export interface ThemeColors {
  name: string;
  accent: string;        // Primary accent (e.g. green-500)
  accentHover: string;   // Hover state
  accentMuted: string;   // Muted/subtle
  accentRgb: string;     // RGB values for rgba()
  sidebarBg: string;     // Sidebar glass background
  sidebarActive: string; // Sidebar active item bg
  sidebarHover: string;  // Sidebar hover bg
  sidebarSection: string;// Section label colour
  gradient: string;      // Button gradient
  gradientHover: string; // Button gradient hover
  shadow: string;        // Accent shadow
  ring: string;          // Focus ring
  badge: string;         // Badge/counter bg
  logoOuter: string;     // Logo outer ring
  logoMiddle: string;    // Logo middle ring
  logoInner: string;     // Logo core
  preview: string;       // Preview swatch colour
}

export const themes: Record<ThemeKey, ThemeColors> = {
  greenlight: {
    name: "Greenlight",
    accent: "text-green-400",
    accentHover: "text-green-300",
    accentMuted: "text-green-400/70",
    accentRgb: "34, 197, 94",
    sidebarBg: "rgba(13, 31, 20, 0.8)",
    sidebarActive: "rgba(34, 197, 94, 0.12)",
    sidebarHover: "rgba(34, 197, 94, 0.06)",
    sidebarSection: "rgba(34, 197, 94, 0.4)",
    gradient: "from-green-600 to-green-500",
    gradientHover: "hover:from-green-500 hover:to-green-400",
    shadow: "shadow-green-500/20 hover:shadow-green-500/30",
    ring: "#22c55e",
    badge: "bg-green-600",
    logoOuter: "bg-green-500",
    logoMiddle: "bg-green-500",
    logoInner: "bg-green-500 shadow-green-500/30",
    preview: "#22c55e",
  },
  midnight: {
    name: "Midnight",
    accent: "text-blue-400",
    accentHover: "text-blue-300",
    accentMuted: "text-blue-400/70",
    accentRgb: "96, 165, 250",
    sidebarBg: "rgba(13, 20, 35, 0.8)",
    sidebarActive: "rgba(96, 165, 250, 0.12)",
    sidebarHover: "rgba(96, 165, 250, 0.06)",
    sidebarSection: "rgba(96, 165, 250, 0.4)",
    gradient: "from-blue-600 to-blue-500",
    gradientHover: "hover:from-blue-500 hover:to-blue-400",
    shadow: "shadow-blue-500/20 hover:shadow-blue-500/30",
    ring: "#60a5fa",
    badge: "bg-blue-600",
    logoOuter: "bg-blue-500",
    logoMiddle: "bg-blue-500",
    logoInner: "bg-blue-500 shadow-blue-500/30",
    preview: "#60a5fa",
  },
  ember: {
    name: "Ember",
    accent: "text-orange-400",
    accentHover: "text-orange-300",
    accentMuted: "text-orange-400/70",
    accentRgb: "251, 146, 60",
    sidebarBg: "rgba(35, 20, 13, 0.8)",
    sidebarActive: "rgba(251, 146, 60, 0.12)",
    sidebarHover: "rgba(251, 146, 60, 0.06)",
    sidebarSection: "rgba(251, 146, 60, 0.4)",
    gradient: "from-orange-600 to-orange-500",
    gradientHover: "hover:from-orange-500 hover:to-orange-400",
    shadow: "shadow-orange-500/20 hover:shadow-orange-500/30",
    ring: "#fb923c",
    badge: "bg-orange-600",
    logoOuter: "bg-orange-500",
    logoMiddle: "bg-orange-500",
    logoInner: "bg-orange-500 shadow-orange-500/30",
    preview: "#fb923c",
  },
  ocean: {
    name: "Ocean",
    accent: "text-teal-400",
    accentHover: "text-teal-300",
    accentMuted: "text-teal-400/70",
    accentRgb: "45, 212, 191",
    sidebarBg: "rgba(13, 31, 30, 0.8)",
    sidebarActive: "rgba(45, 212, 191, 0.12)",
    sidebarHover: "rgba(45, 212, 191, 0.06)",
    sidebarSection: "rgba(45, 212, 191, 0.4)",
    gradient: "from-teal-600 to-teal-500",
    gradientHover: "hover:from-teal-500 hover:to-teal-400",
    shadow: "shadow-teal-500/20 hover:shadow-teal-500/30",
    ring: "#2dd4bf",
    badge: "bg-teal-600",
    logoOuter: "bg-teal-500",
    logoMiddle: "bg-teal-500",
    logoInner: "bg-teal-500 shadow-teal-500/30",
    preview: "#2dd4bf",
  },
  violet: {
    name: "Violet",
    accent: "text-violet-400",
    accentHover: "text-violet-300",
    accentMuted: "text-violet-400/70",
    accentRgb: "167, 139, 250",
    sidebarBg: "rgba(25, 13, 35, 0.8)",
    sidebarActive: "rgba(167, 139, 250, 0.12)",
    sidebarHover: "rgba(167, 139, 250, 0.06)",
    sidebarSection: "rgba(167, 139, 250, 0.4)",
    gradient: "from-violet-600 to-violet-500",
    gradientHover: "hover:from-violet-500 hover:to-violet-400",
    shadow: "shadow-violet-500/20 hover:shadow-violet-500/30",
    ring: "#a78bfa",
    badge: "bg-violet-600",
    logoOuter: "bg-violet-500",
    logoMiddle: "bg-violet-500",
    logoInner: "bg-violet-500 shadow-violet-500/30",
    preview: "#a78bfa",
  },
};

interface ThemeContextType {
  theme: ThemeKey;
  colors: ThemeColors;
  setTheme: (theme: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "greenlight",
  colors: themes.greenlight,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>("greenlight");

  useEffect(() => {
    const saved = localStorage.getItem("greenlight_theme") as ThemeKey | null;
    if (saved && themes[saved]) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (t: ThemeKey) => {
    setThemeState(t);
    localStorage.setItem("greenlight_theme", t);
  };

  // Apply CSS variables for the active theme
  useEffect(() => {
    const c = themes[theme];
    document.documentElement.style.setProperty("--accent-rgb", c.accentRgb);
    document.documentElement.style.setProperty("--accent-ring", c.ring);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, colors: themes[theme], setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
