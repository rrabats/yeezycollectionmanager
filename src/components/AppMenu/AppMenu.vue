<template>
  <button
    type="button"
    class="menu-button"
    aria-label="Open menu"
    :aria-expanded="open"
    aria-controls="app-menu"
    @click="show"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  </button>

  <Teleport to="body">
    <Transition name="menu-fade">
      <div v-if="open" class="menu-backdrop" @click="hide"></div>
    </Transition>
    <Transition name="menu-slide">
      <nav v-if="open" id="app-menu" class="menu" aria-label="Main menu" @keydown.esc="hide">
        <div class="menu__header">
          <span class="menu__brand">Yeezy Vault</span>
          <button ref="closeButton" type="button" class="menu__close" aria-label="Close menu" @click="hide">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <ul class="menu__list">
          <li v-for="item in items" :key="item.label">
            <RouterLink
              class="menu__item"
              :class="{ 'menu__item--active': isActive(item.route) }"
              :to="{ name: item.route }"
              @click="hide"
            >
              <span class="menu__label">{{ item.label }}</span>
              <span class="menu__hint">{{ item.hint }}</span>
            </RouterLink>
          </li>
        </ul>

        <p v-if="login" class="menu__footer">Connected to GitHub as {{ login }}</p>
      </nav>
    </Transition>
  </Teleport>
</template>

<script lang="ts" src="./AppMenu.ts"></script>
<style scoped src="./AppMenu.css"></style>
