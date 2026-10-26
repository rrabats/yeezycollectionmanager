import { registerSW } from 'virtual:pwa-register'

const HOUR = 60 * 60 * 1000

/**
 * Registers the offline service worker. With registerType "autoUpdate" the page reloads by itself
 * once a new version is installed. A home-screen app on iOS can stay open for days, so it also
 * checks for a new version whenever it comes back to the foreground, and every hour.
 */
export function registerServiceWorker(): void {
  registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return
      const check = (): void => {
        if (navigator.onLine) void registration.update()
      }
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check()
      })
      setInterval(check, HOUR)
    },
  })
}
