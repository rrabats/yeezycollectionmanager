import type { Shoe } from '../types/shoe'
import { assetUrl } from '../utils/assetUrl'

export async function fetchCatalog(): Promise<Shoe[]> {
  const res = await fetch(assetUrl('data/catalog.json'))
  if (!res.ok) throw new Error(`Could not load catalog (HTTP ${res.status})`)
  return res.json()
}
