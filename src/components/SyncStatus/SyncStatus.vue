<template>
  <Transition name="sync-fade">
    <div v-if="visible" class="sync" :class="`sync--${tone}`" role="status" aria-live="polite">
      <span class="sync__dot" aria-hidden="true"></span>
      <span class="sync__text">
        {{ label }}
        <RouterLink v-if="linkToSettings" class="sync__link" :to="{ name: 'settings' }">{{ linkLabel }}</RouterLink>
      </span>
    </div>
  </Transition>
</template>

<script lang="ts" src="./SyncStatus.ts"></script>
<style scoped src="./SyncStatus.css"></style>
