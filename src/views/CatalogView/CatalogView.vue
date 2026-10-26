<template>
  <div class="catalog">
    <header class="catalog__header">
      <div class="catalog__inner">
        <div class="catalog__title-row">
          <h1 class="catalog__title">Yeezy Vault</h1>
          <RouterLink class="catalog__settings" :to="{ name: 'settings' }" aria-label="Settings">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"
              />
            </svg>
          </RouterLink>
        </div>
        <CollectionProgress :owned="ownedCount" :total="catalog.shoes.length" />
        <SyncStatus
          class="catalog__sync"
          :state="collection.syncState"
          :error="collection.syncError"
          :pending="collection.pendingCount"
        />
      </div>
    </header>

    <div class="catalog__filters">
      <div class="catalog__inner catalog__filters-inner">
        <SearchField v-model="filters.search" placeholder="Search name or code" />
        <SegmentedControl v-model="filters.ownership" :options="ownershipOptions" label="Ownership" />
        <SegmentedControl v-model="filters.model" :options="modelOptions" label="Model" />
      </div>
    </div>

    <main class="catalog__inner catalog__content">
      <p v-if="catalog.status === 'loading'" class="catalog__message">Loading catalog…</p>

      <div v-else-if="catalog.status === 'error'" class="catalog__message">
        <p>Could not load the catalog.</p>
        <button type="button" class="catalog__button" @click="retry">Try again</button>
      </div>

      <template v-else-if="catalog.status === 'ready'">
        <p class="catalog__count">{{ resultLabel }}</p>

        <ul v-if="visibleShoes.length" class="catalog__grid">
          <li v-for="shoe in visibleShoes" :key="shoe.id">
            <ShoeCard :shoe="shoe" :owned="collection.isOwned(shoe.id)" />
          </li>
        </ul>

        <div v-else class="catalog__message">
          <p>No shoes match your filters.</p>
          <button type="button" class="catalog__button" @click="filters.reset">Clear filters</button>
        </div>
      </template>
    </main>
  </div>
</template>

<script lang="ts" src="./CatalogView.ts"></script>
<style scoped src="./CatalogView.css"></style>
