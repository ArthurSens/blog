// Explicit illustrative model, not a PromQL rate/increase implementation.
export type Sample = { time: number; value: number; synthetic?: boolean }
export const raceDuration = 30
export const rabbitStart = 20
export function distanceAt(time: number, animal: 'turtle' | 'rabbit') {
  return animal === 'turtle' ? Math.min(30, Math.max(0, time)) : Math.min(30, Math.max(0, (time - rabbitStart) * 3))
}
export function raceSamples(interval: number, phase: number, animal: 'turtle' | 'rabbit', created: boolean): Sample[] {
  if (!Number.isFinite(interval) || interval <= 0 || !Number.isFinite(phase)) throw new Error('Invalid scrape schedule')
  const start = animal === 'turtle' ? 0 : rabbitStart
  const samples: Sample[] = []
  for (let time = phase; time <= raceDuration; time += interval) {
    // The rabbit begins just after the 20s scrape, matching the article's story.
    if (time <= start) continue
    samples.push({ time, value: distanceAt(time, animal) })
  }
  return created && samples.length ? [{ time: start, value: 0, synthetic: true }, ...samples] : samples
}
export function observedChange(samples: Sample[]) {
  return samples.length < 2 ? null : samples[samples.length - 1].value - samples[0].value
}
