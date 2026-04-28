import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const baseViteConfig = defineConfig({
  plugins: [vue()],
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
  }
})

export default mergeConfig(
  baseViteConfig,
  defineConfig({
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
  }),
)
