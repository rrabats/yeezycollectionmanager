import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import SyncStatus from '../../components/SyncStatus/SyncStatus.vue'
import { NEW_TOKEN_URL } from '../../config/github'
import { useCollectionStore } from '../../stores/collectionStore'
import { useSettingsStore } from '../../stores/settingsStore'

export default defineComponent({
  name: 'SettingsView',
  components: { SyncStatus },
  setup() {
    const router = useRouter()
    const settings = useSettingsStore()
    const collection = useCollectionStore()

    const tokenInput = ref('')
    const connecting = ref(false)
    const connectError = ref<string | null>(null)

    async function connect(): Promise<void> {
      connecting.value = true
      connectError.value = null
      try {
        await settings.connect(tokenInput.value)
        tokenInput.value = ''
      } catch (err) {
        connectError.value = (err as Error).message
      } finally {
        connecting.value = false
      }
    }

    function disconnect(): void {
      settings.disconnect()
    }

    function saveNow(): void {
      void collection.save()
    }

    function goBack(): void {
      if (window.history.state?.back) router.back()
      else void router.push({ name: 'catalog' })
    }

    return {
      settings,
      collection,
      tokenInput,
      connecting,
      connectError,
      newTokenUrl: NEW_TOKEN_URL,
      connect,
      disconnect,
      saveNow,
      goBack,
    }
  },
})
