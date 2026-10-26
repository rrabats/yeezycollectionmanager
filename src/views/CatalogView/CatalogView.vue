<template>
  <div class="catalog">
    <header class="catalog__header">
      <div class="catalog__inner">
        <div class="catalog__title-row">
          <h1 class="catalog__title">Yeezy Vault</h1>
          <AppMenu />
        </div>
        <div class="catalog__progress">
          <CollectionProgress title="100%" caption="every release" :owned="ownedCount" :total="catalog.shoes.length" />
          <CollectionProgress
            title="Any%"
            caption="every colorway"
            :owned="anyPercent.owned"
            :total="anyPercent.total"
          />
        </div>
        <SyncStatus
          class="catalog__sync"
          :state="collection.syncState"
          :error="collection.syncError"
          :pending="collection.pendingCount"
          :hide-saved-after="3000"
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
