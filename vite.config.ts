import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow access from local network
    port: 5173,
  },
  preview: {
    host: '0.0.0.0', // Allow access from local network
    port: 4173,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*'],
      manifest: {
        name: 'Gezinkte Karten',
        short_name: 'Gezinkte Karten',
        description: 'A card game about marked cards',
        theme_color: '#5CBFBE',
        background_color: '#5CBFBE',
        display: 'standalone',
        orientation: 'landscape',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache all static assets including images in subdirectories
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,otf,eot}',
          '**/deck_*/*.png', // Explicitly include all PNG files in deck folders
        ],
        // Pre-cache all assets on first install
        globIgnores: ['**/node_modules/**/*'],
        // Cache all navigation requests (HTML pages)
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        // Runtime caching for external resources
        runtimeCaching: [
          {
            // Cache Typekit fonts on first load
            urlPattern: /^https:\/\/use\.typekit\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'typekit-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache Typekit font files (woff, woff2, etc.)
            urlPattern: /^https:\/\/use\.typekit\.net\/.*\.(woff|woff2|ttf|otf|eot)/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'typekit-fonts-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
