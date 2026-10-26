import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogView from '../views/CatalogView/CatalogView.vue'

// Hash history: GitHub Pages has no server-side fallback for deep links.
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: CatalogView,
    },
    {
      path: '/shoe/:id',
      name: 'shoe',
      component: () => import('../views/ShoeDetailView/ShoeDetailView.vue'),
      props: true,
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView/SettingsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'catalog' },
    },
  ],
  // Return to the same spot in the catalog after viewing a shoe.
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
