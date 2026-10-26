/** Resolves a path inside public/ against the app's base URL (/yeezycollectionmanager/ on GitHub Pages). */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`
}
