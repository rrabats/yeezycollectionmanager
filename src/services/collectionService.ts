import type { CollectionData } from '../types/collection'
import { assetUrl } from '../utils/assetUrl'

// Reads the deployed copy for now. Step 4 switches this to the GitHub API so changes save to the repo.
export async function fetchCollection(): Promise<CollectionData> {
  const res = await fetch(assetUrl('data/collection.json'), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Could not load collection (HTTP ${res.status})`)
  return res.json()
}
