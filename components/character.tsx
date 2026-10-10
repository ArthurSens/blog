import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useMotion } from "./motion";

export default function Character({ label }: { label: string }) {
  const { enabled } = useMotion();
  const [waving, setWaving] = useState(false);
  const [frame, setFrame] = useState(4);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLButtonElement>(null);
  const waveUntil = useRef(0);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!enabled || !visible) {
      setFrame(4);
      setWaving(false);
      return;
    }
    let tick = 0;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      tick++;
      const phase = tick % 150;
      const wave = Date.now() < waveUntil.current;
      setWaving(wave);
      // Several controlled squats, a long rest, then a glance at the watch.
      setFrame(
        wave
          ? Math.floor(tick / 2) % 4
          : phase < 48
            ? [0, 1, 2, 2, 3, 0][Math.floor(phase / 3) % 6]
            : phase >= 100 && phase < 116
              ? 5
              : 4,
      );
    }, 160);
    return () => clearInterval(timer);
  }, [enabled, visible]);
  const width = 144;
  const height = 156;
  const style = {
    width,
    height,
    backgroundImage: `url(/assets/cast/${waving ? "arth-wave" : "arth-training"}.webp)`,
    backgroundSize: `${width * (waving ? 4 : 6)}px ${height}px`,
    backgroundPosition: `${-width * frame}px 0px`,
  } as CSSProperties;
  return (
    <button
      ref={ref}
      type="button"
      className="character-button"
      aria-label={label}
      disabled={!enabled}
      onClick={() => {
        waveUntil.current = Date.now() + 1600;
        setWaving(true);
        setFrame(0);
      }}
    >
      <span className="character-sprite" style={style} aria-hidden="true" />
    </button>
  );
}
