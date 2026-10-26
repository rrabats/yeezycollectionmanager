import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { GitHubError, verifyToken } from '../services/githubService'
import { readJson, remove, writeJson } from '../services/localStore'

interface StoredAuth {
  token: string
  login: string
}

const AUTH_KEY = 'github-auth'

export const useSettingsStore = defineStore('settings', () => {
  const stored = readJson<StoredAuth>(AUTH_KEY)
  const token = ref<string | null>(stored?.token ?? null)
  const login = ref<string | null>(stored?.login ?? null)

  const isConnected = computed(() => token.value !== null)

  /** Checks the token against GitHub and stores it on this device. Throws a readable message on failure. */
  async function connect(newToken: string): Promise<void> {
    const trimmed = newToken.trim()
    if (!trimmed) throw new Error('Paste a token first.')
    try {
      const user = await verifyToken(trimmed)
      token.value = trimmed
      login.value = user
      writeJson(AUTH_KEY, { token: trimmed, login: user } satisfies StoredAuth)
    } catch (err) {
      if (err instanceof GitHubError && err.status === 401) throw new Error('GitHub did not accept this token.')
      if (err instanceof GitHubError && err.status === 404)
        throw new Error('This token has no access to the yeezycollectionmanager repo.')
      if (err instanceof GitHubError) throw new Error(err.message)
      throw new Error('Could not reach GitHub. Check your connection.')
    }
  }

  function disconnect(): void {
    token.value = null
    login.value = null
    remove(AUTH_KEY)
  }

  return { token, login, isConnected, connect, disconnect }
})
