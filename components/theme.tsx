import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemePreference = "system" | "light" | "dark";
export const themeStorageKey = "arthursens-theme";
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}
const ThemeContext = createContext({
  preference: "system" as ThemePreference,
  setPreference: (_preference: ThemePreference) => {},
});
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setState] = useState<ThemePreference>("system");
  const apply = (value: ThemePreference) => {
    if (value === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset.theme = value;
    setState(value);
  };
  useEffect(() => {
    try {
      const stored = localStorage.getItem(themeStorageKey);
      apply(isThemePreference(stored) ? stored : "system");
    } catch { apply("system"); }
    const onStorage = (event: StorageEvent) => {
      if (event.key === themeStorageKey || event.key === null)
        apply(isThemePreference(event.newValue) ? event.newValue : "system");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const setPreference = (value: ThemePreference) => {
    apply(value);
    try {
      if (value === "system") localStorage.removeItem(themeStorageKey);
      else localStorage.setItem(themeStorageKey, value);
    } catch { /* The theme still works when browser storage is unavailable. */ }
  };
  return <ThemeContext.Provider value={{ preference, setPreference }}>{children}</ThemeContext.Provider>;
}
export function useTheme() { return useContext(ThemeContext); }
