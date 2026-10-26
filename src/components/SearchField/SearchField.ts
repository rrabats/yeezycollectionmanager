import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SearchField',
  props: {
    modelValue: { type: String, required: true },
    placeholder: { type: String, default: 'Search' },
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
  },
  setup(_props, { emit }) {
    function onInput(event: Event): void {
      emit('update:modelValue', (event.target as HTMLInputElement).value)
    }

    function clear(): void {
      emit('update:modelValue', '')
    }

    // Closes the iPhone keyboard when pressing "search".
    function blur(event: KeyboardEvent): void {
      ;(event.target as HTMLInputElement).blur()
    }

    return { onInput, clear, blur }
  },
})
