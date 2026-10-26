<template>
  <RouterLink class="shoe-card" :to="{ name: 'shoe', params: { id: shoe.id } }">
    <div class="shoe-card__media">
      <img
        class="shoe-card__image"
        :src="imageSrc"
        :alt="`${shoe.model} ${shoe.name}`"
        width="800"
        height="560"
        loading="lazy"
        decoding="async"
      />
      <span v-if="owned" class="shoe-card__badge shoe-card__badge--owned">Owned</span>
      <span v-else-if="!shoe.released" class="shoe-card__badge">Unreleased</span>
    </div>
    <p class="shoe-card__model">{{ shoe.model }}</p>
    <h2 class="shoe-card__name">{{ shoe.name }}</h2>
    <p class="shoe-card__code">{{ shoe.id }}</p>
  </RouterLink>
</template>

<script lang="ts" src="./ShoeCard.ts"></script>
<style scoped src="./ShoeCard.css"></style>
