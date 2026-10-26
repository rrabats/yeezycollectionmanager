export interface OwnedEntry {
  /** style code of the shoe, matches Shoe.id */
  id: string
  /** ISO date (YYYY-MM-DD) the shoe was added to the collection */
  addedAt: string
}

export interface CollectionData {
  owned: OwnedEntry[]
}
