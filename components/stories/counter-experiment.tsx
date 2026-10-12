import { useId, useState } from 'react'
import { useRouter } from 'next/router'
import { observedChange, raceSamples } from '../../lib/race-model'
import { RaceScene } from './race-scene'
import styles from './stories.module.css'

export function CounterExperiment() {
  const id = useId()
  const [interval, setInterval] = useState(10)
  const [phase, setPhase] = useState(0)
  const pt = useRouter().locale === 'pt-br'
  const copy = pt ? {
    title: 'O que acontece entre as coletas?', intro: 'A corrida é a mesma. Altere quando o Prometheus observa os corredores.',
    interval: 'Intervalo de coleta', phase: 'Primeira coleta', without: 'Sem o instante de criação', with: 'Com o instante de criação',
    samples: 'Amostras do coelho (instante → distância)', empty: 'Nenhuma amostra', insufficient: 'Dados insuficientes para comparar duas amostras.',
    change: 'Variação entre a primeira e a última amostra', note: 'Modelo ilustrativo: a tartaruga percorre 1 m/s desde 0 s; o coelho começa logo após 20 s e percorre 3 m/s. A corrida termina em 30 s. Zeros sintéticos aparecem somente após a primeira coleta. A variação exibida não é o resultado de rate() ou increase() do PromQL, que têm regras adicionais de janela, extrapolação e resets.',
    reset: 'Restaurar exemplo', zero: 'zero sintético', unit: 'segundos',
  } : {
    title: 'What happens between scrapes?', intro: 'The race stays the same. Change when Prometheus observes the runners.',
    interval: 'Scrape interval', phase: 'First scrape', without: 'Without creation time', with: 'With creation time',
    samples: 'Rabbit samples (time → distance)', empty: 'No samples', insufficient: 'Not enough data to compare two samples.',
    change: 'Change between first and last sample', note: 'Illustrative model: the turtle runs 1 m/s from 0 s; the rabbit starts just after 20 s and runs 3 m/s. The race ends at 30 s. Synthetic zeros appear only after the first observation. The displayed change is not a PromQL rate() or increase() result, which also applies range-window, extrapolation, and reset rules.',
    reset: 'Reset example', zero: 'synthetic zero', unit: 'seconds',
  }
  return <section className={styles.experiment} aria-labelledby={`${id}-title`}>
    <span className={styles.kicker}>{pt ? 'Explore os dados' : 'Explore the data'}</span>
    <h2 id={`${id}-title`}>{copy.title}</h2>
    <p>{copy.intro}</p>
    <div className={styles.controls}>
      <label htmlFor={`${id}-interval`}>{copy.interval} <output>{interval} s</output>
        <input id={`${id}-interval`} type="range" min="5" max="15" value={interval} aria-valuetext={`${interval} ${copy.unit}`} onChange={event => { const next = Number(event.target.value); setInterval(next); setPhase(p => Math.min(p, next-1)) }}/>
      </label>
      <label htmlFor={`${id}-phase`}>{copy.phase} <output>{phase} s</output>
        <input id={`${id}-phase`} type="range" min="0" max={interval-1} value={phase} aria-valuetext={`${phase} ${copy.unit}`} onChange={event => setPhase(Number(event.target.value))}/>
      </label>
      <button type="button" onClick={() => { setInterval(10); setPhase(0) }}>{copy.reset}</button>
    </div>
    <div className={styles.comparison}>
      {[false, true].map(created => {
        const samples = raceSamples(interval, phase, 'rabbit', created)
        const change = observedChange(samples)
        return <div key={String(created)} className={styles.result}>
          <h3>{created ? copy.with : copy.without}</h3>
          <RaceScene time={30} interval={interval} phase={phase} created={created}/>
          <p className={styles.sampleLabel}>{copy.samples}</p>
          <ul className={styles.sampleList}>
            {samples.length ? samples.map(sample => <li key={sample.time}>{sample.time} s → {sample.value} m{sample.synthetic ? ` (${copy.zero})` : ''}</li>) : <li>{copy.empty}</li>}
          </ul>
          <p className={styles.metric}>{change === null ? copy.insufficient : `${copy.change}: ${change} m`}</p>
        </div>
      })}
    </div>
    <p className={styles.disclaimer}>{copy.note}</p>
  </section>
}
