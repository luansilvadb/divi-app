import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue() as any],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'virtual:pwa-register/vue': fileURLToPath(new URL('./src/__tests__/mocks/pwa-register.ts', import.meta.url))
    },
  },
  build: {
    minify: 'esbuild',
    cssCodeSplit: true,
    target: 'esnext',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      exclude: [
        'node_modules/',
        'src/__tests__/',
        'src/**/__tests__/',
        '**/*.d.ts',
        '**/*.spec.ts',
        'src/main.ts',
        'src/sw.ts',
        '**/*.config.*',
      ],
    },
  },
})
