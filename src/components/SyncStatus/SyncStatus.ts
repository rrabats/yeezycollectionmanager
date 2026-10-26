import { computed, defineComponent, onBeforeUnmount, ref, watch, type PropType } from 'vue'
import { RouterLink } from 'vue-router'
import type { SyncState } from '../../types/collection'

type Tone = 'ok' | 'busy' | 'waiting' | 'problem'

function changes(count: number): string {
  return `${count} ${count === 1 ? 'change' : 'changes'}`
}

export default defineComponent({
  name: 'SyncStatus',
  components: { RouterLink },
  props: {
    state: { type: String as PropType<SyncState>, required: true },
    error: { type: String as PropType<string | null>, default: null },
    pending: { type: Number, default: 0 },
    /** Also show "All changes saved" when there is nothing to report. */
    showIdle: { type: Boolean, default: false },
    /** Hide the "Saved" confirmation after this many milliseconds (0 keeps it). */
    hideSavedAfter: { type: Number, default: 0 },
  },
  setup(props) {
    const savedHidden = ref(false)
    let hideTimer: ReturnType<typeof setTimeout> | undefined

    watch(
      () => props.state,
      (state) => {
        clearTimeout(hideTimer)
        savedHidden.value = false
        if (state === 'saved' && props.hideSavedAfter > 0) {
          hideTimer = setTimeout(() => (savedHidden.value = true), props.hideSavedAfter)
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => clearTimeout(hideTimer))

    const visible = computed(() => {
      if (props.state === 'saved' && savedHidden.value) return false
      return props.showIdle || props.state !== 'idle'
    })

    const tone = computed<Tone>(() => {
      switch (props.state) {
        case 'saving':
          return 'busy'
        case 'offline':
        case 'needs-token':
          return 'waiting'
        case 'error':
          return 'problem'
        default:
          return 'ok'
      }
    })

    const label = computed(() => {
      switch (props.state) {
        case 'saving':
          return 'Saving…'
        case 'saved':
          return 'Saved'
        case 'offline':
          return `Offline · ${changes(props.pending)} will save when you're back online`
        case 'needs-token':
          return `${changes(props.pending)} not saved yet.`
        case 'error':
          return props.error ?? 'Saving failed.'
        default:
          return 'All changes saved'
      }
    })

    const linkToSettings = computed(() => props.state === 'needs-token' || props.state === 'error')
    const linkLabel = computed(() => (props.state === 'needs-token' ? 'Connect GitHub' : 'Settings'))

    return { visible, tone, label, linkToSettings, linkLabel }
  },
})
