import { useEffect, useRef, useState } from "react";
import { useMotion } from "./motion";

export default function FamilyScene({ label }: { label: string }) {
  const { enabled } = useMotion();
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  const playing = enabled && visible && pageVisible;
  return (
    <div ref={ref} className="family-scene" role="img" aria-label={label}
      data-playing={playing} data-scene-fps="24" data-scene-duration="2500">
      <span className="family-ground" aria-hidden="true" />
      <img src={`/assets/cast/arth-gon-pitou-${playing ? "loop" : "still"}.webp`}
        alt="" width="300" height="260" draggable={false} />
    </div>
  );
}
