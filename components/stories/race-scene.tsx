import { distanceAt, raceSamples } from '../../lib/race-model'
import styles from './stories.module.css'

const clamp = (value: number) => Math.max(0, Math.min(30, value))
export function RaceScene({ time, created = false, interval = 10, phase = 0 }: {
  time: number; created?: boolean; interval?: number; phase?: number;
}) {
  time = clamp(time)
  const captured = Math.floor(time / interval) * interval
  return <figure className={styles.figure}>
    <div className={styles.figureHeading}><span>{created ? 'With creation time' : 'What the coach can see'}</span><strong>{time.toFixed(1)} s</strong></div>
    <svg viewBox="0 0 500 360" role="img" aria-label={`Race at ${time.toFixed(1)} seconds. Turtle: ${distanceAt(time, 'turtle').toFixed(1)} meters. Rabbit: ${distanceAt(time, 'rabbit').toFixed(1)} meters.`}>
      <text x="32" y="30" className={styles.svgLabel}>THE RACE · continuous movement</text>
      {[0, 10, 20, 30].map((m) => <g key={m}>
        <line x1={85 + m * 12} x2={85 + m * 12} y1="52" y2="160" className={styles.guide} />
        <text x={85 + m * 12} y="181" textAnchor="middle" className={styles.svgLabel}>{m} m</text>
      </g>)}
      <text x="20" y="86" className={styles.svgText}>Turtle</text>
      <text x="20" y="143" className={styles.svgText}>Rabbit</text>
      <line x1="85" x2="445" y1="80" y2="80" className={styles.track}/>
      <line x1="85" x2="445" y1="138" y2="138" className={styles.track}/>
      <g transform={`translate(${85 + distanceAt(time, 'turtle') * 12},80)`}>
        <ellipse rx="12" ry="9" className={styles.turtle}/><circle cx="14" cy="0" r="4" className={styles.turtle}/>
        <path d="M-7 8v5M7 8v5" className={styles.turtleFeet}/>
      </g>
      <g transform={`translate(${85 + distanceAt(time, 'rabbit') * 12},138)`}>
        <circle r="10" className={styles.rabbit}/><path d="M-4-8l-3-16M4-8l3-16" className={styles.rabbitEars}/>
      </g>
      <text x="32" y="222" className={styles.svgLabel}>THE RECORD · samples at each scrape</text>
      <line x1="85" x2="445" y1="323" y2="323" className={styles.track}/>
      <line x1="85" x2="85" y1="240" y2="323" className={styles.track}/>
      <text x="72" y="249" textAnchor="end" className={styles.svgLabel}>30 m</text>
      <text x="72" y="323" textAnchor="end" className={styles.svgLabel}>0</text>
      {[0,10,20,30].map(t => <text key={t} x={85+t*12} y="347" textAnchor="middle" className={styles.svgLabel}>{t}s</text>)}
      {(['turtle','rabbit'] as const).map(animal => {
        const samples = raceSamples(interval, phase, animal, created).filter(s => s.time <= time && (!s.synthetic || time >= (raceSamples(interval, phase, animal, false)[0]?.time ?? Infinity)))
        return <g key={animal}>
          {samples.map(s => animal === 'turtle' ? <circle key={s.time} cx={85+s.time*12} cy={323-s.value*2.5} r="5" className={s.synthetic ? styles.synthetic : styles.turtle}/> : <rect key={s.time} x={81+s.time*12} y={319-s.value*2.5} width="8" height="8" className={s.synthetic ? styles.synthetic : styles.rabbit}/>)}
        </g>
      })}
    </svg>
    <figcaption className={styles.caption}>
      <span><i className={styles.turtleKey}/>Turtle</span><span><i className={styles.rabbitKey}/>Rabbit</span>
      {created && <span><i className={styles.zeroKey}/>Synthetic zero</span>}
    </figcaption>
    <p className={styles.figureNote}>{time < 10 ? 'No samples yet. Movement happens between observations.' : !created && time >= 30 && raceSamples(interval, phase, 'rabbit', false).length === 1 ? 'The rabbit ran 30 m, but its record contains just one sample.' : created ? 'The first observation carries the start time: a zero can be inserted retrospectively.' : `The race keeps moving. Observations arrive only at scrapes${interval === 10 && phase === 0 ? `; the latest is at ${captured} s` : ''}.`}</p>
  </figure>
}
