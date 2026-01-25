import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/Byrons-game/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'maskable-icon.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/Byrons-game/index.html',
        navigateFallbackAllowlist: [/^\/Byrons-game/],
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: "Byron's Game",
        short_name: "Byron's Game",
        description: "A fun educational game for kids!",
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/Byrons-game/',
        scope: '/Byrons-game/',
        display: 'fullscreen',
        orientation: 'landscape',
        icons: [
          {
            src: '/Byrons-game/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/Byrons-game/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/Byrons-game/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    port: 2000
  }
});
