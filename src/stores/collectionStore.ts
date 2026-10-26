import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  fetchDeployedCollection,
  fetchRemoteCollection,
  saveRemoteCollection,
} from '../services/collectionService'
import { GitHubError } from '../services/githubService'
import { readJson, writeJson } from '../services/localStore'
import type { OwnedEntry, PendingChange, SyncState } from '../types/collection'
import type { LoadStatus } from '../types/loadStatus'
import { useCatalogStore } from './catalogStore'
import { useSettingsStore } from './settingsStore'

interface CachedCollection {
  remote: OwnedEntry[]
  sha: string | null
  pending: PendingChange[]
}

const CACHE_KEY = 'collection'
const SAVE_DELAY_MS = 1200
const MAX_SAVE_ATTEMPTS = 3

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function applyChanges(base: OwnedEntry[], changes: PendingChange[]): OwnedEntry[] {
  let result = [...base]
  for (const change of changes) {
    const has = result.some((entry) => entry.id === change.id)
    if (change.action === 'add' && !has) result.push({ id: change.id, addedAt: change.at })
    if (change.action === 'remove' && has) result = result.filter((entry) => entry.id !== change.id)
  }
  return result
}

function sameIds(a: OwnedEntry[], b: OwnedEntry[]): boolean {
  return a.length === b.length && a.every((entry, i) => entry.id === b[i].id)
}

