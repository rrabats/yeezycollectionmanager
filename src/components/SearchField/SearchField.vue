<template>
  <label class="search">
    <svg class="search__icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
    <input
      class="search__input"
      type="search"
      inputmode="search"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      enterkeyhint="search"
      :placeholder="placeholder"
      :aria-label="placeholder"
      :value="modelValue"
      @input="onInput"
      @keydown.enter="blur"
    />
    <button v-if="modelValue" type="button" class="search__clear" aria-label="Clear search" @click="clear">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="7" y1="7" x2="17" y2="17" />
        <line x1="17" y1="7" x2="7" y2="17" />
      </svg>
    </button>
  </label>
</template>

<script lang="ts" src="./SearchField.ts"></script>
<style scoped src="./SearchField.css"></style>
