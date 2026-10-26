import type { Shoe } from '../types/shoe'

/** Same key for a shoe and its reflective / non-reflective counterpart. */
export function colorwayKey(shoe: Shoe): string {
  return shoe.counterpart && shoe.counterpart < shoe.id ? shoe.counterpart : shoe.id
}

/**
 * "Any%" progress: a colorway counts as collected when either version (reflective or not) is owned.
 */
export function colorwayProgress(shoes: Shoe[], isOwned: (id: string) => boolean): { owned: number; total: number } {
  const all = new Set<string>()
  const owned = new Set<string>()
  for (const shoe of shoes) {
    const key = colorwayKey(shoe)
    all.add(key)
    if (isOwned(shoe.id)) owned.add(key)
  }
  return { owned: owned.size, total: all.size }
}
