<template>
  <div class="progress">
    <p class="progress__label">
      <span class="progress__title">{{ title }}</span>
      <span class="progress__caption">{{ caption }}</span>
      <span class="progress__count">
        <strong>{{ owned }}</strong> / {{ total }}<span class="progress__percent"> · {{ percent }}%</span>
      </span>
    </p>
    <div
      class="progress__track"
      role="progressbar"
      :aria-valuenow="owned"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-label="`${title}: ${owned} of ${total} ${caption}`"
    >
      <div class="progress__bar" :class="{ 'progress__bar--complete': complete }" :style="{ width: `${percent}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts" src="./CollectionProgress.ts"></script>
<style scoped src="./CollectionProgress.css"></style>