export const useCollectionStore = defineStore('collection', () => {
  const settings = useSettingsStore()
  const catalog = useCatalogStore()

  // What GitHub has (as far as we know) plus changes made here that are not saved yet.
  // Both are cached on the device so the app opens instantly and works offline.
  const cached = readJson<CachedCollection>(CACHE_KEY)
  const remote = ref<OwnedEntry[]>(cached?.remote ?? [])
  const sha = ref<string | null>(cached?.sha ?? null)
  const pending = ref<PendingChange[]>(cached?.pending ?? [])

  const status = ref<LoadStatus>(cached ? 'ready' : 'idle')
  const syncState = ref<SyncState>('idle')
  const syncError = ref<string | null>(null)

  const owned = computed(() => applyChanges(remote.value, pending.value))
  const ownedById = computed(() => new Map(owned.value.map((entry) => [entry.id, entry])))
  const count = computed(() => owned.value.length)
  const pendingCount = computed(() => pending.value.length)
  const hasUnsavedChanges = computed(() => pendingCount.value > 0)

  let saveTimer: ReturnType<typeof setTimeout> | undefined
  let saving: Promise<void> | null = null
  let saveAgain = false
  // Bumped on every successful save, so a refresh that started earlier doesn't overwrite newer data.
  let saveGeneration = 0

  function persist(): void {
    writeJson(CACHE_KEY, {
      remote: remote.value,
      sha: sha.value,
      pending: pending.value,
    } satisfies CachedCollection)
  }

  function isOwned(id: string): boolean {
    return ownedById.value.has(id)
  }

  function entry(id: string): OwnedEntry | undefined {
    return ownedById.value.get(id)
  }

  function toggle(id: string): void {
    const action: PendingChange['action'] = isOwned(id) ? 'remove' : 'add'
    const onGitHub = remote.value.some((e) => e.id === id)
    // Only the latest change per shoe matters; drop it entirely when it undoes an unsaved change.
    pending.value = pending.value.filter((change) => change.id !== id)
    if ((action === 'add') !== onGitHub) pending.value = [...pending.value, { id, action, at: today() }]
    persist()
    scheduleSave()
  }

  function describe(changes: PendingChange[]): string {
    const label = (id: string): string => {
      const shoe = catalog.byId.get(id)
      return shoe ? `${shoe.model} ${shoe.name} (${id})` : id
    }
    if (changes.length === 1) {
      const [change] = changes
      return `${change.action === 'add' ? 'Add' : 'Remove'} ${label(change.id)}`
    }
    const added = changes.filter((c) => c.action === 'add').map((c) => label(c.id))
    const removed = changes.filter((c) => c.action === 'remove').map((c) => label(c.id))
    const lines = [...added.map((l) => `+ ${l}`), ...removed.map((l) => `- ${l}`)]
    return `Update collection (${changes.length} changes)\n\n${lines.join('\n')}`
  }

  function scheduleSave(): void {
    clearTimeout(saveTimer)
    saveTimer = setTimeout(() => void save(), SAVE_DELAY_MS)
  }

  /** Commits all pending changes in one go. Safe to call at any time. */
  async function save(): Promise<void> {
    if (saving) {
      saveAgain = true
      return saving
    }
    saving = runSave().finally(() => {
      saving = null
      if (saveAgain) {
        saveAgain = false
        void save()
      }
    })
    return saving
  }

  async function runSave(): Promise<void> {
    if (!pending.value.length) {
      if (syncState.value !== 'saved') syncState.value = 'idle'
      return
    }
    if (!settings.token) {
      syncState.value = 'needs-token'
      return
    }
    if (!navigator.onLine) {
      syncState.value = 'offline'
      return
    }

    syncState.value = 'saving'
    syncError.value = null
    const batch = [...pending.value]

    for (let attempt = 1; attempt <= MAX_SAVE_ATTEMPTS; attempt++) {
      try {
        // Always start from the latest version on GitHub so nothing saved elsewhere gets lost.
        const latest = await fetchRemoteCollection(settings.token)
        const next = applyChanges(latest.data.owned, batch)
        let nextSha = latest.sha
        if (!sameIds(next, latest.data.owned)) {
          nextSha = await saveRemoteCollection({ owned: next }, latest.sha, describe(batch), settings.token)
        }
        remote.value = next
        sha.value = nextSha
        saveGeneration++
        // Keep changes made while this save was running; they go in the next commit.
        pending.value = pending.value.filter((change) => !batch.includes(change))
        persist()
        syncState.value = 'saved'
        return
      } catch (err) {
        if (err instanceof GitHubError && err.isConflict && attempt < MAX_SAVE_ATTEMPTS) continue
        if (err instanceof GitHubError && err.isAuthProblem) {
          syncState.value = 'error'
          syncError.value = 'GitHub refused the save. Check the token in Settings (it needs Contents: read and write).'
        } else if (err instanceof GitHubError) {
          syncState.value = 'error'
          syncError.value = err.message
        } else {
          syncState.value = navigator.onLine ? 'error' : 'offline'
          syncError.value = navigator.onLine ? 'Could not reach GitHub.' : null
        }
        return
      }
    }
  }

  /** Loads the latest collection from GitHub, then saves anything still pending. */
  async function refresh(): Promise<void> {
    if (saving) return
    const generation = saveGeneration
    try {
      const latest = await fetchRemoteCollection(settings.token)
      if (saving || generation !== saveGeneration) return
      remote.value = latest.data.owned
      sha.value = latest.sha
      persist()
      status.value = 'ready'
    } catch {
      // Offline or rate-limited: keep showing the cached copy. On a first launch without
      // a cache, fall back to the copy that shipped with the app.
      if (status.value !== 'ready') {
        try {
          remote.value = (await fetchDeployedCollection()).owned
          status.value = 'ready'
        } catch {
          status.value = 'error'
        }
      }
    }
    if (pending.value.length) await save()
  }

  let started = false

  /** Loads once and keeps the collection in sync while the app is open. */
  function start(): void {
    if (started) return
    started = true
    if (status.value === 'idle') status.value = 'loading'
    void refresh()

    window.addEventListener('online', () => void save())
    window.addEventListener('offline', () => {
      if (pending.value.length) syncState.value = 'offline'
    })
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void refresh()
    })
    // A token was just added: save what was waiting for it.
    watch(
      () => settings.token,
      (token) => {
        if (token && pending.value.length) void save()
        if (!token && pending.value.length) syncState.value = 'needs-token'
      },
    )
  }

  return {
    owned,
    status,
    syncState,
    syncError,
    count,
    pendingCount,
    hasUnsavedChanges,
    start,
    refresh,
    save,
    isOwned,
    entry,
    toggle,
  }
})
