import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchCollection } from '../services/collectionService'
import type { OwnedEntry } from '../types/collection'
import type { LoadStatus } from '../types/loadStatus'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export const useCollectionStore = defineStore('collection', () => {
  const owned = ref<OwnedEntry[]>([])
  const status = ref<LoadStatus>('idle')

  const ownedById = computed(() => new Map(owned.value.map((entry) => [entry.id, entry])))
  const count = computed(() => owned.value.length)

  async function load(): Promise<void> {
    if (status.value === 'loading' || status.value === 'ready') return
    status.value = 'loading'
    try {
      owned.value = (await fetchCollection()).owned
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  function isOwned(id: string): boolean {
    return ownedById.value.has(id)
  }

  function entry(id: string): OwnedEntry | undefined {
    return ownedById.value.get(id)
  }

  // In memory only until Step 4 adds saving through the GitHub API.
  function toggle(id: string): void {
    owned.value = isOwned(id)
      ? owned.value.filter((e) => e.id !== id)
      : [...owned.value, { id, addedAt: today() }]
  }

  return { owned, status, count, load, isOwned, entry, toggle }
})
