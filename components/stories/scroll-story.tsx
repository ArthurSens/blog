import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useMotion } from '../motion'
import styles from './stories.module.css'

type SceneRenderer = (value: number) => ReactNode
const SceneContext = createContext<SceneRenderer>(() => null)

// Each article owns the scene and the values attached to its prose steps.
// This component only translates native scroll position into a reversible value.
export function ScrollStory({ children, renderScene, label, initialValue = 0 }: {
  children: ReactNode; renderScene: SceneRenderer; label: string; initialValue?: number;
}) {
  const root = useRef<HTMLDivElement>(null)
  const { enabled } = useMotion()
  const [value, setValue] = useState(initialValue)
  useEffect(() => {
    const element = root.current
    if (!element || !enabled) return
    const desktop = window.matchMedia('(min-width: 1000px)')
    let frame = 0
    let visible = true
    const update = () => {
      frame = 0
      if (!desktop.matches || !visible || document.hidden) return
      const steps = Array.from(element.querySelectorAll<HTMLElement>('[data-story-value]'))
      const anchor = window.innerHeight * 0.55
      let next = initialValue
      for (let i = 0; i < steps.length; i++) {
        const current = steps[i]
        const start = current.getBoundingClientRect().top
        const currentValue = Number(current.dataset.storyValue)
        if (start > anchor) break
        const following = steps[i + 1]
        if (!following) { next = currentValue; break }
        const end = following.getBoundingClientRect().top
        const progress = Math.min(1, Math.max(0, (anchor - start) / (end - start || 1)))
        next = currentValue + progress * (Number(following.dataset.storyValue) - currentValue)
      }
      setValue(next)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule() })
    observer.observe(element)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('visibilitychange', schedule)
    desktop.addEventListener('change', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', schedule)
      desktop.removeEventListener('change', schedule)
    }
  }, [enabled, initialValue])
  return <SceneContext.Provider value={renderScene}>
    <section ref={root} className={styles.story} aria-label={label} data-scroll-story>
      <div className={styles.steps}>{children}</div>
      <div className={styles.sticky} aria-hidden="true" data-story-scene data-value={value.toFixed(2)}>
        {renderScene(value)}
      </div>
    </section>
  </SceneContext.Provider>
}

export function StoryStep({ value, children }: { value: number; children: ReactNode }) {
  const renderScene = useContext(SceneContext)
  return <div className={styles.step} data-story-value={value}>
    <div className={styles.staticScene}>{renderScene(value)}</div>
    {children}
  </div>
}
