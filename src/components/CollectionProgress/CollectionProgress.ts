import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'CollectionProgress',
  props: {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    owned: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  setup(props) {
    const percent = computed(() => (props.total ? Math.round((props.owned / props.total) * 100) : 0))
    const complete = computed(() => props.total > 0 && props.owned >= props.total)

    return { percent, complete }
  },
})
