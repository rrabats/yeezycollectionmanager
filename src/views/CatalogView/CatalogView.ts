import { computed, defineComponent } from 'vue'
import CollectionProgress from '../../components/CollectionProgress/CollectionProgress.vue'
import SearchField from '../../components/SearchField/SearchField.vue'
import SegmentedControl from '../../components/SegmentedControl/SegmentedControl.vue'
import type { SegmentOption } from '../../components/SegmentedControl/SegmentedControl'
import AppMenu from '../../components/AppMenu/AppMenu.vue'
import ShoeCard from '../../components/ShoeCard/ShoeCard.vue'
import SyncStatus from '../../components/SyncStatus/SyncStatus.vue'
import { useCatalogStore } from '../../stores/catalogStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { useFilterStore } from '../../stores/filterStore'
import { colorwayProgress } from '../../utils/colorways'

const ownershipOptions: SegmentOption[] = [
  { value: 'all', label: 'All' },
  { value: 'owned', label: 'Owned' },
  { value: 'missing', label: 'Missing' },
]

const modelOptions: SegmentOption[] = [
  { value: 'all', label: 'All models' },
  { value: '350 V2', label: '350 V2' },
  { value: '350 V2 CMPCT', label: 'CMPCT' },
]

export default defineComponent({
  name: 'CatalogView',
  components: { AppMenu, CollectionProgress, SearchField, SegmentedControl, ShoeCard, SyncStatus },
  setup() {
    const catalog = useCatalogStore()
    const collection = useCollectionStore()
    const filters = useFilterStore()

    // Newest releases first, like a release calendar. Within a year, later catalog entries come first.
    const newestFirst = computed(() =>
      catalog.shoes
        .map((shoe, index) => ({ shoe, index }))
        .sort((a, b) => b.shoe.releaseYear - a.shoe.releaseYear || b.index - a.index)
        .map(({ shoe }) => shoe),
    )
    const visibleShoes = computed(() => filters.apply(newestFirst.value, collection.isOwned))

    // Only count owned shoes that are actually in the catalog.
    const ownedCount = computed(() => catalog.shoes.filter((shoe) => collection.isOwned(shoe.id)).length)
    // Reflective and non-reflective versions count as one colorway.
    const anyPercent = computed(() => colorwayProgress(catalog.shoes, collection.isOwned))

    const resultLabel = computed(() => {
      const count = visibleShoes.value.length
      return `${count} ${count === 1 ? 'shoe' : 'shoes'}`
    })

    function retry(): void {
      void catalog.load()
    }

    return {
      catalog,
      collection,
      filters,
      visibleShoes,
      ownedCount,
      anyPercent,
      resultLabel,
      ownershipOptions,
      modelOptions,
      retry,
    }
  },
})
