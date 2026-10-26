import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves the app from https://rrabats.github.io/yeezycollectionmanager/
const base = '/yeezycollectionmanager/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      // Registered from src/services/serviceWorker.ts
      injectRegister: false,
      pwaAssets: {
        config: true,
        overrideManifestIcons: true,
      },
      manifest: {
        name: 'Yeezy Vault',
        short_name: 'Yeezy Vault',
        description: 'Manage your Yeezy 350 collection',
        lang: 'en',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#000000',
        background_color: '#000000',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,json}'],
        // The collection changes at runtime; it must never be served from the offline cache.
        // Splash screens are only read by iOS when launching, so they don't need to be cached for offline use.
        globIgnores: ['**/data/collection.json', '**/apple-splash-*.png'],
        // Activate a new version right away instead of waiting for every open copy of the app to close.
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
})
