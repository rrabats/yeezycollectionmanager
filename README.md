# Yeezy Vault

A personal PWA for managing a Yeezy Boost 350 V2 / 350 V2 CMPCT collection.

Live: https://rrabats.github.io/yeezycollectionmanager/

## Stack

Vite, Vue 3, TypeScript and plain CSS, with `vite-plugin-pwa` for the installable app and GitHub Pages for hosting.

## Project structure

Every component and view lives in its own folder with three files. The `.vue` file holds only the template and pulls in the rest:

```
src/
  App.vue / App.ts / App.css
  router/             route definitions
  views/<Name>/       <Name>.vue (template) · <Name>.ts (logic) · <Name>.css (styles)
  components/<Name>/  same three-file layout
  stores/             Pinia stores
  services/           data loading and GitHub API
  types/              shared TypeScript types
  styles/             design tokens and base styles
public/
  data/               catalog.json and collection.json
  images/shoes/       one <CODE>.webp per shoe
```

## Development

```bash
npm install
npm run dev
```

Pushing to `main` deploys the app to GitHub Pages.
