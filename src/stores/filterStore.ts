import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Shoe, ShoeModel } from '../types/shoe'

export type OwnershipFilter = 'all' | 'owned' | 'missing'
export type ModelFilter = 'all' | ShoeModel

// Lives in a store so the filters survive opening a shoe and coming back.
export const useFilterStore = defineStore('filters', () => {
  const search = ref('')
  const ownership = ref<OwnershipFilter>('all')
  const model = ref<ModelFilter>('all')

  function apply(shoes: Shoe[], isOwned: (id: string) => boolean): Shoe[] {
    const query = search.value.trim().toLowerCase()
    return shoes.filter((shoe) => {
      if (model.value !== 'all' && shoe.model !== model.value) return false
      if (ownership.value === 'owned' && !isOwned(shoe.id)) return false
      if (ownership.value === 'missing' && isOwned(shoe.id)) return false
      if (query && !`${shoe.name} ${shoe.id}`.toLowerCase().includes(query)) return false
      return true
    })
  }

  function reset(): void {
    search.value = ''
    ownership.value = 'all'
    model.value = 'all'
  }

  return { search, ownership, model, apply, reset }
})
