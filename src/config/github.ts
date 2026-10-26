export const GITHUB_API = 'https://api.github.com'
export const GITHUB_OWNER = 'rrabats'
export const GITHUB_REPO = 'yeezycollectionmanager'
export const GITHUB_BRANCH = 'main'
export const COLLECTION_PATH = 'public/data/collection.json'

/** Opens GitHub's "new fine-grained token" page with the name and description filled in. */
export const NEW_TOKEN_URL =
  'https://github.com/settings/personal-access-tokens/new' +
  `?name=${encodeURIComponent('Yeezy Vault')}` +
  `&description=${encodeURIComponent('Lets the Yeezy Vault app save collection.json')}`
