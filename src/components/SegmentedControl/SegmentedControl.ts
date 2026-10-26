import { defineComponent, type PropType } from 'vue'

export interface SegmentOption {
  value: string
  label: string
}

export default defineComponent({
  name: 'SegmentedControl',
  props: {
    modelValue: { type: String, required: true },
    options: { type: Array as PropType<SegmentOption[]>, required: true },
    label: { type: String, required: true },
  },
  emits: {
    'update:modelValue': (value: string) => typeof value === 'string',
  },
  setup(_props, { emit }) {
    function select(value: string): void {
      emit('update:modelValue', value)
    }

    return { select }
  },
})
