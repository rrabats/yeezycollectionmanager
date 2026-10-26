import { COLLECTION_PATH } from '../config/github'
import type { CollectionData } from '../types/collection'
import { assetUrl } from '../utils/assetUrl'
import { readFile, writeFile } from './githubService'

export interface RemoteCollection {
  data: CollectionData
  /** version of collection.json on GitHub, needed to save the next change */
  sha: string
}

function parse(text: string): CollectionData {
  const data = JSON.parse(text) as Partial<CollectionData>
  return { owned: Array.isArray(data.owned) ? data.owned : [] }
}

/** Latest collection.json straight from the repo (not the deployed site, which is not rebuilt on saves). */
export async function fetchRemoteCollection(token: string | null): Promise<RemoteCollection> {
  const file = await readFile(COLLECTION_PATH, token)
  return { data: parse(file.text), sha: file.sha }
}

export async function saveRemoteCollection(
  data: CollectionData,
  sha: string,
  message: string,
  token: string,
): Promise<string> {
  const text = JSON.stringify(data, null, 2) + '\n'
  const file = await writeFile(COLLECTION_PATH, text, sha, message, token)
  return file.sha
}

/** Copy bundled with the last deploy. Only a fallback when GitHub can't be reached on first launch. */
export async function fetchDeployedCollection(): Promise<CollectionData> {
  const res = await fetch(assetUrl('data/collection.json'), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Could not load collection (HTTP ${res.status})`)
  return parse(await res.text())
}
