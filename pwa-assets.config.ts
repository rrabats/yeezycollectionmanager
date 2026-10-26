import {
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset,
  type AppleDeviceName,
} from '@vite-pwa/assets-generator/config'

const background = '#000000'

// Recent iPhones only; models with the same screen size share one image.
const splashDevices: AppleDeviceName[] = [
  'iPhone SE 4.7"',
  'iPhone 12 mini',
  'iPhone 13 mini',
  'iPhone 11',
  'iPhone XR',
  'iPhone 12',
  'iPhone 13',
  'iPhone 14',
  'iPhone 14 Plus',
  'iPhone 14 Pro',
  'iPhone 14 Pro Max',
  'iPhone 15',
  'iPhone 15 Plus',
  'iPhone 15 Pro',
  'iPhone 15 Pro Max',
  'iPhone 16',
  'iPhone 16e',
  'iPhone 16 Plus',
  'iPhone 16 Pro',
  'iPhone 16 Pro Max',
  'iPhone 17',
  'iPhone 17 Pro',
  'iPhone 17 Pro Max',
  'iPhone Air',
]

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background },
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: { background },
    },
    appleSplashScreens: createAppleSplashScreens(
      {
        padding: 0.45,
        resizeOptions: { background, fit: 'contain' },
        linkMediaOptions: { basePath: '/yeezycollectionmanager/', addMediaScreen: true, xhtml: false, log: false },
        // The generator's default name adds "light-" to the <link> tags but not to the files, so the
        // links would 404. One name for both (the app has no light theme anyway).
        name: (landscape, size) =>
          `apple-splash-${landscape ? 'landscape' : 'portrait'}-${size.width}x${size.height}.png`,
      },
      splashDevices,
    ),
  },
  images: ['public/logo.svg'],
})
