import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { useCatalogStore } from './stores/catalogStore'
import { useCollectionStore } from './stores/collectionStore'

export default defineComponent({
  name: 'App',
  components: { RouterView },
  setup() {
    void useCatalogStore().load()
    useCollectionStore().start()
  },
})
