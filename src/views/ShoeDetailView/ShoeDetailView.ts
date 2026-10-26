import { computed, defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '../../stores/catalogStore'
import { useCollectionStore } from '../../stores/collectionStore'
import { assetUrl } from '../../utils/assetUrl'

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export default defineComponent({
  name: 'ShoeDetailView',
  props: {
    id: { type: String, required: true },
  },
  setup(props) {
    const router = useRouter()
    const catalog = useCatalogStore()
    const collection = useCollectionStore()

    const shoe = computed(() => catalog.byId.get(props.id))
    const imageSrc = computed(() => (shoe.value ? assetUrl(shoe.value.image) : ''))
    const owned = computed(() => collection.isOwned(props.id))

    const ownedSince = computed(() => {
      const entry = collection.entry(props.id)
      return entry ? dateFormat.format(new Date(entry.addedAt)) : null
    })

    function toggleOwned(): void {
      collection.toggle(props.id)
    }

    // Go back in history when we came from the catalog (keeps scroll position and filters),
    // otherwise (opened directly) go to the catalog.
    function goBack(): void {
      if (window.history.state?.back) router.back()
      else void router.push({ name: 'catalog' })
    }

    onMounted(() => {
      void catalog.load()
      void collection.load()
    })

    return { catalog, shoe, imageSrc, owned, ownedSince, toggleOwned, goBack }
  },
})
