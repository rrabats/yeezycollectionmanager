import { computed, defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSettingsStore } from '../../stores/settingsStore'

interface MenuItem {
  label: string
  hint: string
  route: string
}

// Phase 2 adds "Listings" here.
const items: MenuItem[] = [
  { label: 'Collection', hint: 'All 350 V2 and CMPCT releases', route: 'catalog' },
  { label: 'Settings', hint: 'GitHub connection and saving', route: 'settings' },
]

export default defineComponent({
  name: 'AppMenu',
  components: { RouterLink },
  setup() {
    const route = useRoute()
    const settings = useSettingsStore()
    const open = ref(false)
    const closeButton = ref<HTMLButtonElement | null>(null)

    const login = computed(() => settings.login)

    function show(): void {
      open.value = true
    }

    function hide(): void {
      open.value = false
    }

    function isActive(name: string): boolean {
      return route.name === name
    }

    // Keep the page behind the menu from scrolling, and move focus into the menu.
    watch(open, async (isOpen) => {
      document.documentElement.style.overflow = isOpen ? 'hidden' : ''
      if (isOpen) {
        await nextTick()
        closeButton.value?.focus()
      }
    })

    watch(() => route.fullPath, hide)

    onBeforeUnmount(() => {
      document.documentElement.style.overflow = ''
    })

    return { items, open, closeButton, login, show, hide, isActive }
  },
})
