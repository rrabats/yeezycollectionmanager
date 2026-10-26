<template>
  <div class="progress">
    <p class="progress__label">
      <span class="progress__count">{{ owned }}</span>
      <span class="progress__total">/ {{ total }} owned</span>
      <span class="progress__percent">{{ percent }}%</span>
    </p>
    <div
      class="progress__track"
      role="progressbar"
      :aria-valuenow="owned"
      aria-valuemin="0"
      :aria-valuemax="total"
      :aria-label="`${owned} of ${total} shoes owned`"
    >
      <div class="progress__bar" :style="{ width: `${percent}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts" src="./CollectionProgress.ts"></script>
<style scoped src="./CollectionProgress.css"></style>
