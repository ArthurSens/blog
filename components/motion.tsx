import { createContext, useContext, useEffect, useState } from "react";

const MotionContext = createContext({ enabled: false, toggle: () => {} });

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("arthur-motion");
      } catch {}
      setEnabled(!media.matches && saved !== "off");
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const toggle = () =>
    setEnabled((current) => {
      try {
        localStorage.setItem("arthur-motion", current ? "off" : "on");
      } catch {}
      return !current;
    });
  return (
    <MotionContext.Provider value={{ enabled, toggle }}>
      <div data-motion={enabled ? "on" : "off"}>{children}</div>
    </MotionContext.Provider>
  );
}
export const useMotion = () => useContext(MotionContext);
