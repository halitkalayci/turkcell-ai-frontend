import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      exclude: [
        'src/main.tsx',
        'src/App.tsx',
        'src/**/*.d.ts',
        'src/types/**/*',
        'src/**/index.ts',
      ],
    },
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
})
