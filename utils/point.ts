import { Tier } from '../model/point'

export const classifyPointTier = (point: number): Tier => {
  const M = 1000000
  if (point < 5 * M) {
    return {
      start: 0,
      end: 5 * M - 1,
      level: 0,
      label: 'Dragon Egg',
    } // egg
  } else if (point < 15 * M) {
    return {
      start: 5 * M,
      end: 15 * M - 1,
      level: 1,
      label: 'Baby Dragon',
    } // baby
  } else if (point < 50 * M) {
    return {
      start: 15 * M * M,
      end: 50 * M - 1,
      level: 2,
      label: 'Bronze Dragon',
    } // bronze
  } else if (point < 150 * M) {
    return {
      start: 50 * M,
      end: 150 * M - 1,
      level: 3,
      label: 'Silver Dragon',
    } // silver
  } else if (point < 500 * M) {
    return {
      start: 150 * M,
      end: 500 * M - 1,
      level: 4,
      label: 'Gold Dragon',
    } // gold
  } else {
    return {
      start: 500 * M,
      end: Infinity,
      level: 5,
      label: 'Legendary Dragon',
    } // legendary
  }
}
