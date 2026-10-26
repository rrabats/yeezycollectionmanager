import { computed, defineComponent, type PropType } from 'vue'
import { RouterLink } from 'vue-router'
import type { Shoe } from '../../types/shoe'
import { assetUrl } from '../../utils/assetUrl'

export default defineComponent({
  name: 'ShoeCard',
  components: { RouterLink },
  props: {
    shoe: { type: Object as PropType<Shoe>, required: true },
    owned: { type: Boolean, default: false },
  },
  setup(props) {
    const imageSrc = computed(() => assetUrl(props.shoe.image))

    return { imageSrc }
  },
})
