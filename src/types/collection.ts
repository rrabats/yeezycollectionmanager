export interface OwnedEntry {
  /** style code of the shoe, matches Shoe.id */
  id: string
  /** ISO date (YYYY-MM-DD) the shoe was added to the collection */
  addedAt: string
}

export interface CollectionData {
  owned: OwnedEntry[]
}

/** A change made in the app that is not saved to GitHub yet. */
export interface PendingChange {
  id: string
  action: 'add' | 'remove'
  /** ISO date the change was made, used as addedAt */
  at: string
}

/**
 * - idle: nothing to save
 * - saving: committing to GitHub
 * - saved: last change is on GitHub
 * - offline: changes wait until the phone is back online
 * - needs-token: changes wait until a GitHub token is added in Settings
 * - error: saving failed (see the error message)
 */
export type SyncState = 'idle' | 'saving' | 'saved' | 'offline' | 'needs-token' | 'error'
