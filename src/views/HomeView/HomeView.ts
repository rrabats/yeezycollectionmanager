import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const title = 'Yeezy Vault'
    const status = 'Setup complete. Catalog coming soon.'

    return { title, status }
  },
})
