import type { ReactNode } from 'react'
import { ScrollStory } from './scroll-story'
import { RaceScene } from './race-scene'

export function CreatedTimestampsStory({ children }: { children: ReactNode }) {
  return <ScrollStory label="The rabbit and turtle race, one scrape at a time" renderScene={(time) => <RaceScene time={time}/>}>{children}</ScrollStory>
}
