import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchCatalog } from '../services/catalogService'
import type { Shoe } from '../types/shoe'
import type { LoadStatus } from '../types/loadStatus'

export const useCatalogStore = defineStore('catalog', () => {
  const shoes = ref<Shoe[]>([])
  const status = ref<LoadStatus>('idle')

  const byId = computed(() => new Map(shoes.value.map((shoe) => [shoe.id, shoe])))

  async function load(): Promise<void> {
    if (status.value === 'loading' || status.value === 'ready') return
    status.value = 'loading'
    try {
      shoes.value = await fetchCatalog()
      status.value = 'ready'
    } catch {
      status.value = 'error'
    }
  }

  return { shoes, status, byId, load }
})
