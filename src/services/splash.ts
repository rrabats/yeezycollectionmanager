// How long the intro stays up, counted from the moment the page started loading.
const INTRO_MS = 1500
const REDUCED_MOTION_MS = 300

/** Fades out the intro from index.html once it has played, then removes it. */
export function hideSplash(): void {
  const splash = document.getElementById('splash')
  if (!splash) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const wait = Math.max(0, (reducedMotion ? REDUCED_MOTION_MS : INTRO_MS) - performance.now())

  setTimeout(() => {
    splash.classList.add('splash--leaving')
    splash.addEventListener('transitionend', () => splash.remove(), { once: true })
    // Fallback in case transitionend never fires (e.g. the tab is in the background).
    setTimeout(() => splash.remove(), 1000)
  }, wait)
}
