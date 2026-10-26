import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView/HomeView.vue'

// Hash history: GitHub Pages has no server-side fallback for deep links.
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
