import { useEffect, useRef, useState } from "react";
import { useMotion } from "./motion";

// A long cozy pause, two laps, a small scuffle, and a gentle reconciliation.
const story = [
  { frame: 0, duration: 6000, phase: "rest" },
  ...Array.from({ length: 2 }, () => [1, 2, 3, 4].map((frame) => ({ frame, duration: 240, phase: "chase" }))).flat(),
  { frame: 5, duration: 350, phase: "catch" },
  { frame: 6, duration: 550, phase: "tussle" },
  { frame: 7, duration: 600, phase: "surprise" },
  { frame: 8, duration: 700, phase: "reach" },
  { frame: 9, duration: 800, phase: "separate" },
  { frame: 10, duration: 1300, phase: "settle" },
  { frame: 11, duration: 4000, phase: "rest" },
];

export default function FamilyScene({ label }: { label: string }) {
  const { enabled } = useMotion();
  const [step, setStep] = useState(0);
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
  useEffect(() => {
    if (!playing) {
      setStep(0);
      return;
    }
    const timer = window.setTimeout(() => setStep((value) => (value + 1) % story.length), story[step].duration);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const current = story[playing ? step : 0];
  return (
    <div ref={ref} className="family-scene" role="img" aria-label={label}
      data-scene-phase={current.phase} data-scene-frame={current.frame} data-playing={playing}>
      <img src="/assets/cast/arth-gon-pitou.webp" alt="" width="1024" height="768"
        className="family-sheet" draggable={false}
        style={{ left: `${-(current.frame % 4) * 100}%`, top: `${-Math.floor(current.frame / 4) * 100}%` }} />
    </div>
  );
}
