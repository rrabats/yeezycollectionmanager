import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'CollectionProgress',
  props: {
    owned: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  setup(props) {
    const percent = computed(() => (props.total ? Math.round((props.owned / props.total) * 100) : 0))

    return { percent }
  },
})
