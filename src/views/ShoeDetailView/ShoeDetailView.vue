<template>
  <div class="detail">
    <nav class="detail__bar">
      <button type="button" class="detail__back" aria-label="Back to catalog" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 5 8 12 15 19" /></svg>
      </button>
      <span v-if="shoe" class="detail__bar-title">{{ shoe.name }}</span>
    </nav>

    <p v-if="catalog.status === 'loading' || catalog.status === 'idle'" class="detail__message">Loading…</p>

    <div v-else-if="!shoe" class="detail__message">
      <p>{{ catalog.status === 'error' ? 'Could not load the catalog.' : `No shoe with code ${id}.` }}</p>
      <button type="button" class="detail__button detail__button--primary" @click="goBack">Back to catalog</button>
    </div>

    <template v-else>
      <div class="detail__media">
        <img class="detail__image" :src="imageSrc" :alt="`${shoe.model} ${shoe.name}`" width="800" height="560" />
      </div>

      <main class="detail__body">
        <p class="detail__eyebrow">Yeezy Boost {{ shoe.model }}</p>
        <h1 class="detail__name">{{ shoe.name }}</h1>
        <p class="detail__code">{{ shoe.id }}</p>

        <div class="detail__actions">
          <p v-if="ownedSince" class="detail__owned">
            <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 12.5 10 17.5 19 7" /></svg>
            In your collection since {{ ownedSince }}
          </p>
          <button
            type="button"
            class="detail__button"
            :class="owned ? 'detail__button--secondary' : 'detail__button--primary'"
            @click="toggleOwned"
          >
            {{ owned ? 'Remove from collection' : 'Add to collection' }}
          </button>
          <SyncStatus
            class="detail__sync"
            :state="collection.syncState"
            :error="collection.syncError"
            :pending="collection.pendingCount"
          />
        </div>

        <dl class="detail__specs">
          <div class="detail__spec">
            <dt>Style code</dt>
            <dd>{{ shoe.id }}</dd>
          </div>
          <div class="detail__spec">
            <dt>Model</dt>
            <dd>Yeezy Boost {{ shoe.model }}</dd>
          </div>
          <div class="detail__spec">
            <dt>Release year</dt>
            <dd>{{ shoe.releaseYear }}</dd>
          </div>
          <div class="detail__spec">
            <dt>Status</dt>
            <dd>{{ shoe.released ? 'Released' : 'Never released' }}</dd>
          </div>
        </dl>
      </main>
    </template>
  </div>
</template>

<script lang="ts" src="./ShoeDetailView.ts"></script>
<style scoped src="./ShoeDetailView.css"></style>
