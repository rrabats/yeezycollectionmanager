<template>
  <div class="settings">
    <nav class="settings__bar">
      <button type="button" class="settings__back" aria-label="Back" @click="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 5 8 12 15 19" /></svg>
      </button>
      <span class="settings__bar-title">Settings</span>
    </nav>

    <main class="settings__body">
      <section class="settings__section">
        <h2 class="settings__heading">GitHub</h2>

        <template v-if="settings.isConnected">
          <p class="settings__connected">
            <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5 12.5 10 17.5 19 7" /></svg>
            Connected as <strong>{{ settings.login }}</strong>
          </p>
          <p class="settings__text">Changes to your collection are saved to collection.json in your repo.</p>
          <button type="button" class="settings__button settings__button--secondary" @click="disconnect">
            Disconnect
          </button>
        </template>

        <template v-else>
          <p class="settings__text">
            To save your collection, the app needs a GitHub token that may only edit files in the
            <strong>yeezycollectionmanager</strong> repo. It stays on this device.
          </p>

          <ol class="settings__steps">
            <li>
              <a class="settings__link" :href="newTokenUrl" target="_blank" rel="noopener">Create a token on GitHub</a>
            </li>
            <li><strong>Expiration:</strong> pick the longest option.</li>
            <li><strong>Repository access:</strong> Only select repositories → yeezycollectionmanager.</li>
            <li><strong>Permissions:</strong> Repository permissions → Contents → Read and write.</li>
            <li>Tap <strong>Generate token</strong>, copy it and paste it below.</li>
          </ol>

          <form class="settings__form" @submit.prevent="connect">
            <input
              v-model="tokenInput"
              class="settings__input"
              type="password"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              placeholder="github_pat_…"
              aria-label="GitHub token"
            />
            <p v-if="connectError" class="settings__error" role="alert">{{ connectError }}</p>
            <button type="submit" class="settings__button settings__button--primary" :disabled="connecting">
              {{ connecting ? 'Checking…' : 'Connect' }}
            </button>
          </form>
        </template>
      </section>

      <section class="settings__section">
        <h2 class="settings__heading">Collection</h2>
        <SyncStatus
          :state="collection.syncState"
          :error="collection.syncError"
          :pending="collection.pendingCount"
          show-idle
        />
        <button
          v-if="collection.hasUnsavedChanges && settings.isConnected"
          type="button"
          class="settings__button settings__button--secondary"
          @click="saveNow"
        >
          Save now
        </button>
      </section>
    </main>
  </div>
</template>

<script lang="ts" src="./SettingsView.ts"></script>
<style scoped src="./SettingsView.css"></style>
