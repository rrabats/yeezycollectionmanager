<template>
  <div class="segmented" role="radiogroup" :aria-label="label">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      class="segmented__option"
      :class="{ 'segmented__option--active': option.value === modelValue }"
      :aria-checked="option.value === modelValue"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script lang="ts" src="./SegmentedControl.ts"></script>
<style scoped src="./SegmentedControl.css"></style>
