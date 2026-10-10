import { createContext, useContext, useEffect, useState } from "react";

const MotionContext = createContext({ enabled: false });

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <MotionContext.Provider value={{ enabled }}>
      <div data-motion={enabled ? "on" : "off"}>{children}</div>
    </MotionContext.Provider>
  );
}
export const useMotion = () => useContext(MotionContext);
